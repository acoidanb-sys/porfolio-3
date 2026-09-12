
(()=>{
 const button=document.getElementById('themeToggle');
 const apply=value=>{document.documentElement.dataset.theme=value;button.setAttribute('aria-pressed',String(value==='dark'));button.textContent=value==='dark'?'modo claro':'modo oscuro';document.querySelector('meta[name="theme-color"]').content=value==='dark'?'#111111':'#f3f3ef'};
 try{apply(localStorage.getItem('ico-theme')==='dark'?'dark':'light')}catch{apply('light')}
 button.addEventListener('click',()=>{const value=document.documentElement.dataset.theme==='dark'?'light':'dark';apply(value);try{localStorage.setItem('ico-theme',value)}catch{}});
})();
