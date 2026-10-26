// Isolated local browser capture; no personal browser session is read or modified.
import {spawn} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(),work=path.join(root,'.artifacts/demo-capture');
const plan=JSON.parse(await readFile(process.argv[2],'utf8'));
const output=path.resolve(root,plan.output||'.artifacts/demo-capture/browser-inspect.png');
await mkdir(path.dirname(output),{recursive:true});
const executable='/home/tyler/.cache/ms-playwright/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browser=spawn(executable,['--lang=en-US','--accept-lang=en-US,en','--ozone-platform=x11','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--no-first-run','--remote-debugging-pipe','--window-size=1280,720','--window-position=0,0',`--user-data-dir=${path.join(work,'capture-browser-headless-profile')}`,'--app=about:blank'],{env:{...process.env,DISPLAY:'127.0.0.1:91.0',XAUTHORITY:path.join(work,'xauthority'),TMPDIR:path.join(work,'tmp'),LANG:'en_US.UTF-8',LC_ALL:'en_US.UTF-8'},stdio:['ignore','ignore','pipe','pipe','pipe']});
let sequence=0,buffer=Buffer.alloc(0),log='',recording=false;const frames=[],requests=[];const pending=new Map();browser.stderr.on('data',d=>log+=d);browser.on('exit',()=>{writeFileSync(path.join(work,'logs/capture-browser.log'),log);for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('Capture browser exited: '+log.slice(-1500)));}pending.clear();});browser.stdio[4].on('error',e=>{log+=String(e);});browser.stdio[3].on('error',e=>{log+=String(e);});
browser.stdio[4].on('data',chunk=>{buffer=Buffer.concat([buffer,chunk]);let index;while((index=buffer.indexOf(0))>=0){const line=buffer.subarray(0,index).toString();buffer=buffer.subarray(index+1);if(!line)continue;const message=JSON.parse(line);if(message.method==='Network.requestWillBeSent'&&message.params.request.url.includes('/api/ds/query'))requests.push({url:message.params.request.url,body:message.params.request.postData});if(message.method==='Page.screencastFrame'){if(recording)frames.push({timestamp:message.params.metadata.timestamp,data:message.params.data});call('Page.screencastFrameAck',{sessionId:message.params.sessionId},message.sessionId).catch(()=>{});continue;}const item=pending.get(message.id);if(item){pending.delete(message.id);clearTimeout(item.timer);message.error?item.reject(Error(JSON.stringify(message.error))):item.resolve(message.result);}}});
const call=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++sequence,timer=setTimeout(()=>{pending.delete(id);reject(Error('Timeout '+method));},45000);pending.set(id,{resolve,reject,timer});browser.stdio[3].write(JSON.stringify({id,method,params,...sessionId?{sessionId}:{}})+'\0');});
const wait=ms=>new Promise(r=>setTimeout(r,ms));let recordingSession;
try{
 const targets=await call('Target.getTargets');let target=targets.targetInfos.find(t=>t.type==='page');
 if(!target){const t=await call('Target.createTarget',{url:'about:blank'});target={targetId:t.targetId};}
 const {sessionId}=await call('Target.attachToTarget',{targetId:target.targetId,flatten:true});
 await call('Page.enable',{},sessionId);await call('Network.enable',{},sessionId);await call('Emulation.setDeviceMetricsOverride',{width:plan.width||1280,height:plan.height||720,deviceScaleFactor:1,mobile:!!plan.mobile},sessionId);
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true},sessionId);if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 await call('Page.navigate',{url:plan.url},sessionId);await wait(plan.loadMs||6500);
 if(plan.waitText){for(let i=0;i<60;i++){if((await evaluate('document.body.innerText')).includes(plan.waitText))break;await wait(500);}}
 if(plan.video){recording=true;recordingSession=sessionId;await call('Page.startScreencast',{format:'jpeg',quality:92,maxWidth:1280,maxHeight:720,everyNthFrame:1},sessionId);await wait(250);}
 for(const step of plan.steps||[]){
  if(step.click){const found=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(step.click)});if(!e)return false;e.click();return true;})()`);if(!found&&!step.optional)throw Error('Missing click '+step.click);}
  if(step.clickText){const found=await evaluate(`(()=>{const e=[...document.querySelectorAll('button,a,[role="button"]')].find(e=>e.textContent.trim()===${JSON.stringify(step.clickText)});if(!e)return false;e.click();return true;})()`);if(!found&&!step.optional)throw Error('Missing text '+step.clickText);}
  if(step.script)await evaluate(step.script);
  await wait(step.waitMs??1500);
  if(step.screenshot){const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId);await writeFile(path.resolve(root,step.screenshot),Buffer.from(shot.data,'base64'));}
 }
 await wait(plan.holdMs??1000);
 const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId);await writeFile(output,Buffer.from(shot.data,'base64'));
 const state=await evaluate(`({url:location.href,text:document.body.innerText,controls:[...document.querySelectorAll('button,a,input,[role="button"],[role="tab"]')].filter(e=>e.getBoundingClientRect().width).map(e=>({tag:e.tagName,role:e.getAttribute('role'),text:e.textContent.slice(0,100),label:e.getAttribute('aria-label'),title:e.getAttribute('title'),type:e.getAttribute('type')}))})`);
 if(plan.inspect)state.details=await evaluate(plan.inspect);await writeFile(output+'.json',JSON.stringify(state,null,2)+'\n');await writeFile(output+'.requests.json',JSON.stringify(requests,null,2)+'\n');console.log(JSON.stringify({url:state.url,output,controls:state.controls,text:state.text.slice(0,9000)}));
}finally{
 await writeFile(output+'.requests.json',JSON.stringify(requests,null,2)+'\n');
 if(recording){
  await call('Page.stopScreencast',{},recordingSession).catch(()=>{});recording=false;
  const end=Date.now()/1000,dir=path.join(work,'browser-frames',path.basename(plan.video,'.mp4'));await mkdir(dir,{recursive:true});
  if(!frames.length)throw Error('Browser emitted no screencast frames');
  const concat=[];
  for(const [i,frame] of frames.entries()){
   const file=path.join(dir,String(i).padStart(5,'0')+'.jpg');await writeFile(file,Buffer.from(frame.data,'base64'));
   concat.push(`file '${file.replaceAll("'","'\\''")}'`,`duration ${Math.max(.001,(frames[i+1]?.timestamp??end)-frame.timestamp).toFixed(6)}`);
  }
  concat.push(concat.at(-2));await writeFile(path.join(dir,'frames.ffconcat'),concat.join('\n')+'\n');
  await new Promise((resolve,reject)=>{const encoder=spawn('ffmpeg',['-y','-f','concat','-safe','0','-i',path.join(dir,'frames.ffconcat'),'-vf','fps=25','-c:v','libx264','-preset','veryfast','-crf','18','-threads','2','-pix_fmt','yuv420p','-movflags','+faststart',path.resolve(root,plan.video)],{stdio:['ignore','ignore','pipe']});let errors='';encoder.stderr.on('data',d=>errors+=d);encoder.on('exit',async code=>{await writeFile(path.join(dir,'encode.log'),errors);code===0?resolve():reject(Error(errors.slice(-1200)));});});
  await writeFile(path.join(dir,'capture.json'),JSON.stringify({method:'Actual browser Page screencast',frames:frames.length,start:frames[0].timestamp,end,video:plan.video},null,2)+'\n');
 }
 await writeFile(path.join(work,'logs/capture-browser.log'),log);try{await call('Browser.close');}catch{}browser.kill();
}
