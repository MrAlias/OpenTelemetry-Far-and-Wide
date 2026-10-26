// Render the native Slidev deck and check meaningful presentation interactions.
import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir,readdir,access} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
const root=process.cwd(), work=path.join(root,'.artifacts/slides');
await mkdir(path.join(work,'tmp'),{recursive:true});
await mkdir(path.join(work,'renders'),{recursive:true});
const origin=process.env.SLIDEV_URL||'http://localhost:3040';
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
    for(const pipe of [process.stdio[3],process.stdio[4]])pipe.on('error',error=>{for(const request of this.pending.values()){clearTimeout(request.timeout);request.reject(error)}this.pending.clear()});
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
const candidates=[process.env.SLIDEV_CHROMIUM];
const cache=path.join(os.homedir(),'.cache/ms-playwright');
for(const dir of (await readdir(cache).catch(()=>[])).sort((a,b)=>Number(b.includes('headless'))-Number(a.includes('headless'))))if(dir.startsWith('chromium'))for(const suffix of ['chrome-linux/headless_shell','chrome-linux/chrome','chrome-headless-shell-linux64/chrome-headless-shell','chrome-linux64/chrome'])candidates.push(path.join(cache,dir,suffix));
candidates.push('/usr/bin/chromium','/usr/bin/chromium-browser','/usr/bin/google-chrome');
let executable;for(const file of candidates.filter(Boolean)){try{await access(file);executable=file;break}catch{}}
if(!executable)throw Error('Set SLIDEV_CHROMIUM to a Chromium executable for slide validation.');
const browser=spawn(executable,[...(executable.includes('headless_shell')||executable.includes('chrome-headless-shell')?[]:['--headless=new']),'--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--remote-debugging-pipe',`--user-data-dir=${path.join(work,'browser-profile-'+Date.now())}`],{env:{...process.env,TMPDIR:path.join(work,'tmp'),LANG:'en_US.UTF-8',LC_ALL:'en_US.UTF-8'},stdio:['ignore','ignore','pipe','pipe','pipe']});
let browserLog='';browser.stderr.on('data',d=>browserLog+=d);
const cdp=new CDP(browser),errors=[],slides=[],runtimeErrors=[];
try{
 const {targetId}=await cdp.call('Target.createTarget',{url:'about:blank'});
 const {sessionId}=await cdp.call('Target.attachToTarget',{targetId,flatten:true});
 await cdp.call('Page.enable',{},sessionId);await cdp.call('Runtime.enable',{},sessionId);
 await cdp.call('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false},sessionId);
 const evaluate=async expression=>{const r=await cdp.call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true},sessionId);if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const route=(p)=>origin+(process.env.SLIDEV_ROUTER==='hash'?'/#':'')+p;
 async function navigate(n,clicks=0){
  await cdp.call('Page.navigate',{url:route(`/${n}?clicks=${clicks}`)},sessionId);
  for(let i=0;i<100;i++){
   if(await evaluate(`!!document.querySelector('[data-slidev-no="${n}"] .slidev-layout h1')`))break;
   if(i===99)throw Error('Slide '+n+' did not render');await wait(100);
  }
  await evaluate('document.fonts.ready');await wait(250);
 }
 for(let n=1;n<=21;n++){
  for(const clicks of ([6,7,16].includes(n)?[0,1]:[0])){
   await navigate(n,clicks);
   const result=await evaluate(`(()=>{
    const s=document.querySelector('[data-slidev-no="${n}"] .slidev-layout'),b=s.getBoundingClientRect();
    const out=[],collisions=[],h=s.querySelector('h1');
    const visible=e=>{const st=getComputedStyle(e);return st.visibility!=='hidden'&&Number(st.opacity)!==0&&e.getBoundingClientRect().width>0};
    for(const e of s.querySelectorAll('h1,p,pre,td,th,dt,dd,footer,svg text')){
     if(!visible(e))continue;const r=e.getBoundingClientRect();
     if(r.left<b.left-1||r.right>b.right+1||r.top<b.top-1||r.bottom>b.bottom-1)out.push(e.textContent.trim().slice(0,100));
     if(e.tagName==='PRE'&&e.scrollWidth>e.clientWidth+2)out.push('code scroll: '+e.textContent.slice(0,80));
    }
    const blocks=[...s.querySelectorAll('h1,.caption,.lead,.service-topology,.trace-evidence,.demo-clip,pre,.clocks,.lifecycle,.measurements,.payoff,.closing-lines,.closing-link')].filter(visible);
    for(let a=0;a<blocks.length;a++)for(let c=a+1;c<blocks.length;c++){
     const x=blocks[a],y=blocks[c];if(x.contains(y)||y.contains(x))continue;const r=x.getBoundingClientRect(),t=y.getBoundingClientRect();
     if(Math.min(r.right,t.right)-Math.max(r.left,t.left)>4&&Math.min(r.bottom,t.bottom)-Math.max(r.top,t.top)>4)collisions.push([x.tagName+':'+x.className,y.tagName+':'+y.className]);
    }
    return {slide:${n},clicks:${clicks},title:h.textContent,overflow:out,collisions,services:s.querySelectorAll('[data-service]').length,agents:s.querySelectorAll('[data-agent="true"]').length,branchLinks:s.querySelectorAll('.branch-link').length,highlight:!!s.querySelector('.trace-highlight'),video:!!s.querySelector('video'),images:[...s.querySelectorAll('img')].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0}))};
   })()`);
   if(result.overflow.length||result.collisions.length)errors.push(result);
   if(result.images.some(i=>!i.loaded))errors.push({slide:n,images:result.images});
   if([3,6,11,16].includes(n)&&result.services!==18)errors.push({slide:n,issue:'Topology must contain eighteen services'});
   if(n===6&&result.branchLinks!==(clicks?5:0))errors.push({slide:n,issue:'Observed branch click did not update'});
   if(n===7&&result.highlight!==!!clicks)errors.push({slide:n,issue:'Local interval click did not update'});
   if(n===16&&result.agents!==(clicks?14:1))errors.push({slide:n,issue:'Namespace lighting did not update'});
   const png=await cdp.call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId);
   await writeFile(path.join(work,'renders',`${String(n).padStart(2,'0')}-${clicks}.png`),Buffer.from(png.data,'base64'));slides.push(result);
   console.log(`Checked slide ${n}, click ${clicks}: ${result.title}`);
  }
 }
 await writeFile(path.join(work,'render-report.json'),JSON.stringify({errors,slides},null,2)+'\n');
 await navigate(15);
 const video=await evaluate(`(async()=>{const v=document.querySelector('[data-slidev-no="15"] video');let failure=null;try{await v.play()}catch(e){failure=e.message};await new Promise(r=>setTimeout(r,1400));const f=await fetch(v.currentSrc);return {src:v.currentSrc,status:f.status,type:f.headers.get('content-type'),canPlay:v.canPlayType('video/mp4;codecs=\"avc1.64001f\"'),time:v.currentTime,error:v.error?.message||failure,muted:v.muted,rate:v.playbackRate};})()`);
 console.log('Video check '+JSON.stringify(video));
 if(video.time<.5||video.error||!video.muted||video.rate!==1)errors.push({video});
 // Use Slidev's real Next key, so the onSlideLeave lifecycle runs on the existing video element.
 await evaluate(`window.leavingDemo=document.querySelector('[data-slidev-no="15"] video')`);
 await cdp.call('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39},sessionId);
 await cdp.call('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39},sessionId);await wait(400);
 const paused=await evaluate('window.leavingDemo.paused');if(!paused)errors.push({issue:'Demo keeps playing after leaving slide'});
 await cdp.call('Page.navigate',{url:route('/presenter/14')},sessionId);await wait(500);
 for(let i=0;i<100;i++){if(await evaluate("document.body.innerText.includes('Shared defaults and exclusions')"))break;await wait(100);}
 const presenter=await evaluate(`({notes:document.body.innerText.includes('Shared defaults and exclusions'),text:document.body.innerText.slice(-1500)})`);
 if(!presenter.notes)errors.push({issue:'Presenter notes missing',presenter});
 await writeFile(path.join(work,'slide-report.json'),JSON.stringify({errors,slides,video,pausedOnLeave:paused,presenterNotes:presenter.notes},null,2)+'\n');
 if(errors.length)throw Error('Slide checks failed: '+JSON.stringify(errors));
 console.log('All 21 slides, three click builds, video playback and presenter notes passed.');
}finally{await writeFile(path.join(work,'browser.log'),browserLog);try{await cdp.call('Browser.close')}catch{}browser.kill();}
