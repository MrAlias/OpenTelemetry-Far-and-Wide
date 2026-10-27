"""Record the real pricing source edit in Vim, without changing demo fixtures."""
from pathlib import Path
import hashlib
import json
import os
import shutil
import subprocess
import time

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / '.artifacts/timeout-evidence/editor'
WORK.mkdir(parents=True, exist_ok=True)
OUT = ROOT / 'public/demo-capture'
baseline = ROOT / 'demo/apps/checkout/baseline/PricingEngine.java'
fixed = ROOT / 'demo/apps/checkout/fixes/PricingEngine.java'
source = WORK / 'PricingEngine.java'
shutil.copy2(baseline, source)
for name in ['ready', 'go', 'done']:
    (WORK / name).unlink(missing_ok=True)

def vim_path(path):
    return "'" + str(path).replace("'", "''") + "'"

# All edits act on a working copy; the saved result must match the actual fix.
scenario = WORK / 'edit.vim'
scenario.write_text('''set nocompatible nomore noswapfile nobackup nowritebackup
set number nowrap laststatus=2 showmode noruler scrolloff=0
set background=dark termguicolors
syntax on
set filetype=java
highlight Normal guifg=#f5f7fa guibg=#081725
highlight LineNr guifg=#71879b guibg=#081725
highlight StatusLine guifg=#081725 guibg=#62c5ff gui=bold
highlight Visual guifg=#ffffff guibg=#74372d
highlight Search guifg=#081725 guibg=#ffbf71
let &statusline = ' PricingEngine.java · Checkout %m%= %l:%c '
normal! 15Gzt
call matchadd('Search', '\\%22l.*\\|\\%23l.*\\|\\%24l.*')
redraw!
call writefile(['ready'], ''' + vim_path(WORK / 'ready') + ''')
while !filereadable(''' + vim_path(WORK / 'go') + ''')
  sleep 100m
endwhile
sleep 7000m
call clearmatches()
normal! 16GV33G
redraw!
sleep 2500m
normal! d
3,6delete _
call setline(3, '/** Use the current product store directly; remove the stale legacy attempt. */')
normal! gg
write
redraw!
sleep 8000m
call writefile(['done'], ''' + vim_path(WORK / 'done') + ''')
sleep 2000m
quit
''')
env = {**os.environ, 'DISPLAY': '127.0.0.1:91.0',
       'XAUTHORITY': str(ROOT / '.artifacts/demo-capture/xauthority'),
       'TMPDIR': str(ROOT / '.artifacts/timeout-evidence/tmp'),
       'TERM': 'xterm-256color', 'LANG': 'en_US.UTF-8'}
video = OUT / 'edit-pricing-source.mp4'
terminal = recorder = None
try:
    with (WORK / 'terminal.log').open('wb') as termlog, (WORK / 'recording.log').open('wb') as reclog:
        terminal = subprocess.Popen(['xterm', '-fa', 'DejaVu Sans Mono', '-fs', '16',
            '-geometry', '96x25+0+0', '-b', '8', '-bw', '0', '-bg', '#081725',
            '-fg', '#f5f7fa', '-T', 'Checkout — PricingEngine.java', '-e',
            'vim', '-u', 'NONE', '-U', 'NONE', '-i', 'NONE', '-n', '-N',
            '-S', str(scenario), str(source)], cwd=ROOT, env=env, stdout=termlog, stderr=termlog)
        deadline = time.monotonic() + 20
        while not (WORK / 'ready').exists():
            if terminal.poll() is not None or time.monotonic() > deadline:
                raise RuntimeError('Vim did not start: ' + (WORK / 'terminal.log').read_text())
            time.sleep(.1)
        recorder = subprocess.Popen(['ffmpeg', '-y', '-f', 'x11grab', '-framerate', '25',
            '-video_size', '1280x720', '-draw_mouse', '0', '-i', env['DISPLAY'],
            '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18',
            '-threads', '2', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(video)],
            env=env, stdin=subprocess.PIPE, stdout=reclog, stderr=reclog)
        time.sleep(.7)
        (WORK / 'go').touch()
        while not (WORK / 'done').exists():
            if terminal.poll() is not None or recorder.poll() is not None:
                raise RuntimeError('Editor capture exited early')
            time.sleep(.2)
        recorder.communicate(b'q', timeout=20)
        recorder = None
        terminal.wait(timeout=10)
        terminal = None
    assert source.read_bytes() == fixed.read_bytes(), 'Recorded edit differs from the deployed fix'
    for name, second in [('edit-pricing-before', 2), ('edit-pricing-after', 13)]:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(second), '-i', str(video),
            '-frames:v', '1', str(OUT / (name + '.png'))], check=True)
    report = {'method': 'Actual X11 screen capture of Vim editing a copy of the demo source',
        'baseline': str(baseline.relative_to(ROOT)), 'fixed': str(fixed.relative_to(ROOT)),
        'beforeSha256': hashlib.sha256(baseline.read_bytes()).hexdigest(),
        'afterSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
        'savedFileMatchesFixedSource': True, 'playbackRate': 1, 'audio': False,
        'video': str(video.relative_to(ROOT))}
    (OUT / 'edit-pricing-source.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report), flush=True)
finally:
    for process in [recorder, terminal]:
        if process and process.poll() is None:
            process.terminate()
            process.wait(timeout=10)
