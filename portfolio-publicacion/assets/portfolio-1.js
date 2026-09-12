
    const cursor = document.getElementById('cursor');
    const cursorLabel = document.getElementById('cursorLabel');
    const projects = document.querySelectorAll('.project');
    const followPreview = document.getElementById('followPreview');
    const followPreviewInner = document.getElementById('followPreviewInner');
    const counter = document.getElementById('counter');

    const touchPreviewMode = matchMedia('(hover: none), (pointer: coarse)').matches;
    let touchPreviewTimer = 0;
    let mouseX = innerWidth/2, mouseY = innerHeight/2;
    let previewX = mouseX, previewY = mouseY;

    window.addEventListener('mousemove', e=>{
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
      cursorLabel.style.left = mouseX + 'px';
      cursorLabel.style.top = mouseY + 'px';
    });

    window.addEventListener('mousedown', ()=>cursor.classList.add('is-down'));
    window.addEventListener('mouseup', ()=>cursor.classList.remove('is-down'));

    function animatePreview(){
      if(!touchPreviewMode){
        const previewDistance = followPreview.clientWidth / 2 + 24;
        const previewOffset = mouseX > innerWidth * .68 ? -previewDistance : previewDistance;
        const targetX = mouseX + previewOffset;
        const targetY = mouseY + (mouseY > innerHeight * .72 ? -70 : 30);
        previewX += (targetX - previewX) * 0.12;
        previewY += (targetY - previewY) * 0.12;
        followPreview.style.left = previewX + 'px';
        followPreview.style.top = previewY + 'px';
      }
      requestAnimationFrame(animatePreview);
    }
    animatePreview();

    document.querySelectorAll('.interactive').forEach(el=>{
      el.addEventListener('mouseenter', ()=>{
        cursor.classList.add('is-link');
        const visibleText = el.textContent.trim().replace(/\s+/g,' ');
        cursorLabel.textContent = el.dataset.label || visibleText || 'view';
        cursorLabel.classList.add('show');
      });
      el.addEventListener('mouseleave', ()=>{
        cursor.classList.remove('is-link');
        cursorLabel.classList.remove('show');
      });
    });

    projects.forEach((project,index)=>{
      const button = project.querySelector('.project-button');

      button.addEventListener('mouseenter', ()=>{
        followPreview.classList.add('show');
        followPreviewInner.dataset.mode = project.dataset.preview;
        counter.textContent = String(index+1).padStart(2,'0') + ' / ' + String(projects.length).padStart(2,'0');
      });

      button.addEventListener('mouseleave', ()=>{
        if(!touchPreviewMode) followPreview.classList.remove('show');
      });

      button.addEventListener('pointerdown', event=>{
        if(!touchPreviewMode || event.pointerType === 'mouse') return;
        clearTimeout(touchPreviewTimer);
        followPreviewInner.dataset.mode = project.dataset.preview;
        followPreview.classList.add('show');
        counter.textContent = String(index+1).padStart(2,'0') + ' / ' + String(projects.length).padStart(2,'0');
      },{passive:true});

      button.addEventListener('click', ()=>{
        const willOpen = !project.classList.contains('is-open');
        project.dispatchEvent(new CustomEvent('project-accordion-toggle'));
        if(willOpen && project.id === 'project-tacto'){
          setTimeout(()=>window.dispatchEvent(new Event('resize')),460);
        }
        if(touchPreviewMode){
          clearTimeout(touchPreviewTimer);
          touchPreviewTimer = setTimeout(()=>followPreview.classList.remove('show'),900);
        }else{
          followPreview.classList.remove('show');
        }
        if(willOpen && project.id === 'project-brockmann') initBrockmannWeb();
        if(willOpen && project.id === 'project-post-relics') initPostRelicsInline();
        if(willOpen && project.id === 'project-refraction') initRefractionVideo();
        if(willOpen && project.id === 'project-gaussian') initGaussianField();
        if(!willOpen && project.id === 'project-gaussian') destroyGaussianField();
      });
    });

    if(touchPreviewMode){
      addEventListener('scroll',()=>followPreview.classList.remove('show'),{passive:true});
      document.addEventListener('pointerdown',event=>{
        if(!event.target.closest('.project-button')) followPreview.classList.remove('show');
      },true);
    }

    const overlayTriggers = new WeakMap();
    const backgroundRegions = [...document.querySelectorAll('body > header,body > main,body > footer,#backToTop')];
    function openPortfolioOverlay(overlay,trigger){
      overlayTriggers.set(overlay,trigger);overlay.inert=false;overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');
      backgroundRegions.forEach(node=>node.inert=true);document.body.style.overflow='hidden';overlay.querySelector('.overlay-close').focus();
    }
    function closePortfolioOverlay(overlay){
      overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');overlay.inert=true;
      backgroundRegions.forEach(node=>node.inert=false);document.body.style.overflow='';overlayTriggers.get(overlay)?.focus();
    }
    document.querySelectorAll('.overlay').forEach(overlay=>{
      overlay.inert=true;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
      const heading=overlay.querySelector('h2');heading.id=overlay.id+'-title';overlay.setAttribute('aria-labelledby',heading.id);
      overlay.addEventListener('keydown',event=>{
        if(event.key!=='Tab')return;
        const focusable=[...overlay.querySelectorAll('button,a[href],input,iframe,[tabindex="0"]')].filter(node=>!node.hidden&&!node.disabled);
        const first=focusable[0],last=focusable[focusable.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
      });
    });

    document.querySelectorAll('.project-open, .overlay-trigger').forEach(button=>{
      button.addEventListener('click', event=>{
        if(!button.dataset.overlay) return;
        event.preventDefault();
        event.stopPropagation();
        const overlay = document.getElementById(button.dataset.overlay);
        if(overlay.id === 'overlay-5') initPostRelicsPdf();
        openPortfolioOverlay(overlay,button);
      });
    });

    document.querySelectorAll('.overlay').forEach(overlay=>{
      overlay.querySelector('.overlay-close').addEventListener('click', ()=>{
        closePortfolioOverlay(overlay);
      });
    });

    const ownedAssetUrls = new Map();
    function resolveAsset(sourceId,mime){
      const source=document.getElementById(sourceId);
      if(source.dataset.src)return new URL(source.dataset.src,document.baseURI).href;
      if(ownedAssetUrls.has(sourceId))return ownedAssetUrls.get(sourceId);
      const binary=atob(source.textContent.trim()),bytes=new Uint8Array(binary.length);
      for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
      const url=URL.createObjectURL(new Blob([bytes],{type:mime}));ownedAssetUrls.set(sourceId,url);return url;
    }
    window.addEventListener('beforeunload',()=>{for(const url of ownedAssetUrls.values())URL.revokeObjectURL(url)});

    let brockmannWebUrl = '';
    function initBrockmannWeb(){
      const frame = document.getElementById('brockmannWebFrame');
      if(frame.src && frame.src !== 'about:blank') return brockmannWebUrl;
      brockmannWebUrl = resolveAsset('brockmannWebSource','text/html;charset=utf-8');
      frame.src = brockmannWebUrl;
      return brockmannWebUrl;
    }
    document.getElementById('brockmannWebOpen').addEventListener('click',()=>{
      window.open(initBrockmannWeb(),'_blank','noopener');
    });
    window.addEventListener('beforeunload',()=>{
      if(brockmannWebUrl) URL.revokeObjectURL(brockmannWebUrl);
    });

    let refractionVideoUrl = '';
    function initRefractionVideo(){
      if(refractionVideoUrl) return refractionVideoUrl;
      refractionVideoUrl = resolveAsset('refractionVideoSource','video/mp4');
      const video = document.getElementById('refractionVideo');
      video.src = refractionVideoUrl;
      video.preload = 'metadata';
      video.load();
      return refractionVideoUrl;
    }
    document.getElementById('refractionVideoOpen').addEventListener('click',()=>{
      document.getElementById('refractionVideo').pause();
      window.open(initRefractionVideo(),'_blank','noopener');
    });
    const refractionProject = document.getElementById('project-refraction');
    const refractionObserver = new MutationObserver(()=>{
      if(!refractionProject.classList.contains('is-open')) document.getElementById('refractionVideo').pause();
    });
    refractionObserver.observe(refractionProject,{attributes:true,attributeFilter:['class']});
    window.addEventListener('beforeunload',()=>{
      refractionObserver.disconnect();
      if(refractionVideoUrl) URL.revokeObjectURL(refractionVideoUrl);
    });

    let gaussianFieldUrl = '';
    function initGaussianField(){
      const frame = document.getElementById('gaussianFieldFrame');
      if(frame.src && frame.src !== 'about:blank') return gaussianFieldUrl;
      gaussianFieldUrl = resolveAsset('gaussianFieldSource','text/html;charset=utf-8');
      frame.src = gaussianFieldUrl;
      return gaussianFieldUrl;
    }
    function destroyGaussianField(){
      const frame = document.getElementById('gaussianFieldFrame');
      frame.src = 'about:blank';
      if(gaussianFieldUrl && gaussianFieldUrl.startsWith('blob:')) URL.revokeObjectURL(gaussianFieldUrl);
      ownedAssetUrls.delete('gaussianFieldSource');
      gaussianFieldUrl = '';
    }
    document.getElementById('gaussianFieldOpen').addEventListener('click',()=>{
      window.open(initGaussianField(),'_blank','noopener');
    });
    window.addEventListener('beforeunload',()=>{
      if(gaussianFieldUrl) URL.revokeObjectURL(gaussianFieldUrl);
    });

    let postRelicsPdfUrl = '';
    function initPostRelicsPdf(){
      if(postRelicsPdfUrl) return postRelicsPdfUrl;
      postRelicsPdfUrl = resolveAsset('postRelicsPdfSource','application/pdf');
      document.getElementById('postRelicsPdf').src = postRelicsPdfUrl;
      return postRelicsPdfUrl;
    }
    const postRelicsPdfOpen = document.getElementById('postRelicsPdfOpen');
    postRelicsPdfOpen.addEventListener('click',()=>{
      window.open(initPostRelicsPdf(),'_blank','noopener');
    });

    function initPostRelicsInline(){
      const inlineFrame = document.getElementById('postRelicsInlinePdf');
      if(inlineFrame.getAttribute('src')) return;
      inlineFrame.src = initPostRelicsPdf();
    }
    document.getElementById('postRelicsInlineOpen').addEventListener('click',()=>{
      window.open(initPostRelicsPdf(),'_blank','noopener');
    });
    window.addEventListener('beforeunload',()=>{
      if(postRelicsPdfUrl) URL.revokeObjectURL(postRelicsPdfUrl);
    });

    window.addEventListener('keydown', e=>{
      if(e.key === 'Escape'){
        document.querySelectorAll('.overlay.open').forEach(overlay=>{
          closePortfolioOverlay(overlay);
        });
        document.body.style.overflow = '';
      }
    });

    document.querySelectorAll('.drag-track').forEach(track=>{
      track.tabIndex=0;track.setAttribute('role','group');track.setAttribute('aria-label','Galería del proyecto. Usa las flechas izquierda y derecha para recorrerla.');
      let isDown = false;
      let startX = 0;
      let current = 0;
      let startCurrent = 0;

      const clamp = value=>{
        const shell = track.parentElement;
        const min = Math.min(0, shell.clientWidth - track.scrollWidth);
        return Math.max(min, Math.min(0, value));
      };

      const setX = value=>{
        current = clamp(value);
        track.style.transform = `translate3d(${current}px,0,0)`;
      };

      track.addEventListener('keydown', e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();setX(current+(e.key==='ArrowRight'?-1:1)*track.parentElement.clientWidth*.6)}});
      track.addEventListener('pointerdown', e=>{
        isDown = true;
        startX = e.clientX;
        startCurrent = current;
        track.setPointerCapture(e.pointerId);
      });

      track.addEventListener('pointermove', e=>{
        if(!isDown) return;
        setX(startCurrent + (e.clientX - startX));
      });

      track.addEventListener('pointerup', e=>{
        isDown = false;
        try{track.releasePointerCapture(e.pointerId)}catch(_){}
      });

      track.addEventListener('pointercancel', ()=>isDown=false);
      window.addEventListener('resize', ()=>setX(current));
    });
  