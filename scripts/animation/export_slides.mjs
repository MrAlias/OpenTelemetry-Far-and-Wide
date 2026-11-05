// Export review frames only. The authored Slidev deck and its notes are independent.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import vm from 'node:vm';
const root=new URL('../../',import.meta.url);
const talk=JSON.parse(await readFile(new URL('scripts/animation/talk.json',root),'utf8'));
const images={};
const sources=new Set(['demo-capture/connected-trace.png','demo-capture/java-timeout-proof.png','demo-capture/checkout-resource-proof.png']);
for(const c of talk.chapters){
 for(const v of c.visuals||[]){const src=v.type==='image'?v.src:v.poster;if(src)sources.add(src)}
 for(const src of c.evidenceImages||[])sources.add(src);
}
for(const src of sources)images[src]='data:image/png;base64,'+(await readFile(new URL('public/'+src,root))).toString('base64');
const context={window:{EVIDENCE_IMAGES:images}};vm.createContext(context);
for(const name of ['savings-data','rollout-charts','resolution-data','timeout-data','topology','evidence','resources','operator-data'])
 vm.runInContext(await readFile(new URL('public/animation/'+name+'.js',root),'utf8'),context);
let art=await readFile(new URL('public/animation/art.js',root),'utf8');
for(const [dark,light] of Object.entries({'#081725':'#fbfbfd','#112a3d':'#eef0f6','#f5f7fa':'#16182b','#adbfce':'#5f6475','#365268':'#c0c5d3','#62c5ff':'#5b5bd6','#ffbf71':'#9d5410','#8de0bf':'#087b6a'}))art=art.replaceAll(dark,light);
vm.runInContext(art,context);
const out=new URL('.artifacts/animation/rehearsal-frames/',root);await mkdir(out,{recursive:true});
for(const c of talk.chapters){
 const visuals=Number.isInteger(c.previewVisualIndex)?[c.visuals[c.previewVisualIndex]]:c.visuals;
 const scene={...c,visualCues:visuals?.map(v=>({...v,start:0})),buildTime:0};
 await writeFile(new URL(c.id+'.svg',out),context.window.renderArtwork(scene,9999,{final:true}));
}
await writeFile(new URL('manifest.json',out),JSON.stringify({scriptRevision:talk.scriptRevision,frames:talk.chapters.map(c=>({id:c.id,file:c.id+'.svg',title:c.title}))},null,2)+'\n');
await writeFile(new URL('README.txt',out),'Generated rehearsal frames from the current script. Present slides.md and slides/*.md with Slidev. This exporter does not create an alternate deck, notes, or a source-inspection workflow.\n');
console.log(`Exported ${talk.chapters.length} review frames into .artifacts/animation/rehearsal-frames/. The authored deck and notes are unchanged.`);
