
  (()=>{
    // Local text-layout fallback: keeps the portfolio fully functional when it is
    // opened from file:// or when a mobile browser blocks external ES modules.
    const textMeasureCanvas = document.createElement('canvas');
    const textMeasureContext = textMeasureCanvas.getContext('2d');
    function prepareWithSegments(text,font){ return {text,font}; }
    function layoutNextLine(prepared,cursor,width){
      const source = prepared.text;
      let start = cursor && Number.isFinite(cursor.offset) ? cursor.offset : 0;
      if(start >= source.length) return null;
      if(source[start] === '\n') return {text:'\u00a0',end:{offset:start+1}};
      const newline = source.indexOf('\n',start);
      const hardEnd = newline === -1 ? source.length : newline;
      textMeasureContext.font = prepared.font;
      let end = start;
      let lastSpace = -1;
      while(end < hardEnd){
        if(/\s/.test(source[end])) lastSpace = end;
        if(textMeasureContext.measureText(source.slice(start,end+1)).width > width){
          end = lastSpace > start ? lastSpace : Math.max(start+1,end);
          break;
        }
        end++;
      }
      if(end >= hardEnd) end = hardEnd;
      const line = source.slice(start,end).trimEnd() || '\u00a0';
      let next = end;
      while(next < source.length && source[next] === ' ') next++;
      if(next === hardEnd && source[next] === '\n') next++;
      return {text:line,end:{offset:next}};
    }

    const asciiField = document.getElementById('asciiField');
    const previewAscii = document.getElementById('previewAscii');
    const previewInner = document.getElementById('followPreviewInner');
    const asciiRamp = '  .,:;i1tfLCG08@';
    let asciiPointerX = .5;
    let asciiPointerY = .5;

    addEventListener('pointermove', event => {
      asciiPointerX = event.clientX / innerWidth;
      asciiPointerY = event.clientY / innerHeight;
    }, { passive:true });

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let heroOnscreen = true, heroDrawn = false, lastHeroFrame = 0, lastPreviewFrame = 0;
    const heroObserver = new IntersectionObserver(entries=>{heroOnscreen=entries[0].isIntersecting});
    heroObserver.observe(document.getElementById('top'));
    addEventListener('resize',()=>{heroDrawn=false});
    function drawAscii(time){
      if(document.hidden || !heroOnscreen || (reducedMotion.matches && heroDrawn) || time-lastHeroFrame<33){requestAnimationFrame(drawAscii);return}
      lastHeroFrame=time;heroDrawn=true;
      const rows = innerWidth < 760 ? 52 : 58;
      const lineHeight = innerHeight / rows;
      const fontSize = lineHeight / .82;
      const cols = Math.ceil(innerWidth / (fontSize * .61));
      asciiField.style.fontSize = `${fontSize}px`;
      asciiField.style.lineHeight = `${lineHeight}px`;
      let output = '';
      const wave = time * .00035;
      for(let y = 0; y < rows; y++){
        for(let x = 0; x < cols; x++){
          const nx = x / cols;
          const ny = y / rows;
          const dx = (nx - asciiPointerX) * 1.45;
          const dy = (ny - asciiPointerY) * 1.1;
          const pointerGlow = Math.max(0, 1 - Math.sqrt(dx*dx + dy*dy) * 2.2);
          const waves = (Math.sin(x * .19 + wave * 4) + Math.cos(y * .31 - wave * 3) + 2) / 4;
          const vignette = Math.max(0, 1 - Math.hypot(nx - .5, ny - .5) * 1.35);
          const value = Math.min(1, pointerGlow * .62 + waves * .23 + vignette * .3);
          output += asciiRamp[Math.floor(value * (asciiRamp.length - 1))];
        }
        output += '\n';
      }
      asciiField.textContent = output;
      requestAnimationFrame(drawAscii);
    }
    requestAnimationFrame(drawAscii);

    const previewRamp = [' ',' ','·','·','–','+','•'];
    function drawPreviewAscii(time){
      if(document.hidden || !document.getElementById('followPreview').classList.contains('show') || time-lastPreviewFrame<50){requestAnimationFrame(drawPreviewAscii);return}
      lastPreviewFrame=time;
      if(reducedMotion.matches) time=0;
      const cols = 42;
      const rows = 48;
      const mode = previewInner.dataset.mode || 'b';
      const t = time * .001;
      let output = '';

      for(let y=0;y<rows;y++){
        for(let x=0;x<cols;x++){
          const nx = (x/(cols-1))*2-1;
          const ny = (y/(rows-1))*2-1;
          let value = 0;

          if(mode === 'b'){
            // isla: un único contorno que respira.
            const radius = Math.hypot(nx*1.05, ny*.82);
            const edge = .56 + Math.sin(t*1.2+ny*4)*.025;
            value = Math.max(0,1-Math.abs(radius-edge)*18);
          }else if(mode === 'c'){
            // te pienso tiemblo: tres trazos finos que vibran.
            const waveA = Math.sin(nx*6+t*2.4)*.11;
            const band = Math.min(Math.abs(ny-waveA),Math.abs(ny-waveA-.24),Math.abs(ny-waveA+.24));
            value = Math.max(0,1-band*42);
          }else if(mode === 'd'){
            // archivo mutuo: dos órbitas abiertas que se acercan.
            const ax = Math.sin(t*.8)*.27;
            const d1 = Math.hypot(nx+0.42-ax,ny+Math.sin(t)*.12);
            const d2 = Math.hypot(nx-0.42+ax,ny-Math.sin(t)*.12);
            value = Math.max(0,1-Math.abs(d1-.32)*30)+Math.max(0,1-Math.abs(d2-.32)*30);
          }else if(mode === 'e'){
            // experimentos: retícula diagonal rota y cambiante.
            const diagonal = Math.abs(Math.sin((nx+ny)*12+t*.8));
            const mask = Math.sin(nx*5-t)+Math.cos(ny*4+t*.6);
            value = diagonal > .955 && mask > .18 ? .88 : 0;
          }else if(mode === 'pr'){
            // post relics: inscripción táctil inspirada en Braille.
            const cellX = Math.round((nx + 1) * 9);
            const cellY = Math.round((ny + 1) * 12);
            const dot = Math.hypot((nx + 1) * 9 - cellX,(ny + 1) * 12 - cellY);
            const brokenBand = Math.sin(cellX * 1.7 + cellY * .9) + Math.cos(cellY * 1.3 - t);
            value = dot < .24 && brokenBand > -.35 ? .94 : 0;
          }else if(mode === 'a'){
            // tacto: dos campos de calor que dejan un residuo móvil.
            const h1 = Math.exp(-8*((nx-Math.sin(t*.7)*.35)**2+(ny-Math.cos(t*.5)*.28)**2));
            const h2 = Math.exp(-12*((nx+Math.cos(t*.55)*.48)**2+(ny+Math.sin(t*.8)*.35)**2));
            value = Math.min(1,h1+h2*.82);
          }else if(mode === 'f'){
            // Müller-Brockmann: retícula modular, ejes y tensión tipográfica.
            const vertical = Math.abs(nx+.42)<.035 || Math.abs(nx-.18)<.025;
            const horizontal = Math.abs(ny+.34)<.025 || Math.abs(ny-.2)<.04;
            const diagonal = Math.abs(ny+nx*.72-Math.sin(t*.45)*.1)<.035;
            value = vertical || horizontal || diagonal ? .96 : 0;
          }else if(mode === 'g'){
            // Refraction: displaced rings and fragmented scan lines.
            const bend = Math.sin(ny*8+t*1.6)*.12;
            const radius = Math.hypot((nx+bend)*.9,ny);
            const rings = Math.max(0,1-Math.abs(Math.sin(radius*15-t*1.4))*8);
            const fragments = Math.sin(ny*24+nx*3-t*2)>.2?1:.12;
            value = rings*fragments;
          }else if(mode === 'h'){
            // Campo gaussiano: nube orgánica, porosa y audio-reactiva.
            const angle=Math.atan2(ny,nx);
            const radius=Math.hypot(nx*.86,ny);
            const shell=.54+Math.sin(angle*5+t*.7)*.08+Math.cos(ny*9-t)*.035;
            const membrane=Math.max(0,1-Math.abs(radius-shell)*17);
            const interior=Math.max(0,1-radius/1.08)*(.35+.25*Math.sin((nx-ny)*15+t*2));
            const pores=Math.sin(x*1.87+y*2.23+t*1.3)>.42?1:.18;
            value=Math.min(1,(membrane+interior)*pores);
          }else{
            value = Math.max(0,1-Math.hypot(nx,ny));
          }

          value = Math.max(0,Math.min(1,value));
          output += previewRamp[Math.floor(value*(previewRamp.length-1))];
        }
        output += '\n';
      }

      const previewWidth = followPreview.clientWidth;
      const previewHeight = followPreview.clientHeight;
      const fontSize = Math.min(previewWidth/(cols*.61),previewHeight/(rows*.9));
      previewAscii.style.fontSize = `${fontSize}px`;
      previewAscii.textContent = output;
      requestAnimationFrame(drawPreviewAscii);
    }
    requestAnimationFrame(drawPreviewAscii);

    // Accordion: native measurement, independent of external libraries.
    const accordionProjects = [...document.querySelectorAll('.project')];
    function closeAccordion(project){
      const body = project.querySelector('.project-accordion');
      const inner = project.querySelector('.project-accordion-inner');
      if(!project.classList.contains('is-open')){
        body.style.height = '0px';
        body.setAttribute('aria-hidden','true');
      body.inert = true;
        project.querySelector('.project-button').setAttribute('aria-expanded','false');
        return;
      }
      body.style.height = `${inner.scrollHeight}px`;
      body.offsetHeight;
      project.classList.remove('is-open');
      requestAnimationFrame(()=>{ body.style.height = '0px'; });
      body.setAttribute('aria-hidden','true');
      body.inert = true;
      project.querySelector('.project-button').setAttribute('aria-expanded','false');
    }
    function openAccordion(project){
      accordionProjects.forEach(other => { if(other !== project) closeAccordion(other); });
      const body = project.querySelector('.project-accordion');
      const inner = project.querySelector('.project-accordion-inner');
      inner.querySelectorAll('img').forEach(image=>{
        if(image.complete) return;
        image.addEventListener('load',()=>{
          if(project.classList.contains('is-open')) body.style.height = 'auto';
        },{once:true});
      });
      project.classList.add('is-open');
      body.setAttribute('aria-hidden','false');
      body.inert = false;
      project.querySelector('.project-button').setAttribute('aria-expanded','true');
      body.style.height = '0px';
      requestAnimationFrame(()=>{
        body.style.height = `${inner.scrollHeight}px`;
      });
      const settle = event=>{
        if(event.propertyName === 'height' && project.classList.contains('is-open')){
          body.style.height = 'auto';
          body.removeEventListener('transitionend',settle);
        }
      };
      body.addEventListener('transitionend',settle);
    }
    accordionProjects.forEach(project=>{
      project.querySelector('.project-accordion').inert = true;
      project.querySelector('.project-button').setAttribute('aria-expanded','false');
      project.addEventListener('project-accordion-toggle', ()=>{
        project.classList.contains('is-open') ? closeAccordion(project) : openAccordion(project);
      });
    });
    document.querySelectorAll('.technical-details').forEach(details=>{
      if(innerWidth <= 760) details.removeAttribute('open');
      details.addEventListener('toggle',()=>{
        const project = details.closest('.project');
        if(project && project.classList.contains('is-open')){
          const body = project.querySelector('.project-accordion');
          body.style.height = 'auto';
        }
      });
    });
    addEventListener('resize', ()=>{
      const openProject = document.querySelector('.project.is-open');
      if(openProject) openProject.querySelector('.project-accordion').style.height = 'auto';
    });

    // Thermal residue study, inspired by Thermanator's post-contact heat traces.
    const touchSurface = document.getElementById('touchSurface');
    const touchCanvas = document.getElementById('touchCanvas');
    const touchContext = touchCanvas.getContext('2d');
    const touchMode = document.getElementById('touchMode');
    const touchValue = document.getElementById('touchValue');
    const touchMeterFill = document.getElementById('touchMeterFill');
    const touchReset = document.getElementById('touchReset');
    const thermalTouchTab = document.getElementById('thermalTouchTab');
    const thermalObserveTab = document.getElementById('thermalObserveTab');
    const thermalArchiveTab = document.getElementById('thermalArchiveTab');
    const thermalLiveView = document.getElementById('thermalLiveView');
    const thermalArchive = document.getElementById('thermalArchive');
    const thermalArchiveGrid = document.getElementById('thermalArchiveGrid');
    const thermalTimeline = document.getElementById('thermalTimeline');
    const thermalTime = document.getElementById('thermalTime');
    const thermalTimeLabel = document.getElementById('thermalTimeLabel');
    const thermalFinish = document.getElementById('thermalFinish');
    const thermalSave = document.getElementById('thermalSave');
    const thermalExport = document.getElementById('thermalExport');
    const thermalInstruction = document.getElementById('thermalInstruction');
    const thermalSessionLabel = document.getElementById('thermalSessionLabel');
    const thermalCols = 180;
    let thermalRows = 100;
    let thermalField = new Float32Array(thermalCols*thermalRows);
    let thermalImage = touchContext.createImageData(thermalCols,thermalRows);
    let touchLast = null;
    let touchPressed = false;
    let lastThermalFrame = performance.now();
    let lastContactAt = 0;
    let thermalView = 'touch';
    let thermalSnapshot = null;
    let thermalObservationSeconds = 0;
    let thermalEvents = [];
    let thermalSessionStarted = performance.now();
    const thermalStorageKey = 'ikodou-thermal-atlas-sessions-v1';

    function setTouchReadout(mode){
      touchMode.textContent = mode;
      let peak = 0;
      for(let i=0;i<thermalField.length;i++) peak = Math.max(peak,thermalField[i]);
      const rounded = Math.min(100,Math.round(peak*100));
      touchValue.textContent = String(rounded).padStart(2,'0');
      touchMeterFill.style.width = `${rounded}%`;
    }

    function resetTouchSurface(){
      thermalField.fill(0);
      touchLast = null;
      lastContactAt = 0;
      thermalSnapshot = null;
      thermalEvents = [];
      thermalSessionStarted = performance.now();
      thermalObservationSeconds = 0;
      thermalTime.value = '0';
      thermalTimeLabel.textContent = '00 s';
      setTouchReadout('sin contacto');
    }

    function resizeTouchSurface(){
      const rect = touchSurface.getBoundingClientRect();
      thermalRows = Math.max(72,Math.round(thermalCols*(rect.height/rect.width)));
      thermalField = new Float32Array(thermalCols*thermalRows);
      thermalImage = touchContext.createImageData(thermalCols,thermalRows);
      touchCanvas.width = thermalCols;
      touchCanvas.height = thermalRows;
      resetTouchSurface();
    }

    function depositHeat(nx,ny,radius,intensity){
      const cx = nx*thermalCols;
      const cy = ny*thermalRows;
      const radiusX = radius*thermalCols;
      const radiusY = radius*thermalCols;
      const minX = Math.max(0,Math.floor(cx-radiusX));
      const maxX = Math.min(thermalCols-1,Math.ceil(cx+radiusX));
      const minY = Math.max(0,Math.floor(cy-radiusY));
      const maxY = Math.min(thermalRows-1,Math.ceil(cy+radiusY));
      for(let y=minY;y<=maxY;y++){
        for(let x=minX;x<=maxX;x++){
          const dx = (x-cx)/radiusX;
          const dy = (y-cy)/radiusY;
          const distance = Math.sqrt(dx*dx+dy*dy);
          if(distance>=1) continue;
          const heat = Math.pow(1-distance,2)*intensity;
          const index = y*thermalCols+x;
          thermalField[index] = Math.min(1,thermalField[index]+heat);
        }
      }
    }

    function interactWithTouch(event){
      if(thermalView!=='touch') return;
      if(event.pointerType !== 'mouse' && !touchPressed) return;
      const rect = touchSurface.getBoundingClientRect();
      const x = (event.clientX-rect.left)/rect.width;
      const y = (event.clientY-rect.top)/rect.height;
      const now = performance.now();
      if(touchLast === null){
        touchLast = {x,y,time:now};
        depositHeat(x,y,.035,.34);
        thermalEvents.push({x,y,time:Math.round(now-thermalSessionStarted),speed:0,gesture:'contacto'});
        lastContactAt = now;
        return;
      }
      const elapsed = Math.max(8,now-touchLast.time);
      const distance = Math.hypot((x-touchLast.x)*rect.width,(y-touchLast.y)*rect.height);
      const speed = distance/elapsed;

      if(speed < .55){
        depositHeat(x,y,.055,.12);
        setTouchReadout('caricia');
        thermalEvents.push({x,y,time:Math.round(now-thermalSessionStarted),speed,gesture:'caricia'});
      }else if(speed > 1.18){
        depositHeat(x,y,.024,Math.min(.8,.28+speed*.12));
        setTouchReadout('agresión');
        thermalEvents.push({x,y,time:Math.round(now-thermalSessionStarted),speed,gesture:'agresión'});
      }else{
        depositHeat(x,y,.04,.2);
        setTouchReadout('contacto');
        thermalEvents.push({x,y,time:Math.round(now-thermalSessionStarted),speed,gesture:'contacto'});
      }
      lastContactAt = now;
      touchLast = {x,y,time:now};
    }

    function thermalColor(value){
      const stops = [
        [7,2,18],[43,8,70],[126,20,102],[221,52,75],[255,126,37],[255,232,132],[255,255,235]
      ];
      const scaled = Math.max(0,Math.min(.999,value))* (stops.length-1);
      const index = Math.floor(scaled);
      const mix = scaled-index;
      const a = stops[index];
      const b = stops[Math.min(stops.length-1,index+1)];
      return [
        Math.round(a[0]+(b[0]-a[0])*mix),
        Math.round(a[1]+(b[1]-a[1])*mix),
        Math.round(a[2]+(b[2]-a[2])*mix)
      ];
    }

    function renderThermal(now){
      if(document.hidden || !document.getElementById('project-tacto').classList.contains('is-open')){lastThermalFrame=now;requestAnimationFrame(renderThermal);return}
      const elapsed = Math.min(100,now-lastThermalFrame);
      lastThermalFrame = now;
      const cooling = Math.exp(-elapsed/18000);
      let peak = 0;
      for(let i=0;i<thermalField.length;i++){
        let value;
        if(thermalView==='observe' && thermalSnapshot!==null){
          value = thermalSnapshot[i]*Math.exp(-(thermalObservationSeconds*1000)/18000);
        }else{
          const cooled = thermalField[i]*cooling;
          thermalField[i] = cooled<.002 ? 0 : cooled;
          value = thermalField[i];
        }
        peak = Math.max(peak,value);
        const color = thermalColor(Math.pow(value,.68));
        const offset = i*4;
        thermalImage.data[offset] = color[0];
        thermalImage.data[offset+1] = color[1];
        thermalImage.data[offset+2] = color[2];
        thermalImage.data[offset+3] = 255;
      }
      touchContext.putImageData(thermalImage,0,0);
      if(!touchPressed && now-lastContactAt>800 && lastContactAt>0){
        touchMode.textContent = peak>.42 ? 'residuo reciente' : peak>.12 ? 'enfriamiento' : 'rastro débil';
      }
      const rounded = Math.min(100,Math.round(peak*100));
      touchValue.textContent = String(rounded).padStart(2,'0');
      touchMeterFill.style.width = `${rounded}%`;
      requestAnimationFrame(renderThermal);
    }

    function readThermalSessions(){
      try{return JSON.parse(localStorage.getItem(thermalStorageKey)||'[]')}catch(_){return []}
    }

    function updateThermalSessionLabel(){
      const number = readThermalSessions().length+1;
      thermalSessionLabel.textContent = `session ${String(number).padStart(3,'0')}`;
    }

    function renderThermalArchive(){
      const sessions = readThermalSessions();
      thermalArchiveGrid.innerHTML = '';
      if(!sessions.length){
        thermalArchiveGrid.innerHTML = '<p class="thermal-empty">no residuos guardados yet</p>';
        return;
      }
      sessions.slice().reverse().forEach((session,index)=>{
        const article = document.createElement('article');
        article.className = 'thermal-record';
        const img = document.createElement('img');
        img.src = session.image;
        img.alt = `Residuo térmico de la sesión ${session.id}`;
        const meta = document.createElement('div');
        meta.className = 'thermal-record-meta';
        meta.innerHTML = `<span>${session.id}</span><span>${session.contacts} contacts / ${(session.duration/1000).toFixed(1)} s</span>`;
        article.append(img,meta);
        thermalArchiveGrid.appendChild(article);
      });
    }

    function setThermalView(view){
      thermalView = view;
      [thermalTouchTab,thermalObserveTab,thermalArchiveTab].forEach(tab=>tab.classList.remove('active'));
      thermalTouchTab.classList.toggle('active',view==='touch');
      thermalObserveTab.classList.toggle('active',view==='observe');
      thermalArchiveTab.classList.toggle('active',view==='archive');
      thermalLiveView.hidden = view==='archive';
      thermalArchive.hidden = view!=='archive';
      thermalTimeline.hidden = view!=='observe';
      touchCanvas.style.pointerEvents = view==='touch' ? 'auto' : 'none';
      thermalFinish.disabled = view!=='touch';
      thermalSave.disabled = view==='archive';
      thermalExport.disabled = view==='archive';
      thermalInstruction.textContent = view==='touch'
        ? 'toca / observa / retira la mano / espera'
        : 'desplaza la línea temporal para observar cómo desaparece el residuo';
      if(view==='observe' && thermalSnapshot===null) thermalSnapshot = new Float32Array(thermalField);
      if(view==='archive') renderThermalArchive();
      if(view==='touch' && thermalSnapshot!==null) thermalField.set(thermalSnapshot);
    }

    function finishThermalSession(){
      thermalSnapshot = new Float32Array(thermalField);
      thermalObservationSeconds = 0;
      thermalTime.value = '0';
      thermalTimeLabel.textContent = '00 s';
      setThermalView('observe');
    }

    function saveThermalSession(){
      if(thermalEvents.length===0) return;
      const sessions = readThermalSessions();
      const session = {
        id:`session-${String(sessions.length+1).padStart(3,'0')}`,
        createdAt:new Date().toISOString(),
        duration:thermalEvents.length ? thermalEvents[thermalEvents.length-1].time : 0,
        contacts:thermalEvents.length,
        image:touchCanvas.toDataURL('image/jpeg',.78)
      };
      sessions.push(session);
      try{localStorage.setItem(thermalStorageKey,JSON.stringify(sessions.slice(-12)))}catch(_){ }
      updateThermalSessionLabel();
      setThermalView('archive');
    }

    function exportThermalImage(){
      const link = document.createElement('a');
      link.download = `thermal-residue-${Date.now()}.png`;
      link.href = touchCanvas.toDataURL('image/png');
      link.click();
    }

    touchCanvas.addEventListener('pointerdown',event=>{
      touchPressed = true;
      touchLast = null;
      touchCanvas.setPointerCapture(event.pointerId);
      interactWithTouch(event);
    });
    touchCanvas.addEventListener('pointermove',interactWithTouch);
    touchCanvas.addEventListener('pointerup',event=>{
      touchPressed = false;
      touchLast = null;
      try{touchCanvas.releasePointerCapture(event.pointerId)}catch(_){ }
    });
    touchCanvas.addEventListener('pointercancel',()=>{touchPressed=false;touchLast=null});
    touchCanvas.addEventListener('pointerleave',()=>{
      if(!touchPressed){touchLast=null;touchMode.textContent='observación post factum'}
    });
    touchReset.addEventListener('click',()=>{setThermalView('touch');resetTouchSurface()});
    thermalTouchTab.addEventListener('click',()=>setThermalView('touch'));
    thermalObserveTab.addEventListener('click',()=>setThermalView('observe'));
    thermalArchiveTab.addEventListener('click',()=>setThermalView('archive'));
    thermalFinish.addEventListener('click',finishThermalSession);
    thermalSave.addEventListener('click',saveThermalSession);
    thermalExport.addEventListener('click',exportThermalImage);
    thermalTime.addEventListener('input',()=>{
      thermalObservationSeconds = Number(thermalTime.value);
      thermalTimeLabel.textContent = `${String(thermalObservationSeconds).padStart(2,'0')} s`;
    });
    addEventListener('resize',resizeTouchSurface);
    resizeTouchSurface();
    updateThermalSessionLabel();
    renderThermalArchive();
    requestAnimationFrame(renderThermal);

    const editorialStage = document.getElementById('editorialStage');
    const editorialOrb = document.getElementById('editorialOrb');
    const editorialText = `diseñadora
background en programación e ingeniería

áreas
graphic design / art direction / editorial design
creative coding / digital experiences

herramientas
figma / illustrator / indesign / photoshop / after effects

código
html / css / javascript / python / p5.js / three.js

intereses
typography / interaction / archives / materiality / generative systems

ubicación
lanzarote / madrid / remote

disponible para
freelance / collaborations / experimental projects`;
    let editorialFont = `${innerWidth < 760 ? 18 : Math.min(34, innerWidth * .022)}px Helvetica`;
    let preparedEditorial = prepareWithSegments(editorialText, editorialFont, { whiteSpace:'pre-wrap' });
    let orbX = .58;
    let orbY = .42;
    let draggingOrb = false;

    function circleBlock(cx, cy, radius, bandTop, bandBottom){
      if(bandBottom <= cy-radius || bandTop >= cy+radius) return null;
      const nearestY = cy < bandTop ? bandTop-cy : cy > bandBottom ? cy-bandBottom : 0;
      const half = Math.sqrt(Math.max(0, radius*radius-nearestY*nearestY));
      return [cx-half-14, cx+half+14];
    }

    function renderEditorial(){
      editorialStage.querySelectorAll('.editorial-line').forEach(node => node.remove());
      const width = editorialStage.clientWidth;
      const height = editorialStage.clientHeight;
      const orbSize = editorialOrb.offsetWidth;
      const cx = orbX * width;
      const cy = orbY * height;
      editorialOrb.style.left = `${cx-orbSize/2}px`;
      editorialOrb.style.top = `${cy-orbSize/2}px`;
      const lineHeight = innerWidth < 760 ? 21 : Math.min(39, innerWidth * .025);
      let cursor = { segmentIndex:0, graphemeIndex:0 };
      let y = 24;

      while(y + lineHeight < height - 30){
        const blocked = circleBlock(cx, cy, orbSize/2, y, y+lineHeight);
        const slots = blocked ? [[0, Math.max(0, blocked[0])], [Math.min(width, blocked[1]), width]] : [[0,width]];
        for(const [left,right] of slots){
          if(right-left < 70) continue;
          const line = layoutNextLine(preparedEditorial, cursor, right-left);
          if(!line) return;
          const span = document.createElement('span');
          span.className = 'editorial-line';
          span.textContent = line.text;
          span.style.left = `${left}px`;
          span.style.top = `${y}px`;
          span.style.font = editorialFont;
          span.style.lineHeight = `${lineHeight}px`;
          editorialStage.appendChild(span);
          cursor = line.end;
        }
        y += lineHeight;
      }
    }

    editorialOrb.tabIndex=0;editorialOrb.setAttribute('role','button');editorialOrb.setAttribute('aria-label','Mover esfera. Usa las flechas para redistribuir el texto.');
    editorialOrb.addEventListener('keydown',event=>{const delta={ArrowLeft:[-.04,0],ArrowRight:[.04,0],ArrowUp:[0,-.04],ArrowDown:[0,.04]}[event.key];if(!delta)return;event.preventDefault();orbX=Math.max(.12,Math.min(.88,orbX+delta[0]));orbY=Math.max(.16,Math.min(.84,orbY+delta[1]));renderEditorial()});
    editorialOrb.addEventListener('pointerdown', event => {
      draggingOrb = true;
      editorialOrb.setPointerCapture(event.pointerId);
    });
    editorialOrb.addEventListener('pointermove', event => {
      if(!draggingOrb) return;
      const rect = editorialStage.getBoundingClientRect();
      orbX = Math.max(.12, Math.min(.88, (event.clientX-rect.left)/rect.width));
      orbY = Math.max(.16, Math.min(.84, (event.clientY-rect.top)/rect.height));
      renderEditorial();
    });
    editorialOrb.addEventListener('pointerup', () => draggingOrb = false);
    editorialOrb.addEventListener('pointercancel', () => draggingOrb = false);

    addEventListener('resize', () => {
      const size = innerWidth < 760 ? 18 : Math.min(34, innerWidth * .022);
      editorialFont = `${size}px Helvetica`;
      preparedEditorial = prepareWithSegments(editorialText, editorialFont, { whiteSpace:'pre-wrap' });
      renderEditorial();
    });
    if(document.fonts && document.fonts.ready){
      document.fonts.ready.then(renderEditorial,renderEditorial);
    }else{
      renderEditorial();
    }
  })();
  