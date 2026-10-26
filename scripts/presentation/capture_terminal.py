"""Record actual demo commands in an isolated X terminal; keep all output in the repo."""
from pathlib import Path
import argparse, json, os, selectors, shlex, signal, subprocess, sys, time
ROOT=Path(__file__).resolve().parents[2]
WORK=ROOT/'.artifacts/demo-capture'

def run_job(path):
    job=json.loads(path.read_text());work=path.parent
    env={**os.environ,'KUBECONFIG':str(WORK/'kubeconfig'),'TMPDIR':str(WORK/'tmp'),'TERM':'xterm-256color'}
    print('\033[2J\033[H\033[1;36mOpenTelemetry Far and Wide\033[0m\n',flush=True)
    (work/'ready').touch()
    while not (work/'go').exists():time.sleep(.1)
    events=[];failed=False
    with (work/'commands.log').open('wb') as log:
        for step in job['commands']:
            args=step['argv'];shown=step.get('display',shlex.join(args))
            displayed=time.time();print('\033[1;36m$ '+shown+'\033[0m',flush=True)
            time.sleep(step.get('readBeforeSeconds',2))
            event={'argv':args,'displayed':displayed,'started':time.time()}
            process=subprocess.Popen(args,cwd=ROOT,env=env,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,start_new_session=True)
            selector=selectors.DefaultSelector();selector.register(process.stdout,selectors.EVENT_READ)
            deadline=time.monotonic()+step.get('timeoutSeconds',360)
            while selector.get_map():
                if time.monotonic()>deadline:
                    os.killpg(process.pid,signal.SIGTERM);raise TimeoutError(shown)
                for key,_ in selector.select(1):
                    data=os.read(key.fileobj.fileno(),65536)
                    if not data:selector.unregister(key.fileobj);continue
                    sys.stdout.buffer.write(data);sys.stdout.buffer.flush();log.write(data);log.flush()
            code=process.wait();event.update(finished=time.time(),exitCode=code);events.append(event)
            print('',flush=True)
            if code:
                print(f'Command exited with status {code}.',flush=True);failed=True;break
            time.sleep(step.get('holdAfterSeconds',3))
        print('\033[1;36m$\033[0m',flush=True)
        time.sleep(4)
    (work/'events.json').write_text(json.dumps({'failed':failed,'commands':events},indent=2)+'\n')
    (work/'done').touch()
    raise SystemExit(int(failed))

def capture(path):
    job=json.loads(path.read_text());name=job['id'];work=WORK/'terminal'/name
    work.mkdir(parents=True,exist_ok=True)
    for flag in ['ready','go','done']:(work/flag).unlink(missing_ok=True)
    target=work/'job.json';target.write_text(json.dumps(job,indent=2)+'\n')
    auth=WORK/'xauthority';env={**os.environ,'DISPLAY':'127.0.0.1:91.0','XAUTHORITY':str(auth),'TMPDIR':str(WORK/'tmp')}
    video=ROOT/'public/demo-capture'/f'{name}.mp4';video.parent.mkdir(parents=True,exist_ok=True)
    terminal=None;recorder=None
    with (work/'terminal.log').open('wb') as terminal_log,(work/'ffmpeg.log').open('wb') as capture_log:
        try:
            terminal=subprocess.Popen(['xterm','-fa','DejaVu Sans Mono','-fs','18','-geometry','86x23+0+0','-b','20','-bw','0','-bg','#081725','-fg','#f5f7fa','-T',name,'-e',sys.executable,str(Path(__file__).resolve()),'--run-job',str(target)],env=env,cwd=ROOT,stdout=terminal_log,stderr=terminal_log)
            deadline=time.monotonic()+20
            while not (work/'ready').exists():
                if terminal.poll() is not None:raise RuntimeError('Terminal exited; inspect '+str(work/'terminal.log'))
                if time.monotonic()>deadline:raise TimeoutError('Terminal startup')
                time.sleep(.1)
            capture_started=time.time();recorder=subprocess.Popen(['ffmpeg','-y','-f','x11grab','-framerate','15','-video_size','1280x720','-draw_mouse','0','-i',env['DISPLAY'],'-c:v','libx264','-preset','veryfast','-crf','18','-threads','2','-pix_fmt','yuv420p',str(video)],env=env,stdin=subprocess.PIPE,stdout=capture_log,stderr=capture_log)
            time.sleep(1);(work/'go').touch()
            while not (work/'done').exists():
                if terminal.poll() is not None:raise RuntimeError('Command runner exited before completion')
                if recorder.poll() is not None:raise RuntimeError('Screen recorder exited')
                time.sleep(.2)
            recorder.communicate(b'q',timeout=20);recorder=None
            terminal.wait(timeout=10);terminal=None
            result=json.loads((work/'events.json').read_text());result.update(video=str(video.relative_to(ROOT)),capturedAt=time.time(),captureStartedAt=capture_started)
            (work/'recording.json').write_text(json.dumps(result,indent=2)+'\n')
            print(json.dumps(result),flush=True)
            if result['failed']:raise SystemExit(1)
        finally:
            for process in [recorder,terminal]:
                if process and process.poll() is None:
                    process.terminate()
                    try:process.wait(timeout=10)
                    except subprocess.TimeoutExpired:process.kill();process.wait()

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--run-job',type=Path);p.add_argument('--capture',type=Path);a=p.parse_args()
    if a.run_job:run_job(a.run_job)
    elif a.capture:capture(a.capture)
    else:p.error('choose --capture or --run-job')
