// Export editable vector rehearsal frames from the same compositions as the film.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
const root=new URL('../../',import.meta.url);
await mkdir(new URL('.artifacts/demo-capture/edits',root),{recursive:true});
const directList=new URL('.artifacts/demo-capture/edits/direct-workflow.ffconcat',root);
await writeFile(directList,['inspect-java-setup-edited','install-java-agent-edited'].map(n=>"file '"+new URL('public/demo-capture/'+n+'.mp4',root).pathname+"'").join('\n')+'\n');
execFileSync('ffmpeg',['-v','error','-y','-f','concat','-safe','0','-i',directList.pathname,'-an','-c:v','copy','-movflags','+faststart',new URL('public/demo-capture/direct-java-workflow.mp4',root).pathname]);
const talk=JSON.parse(await readFile(new URL('./talk.json',import.meta.url),'utf8'));
let source=await readFile(new URL('../../public/animation/art.js',import.meta.url),'utf8');
// Keep the established light deck palette; narration player uses its dark palette.
for(const [before,after] of Object.entries({'#081725':'#fbfbfd','#112a3d':'#eef0f6','#f5f7fa':'#16182b','#adbfce':'#5f6475','#365268':'#c0c5d3','#62c5ff':'#5b5bd6','#ffbf71':'#9d5410','#8de0bf':'#087b6a'}))source=source.replaceAll(before,after);
const images={};for(const c of talk.chapters)for(const v of c.visuals||[]){const src=v.type==='image'?v.src:v.poster;if(src)images[src]='data:image/png;base64,'+(await readFile(new URL('../../public/'+src,import.meta.url))).toString('base64');}for(const name of ['connected-trace','java-timeout-span','pricing-config-attribute','java-timeout-proof','checkout-resource-proof'])images['demo-capture/'+name+'.png']='data:image/png;base64,'+(await readFile(new URL('../../public/demo-capture/'+name+'.png',import.meta.url))).toString('base64');
const context={window:{EVIDENCE_IMAGES:images}};vm.createContext(context);vm.runInContext(await readFile(new URL('../../public/animation/savings-data.js',import.meta.url),'utf8'),context);vm.runInContext(await readFile(new URL('../../public/animation/rollout-charts.js',import.meta.url),'utf8'),context);vm.runInContext(await readFile(new URL('../../public/animation/resolution-data.js',import.meta.url),'utf8'),context);vm.runInContext(await readFile(new URL('../../public/animation/timeout-data.js',import.meta.url),'utf8'),context);vm.runInContext(await readFile(new URL('../../public/animation/topology.js',import.meta.url),'utf8'),context);vm.runInContext(await readFile(new URL('../../public/animation/evidence.js',import.meta.url),'utf8'),context);vm.runInContext(await readFile(new URL('../../public/animation/resources.js',import.meta.url),'utf8'),context);vm.runInContext(source,context);
const out=new URL('../../public/slides/',import.meta.url);await mkdir(out,{recursive:true});
await writeFile(new URL('title-cover.svg',out),context.window.renderArtwork({...talk.chapters[0],visuals:[],visualCues:[]},0,{final:true}));
for(const c of talk.chapters)await writeFile(new URL(c.id+'.svg',out),context.window.renderArtwork({...c,visualCues:(Number.isInteger(c.previewVisualIndex)?[c.visuals[c.previewVisualIndex]]:c.visuals)?.map(v=>({...v,start:0})),buildTime:0},9999,{final:true}));
const sources={
  obi:['https://opentelemetry.io/docs/zero-code/obi/'],
  operator:['https://opentelemetry.io/docs/platforms/kubernetes/operator/automatic/','components/otel-injector-operator/README.md','components/otel-injector-images/versions.json'],
  deploy:['https://opentelemetry.io/docs/platforms/kubernetes/operator/automatic/','docs/fleet-demo-handoff.md'],
  manual:['demo/README.md','demo/k8s/checkout-instrumentation.yaml'],
  question:['demo/apps/checkout/src/main/java/demo/checkout/OrderStore.java'],
  detail:['demo/README.md','demo/k8s/checkout-instrumentation.yaml'],
  savings:['https://sre.google/workbook/eliminating-toil/','docs/instrumentation-savings.md'],
  lifecycle:['https://sre.google/workbook/eliminating-toil/','docs/instrumentation-savings.md'],
  measure:['https://sre.google/workbook/eliminating-toil/','docs/instrumentation-savings.md'],
};
const deck=['---\ntheme: default\ntitle: OpenTelemetry Far and Wide\ninfo: |\n  KubeCon + CloudNativeCon NA 2026 · Observability Day\n  Tyler Yahn · Nikola Grcevski\nclass: frame-slide\ntransition: fade\nmdc: true\n---\n'];
for(const [i,c] of talk.chapters.entries()){
  if(i)deck.push('\n---\nclass: frame-slide\n---\n');
  const scene={duration:c.plannedDuration,phase:i===0?'Intro':i<13?'Live demo':'Takeaways',delivery:c.purpose,needs:'Use the actual recorded exemplar as fallback; execute installation live.'};
  deck.push(`\n<h1 class="sr-only">${c.title}</h1>\n<img class="talk-frame" src="/slides/${c.id}.svg" alt="${c.title}" />\n`);
  if(i===0){deck.pop();deck.push(`<h1 class="sr-only">${c.title}</h1><img class="talk-frame" src="/slides/title-cover.svg" alt="${c.title}" /><img v-click class="talk-frame" src="/demo-capture/request-latency.png" alt="One recorded request: ${(context.window.DEMO_EVIDENCE.serverDurationMs.gateway/1000).toFixed(2)} s" />\n`);}
  const videos=(c.visuals||[]).filter(v=>v.type==='video');
  if(videos.length&&c.kind!=='namespace-result'){const video=c.id==='07-direct-agent'?{src:'demo-capture/direct-java-workflow.mp4',poster:videos[0].poster}:videos[0];deck.push(`\n<video class="talk-frame" controls playsinline preload="none" poster="/${video.poster}" src="/${video.src}">Recorded demo fallback</video>\n`);}
  if(c.kind==='namespace-result'){deck.pop();deck.push(`<h1 class="sr-only">${c.title}</h1><video class="talk-frame" controls playsinline preload="none" poster="/demo-capture/namespace-rule.png" src="/${videos[0].src}">Namespace selection recording</video>\n<img v-click class="talk-frame" src="/slides/${c.id}.svg" alt="Namespace selected; fourteen language agents and four Go services with OBI" />\n`);}
  const notes=[`Scene ${i+1}. Live budget ${scene.duration} seconds. ${scene.phase}.`,scene.delivery,scene.needs,...c.turns.map(t=>`${t.speaker}: ${t.text}`)];
  if(i===0)notes.unshift('Rehearsal deck. Enter the live demo after the introduction; return to slides at scene 14. Scenes 2–13 include captured demo evidence and terminal fallbacks. Live budget: 21 minutes content, one minute flex, three minutes questions. Animation uses native speech pace; a shorter read is fine.');
  const topologyKinds=['topology','obi','slow','scale','deploy','complete'];
  if(topologyKinds.includes(c.kind))notes.push('[Sources]','- demo/k8s/applications.yaml (759cc0979909)','- demo/apps/README.md','- components/otel-injector-images/versions.json','[/Sources]');
  if(c.sources)notes.push('[Sources]',...c.sources.map(url=>'- '+url),'[/Sources]');
  notes.push('[Sources]','- public/demo-capture/capture-summary.json','- docs/fleet-demo-handoff.md','- https://opentelemetry.io/docs/zero-code/','[/Sources]');
  if(sources[c.kind])notes.push('[Sources]',...sources[c.kind].map(url=>'- '+url),'[/Sources]');
  deck.push('\n<!--\n'+notes.join('\n\n')+'\n-->\n');
}
await writeFile(new URL('../../.artifacts/animation/rehearsal-slides.md',import.meta.url),deck.join(''));
console.log(`Exported ${talk.chapters.length} vector frames and a separate rehearsal draft. The authored Slidev deck is unchanged.`);
