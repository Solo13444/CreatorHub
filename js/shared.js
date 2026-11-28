/* Общие компоненты и взаимодействия на четырёх страницах CreatorHub. */
(() => {
  'use strict';
  const authors = window.creators || [];
  const page = location.pathname.split('/').pop() || 'index.html';
  const logo = '<span class="wordmark"><i aria-hidden="true">✳</i>Creator<span>Hub</span></span>';
  const pages = [['index.html','Главная'], ['creators.html','Каталог'], ['contacts.html','Контакты']];
  const menu = pages.map(([url,name]) => `<a href="${url}" ${page === url ? 'aria-current="page"' : ''}>${name}</a>`).join('');
  const head = document.querySelector('.site-head');
  document.body.insertAdjacentHTML('afterbegin','<a class="skip" href="#main">К содержимому</a>');
  head.innerHTML = `<div class="shell head-row"><a class="brand" href="index.html" aria-label="CreatorHub, главная">${logo}</a>
    <button class="menu-switch" type="button" aria-expanded="false" aria-controls="site-nav">Меню</button>
    <nav class="head-nav" id="site-nav" aria-label="Основная навигация">${menu}</nav>
    <a href="creators.html" class="head-action">Подобрать автора</a></div>`;
  const toggle = head.querySelector('.menu-switch');
  function closeMenu() { toggle.setAttribute('aria-expanded','false'); head.classList.remove('opened'); }
  toggle.addEventListener('click', () => toggle.setAttribute('aria-expanded',String(head.classList.toggle('opened'))));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && head.classList.contains('opened')) { closeMenu(); toggle.focus(); } });
  document.querySelector('.site-foot').innerHTML = `<div class="shell"><div class="foot-row"><a class="brand" href="index.html">${logo}</a><nav aria-label="Навигация в подвале">${menu}</nav><a class="to-top" href="#main">Наверх ↑</a></div><div class="foot-base"><span>© 2026 CreatorHub. Все права защищены.</span><span>Учебная платформа · Демонстрационные профили</span></div></div>`;
  const count = new Intl.NumberFormat('ru-RU',{notation:'compact',maximumFractionDigits:1});
  function card(c) {
    return `<article class="talent"><div class="talent__visual"><a href="creator.html?id=${encodeURIComponent(c.id)}" aria-label="Профиль: ${c.name}"><img src="${c.image}" alt="" loading="lazy"></a>
      <span class="talent__badge">${c.badge}</span><button type="button" class="talent__preview" data-preview="${c.id}" aria-label="Быстрый просмотр: ${c.name}"><span aria-hidden="true">◉</span> Обзор</button></div>
      <div class="talent__body"><p class="talent__topic">${c.topic}</p><h3><a href="creator.html?id=${encodeURIComponent(c.id)}">${c.name}</a></h3><p class="talent__meta">${c.platforms.join(' · ')}</p><p class="talent__count"><strong>${count.format(c.followers)}</strong> подписчиков <span class="talent__status">${c.status}</span></p></div></article>`;
  }
  window.creatorCard = card;
  const featured = document.querySelector('#featured');
  if (featured) {
    const popular = authors.filter(c=> c.badge === 'Популярный');
    featured.innerHTML = [...new Set([...popular,...authors])].slice(0,3).map(card).join('');
    const stats = [[authors.length,'авторов'],[new Set(authors.flatMap(c=>c.platforms)).size,'соцсети'],[new Set(authors.map(c=>c.topic)).size,'тематик']];
    document.querySelector('#stats').innerHTML = stats.map(([n,label])=>`<p><strong>${n}</strong> ${label}</p>`).join('');
  }
  const modal = document.createElement('dialog');
  modal.className = 'quick-view';
  modal.setAttribute('aria-labelledby','preview-name');
  document.body.append(modal);
  document.addEventListener('click',event => {
    const button = event.target.closest('[data-preview]');
    if (!button) return;
    const c = authors.find(entry=>entry.id === button.dataset.preview);
    if (!c) return;
    modal.innerHTML = `<div class="quick-view__wrap"><img class="quick-view__image" src="${c.image}" alt=""><div class="quick-view__copy">
      <button class="quick-view__close" type="button" aria-label="Закрыть" autofocus>×</button>
      <p class="eyebrow">${c.topic}</p><h2 id="preview-name">${c.name}</h2><p>${c.bio}</p><p><strong>${count.format(c.followers)}</strong> подписчиков · ${c.platforms.join(' / ')}</p>
      <a class="action action--dark" href="creator.html?id=${encodeURIComponent(c.id)}">Открыть профиль</a></div></div>`;
    modal.querySelector('button').onclick = () => modal.close();
    modal.showModal();
    document.documentElement.classList.add('modal-opened');
  });
  modal.addEventListener('click',e => { if (e.target === modal) modal.close(); });
  modal.addEventListener('close',()=>document.documentElement.classList.remove('modal-opened'));

  function setStatus(form, text, error) {
    const box = form.querySelector('.form-status');
    if (!box) return;
    box.hidden = false;
    box.classList.toggle('is-error',error);
    box.textContent = text;
  }
  document.addEventListener('invalid', e => {
    if (e.target.form?.matches('[data-inquiry]')) setStatus(e.target.form,'Проверьте выделенное поле и заполните обязательные поля.',true);
  }, true);
  document.addEventListener('input',e => {
    if (e.target.form?.matches('[data-inquiry]') && e.target.setCustomValidity) e.target.setCustomValidity('');
  });
  document.addEventListener('submit',e => {
    const form = e.target;
    if (!form.matches('[data-inquiry]')) return;
    e.preventDefault();
    for (const field of form.querySelectorAll('input[required],textarea[required]')) {
      if (!field.value.trim()) { field.setCustomValidity('Введите значение.'); field.reportValidity(); return; }
    }
    if (!form.reportValidity()) return;
    try {
      const fields = Object.fromEntries(new FormData(form));
      const id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now()+'-'+Math.random();
      localStorage.setItem('creatorhub:inquiry:'+id, JSON.stringify({page,creator:new URLSearchParams(location.search).get('id') || (page === 'creator.html' ? authors[0]?.id : null),date:new Date().toISOString(),fields}));
      form.reset();
      setStatus(form,'Готово! Ваша учебная заявка сохранена в этом браузере.',false);
    } catch {
      setStatus(form,'Не удалось сохранить заявку. Проверьте разрешение браузера на локальное хранение данных.',true);
    }
  });
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('motion-enter');
        reveal.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    document.querySelectorAll('.workflow__grid article,.stats__grid p').forEach(item => reveal.observe(item));
  }
  const art = document.querySelector('.hero__art');
  if (art && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    art.addEventListener('pointermove',e=>{
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = art.getBoundingClientRect();
      art.style.setProperty('--dx', ((e.clientX-rect.left)/rect.width*2-1)*7+'px');
      art.style.setProperty('--dy', ((e.clientY-rect.top)/rect.height*2-1)*5+'px');
    });
    art.addEventListener('pointerleave',()=>{ art.style.setProperty('--dx','0px'); art.style.setProperty('--dy','0px'); });
  }
})();
