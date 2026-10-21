/* Deterministic visual renderer shared by the browser player and video export.
   All six builds explain a changed relationship or result; narration is optional. */
(() => {
  const C = {bg:'#081725', panel:'#112a3d', ink:'#f5f7fa', muted:'#adbfce', line:'#365268', blue:'#62c5ff', depth:'#ffbf71', green:'#8de0bf'};
  const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ease = x => {x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
  function text(x,y,value,size=28,color=C.ink,extra='') {
    return `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${escape(value)}</text>`;
  }
  function wrap(value,limit=44) {
    const lines=[''];
    for(const word of value.split(' ')) {
      const last=lines.length-1;
      if(lines[last] && (lines[last]+' '+word).length>limit)lines.push(word);
      else lines[last]+=(lines[last]?' ':'')+word;
    }
    return lines;
  }
  function lines(x,y,values,size=28,color=C.ink,extra='') {
    return values.map((value,i)=>text(x,y+i*size*1.35,value,size,color,extra)).join('');
  }
  function box(x,y,w,h,title,subtitle='',color=C.blue) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${C.panel}"/>`+
      `<rect x="${x}" y="${y}" width="4" height="${h}" fill="${color}"/>`+
      text(x+w/2,y+(subtitle?38:h/2+10),title,30,C.ink,'text-anchor="middle"')+
      (subtitle?text(x+w/2,y+71,subtitle,23,C.muted,'text-anchor="middle"'):'');
  }
  function arrow(x1,y1,x2,y2,opacity=1,color=C.line) {
    return `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="3" marker-end="url(#arrow)" opacity="${opacity}"/>`;
  }
  function services({selected=false,detail=0,y=310}={}) {
    let out=arrow(390,y+50,450,y+50)+arrow(780,y+50,840,y+50);
    out+=box(70,y,320,100,'Gateway','Go');
    out+=box(450,y,330,100,'Checkout','Java',selected?C.depth:C.blue);
    out+=box(840,y,370,100,'Inventory','Node.js');
    if(detail>0)out+=`<g opacity="${detail}" transform="translate(0 ${20*(1-detail)})">`+
      arrow(615,y+100,615,y+155,1,C.depth)+box(390,y+155,450,85,'Selected local operation','',C.depth)+'</g>';
    return out;
  }
  function trace({x=70,y=245,w=1130,depth=0,aligned=true,compact=false,focus=false}={}) {
    const labelWidth=compact?112:190;
    const plotX=x+labelWidth;
    const plotW=w-labelWidth;
    const step=compact?55:66;
    const barH=compact?19:25;
    const names=['Gateway','Checkout',depth>0?'Method':'', 'Inventory'];
    const widths=[.96,.86,.65,.08];
    const offsets=[0,.04,.09,.78];
    let out='';
    names.forEach((name,i)=>{
      const yy=y+i*step;
      if(i===2 && depth===0) {
        if(aligned)out+=text(plotX+8,yy+barH-2,'No named method span',compact?20:25,C.muted);
        return;
      }
      const p=i===2?depth:1;
      out+=`<g opacity="${p}">`+text(x,yy+barH-2,name,compact?23:29,i===2?C.depth:C.ink);
      out+=`<rect x="${plotX}" y="${yy}" width="${plotW}" height="${barH}" fill="${C.panel}"/>`;
      out+=`<rect x="${plotX+offsets[i]*plotW}" y="${yy}" width="${widths[i]*plotW*(i===2?p:1)}" height="${barH}" rx="3" fill="${i===2?C.depth:(focus&&i===1?C.blue:'#668aa4')}"/></g>`;
    });
    return out;
  }
  function compare(removal=false,progress=1) {
    let out=text(70,245,removal?'Earlier request · depth':'Baseline request',28,C.muted)+
      text(690,245,removal?'Fresh request · breadth':'New request · depth',28,C.muted);
    out+=trace({x:70,y:290,w:515,depth:removal?1:0,compact:true});
    out+=`<line x1="640" y1="260" x2="640" y2="550" stroke="${C.line}"/>`;
    if(progress>0)out+=`<g opacity="${progress}">`+trace({x:690,y:290,w:515,depth:removal?0:1,compact:true})+'</g>';
    if(progress===0)out+=text(945,420,'Observe after convergence',23,C.muted,'text-anchor="middle"');
    out+=text(640,590,removal?'Keep baseline coverage · remove selected method detail':'Same framing · separate requests · newly named work',29,removal?C.blue:C.depth,'text-anchor="middle"');
    return out;
  }
  function content(scene,p) {
    switch(scene.kind) {
    case 'title':return lines(70,270,['OpenTelemetry','Far and Wide'],88)+text(74,475,'Tyler Yahn · Nikola Grcevski',32,C.muted)+text(74,570,'Broad coverage · selected depth',34,C.blue);
    case 'problem':return services({selected:true,y:305})+text(640,235,'Checkout is slow.',48,C.depth,'text-anchor="middle"')+text(640,500,'Which work inside it explains the delay?',34,C.ink,'text-anchor="middle"')+text(640,565,'One platform · several service owners',27,C.muted,'text-anchor="middle"');
    case 'model':return services({selected:p>0,detail:p,y:270});
    case 'breadth':return box(380,220,520,85,'Shared deployment workflow')+arrow(640,305,640,365)+(p===0?text(640,425,'Apply baseline configuration',34,C.ink,'text-anchor="middle"')+text(640,490,'Inspect a fresh request',29,C.muted,'text-anchor="middle"'):'')+`<g opacity="${p}">`+services({y:390})+text(640,585,'Connected request path',34,C.blue,'text-anchor="middle"')+'</g>';
    case 'gap':return trace({focus:true})+text(640,575,'Which local operation would explain the interval?',32,C.depth,'text-anchor="middle"');
    case 'depth':return trace({depth:p,focus:true})+text(640,590,p>0?'PricingEngine.calculate':'Change checkout’s profile → inspect the next request',p>0?34:30,p>0?C.depth:C.muted,'text-anchor="middle"');
    case 'answer':return compare();
    case 'control':return arrow(640,300,350,365)+arrow(640,300,930,365)+
      `<g opacity="${p}">`+arrow(350,465,640,560)+arrow(930,465,640,560)+'</g>'+
      box(360,210,560,90,'Shared deployment workflow','Proposed Operator integration')+
      text(345,345,'Configure',26,C.muted,'text-anchor="middle"')+text(935,345,'Inject',26,C.muted,'text-anchor="middle"')+
      box(135,365,430,100,'OBI','Request view + baseline metrics')+box(715,365,430,100,'Language agent','Selected runtime detail',C.depth)+
      `<g opacity="${p}">`+box(470,560,340,65,'Collector')+text(640,665,'Checkout trace owner: OBI in breadth · Java agent in depth',24,C.muted,'text-anchor="middle"')+'</g>';
    case 'upgrade':return box(80,260,500,85,'Before convergence')+box(700,260,500,85,'After convergence')+
      lines(110,410,['Requested: target agent version','Running: current agent version'],27,C.muted)+
      lines(730,410,['Requested: target agent version','Running: target agent version'],27,C.blue)+
      text(640,570,'Verify the running agent / SDK · keep application identity',30,C.depth,'text-anchor="middle"');
    case 'return':return compare(true,p);
    case 'cost':{
      let out='';
      for(const [x,title,unit] of [[85,'Export volume','OTLP bytes / completed request'],[725,'Application CPU','CPU cores · matched request throughput']]) {
        out+=text(x,255,title,35)+text(x,300,unit,23,C.muted)+
          `<path d="M${x} 335 V520 H${x+470}" fill="none" stroke="${C.line}" stroke-width="2"/>`+
          text(x+235,430,'Measurements pending',27,C.muted,'text-anchor="middle"')+
          text(x+20,560,'Breadth',23,C.muted)+text(x+194,560,'Depth',23,C.muted)+text(x+337,560,'Restored',23,C.muted);
      }
      return out+text(640,635,'Matched load · repeated trials · report variation',29,C.blue,'text-anchor="middle"');
    }
    case 'verify':{
      let out='';
      ['Candidate','Verify','Promote','Retire'].forEach((name,i)=>{
        const x=70+i*295;
        if(i<3)out+=arrow(x+250,325,x+280,325);
        out+=box(x,280,250,85,name,'',i===1?C.depth:C.blue);
      });
      out+=text(640,455,'Correct parent chain · one trace owner · retained baseline',31,C.depth,'text-anchor="middle"');
      return out+lines(640,550,['Pass → promote and retire','Fail → recover before proceeding'],29,C.muted,'text-anchor="middle"');
    }
    case 'adopt':return lines(100,285,['1   Choose one service and an unanswered question.','2   Compare profiles and verify a fresh request.','3   Retain or remove detail; keep a rollback path.'],34)+text(100,580,'Measure whether the new observation earns its place.',30,C.blue);
    case 'question':return text(640,255,'Which service is returning errors?',39,C.ink,'text-anchor="middle"')+
      box(85,325,540,100,'A · Inspect request signals','',p>0?C.blue:C.line)+box(675,325,520,100,'B · Add method detail','',C.line)+
      `<g opacity="${p}">`+text(640,505,'A · Existing signals may already answer it.',30,C.blue,'text-anchor="middle"')+
      text(640,580,'Which local calculation consumes time?',32,C.ink,'text-anchor="middle"')+
      text(640,630,'Now consider selected runtime detail.',29,C.depth,'text-anchor="middle"')+'</g>';
    case 'close':return lines(75,300,['Start broad.','Add depth with purpose.'],72)+text(78,540,'One service. One unanswered question.',38,C.blue)+text(78,610,'Manage and verify the profile.',29,C.muted);
    }
    return '';
  }
  window.renderArtwork = (scene,seconds,{final=false,reduceMotion=false}={}) => {
    const hasBuild=Number.isFinite(scene.buildTime);
    const p=hasBuild?(final?1:reduceMotion?Number(seconds>=scene.buildTime):ease((seconds-scene.buildTime)/1.6)):1;
    const title=scene.kind==='title'?'':lines(70,105,wrap(scene.title,47),46);
    const evidence=['breadth','gap','depth','answer','upgrade','return','cost','verify'].includes(scene.kind);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" role="img" aria-label="${escape(scene.title)}" style="font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">`+
      `<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10" fill="none" stroke="${C.line}" stroke-width="1.5"/></marker></defs>`+
      `<rect width="1280" height="720" fill="${C.bg}"/>`+text(70,40,'OPENTELEMETRY FAR AND WIDE',18,C.muted)+title+content(scene,p)+
      (evidence?text(70,695,scene.kind==='cost'?'No measured results shown':'Illustration · not recorded demo evidence',18,C.muted):'')+'</svg>';
  };
})();
