// Render only changing frames; long holds are explicit durations, not duplicated screenshots.
import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const work=path.join(root,'.artifacts/animation');
const out=path.join(root,'public/animation');
const browserPath=process.env.ANIMATION_CHROMIUM||'/home/tyler/.cache/ms-playwright/chromium_headless_shell-1194/chrome-linux/headless_shell';
const manifest=await readFile(path.join(out,'timeline.js'),'utf8');
const talk=JSON.parse(manifest.replace(/^window.TALK = /,'').replace(/;\s*$/,''));
const renderDir=path.join(work,'frames');
await mkdir(renderDir,{recursive:true});
await mkdir(path.join(out,'clips'),{recursive:true});
await mkdir(path.join(out,'explainers'),{recursive:true});

function run(executable,args,logName) {
  return new Promise(async(resolve,reject)=>{
    const child=spawn(executable,args,{cwd:root,env:{...process.env,TMPDIR:path.join(work,'runtime/tmp')},stdio:['ignore','pipe','pipe']});
    let output='';child.stdout.on('data',d=>output+=d);child.stderr.on('data',d=>output+=d);
    child.on('error',reject);
    child.on('exit',async code=>{if(logName)await writeFile(path.join(work,logName),output);code===0?resolve(output):reject(new Error(`${executable} exited ${code}: ${output.slice(-1200)}`));});
  });
}
class CDP {
  constructor(process) {
    this.process=process;this.sequence=0;this.pending=new Map();this.buffer=Buffer.alloc(0);
    process.stdio[4].on('data',chunk=>{
      this.buffer=Buffer.concat([this.buffer,chunk]);
      let end;
      while((end=this.buffer.indexOf(0))!==-1){
        const line=this.buffer.subarray(0,end).toString();this.buffer=this.buffer.subarray(end+1);
        if(!line)continue;
        const message=JSON.parse(line),request=this.pending.get(message.id);
        if(request){this.pending.delete(message.id);clearTimeout(request.timeout);message.error?request.reject(new Error(JSON.stringify(message.error))):request.resolve(message.result);}
      }
    });
    process.on('exit',code=>{for(const request of this.pending.values()){clearTimeout(request.timeout);request.reject(new Error('Browser exited '+code));}});
  }
  call(method,params={},sessionId) {
    return new Promise((resolve,reject)=>{
      const id=++this.sequence;
      const timeout=setTimeout(()=>{this.pending.delete(id);reject(new Error('Timed out: '+method));},45000);
      this.pending.set(id,{resolve,reject,timeout});
      this.process.stdio[3].write(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})})+'\0');
    });
  }
}
const browser=spawn(browserPath,['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--remote-debugging-pipe',`--user-data-dir=${path.join(work,'browser-profile')}`],{env:{...process.env,TMPDIR:path.join(work,'runtime/tmp')},stdio:['ignore','ignore','pipe','pipe','pipe']});
let browserLog='';browser.stderr.on('data',d=>browserLog+=d);
const cdp=new CDP(browser);
try {
  const {targetId}=await cdp.call('Target.createTarget',{url:'about:blank'});
  const {sessionId}=await cdp.call('Target.attachToTarget',{targetId,flatten:true});
  await cdp.call('Page.enable',{},sessionId);
  await cdp.call('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false},sessionId);
  const url=pathToFileURL(path.join(root,'public/animation.html')).href+'?export=1';
  await cdp.call('Page.navigate',{url},sessionId);
  for(let i=0;i<80;i++) {
    const result=await cdp.call('Runtime.evaluate',{expression:'typeof window.renderAt === "function"',returnByValue:true},sessionId);
    if(result.result.value)break;
    if(i===79)throw new Error('Animation did not load');
    await new Promise(resolve=>setTimeout(resolve,50));
  }
  const errors=[];
  async function evaluate(expression) {
    const result=await cdp.call('Runtime.evaluate',{expression,returnByValue:true},sessionId);
    if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  // Verify the authored controls rather than just the rendered artwork.
  const interaction=await evaluate(`(()=>{
    const issues=[],check=(ok,message)=>{if(!ok)issues.push(message);};
    check(document.querySelectorAll('[data-chapter]').length===window.TALK.chapters.length,'chapter controls');
    document.querySelector('[data-chapter="5"]').click();
    check(window.animationState().chapter===6,'chapter seek');
    document.getElementById('narration').click();
    check(document.getElementById('audio').muted,'narration toggle');
    document.getElementById('narration').click();
    const seek=document.getElementById('seek');const seekTarget=Math.floor(Math.min(1000,window.TALK.duration-1)*10)/10;seek.value=seekTarget;seek.dispatchEvent(new Event('input'));
    check(window.animationState().time===seekTarget,'timeline seek');
    const speed=document.getElementById('speed');speed.value='1.5';speed.dispatchEvent(new Event('change'));
    check(document.getElementById('audio').playbackRate===1.5,'playback rate');
    speed.value='1';speed.dispatchEvent(new Event('change'));
    document.getElementById('caption-toggle').click();
    check(!document.getElementById('captions').hidden,'caption toggle');
    document.getElementById('caption-toggle').click();
    window.renderAt(0);return {issues};
  })()`);
  await writeFile(path.join(work,'interaction-report.json'),JSON.stringify(interaction,null,2)+'\n');
  if(interaction.issues.length)throw new Error('Player controls failed: '+JSON.stringify(interaction));
  const playback=await cdp.call('Runtime.evaluate',{expression:`(async()=>{
    window.renderAt(0);document.getElementById('play').click();
    await new Promise(resolve=>setTimeout(resolve,1600));
    const audio=document.getElementById('audio');
    const result={state:window.animationState(),audioTime:audio.currentTime,mediaError:audio.error?.message||null};
    document.getElementById('play').click();return result;
  })()`,awaitPromise:true,returnByValue:true,userGesture:true},sessionId);
  await writeFile(path.join(work,'playback-report.json'),JSON.stringify(playback.result.value,null,2)+'\n');
  if(!playback.result.value?.state?.playing||playback.result.value.audioTime<.5)throw new Error('Narrated playback failed: '+JSON.stringify(playback));
  await cdp.call('Runtime.evaluate',{expression:'window.mediaReady',awaitPromise:true},sessionId);
  let imageCount=0;const renderReports=[];
  const onlyIndex=process.argv.indexOf('--only');const only=onlyIndex>=0?new Set(process.argv[onlyIndex+1].split(',')):null;
  let previousReport={chapters:[]};if(only){try{previousReport=JSON.parse(await readFile(path.join(work,'layout-report.json'),'utf8'));}catch{}}
  for(const chapter of talk.chapters){
    if(only&&!only.has(chapter.id)){renderReports.push(previousReport.chapters.find(c=>c.chapter===chapter.id)||{chapter:chapter.id,reused:true});continue;}
    const dir=path.join(renderDir,chapter.id);await mkdir(dir,{recursive:true});
    const events=chapter.visualCues?.length?chapter.visualCues:[{type:'art',start:0}];
    const segments=[];
    for(const [index,event] of events.entries()){
      const end=events[index+1]?.start??chapter.duration, duration=end-event.start;
      const file=path.join(dir,`segment-${index}.mp4`);let args=[];
      if(event.type==='video'){
        args=['-i',path.join(root,'public',event.src),'-vf',`fps=25,scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,tpad=stop_mode=clone:stop_duration=${duration}`];
      }else if(event.type==='image'){
        args=['-loop','1','-i',path.join(root,'public',event.src),'-vf','fps=25,scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2'];
      }else{
        const times=[event.start];
        if(Number.isFinite(chapter.buildTime)&&chapter.buildTime>=event.start&&chapter.buildTime<end){for(let i=0;i<=40;i++){const t=chapter.buildTime+i*.04;if(t<end)times.push(t);}}
        const unique=[...new Set(times)].sort((a,b)=>a-b),concat=[];
        for(const [i,t] of unique.entries()){
          await evaluate(`window.renderAt(${chapter.start+t})`);
          await cdp.call('Runtime.evaluate',{expression:'new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))',awaitPromise:true},sessionId);
          const overflow=await evaluate(`(()=>{const s=document.querySelector('#stage svg');if(!s)return ['missing artwork'];const b=s.getBoundingClientRect();return [...s.querySelectorAll('text')].filter(t=>{const r=t.getBoundingClientRect();return r.left<b.left-1||r.right>b.right+1||r.top<b.top-1||r.bottom>b.bottom+1}).map(t=>t.textContent)})()`);
          if(overflow.length)errors.push({chapter:chapter.id,time:t,overflow});
          const shot=await cdp.call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId);
          const png=path.join(dir,`${index}-${String(i).padStart(3,'0')}.png`);await writeFile(png,Buffer.from(shot.data,'base64'));imageCount++;
          concat.push(`file '${png}'`,`duration ${((unique[i+1]??end)-t).toFixed(6)}`);
        }
        concat.push(concat.at(-2));const list=path.join(dir,`art-${index}.ffconcat`);await writeFile(list,concat.join('\n')+'\n');args=['-f','concat','-safe','0','-i',list,'-vf','fps=25'];
      }
      await run('ffmpeg',['-y',...args,'-an','-t',String(duration),'-c:v','libx264','-preset','veryfast','-crf','20','-threads','2','-pix_fmt','yuv420p','-video_track_timescale','12800',file],chapter.id+`-segment-${index}.log`);segments.push(file);
    }
    const list=path.join(dir,'segments.ffconcat');await writeFile(list,segments.map(f=>`file '${f}'`).join('\n')+'\n');
    const video=path.join(work,chapter.id+'.mp4');
    await run('ffmpeg',['-y','-f','concat','-safe','0','-i',list,'-i',path.join(work,'speech',chapter.id+'.wav'),'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','112k','-t',String(chapter.duration),'-movie_timescale','1000','-movflags','+faststart',video],chapter.id+'-encode.log');
    await run('ffmpeg',['-y','-i',video,'-map','0:v','-an','-c:v','copy','-movflags','+faststart',path.join(out,'clips',chapter.id+'-silent.mp4')]);
    if(Number.isFinite(chapter.buildTime))await run('ffmpeg',['-y','-ss',String(Math.max(0,chapter.buildTime-7)),'-i',video,'-t','20','-an','-vf','tpad=stop_mode=clone:stop_duration=20','-c:v','libx264','-preset','veryfast','-threads','2','-pix_fmt','yuv420p',path.join(out,'explainers',chapter.id+'-20s.mp4')]);
    renderReports.push({chapter:chapter.id,seconds:chapter.duration,segments:segments.length});console.log('Rendered '+chapter.id+' '+chapter.duration+'s');
  }
  await writeFile(path.join(work,'layout-report.json'),JSON.stringify({errors,chapters:renderReports,imageCount},null,2)+'\n');
  if(errors.length)throw Error('Artwork overflow: '+JSON.stringify(errors));
  const list=path.join(work,'chapters.ffconcat');
  await writeFile(list,talk.chapters.map(c=>`file '${path.join(work,c.id+'.mp4').replaceAll("'","'\\''")}'`).join('\n')+'\n');
  const metadata=path.join(work,'chapters.ffmetadata');
  await writeFile(metadata,';FFMETADATA1\ntitle=OpenTelemetry Far and Wide\ncomment=Recorded local demo. '+talk.voice.replace(/[=;#\\]/g,' ')+'. Actual request and terminal recordings; savings are qualitative.\n'+talk.chapters.map(c=>`[CHAPTER]\nTIMEBASE=1/1000\nSTART=${Math.round(c.start*1000)}\nEND=${Math.round(c.end*1000)}\ntitle=${c.title.replace(/[=;#\\]/g,' ')}`).join('\n')+'\n');
  const final=path.join(out,talk.videoFile||'opentelemetry-far-and-wide-dialogue.mp4');
  await run('ffmpeg',['-y','-f','concat','-safe','0','-i',list,'-i',metadata,'-i',path.join(out,'captions.vtt'),'-map','0:v','-map','0:a','-map','2:0','-map_metadata','1','-map_chapters','1','-c:v','copy','-c:a','copy','-c:s','mov_text','-metadata:s:s:0','language=eng','-t',String(talk.duration),'-movie_timescale','1000','-movflags','+faststart',final],'full-encode.log');
  await run('ffmpeg',['-y','-i',final,'-map','0:v','-map_metadata','0','-map_chapters','0','-an','-c:v','copy','-t',String(talk.duration),'-movie_timescale','1000','-movflags','+faststart',path.join(out,'opentelemetry-far-and-wide-silent.mp4')]);
  await run('ffmpeg',['-y','-i',final,'-map','0:a','-vn','-c:a','copy','-movie_timescale','1000',path.join(out,'draft-narration.m4a')]);
  console.log(`Export complete: ${talk.duration}s, ${talk.chapters.length} silent chapters, ${imageCount} rendered frames.`);
} finally {
  await writeFile(path.join(work,'browser.log'),browserLog);
  try{await cdp.call('Browser.close');}catch{}
  browser.kill();
}
