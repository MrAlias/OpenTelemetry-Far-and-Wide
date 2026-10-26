(() => {
  const talk=window.TALK, chapters=talk.chapters;
  const ownNikola=talk.speakers.Nikola.engine==='nikola-demo-voice';
  document.getElementById('voice-cast').textContent=ownNikola?'Tyler and Nikola · authorized synthetic voices · natural narration pace':"Tyler's synthetic voice · Nikola draft stand-in · natural narration pace";
  document.getElementById('voice-credit').textContent=ownNikola?'Tyler and Nikola each use their separate authorized synthetic voice profiles.':"Tyler uses his authorized synthetic voice. Nikola uses a stock male draft stand-in.";
  const stage=document.getElementById('stage'),audio=document.getElementById('audio');
  const play=document.getElementById('play'),seek=document.getElementById('seek');
  const speed=document.getElementById('speed'),captionToggle=document.getElementById('caption-toggle');
  const narration=document.getElementById('narration'),loop=document.getElementById('loop');
  const captionBox=document.getElementById('captions'),chapterList=document.getElementById('chapters');
  const params=new URLSearchParams(location.search),exportMode=params.has('export');
  let current=0,position=0,playing=false,lastFrame=0,lastDraw=-1;
  seek.max=String(talk.duration);
  const stamp=value=>{value=Math.max(0,Math.floor(value));return Math.floor(value/60)+':'+String(value%60).padStart(2,'0');};
  let activeMedia=null,activeVisualKey="";
  function draw(at=position) {
    const chapter=chapters.find(c=>at>=c.start&&at<c.end)||chapters[chapters.length-1];
    const index=chapters.indexOf(chapter),local=Math.min(chapter.duration,Math.max(0,at-chapter.start));
    current=index;
    const event=[...(chapter.visualCues||[])].reverse().find(v=>v.start<=local);
    if(event?.type==='video'){
      const key=chapter.id+event.src;
      if(activeVisualKey!==key){stage.innerHTML='';activeMedia=document.createElement('video');activeMedia.muted=true;activeMedia.playsInline=true;activeMedia.preload='auto';activeMedia.src=new URL(event.src,location.href).href;activeMedia.style.cssText='width:100%;height:100%;object-fit:contain';stage.append(activeMedia);activeVisualKey=key;}
      const target=Math.min(event.mediaDuration-.045,Math.max(0,local-event.start));
      if(Math.abs(activeMedia.currentTime-target)>.2)activeMedia.currentTime=target;
      activeMedia.playbackRate=Number(speed.value);
      if(playing&&target<event.mediaDuration-.05)activeMedia.play().catch(()=>{});else activeMedia.pause();
    }else{
      activeMedia?.pause();activeMedia=null;activeVisualKey='';
      stage.innerHTML=window.renderArtwork(chapter,local,{reduceMotion:!exportMode&&matchMedia('(prefers-reduced-motion: reduce)').matches});
    }
    document.getElementById('time').value=`${stamp(at)} / ${stamp(talk.duration)}`;
    seek.value=String(at);
    document.getElementById('previous').disabled=index===0;
    document.getElementById('next').disabled=index===chapters.length-1;
    const cue=chapter.cues.find(c=>local>=c.start&&local<=c.end);
    captionBox.textContent=cue?(cue.speaker?`${cue.speaker}: ${cue.text}`:cue.text):'';
    chapterList.querySelectorAll('button').forEach((el,i)=>el.setAttribute('aria-current',String(i===index)));
    return chapter;
  }
  function setAudio(at) {
    const chapter=draw(at);
    const path=new URL('animation/'+chapter.audio,location.href).href;
    if(audio.src!==path)audio.src=path;
    audio.currentTime=Math.max(0,at-chapter.start);
    audio.playbackRate=Number(speed.value);
    audio.muted=!narration.checked;
  }
  async function start() {
    if(position>=talk.duration)position=0;
    setAudio(position);
    try {await audio.play();playing=true;play.textContent='Pause';lastFrame=performance.now();}
    catch(error){playing=false;play.textContent='Play';document.getElementById('time').value='Audio could not play. Check that the narration files are present.';}
  }
  function pause(){playing=false;audio.pause();activeMedia?.pause();play.textContent='Play';}
  function go(at){position=Math.max(0,Math.min(talk.duration,at));setAudio(position);if(playing)start();}
  function frame(now){
    if(playing){
      const chapter=chapters[current];
      // The media clock owns synchronization, including seeks and playback-rate changes.
      position=chapter.start+audio.currentTime;
      if(audio.ended||position>=chapter.end-.015){
        if(loop.checked)go(chapter.start);
        else if(current<chapters.length-1)go(chapters[current+1].start);
        else{position=talk.duration;pause();}
      }
      if(now-lastDraw>32){draw();lastDraw=now;}
    }
    lastFrame=now;requestAnimationFrame(frame);
  }
  chapterList.innerHTML=chapters.map((c,i)=>`<li><button type="button" data-chapter="${i}"><small>${stamp(c.start)}</small>${c.title.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</button><a class="clip" href="animation/clips/${c.id}-silent.mp4">Silent chapter</a>${Number.isFinite(c.buildTime)?`<a class="clip" href="animation/explainers/${c.id}-20s.mp4">20s live clip</a>`:''}</li>`).join('');
  chapterList.addEventListener('click',event=>{const button=event.target.closest('[data-chapter]');if(button)go(chapters[Number(button.dataset.chapter)].start);});
  play.addEventListener('click',()=>playing?pause():start());
  document.getElementById('previous').addEventListener('click',()=>go(chapters[Math.max(0,current-1)].start));
  document.getElementById('next').addEventListener('click',()=>go(chapters[Math.min(chapters.length-1,current+1)].start));
  seek.addEventListener('input',()=>go(Number(seek.value)));
  narration.addEventListener('change',()=>{audio.muted=!narration.checked;});
  speed.addEventListener('change',()=>{audio.playbackRate=Number(speed.value);});
  captionToggle.addEventListener('change',()=>{captionBox.hidden=!captionToggle.checked;});
  document.getElementById('fullscreen').addEventListener('click',async()=>{
    if(document.fullscreenElement){await document.exitFullscreen();document.body.classList.remove('presentation');}
    else{document.body.classList.add('presentation');try{await document.documentElement.requestFullscreen();}catch{document.body.classList.remove('presentation');}}
  });
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)document.body.classList.remove('presentation');});
  document.addEventListener('keydown',event=>{
    if(['INPUT','SELECT','BUTTON','A','TEXTAREA'].includes(document.activeElement?.tagName))return;
    if(event.code==='Space'){event.preventDefault();playing?pause():start();}
    if(event.code==='ArrowRight')go(position+5);
    if(event.code==='ArrowLeft')go(position-5);
  });
  window.mediaReady=Promise.all([...new Set(chapters.flatMap(c=>(c.visualCues||[]).map(v=>v.type==='image'?v.src:v.poster)).filter(Boolean).concat(['demo-capture/connected-trace.png']))].map(src=>new Promise(resolve=>{const img=new Image();img.onload=img.onerror=resolve;img.src=new URL(src,location.href).href;})));
  window.renderAt=at=>{pause();position=Math.max(0,Math.min(talk.duration,at));draw();return {chapter:current+1,time:position};};
  window.animationState=()=>({chapter:current+1,time:position,playing,narration:narration.checked});
  if(exportMode)document.body.classList.add('export');
  const initial=Number(params.get('chapter'));
  if(initial>=1&&initial<=chapters.length)position=chapters[initial-1].start;
  draw();requestAnimationFrame(frame);
})();
