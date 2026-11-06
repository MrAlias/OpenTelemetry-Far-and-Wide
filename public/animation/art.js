/* Evidence-led artwork shared by playback, storyboard and slides. */
(() => {
  const C={bg:'#081725',panel:'#112a3d',ink:'#f5f7fa',muted:'#adbfce',line:'#365268',blue:'#62c5ff',depth:'#ffbf71',green:'#8de0bf'};
  const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text=(x,y,s,size=28,color=C.ink,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${escape(s)}</text>`;
  const lines=(x,y,ss,size=28,color=C.ink,extra='')=>ss.map((s,i)=>text(x,y+i*size*1.35,s,size,color,extra)).join('');
  const wrap=(s,n=47)=>{const a=[''];for(const w of s.split(' ')){const i=a.length-1;if(a[i]&&(a[i]+' '+w).length>n)a.push(w);else a[i]+=(a[i]?' ':'')+w;}return a;};
  const arrow=(x,y,xx,yy,color=C.line)=>`<path d="M${x} ${y} L${xx} ${yy}" stroke="${color}" stroke-width="3" fill="none" marker-end="url(#arrow)"/>`;
  const box=(x,y,w,h,label,sub='',color=C.blue)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${C.panel}" stroke="${color}" stroke-width="2"/>`+text(x+w/2,y+(sub?32:h/2+10),label,30,C.ink,'text-anchor="middle"')+(sub?text(x+w/2,y+72,sub,22,C.muted,'text-anchor="middle"'):'');
  const center=(y,s,size=29,color=C.muted)=>text(640,y,s,size,color,'text-anchor="middle"');
  const fleet=(mode='plain',progress=1)=>window.renderDemoTopology({mode,progress,palette:C});
  const duration=ms=>ms>=1000?(ms/1000).toFixed(2)+' s':Math.round(ms)+' ms';
  const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v);
  function list(items,{x=85,y=270,size=33,gap=70,color=C.ink}={}){return items.map((s,i)=>text(x,y+i*gap,s,size,color)).join('');}
  function capturedPanel(capture, region, x, y, width, id) {
    const [left,top,w,h]=region, scale=width/w;
    const file='demo-capture/'+capture.image, src=window.EVIDENCE_IMAGES?.[file]||file;
    return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${width}" height="${h*scale}" rx="5"/></clipPath></defs><image href="${escape(src)}" x="${x-left*scale}" y="${y-top*scale}" width="${capture.width*scale}" height="${capture.height*scale}" clip-path="url(#${id})"/>`;
  }
  function content(scene,p){switch(scene.kind){
    case 'title':return lines(70,270,['OpenTelemetry','Far and Wide'],88)+text(75,485,'Tyler Yahn · Nikola Grcevski',32,C.muted)+lines(75,565,['Find the wait. Fix the cause.','Make the next investigation easier.'],33,C.blue);
    case 'trace-focus':return '<svg x="0" y="180" width="1280" height="480" viewBox="0 280 1280 440">'+`<image href="${window.EVIDENCE_IMAGES?.['demo-capture/connected-trace.png']||'demo-capture/connected-trace.png'}" width="1280" height="720"/>`+(p>0?`<rect x="513" y="${window.DEMO_EVIDENCE.failedConnectionRowY}" width="${750*window.DEMO_EVIDENCE.failedConnectionMs/window.DEMO_EVIDENCE.serverDurationMs.gateway}" height="30" fill="${C.depth}" opacity="${.35*p}"/><path d="M700 ${window.DEMO_EVIDENCE.failedConnectionRowY} L700 388" stroke="${C.depth}" stroke-width="3"/><rect x="530" y="330" width="470" height="58" rx="8" fill="${C.bg}" stroke="${C.depth}"/>`+text(765,368,(window.DEMO_EVIDENCE.failedConnectionMs/1000).toFixed(2)+' s · failed connection',25,C.depth,'text-anchor="middle"'):'')+'</svg>';
    case 'java-setup':return `<rect x="65" y="210" width="1150" height="365" rx="6" fill="${C.panel}"/>`+lines(100,270,['JAVA_TOOL_OPTIONS: >-', '  -javaagent:/java-agent/opentelemetry-javaagent.jar','OTEL_SERVICE_NAME: checkout','OTEL_EXPORTER_OTLP_ENDPOINT: >-', '  http://lgtm.observability.svc.cluster.local:4318'],29,C.ink,'font-family="monospace" xml:space="preserve"');
    case 'namespace-rule':return `<rect x="95" y="235" width="1090" height="320" rx="6" fill="${C.panel}"/>`+lines(150,325,['selector:','  namespaces: [demo-apps]','action: Inject'],46,C.blue,'font-family="monospace" xml:space="preserve"');
    case 'screen':case 'terminal':return '';
    case 'obi-intro':{
      const r=window.PREVIOUS_TALK_RESOURCE;
      let g=text(75,180,'OpenTelemetry eBPF Instrumentation',30,C.blue);
      g+='<g transform="translate(65 225)">'+text(380,38,'Running applications',25,C.muted,'text-anchor="middle"');
      g+=[160,380,600].map(x=>`<path d="M${x} 155V222" fill="none" stroke="${C.line}" stroke-width="2"/><rect x="${x-72}" y="73" width="144" height="84" rx="7" fill="${C.panel}" stroke="${C.line}" stroke-width="2"/><path d="M${x-22} 102L${x-36} 115L${x-22} 128M${x+22} 102L${x+36} 115L${x+22} 128M${x+8} 94L${x-8} 136" fill="none" stroke="${C.ink}" stroke-width="3"/>`).join('');
      g+=`<rect x="67" y="220" width="626" height="73" rx="6" fill="${C.panel}" stroke="${C.blue}" stroke-width="2"/>`+text(104,266,'OBI / eBPF',29,C.blue)+text(651,265,'Linux',24,C.muted,'text-anchor="end"')+arrow(380,293,380,333)+text(380,370,'Traces + metrics',28,C.ink,'text-anchor="middle"')+'</g>';
      return g+text(250,675,'0',52)+text(295,675,'code edits',24,C.muted)+text(500,675,'0',52)+text(545,675,'restarts',24,C.muted)+`<a href="${r.url}">`+text(1060,205,r.location+' · '+r.year,25,C.muted,'text-anchor="middle"')+`<g transform="translate(930 235) scale(${260/r.size})">${r.markup}</g>`+r.lines.map((line,i)=>text(1060,540+i*36,line,26,C.ink,'text-anchor="middle"')).join('')+'</a>';
    }
    case 'timeout-evidence':{
      const c=window.ATTRIBUTE_CAPTURES.timeout, width=980;
      return capturedPanel(c,c.attributes,150,190,width,'timeout-attributes')
        +capturedPanel(c,c.event,150,190+c.attributes[3]*width/c.attributes[2]+16,width,'timeout-event');
    }
    case 'configuration-fix':{
      const c=window.ATTRIBUTE_CAPTURES.configuration, width=1120;
      return capturedPanel(c,c.context,80,185,width,'resource-context')
        +capturedPanel(c,c.setting,80,185+c.context[3]*width/c.context[2]+24,width,'resource-setting')
        +text(80,650,'Same address as the failed HTTP span.',28,C.muted);
    }
    case 'injector-intro':{
      const project=window.INJECTOR_RESOURCE;
      const graphic=window.renderInjectorDiagram({runtimes:project.runtimes,palette:{ink:C.ink,muted:C.muted,line:C.line,surface:C.panel,accent:C.blue,agent:C.green}}).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
      return '<g transform="translate(64 185) scale(1.005)">'+graphic+'</g>'
        +`<a href="${project.url}"><g transform="translate(924 220) scale(${280/project.size})">${project.markup}</g>`
        +text(1064,545,'Project + docs',26,C.ink,'text-anchor="middle"')
        +text(1064,580,'opentelemetry-injector',19,C.muted,'text-anchor="middle"')+'</a>';
    }
    case 'operator-opt-in':{
      const c=window.OPERATOR_CONFIGURATION,step=scene.operatorStep??5;
      const rows=c.annotations.filter(row=>row.at<=step);
      let diagram='';
      if(step===1){diagram=`<rect x="850" y="250" width="350" height="340" rx="6" fill="none" stroke="${C.line}" stroke-width="2"/>`+text(875,285,'Pod',22,C.muted)+box(930,315,190,105,'api','Python 3.12')+`<path d="M1025 420V455M940 455H1110M940 455V490M1110 455V490" fill="none" stroke="${C.line}" stroke-width="2"/>`+box(875,490,130,58,'glibc','',C.line)+box(1045,490,130,58,'musl','',C.green)}
      else if(step===2){diagram=`<rect x="850" y="250" width="350" height="340" rx="6" fill="none" stroke="${C.line}" stroke-width="2"/>`+text(875,285,'Pod',22,C.muted)+box(865,320,155,175,'api','Python')+box(1030,320,155,175,'worker','.NET',C.green)}
      else{diagram=box(850,260,350,86,'App team','Image + startup')+arrow(1025,346,1025,380)+box(850,380,350,86,'Platform','Payload + configuration')+arrow(1025,466,1025,500)+box(850,500,350,86,'Release','Restart + trace')}
      return text(75,190,'Upstream OpenTelemetry Operator · reporting-api',25,C.blue)+text(75,240,c.annotationPrefix,19,C.muted,'font-family="monospace"')+rows.map((row,i)=>text(75,292+i*43,row.key+': "'+row.value+'"',25,row.at===step?C.blue:C.ink,'font-family="monospace"')).join('')+text(850,220,c.steps[step],27)+diagram+text(75,566,c.pythonPayload.field,18,C.muted)+text(75,596,c.pythonPayload.image,23,C.blue,'font-family="monospace"');
    }
    case 'controller-intro':return box(90,255,470,110,'RIO demo controller','Select workloads + manage rollout')+arrow(560,310,710,310)+box(710,255,470,110,'Injector','Load agent inside each process')+center(500,'Prepared bundle · shared exporter · compatible workloads',30,C.blue)+center(585,'Purpose-built prototype · upstream home remains open',26);
    case 'namespace-result':return text(75,163,'selector.namespaces: [demo-apps]',29,C.blue,'font-family="monospace"')+fleet(p>0?'deploy':'one',p)+center(655,'14 language agents · 4 Go services with OBI · one namespace choice',26,C.green);
    case 'topology':return fleet()+center(655,'18 application services · one successful checkout visits the full tree',27);
    case 'scale':return fleet('one')+center(655,'1 agent configured · 13 more eligible · 4 Go services keep OBI',28,C.depth);
    case 'lifecycle':{
      let g='<g transform="translate(64 130)">';
      const events=['New service','Agent update','Configuration','Recovery'];
      events.forEach((event,i)=>{const y=105+i*100;g+=`<path d="M300 ${y}H360Q395 ${y} 415 255H455" fill="none" stroke="${C.line}" stroke-width="2"/><circle cx="46" cy="${y}" r="18" fill="${C.panel}" stroke="${C.line}" stroke-width="2"/><path d="M38 ${y}H54M46 ${y-8}V${y+8}" stroke="${C.blue}" stroke-width="2"/>`+text(85,y+9,event,27)});
      g+=`<circle cx="545" cy="255" r="88" fill="${C.panel}" stroke="${C.green}" stroke-width="3"/><path d="M520 222A35 35 0 1 1 515 267M515 244V267H538" fill="none" stroke="${C.green}" stroke-width="3"/>`+text(545,305,'Platform',24,C.ink,'text-anchor="middle"')+`<path d="M635 255H712M712 125V374" fill="none" stroke="${C.green}" stroke-width="2"/>`;
      const nodes=Array.from({length:13},(_,i)=>({x:i===12?922.5:795+(i%4)*85,y:125+Math.floor(i/4)*83}));
      g+=nodes.map(({x,y})=>`<path d="M712 255V${y}H${x-27}" fill="none" stroke="${C.green}" stroke-width="2" opacity=".45"/>`).join('');
      g+=nodes.map(({x,y})=>`<g transform="translate(${x} ${y})"><rect x="-26" y="-23" width="52" height="46" rx="5" fill="${C.panel}" stroke="${C.green}" stroke-width="2"/><path d="M-13 -6L-19 0L-13 6M13 -6L19 0L13 6M4 -10L-4 10" fill="none" stroke="${C.green}" stroke-width="2"/></g>`).join('');
      return g+text(922,65,'13 services',26,C.muted,'text-anchor="middle"')+'</g>';
    }
    case 'latency-result':case 'metric-comparison':{
      return ['before','after'].map((phase,i)=>{
        const src='presentation/images/customer-'+phase+'-metric.png';
        const href=window.EVIDENCE_IMAGES?.[src]||src,x=64+i*588;
        return text(x,205,phase==='before'?'Before fix':'After fix',29)
          +`<image href="${escape(href)}" x="${x}" y="230" width="560" height="379.1667"/>`;
      }).join('');
    }
    case 'adoption':case 'cost-timeline':{
      const chart=window.renderRolloutChart(scene.kind==='adoption'?'adoption':'cost',{ink:C.ink,muted:C.muted,grid:C.line,central:C.green,distributed:C.blue,emphasis:C.depth});
      const inner=chart.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
      return '<g transform="translate(64 '+(scene.kind==='cost-timeline'?110:155)+')">'+inner+'</g>'+(scene.kind==='cost-timeline'?text(75,675,'18 services · monthly updates',25,C.muted):'');
    }
    case 'close':return text(75,265,duration(window.METRIC_COMPARISON.before.meanSeconds*1000)+' → '+duration(window.METRIC_COMPARISON.after.meanSeconds*1000),76,C.green)+text(75,325,'Customer request · captured mean',29,C.muted)+text(75,465,'One namespace',65,C.green)+text(75,520,'14 language agents · 4 services with OBI',29,C.muted)+window.CLOSING_RESOURCES.map((r,i)=>`<a href="${r.url}"><g transform="translate(${710+i*175} 235) scale(${155/r.size})">${r.markup}</g>`+text(787.5+i*175,435,r.label,21,C.ink,'text-anchor="middle"')+'</a>').join('')+text(75,630,'Find the wait. Fix the cause. Make the next investigation easier.',29,C.blue);
    default:throw new Error('Unknown artwork kind: '+scene.kind);
  }}
  window.renderArtwork=(scene,seconds,{final=false,reduceMotion=false}={})=>{
    const events=scene.visualCues||scene.visuals||[];
    const visual=[...events].reverse().find(v=>(v.start??v.at??0)<=seconds)||events[0];
    if(visual&&visual.type!=='art'){const src=visual.type==='video'?visual.poster:visual.src;const href=window.EVIDENCE_IMAGES?.[src]||src;return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${visual.focus==='waterfall'?'0 230 1280 470':'0 0 1280 720'}"><rect width="1280" height="720" fill="${C.bg}"/><image href="${escape(href)}" width="1280" height="720" preserveAspectRatio="xMidYMid meet"/></svg>`;}
    scene={...scene,...visual?.artwork};
    const hasBuild=Number.isFinite(scene.buildTime),t=Math.max(0,Math.min(1,(seconds-scene.buildTime)/1.6));
    const p=hasBuild?(final?1:reduceMotion?Number(seconds>=scene.buildTime):t*t*(3-2*t)):1;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" role="img" aria-label="${escape(scene.title)}" style="font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">`+
      `<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10" fill="none" stroke="${C.line}" stroke-width="1.5"/></marker></defs>`+
      `<rect width="1280" height="720" fill="${C.bg}"/>`+(scene.kind==='cost-timeline'?'':text(70,40,'OPENTELEMETRY FAR AND WIDE',18,C.muted))+
      (['title','cost-timeline'].includes(scene.kind)?'':lines(70,105,wrap(scene.title),46))+content(scene,p)+
      ''+'</svg>';
  };
})();
