(function(){
  const page = document.body.dataset.page || '';
  const navItems = [
    {key:'home',label:'Главная',href:'index.html'},
    {key:'creators',label:'Каталог креаторов',href:'creators.html'},
    {key:'contacts',label:'Контакты',href:'contacts.html'}
  ];
  const activeKey = page === 'creator' ? 'creators' : page;
  const header = document.getElementById('site-header');
  if(header){
    header.innerHTML = `<header class="site-header" id="siteHeader"><div class="container nav-inner">
      <a href="index.html" class="brand" aria-label="CreatorHub — главная"><span class="brand-mark">c</span><span>Creator<em>Hub</em></span></a>
      <nav class="main-nav" id="mainNav" aria-label="Главная навигация">${navItems.map(item=>`<a href="${item.href}" class="${activeKey===item.key?'active':''}">${item.label}</a>`).join('')}</nav>
      <div class="nav-actions"><button class="theme-toggle" id="themeToggle" type="button" aria-label="Переключить тему" title="Переключить тему">☾</button><a class="btn btn-brand" href="creators.html">Найти креатора <span>↗</span></a><button class="mobile-toggle" id="mobileToggle" type="button" aria-label="Открыть меню" aria-expanded="false">☰</button></div>
    </div></header>`;
  }
  const footer = document.getElementById('site-footer');
  if(footer){footer.innerHTML = `<footer class="site-footer"><div class="container"><div class="footer-grid">
    <div class="footer-brand"><a href="index.html" class="brand"><span class="brand-mark">c</span><span>Creator<em>Hub</em></span></a><p>Платформа для поиска блогеров и контент-креаторов. Находите подходящих авторов и создавайте партнёрства, которые работают.</p></div>
    <div class="footer-column"><h3>Навигация</h3><a href="index.html">Главная</a><a href="creators.html">Каталог креаторов</a><a href="contacts.html">Контакты</a></div>
    <div class="footer-column"><h3>Платформа</h3><a href="index.html#how-it-works">Как это работает</a><a href="creators.html">Популярные авторы</a><a href="contacts.html#faqList">Частые вопросы</a></div>
    <div class="footer-column"><h3>Связаться</h3><a href="mailto:hello@creatorhub.ru">hello@creatorhub.ru</a><a href="https://t.me/" target="_blank" rel="noopener">Telegram</a><a href="https://vk.com/" target="_blank" rel="noopener">ВКонтакте</a></div>
    </div><div class="footer-bottom"><span>© 2026 CreatorHub. Все права защищены.</span><span>Учебный демонстрационный проект · <a href="contacts.html">Обратная связь</a></span><a class="footer-back-top" href="#top" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">Наверх ↑</a></div></div></footer>`;}

  // Тема оформления сохраняется между страницами.
  const savedTheme = localStorage.getItem('creatorhub-theme');
  if(savedTheme === 'dark') document.documentElement.setAttribute('data-theme','dark');
  const themeBtn = document.getElementById('themeToggle');
  const updateThemeButton = () => {if(themeBtn){const dark=document.documentElement.getAttribute('data-theme')==='dark';themeBtn.textContent=dark?'☀':'☾';themeBtn.setAttribute('aria-label',dark?'Включить светлую тему':'Включить тёмную тему');}};
  updateThemeButton();
  themeBtn?.addEventListener('click',()=>{const dark=document.documentElement.getAttribute('data-theme')!=='dark';document.documentElement.setAttribute('data-theme',dark?'dark':'light');if(!dark)document.documentElement.removeAttribute('data-theme');localStorage.setItem('creatorhub-theme',dark?'dark':'light');updateThemeButton();});

  const mobileToggle=document.getElementById('mobileToggle');const mainNav=document.getElementById('mainNav');
  mobileToggle?.addEventListener('click',()=>{const open=mainNav.classList.toggle('open');mobileToggle.setAttribute('aria-expanded',String(open));mobileToggle.textContent=open?'×':'☰';});
  mainNav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{mainNav.classList.remove('open');mobileToggle?.setAttribute('aria-expanded','false');if(mobileToggle)mobileToggle.textContent='☰';}));

  const progress=document.getElementById('scrollProgress'),topButton=document.getElementById('backToTop'),siteHeader=document.getElementById('siteHeader');
  const onScroll=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;const value=max>0?window.scrollY/max*100:0;if(progress)progress.style.width=value+'%';if(topButton)topButton.classList.toggle('visible',window.scrollY>450);if(siteHeader)siteHeader.classList.toggle('is-scrolled',window.scrollY>12);};
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  topButton?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

  const revealItems=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12});revealItems.forEach(el=>observer.observe(el));}else revealItems.forEach(el=>el.classList.add('is-visible'));

  const cursor=document.getElementById('customCursor');
  if(cursor && window.matchMedia('(pointer:fine)').matches){document.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.style.opacity='1';});document.addEventListener('mouseover',e=>{if(e.target.closest('a,button,.creator-card,select,input'))cursor.classList.add('cursor-active');else cursor.classList.remove('cursor-active');});document.addEventListener('mouseleave',()=>cursor.style.opacity='0');}

  // Горячая клавиша Ctrl/Cmd + K переводит фокус в поиск каталога.
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){const search=document.getElementById('creatorSearch');if(search){e.preventDefault();search.focus();}}if(e.key==='Escape'){document.querySelector('.modal-backdrop-custom')?.remove();}});

  window.showToast=function(message,type='success'){let area=document.querySelector('.toast-area');if(!area){area=document.createElement('div');area.className='toast-area';document.body.appendChild(area);}const toast=document.createElement('div');toast.className='site-toast'+(type==='error'?' error':'');toast.textContent=message;area.appendChild(toast);setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translateX(12px)';setTimeout(()=>toast.remove(),250);},3600);};
})();
