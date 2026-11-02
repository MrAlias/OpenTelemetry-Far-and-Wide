/* Graphviz supplies geometry; semantic layers distinguish evidence and enrollment. */
window.renderDemoTopology=({mode='plain',progress=1,palette:C}={})=>{
 const model=window.DEMO_TOPOLOGY;
 const branch=window.DEMO_EVIDENCE?.highlightedBranch||['gateway','checkout','cart','catalog','recommendations','promotions'];
 const active=new Set(branch.slice(0,Math.ceil(progress*branch.length)));
 const observed=mode!=='plain'&&(mode!=='obi'||progress>0);
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const txt=(x,y,s,size,color,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${esc(s)}</text>`;
 let art='';
 for(const e of model.edges){
  const points=e.points;let d=`M ${points[0].join(' ')}`;
  for(let i=1;i<points.length;i+=3)d+=' C '+points.slice(i,i+3).map(p=>p.join(' ')).join(' ');
  const edge=(color,width)=>`<path data-edge="${e.from}:${e.to}" d="${d}" stroke="${color}" stroke-width="${width}" fill="none"/>`;
  art+=edge(C.line,2);
  if(mode!=='plain'&&(mode!=='observed'||active.has(e.from)&&active.has(e.to)))art+=`<g opacity="${mode==='obi'?progress:1}">${edge(C.blue,3)}</g>`;
  const a=points.at(-2),b=points.at(-1),angle=Math.atan2(b[1]-a[1],b[0]-a[0]);
  art+=`<path d="M${b[0]-7*Math.cos(angle-.45)} ${b[1]-7*Math.sin(angle-.45)} L${b[0]} ${b[1]} L${b[0]-7*Math.cos(angle+.45)} ${b[1]-7*Math.sin(angle+.45)}" stroke="${observed?C.blue:C.line}" stroke-width="2" fill="none"/>`;
 }
 for(const e of model.storeEdges){
  const points=e.points;let d=`M${points[0].join(' ')}`;
  for(let i=1;i<points.length;i+=3)d+=' C '+points.slice(i,i+3).map(p=>p.join(' ')).join(' ');
  art+=`<path data-store-edge="${e.from}:${e.to}" d="${d}" stroke="${C.line}" stroke-width="1.7" stroke-dasharray="5 5" fill="none"/>`;
  const a=points.at(-2),b=points.at(-1),angle=Math.atan2(b[1]-a[1],b[0]-a[0]);
  art+=`<path d="M${b[0]-7*Math.cos(angle-.45)} ${b[1]-7*Math.sin(angle-.45)} L${b[0]} ${b[1]} L${b[0]-7*Math.cos(angle+.45)} ${b[1]-7*Math.sin(angle+.45)}" stroke="${C.line}" stroke-width="1.7" fill="none"/>`;
 }
 for(const n of model.nodes){
  const marked=mode==='slow'&&progress>0&&n.id==='checkout';
  const agent=n.eligible&&(mode==='complete'||mode==='deploy'&&(n.id==='checkout'||progress>0)||mode==='one'&&n.id==='checkout');
  const color=marked?C.depth:agent?C.green:mode==='observed'?(active.has(n.id)?C.blue:C.line):observed?C.blue:C.line;
  const x=n.x-n.w/2,y=n.y-n.h/2;
  art+=`<g data-service="${n.id}" data-agent="${agent}" data-selected="${marked}" data-eligible="${n.eligible}"><rect x="${x}" y="${y}" width="${n.w}" height="${n.h}" rx="5" fill="${C.panel}" stroke="${color}" stroke-width="${marked?4:2}"/>`;
  art+=txt(n.x,n.y-4,n.label,20,C.ink,'text-anchor="middle"');
  art+=txt(n.x,n.y+17,mode==='observed'&&active.has(n.id)?((window.DEMO_EVIDENCE?.serverDurationMs[n.id]||0)>=1000?(window.DEMO_EVIDENCE.serverDurationMs[n.id]/1000).toFixed(2)+' s':window.DEMO_EVIDENCE?.serverDurationMs[n.id]?.toFixed(1)+' ms'):n.runtime,16,observed?color:C.muted,'text-anchor="middle"');
  art+='</g>';
 }
 for(const store of model.stores){
  const {x,y,w,h}=store;
  art+=`<g data-store="${store.id}" transform="translate(${x} ${y})" fill="${C.panel}" stroke="${C.muted}" stroke-width="1.8"><path d="M${-w/2} ${-h/2+9} a${w/2} 9 0 0 1 ${w} 0 v${h-18} a${w/2} 9 0 0 1 ${-w} 0 Z"/><ellipse cx="0" cy="${-h/2+9}" rx="${w/2}" ry="9"/></g>`;
  art+=txt(x,y+12,store.label,22,C.ink,'text-anchor="middle"');
 }
 return art;
};
