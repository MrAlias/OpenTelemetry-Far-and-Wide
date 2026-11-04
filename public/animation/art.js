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
  function localTrace(detail=0){
    const names=['Gateway','Checkout',detail>0?'PricingEngine.calculate':'Unexplained local work','Inventory call',detail>0?'Hibernate / JDBC':'Persistence question','Commerce calls'];let s='';
    names.forEach((name,i)=>{const y=225+i*58,internal=i===2||i===4;
      s+=text(75,y+24,name,internal?24:27,internal?C.depth:C.ink);
      s+=`<rect x="410" y="${y}" width="790" height="27" fill="${C.panel}"/>`;
      if(!internal||detail>0)s+=`<rect x="${410+[0,32,85,355,420,520][i]}" y="${y}" width="${[770,710,260*detail,55,90*detail,160][i]}" height="27" rx="3" fill="${internal?C.depth:C.blue}" opacity="${internal?detail:1}"/>`;
    });return s;
  }
  function list(items,{x=85,y=270,size=33,gap=70,color=C.ink}={}){return items.map((s,i)=>text(x,y+i*gap,s,size,color)).join('');}
  function capturedPanel(capture, region, x, y, width, id) {
    const [left,top,w,h]=region, scale=width/w;
    const file='demo-capture/'+capture.image, src=window.EVIDENCE_IMAGES?.[file]||file;
    return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${width}" height="${h*scale}" rx="5"/></clipPath></defs><image href="${escape(src)}" x="${x-left*scale}" y="${y-top*scale}" width="${capture.width*scale}" height="${capture.height*scale}" clip-path="url(#${id})"/>`;
  }
  function content(scene,p){switch(scene.kind){
    case 'title':return lines(70,270,['OpenTelemetry','Far and Wide'],88)+text(75,485,'Tyler Yahn · Nikola Grcevski',32,C.muted)+lines(75,565,['Find the wait. Fix the cause.','Make the next investigation easier.'],33,C.blue);
    case 'observed':return fleet('observed',p)+center(655,p>0?'Cart branch · captured server durations':'A topology shows possible calls; the request shows observed calls',25,C.blue);
    case 'trace-focus':return `<image href="${window.EVIDENCE_IMAGES?.['demo-capture/connected-trace.png']||'demo-capture/connected-trace.png'}" x="0" y="0" width="1280" height="720"/>`+(p>0?`<rect x="513" y="${window.DEMO_EVIDENCE.failedConnectionRowY}" width="${750*window.DEMO_EVIDENCE.failedConnectionMs/window.DEMO_EVIDENCE.serverDurationMs.gateway}" height="30" fill="${C.depth}" opacity="${.35*p}"/><path d="M700 ${window.DEMO_EVIDENCE.failedConnectionRowY} L700 388" stroke="${C.depth}" stroke-width="3"/><rect x="530" y="330" width="470" height="58" rx="8" fill="${C.bg}" stroke="${C.depth}"/>`+text(765,368,(window.DEMO_EVIDENCE.failedConnectionMs/1000).toFixed(2)+' s · failed connection',25,C.depth,'text-anchor="middle"'):'');
    case 'screen':case 'terminal':return '';
    case 'obi-intro':return text(75,210,'OpenTelemetry eBPF Instrumentation',32,C.blue)+lines(75,300,['Start with the applications','you already have.'],52)+lines(75,485,['No application code changes','No application restarts','OpenTelemetry traces and metrics'],30,C.ink)+text(75,665,'Deploy on the nodes · discover supported Linux workloads',26,C.muted);
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
      return text(75,190,'Upstream OpenTelemetry Operator · reporting-api',25,C.blue)
        +text(75,240,c.annotationPrefix,19,C.muted,'font-family="monospace"')
        +rows.map((row,i)=>text(75,292+i*43,row.key+': "'+row.value+'"',25,row.at===step?C.blue:C.ink,'font-family="monospace"')).join('')
        +text(850,220,c.steps[step],27,C.ink)
        +box(850,260,350,86,'App team','Image + startup')+arrow(1025,346,1025,380)
        +box(850,380,350,86,'Platform','Payload + configuration')+arrow(1025,466,1025,500)
        +box(850,500,350,86,'Release','Restart + trace')
        +text(75,566,c.pythonPayload.field,18,C.muted)+text(75,596,c.pythonPayload.image,23,C.blue,'font-family="monospace"')
        +text(75,635,c.startup,25,C.depth,'font-family="monospace"')
        +text(75,680,'Pod mutation still needs application facts.',25,C.muted);
    }
    case 'namespace-result':return text(75,163,'selector.namespaces: [demo-apps]',29,C.blue,'font-family="monospace"')+fleet(p>0?'deploy':'one',p)+center(655,'14 language agents · 4 Go services with OBI · one namespace choice',26,C.green);
    case 'topology':return fleet()+center(655,'18 application services · one successful checkout visits the full tree',27);
    case 'obi':return fleet('obi',p)+center(655,p>0?'Follow gateway → checkout → the commerce branches':'Apply OBI · send a checkout request',28,C.blue);
    case 'slow':return fleet('slow',p)+center(655,p>0?'Inspect Checkout after accounting for its downstream work':'Compare the observed timing before selecting a service',27,p>0?C.depth:C.muted);
    case 'question':return localTrace()+center(610,'What can the language agent explain inside the boundary?',29,C.depth);
    case 'manual':return list(['1   Choose and provide the supported agent','2   Configure startup, identity, and export','3   Deploy · wait for readiness','4   Generate traffic · verify useful linked spans'],{gap:78,size:32})+center(635,'Knowing how and having access still leave work to do',28,C.depth);
    case 'detail':return localTrace(p)+center(610,p>0?'New observation · correct parent links · healthy requests':'Keep the baseline framing; inspect a fresh request',29,p>0?C.depth:C.muted);
    case 'scale':return fleet('one')+center(655,'1 agent configured · 13 more eligible · 4 Go services keep OBI',28,C.depth);
    case 'operator':return box(360,230,560,90,'Custom operator','Shared selection and runtime handling')+arrow(640,320,640,370)+box(360,380,560,90,'Injector','Arrange the supported language agent',C.depth)+center(550,'Upstream already supports language auto-injection',28)+center(610,'Custom prototype · upstream already supports auto-injection',25);
    case 'deploy':return fleet(p>0?'deploy':'one',p)+center(655,p>0?'Verify 14 language agents; retain the Go OBI baseline':'Enroll 13 eligible services; exclude existing direct setup',28,p>0?C.green:C.muted);
    case 'complete':return fleet('complete')+center(655,'14 language agents · 4 Go OBI baselines · latency still needs investigation',26,C.green);
    case 'savings':return text(80,245,'Request for visibility',30,C.blue)+text(1200,245,'Useful telemetry',30,C.green,'text-anchor="end"')+arrow(80,305,1195,305)+list(['Agree and coordinate','Configure and deploy','Wait and switch context','Validate and recover'],{x:95,y:380,size:33,gap:67})+text(680,400,'People doing the work',31,C.depth)+text(680,470,'Time waiting between steps',31,C.depth)+text(680,555,'Measure both clocks separately',26,C.muted);
    case 'lifecycle':return list(['New compatible service → inherit namespace selection','Agent update → reuse the rollout and checks','Configuration change → reduce drift and rework','Failure → reuse a tested recovery path'],{size:31,gap:78})+center(635,'Include platform maintenance, compatibility, and blast radius',27,C.depth);
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
      return '<g transform="translate(64 155)">'+inner+'</g>'+(scene.kind==='cost-timeline'?text(75,675,'18-service demo · setup + monthly updates · $100/hour',25,C.muted):'');
    }
    case 'close':return text(75,265,duration(window.RESOLUTION.before.requestMedianMs)+' → '+duration(window.RESOLUTION.after.requestMedianMs),76,C.green)+text(75,325,'Customer request · matched median',29,C.muted)+text(75,465,'One namespace',65,C.green)+text(75,520,'14 language agents · 4 services with OBI',29,C.muted)+window.CLOSING_RESOURCES.map((r,i)=>`<a href="${r.url}"><g transform="translate(${790+i*215} 235) scale(${195/r.size})">${r.markup}</g>`+text(887.5+i*215,470,r.label,24,C.ink,'text-anchor="middle"')+'</a>').join('')+text(75,630,'Find the wait. Fix the cause. Make the next investigation easier.',29,C.blue);
    default:throw new Error('Unknown artwork kind: '+scene.kind);
  }}
  window.renderArtwork=(scene,seconds,{final=false,reduceMotion=false}={})=>{
    const events=scene.visualCues||scene.visuals||[];
    const visual=[...events].reverse().find(v=>(v.start??v.at??0)<=seconds)||events[0];
    if(visual&&visual.type!=='art'){const src=visual.type==='video'?visual.poster:visual.src;const href=window.EVIDENCE_IMAGES?.[src]||src;return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${visual.focus==='waterfall'?'0 230 1280 470':'0 0 1280 720'}"><rect width="1280" height="720" fill="${C.bg}"/><image href="${escape(href)}" width="1280" height="720" preserveAspectRatio="xMidYMid meet"/></svg>`;}
    const hasBuild=Number.isFinite(scene.buildTime),t=Math.max(0,Math.min(1,(seconds-scene.buildTime)/1.6));
    const p=hasBuild?(final?1:reduceMotion?Number(seconds>=scene.buildTime):t*t*(3-2*t)):1;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" role="img" aria-label="${escape(scene.title)}" style="font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">`+
      `<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10" fill="none" stroke="${C.line}" stroke-width="1.5"/></marker></defs>`+
      `<rect width="1280" height="720" fill="${C.bg}"/>`+text(70,40,'OPENTELEMETRY FAR AND WIDE',18,C.muted)+
      (scene.kind==='title'?'':lines(70,105,wrap(scene.title),46))+content(scene,p)+
      ''+'</svg>';
  };
})();
