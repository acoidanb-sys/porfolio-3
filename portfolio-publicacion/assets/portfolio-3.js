
(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const topLink=document.getElementById('backToTop');
  const updateTop=()=>{topLink.hidden=scrollY<innerHeight*.7};
  addEventListener('scroll',updateTop,{passive:true});updateTop();
  if('IntersectionObserver' in window&&!reduce.matches){
    const reveal=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('scroll-visible');reveal.unobserve(entry.target)}},{threshold:.06});
    document.querySelectorAll('.project,.section-head,.intro-statement').forEach(node=>{
      if(node.getBoundingClientRect().top>innerHeight){node.classList.add('scroll-ready');reveal.observe(node)}
    });
  }
  document.querySelectorAll('iframe').forEach(frame=>{
    const status=document.createElement('p');status.className='media-status';status.hidden=true;status.setAttribute('role','status');
    frame.parentElement.insertAdjacentElement('afterend',status);
    const reset=()=>{status.hidden=true;frame.classList.remove('frame-loading')};
    frame.addEventListener('load',reset);
    frame.addEventListener('error',()=>{frame.classList.remove('frame-loading');status.textContent='No se ha podido cargar el contenido. Puedes abrirlo con el botón situado debajo.';status.hidden=false});
    new MutationObserver(()=>{if(frame.getAttribute('src')&&frame.getAttribute('src')!=='about:blank'){status.textContent='Cargando contenido…';status.hidden=false;frame.classList.add('frame-loading')}else reset()}).observe(frame,{attributes:true,attributeFilter:['src']});
  });
  const video=document.getElementById('refractionVideo');
  const status=document.createElement('p');status.className='media-status';status.hidden=true;status.setAttribute('role','status');video.parentElement.insertAdjacentElement('afterend',status);
  video.addEventListener('loadstart',()=>{status.hidden=false;status.textContent='Cargando vídeo…'});
  video.addEventListener('loadeddata',()=>status.hidden=true);
  video.addEventListener('loadedmetadata',()=>status.hidden=true);
  video.addEventListener('error',()=>{status.hidden=false;status.textContent='No se ha podido reproducir el vídeo. Prueba «abrir vídeo» o vuelve a cargar la página.'});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause()});
})();

