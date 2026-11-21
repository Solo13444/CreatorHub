(function(){
  const root=document.getElementById('creatorProfile');if(!root)return;
  const list=window.CREATORS||[];const params=new URLSearchParams(location.search);const requested=params.get('id');const creator=list.find(c=>c.id===requested)||list[0];
  if(!creator){root.innerHTML='<div class="empty-state"><h2>Автор не найден</h2><a class="btn btn-brand" href="creators.html">Вернуться в каталог</a></div>';return;}
  const fmt=n=>n>=1000000?(n/1000000).toFixed(1).replace('.',',')+' млн':n>=1000?Math.round(n/1000).toLocaleString('ru-RU')+' тыс.':n.toLocaleString('ru-RU');
  const badgeClass=creator.badge==='Популярный'?'':creator.badge==='Новый автор'?'badge-blue':'badge-green';
  const socials=creator.platforms.map(p=>{const urls={Instagram:'https://instagram.com/',TikTok:'https://www.tiktok.com/',YouTube:'https://youtube.com/',Telegram:'https://t.me/'};return `<a class="social-chip" href="${urls[p]}" target="_blank" rel="noopener">${p} ↗</a>`;}).join('');
  root.innerHTML=`<section class="profile-main-card reveal is-visible">
    <div class="profile-cover"></div>
    <div class="profile-summary"><img class="profile-avatar" src="${creator.photo}" alt="Портрет: ${creator.name}"><div class="profile-title-wrap"><span class="creator-handle">${creator.handle} · ${creator.location}</span><h2>${creator.name} ${creator.verified?'<span class="verified-mark" title="Профиль отмечен">✓</span>':''}</h2><div class="profile-badge-row"><span class="creator-badge ${badgeClass}">${creator.badge}</span><span class="creator-badge badge-green">${creator.status}</span></div></div></div>
    <div class="profile-content"><span class="section-kicker">ОБ АВТОРЕ</span><p>${creator.bio}</p>
      <h3>Социальные сети</h3><div class="profile-platforms">${socials}</div>
      <h3>Аудитория и статистика</h3><div class="profile-stat-grid"><div class="profile-stat"><small>Подписчики</small><strong>${fmt(creator.followers)}</strong></div><div class="profile-stat"><small>Вовлечённость</small><strong>${creator.engagement}</strong></div><div class="profile-stat"><small>Основная аудитория</small><strong style="font-size:.78rem">${creator.audience}</strong></div></div>
      <h3>Тематика контента</h3><p>${creator.description}</p><h3>Форматы рекламы</h3><div class="format-list">${creator.formats.map(f=>`<span class="format-chip">${f}</span>`).join('')}</div>
    </div></section>
    <aside class="collab-card reveal is-visible"><span class="section-kicker">ОБСУДИМ ПРОЕКТ</span><h2>Заявка на <span class="gradient-text">сотрудничество</span></h2><p>Расскажите о вашей задаче. Все поля со звёздочкой обязательны.</p>
      <form id="collabForm" novalidate>
        <div class="mb-3"><label class="form-label" for="clientName">Ваше имя *</label><input class="form-control" id="clientName" name="clientName" type="text" placeholder="Как к вам обращаться?" required minlength="2"><div class="invalid-feedback">Введите имя (не менее 2 символов).</div></div>
        <div class="mb-3"><label class="form-label" for="clientEmail">Электронная почта *</label><input class="form-control" id="clientEmail" name="clientEmail" type="email" placeholder="name@example.com" required><div class="invalid-feedback">Введите корректный адрес почты.</div></div>
        <div class="mb-3"><label class="form-label" for="companyName">Название компании *</label><input class="form-control" id="companyName" name="companyName" type="text" placeholder="Название бренда или компании" required minlength="2"><div class="invalid-feedback">Укажите компанию или проект.</div></div>
        <div class="mb-3"><label class="form-label" for="adFormat">Формат рекламы *</label><select class="form-select" id="adFormat" name="adFormat" required><option value="">Выберите формат</option>${creator.formats.map(f=>`<option>${f}</option>`).join('')}<option>Обсудить индивидуальный формат</option></select><div class="invalid-feedback">Выберите формат рекламы.</div></div>
        <div class="mb-3"><label class="form-label" for="budget">Примерный бюджет *</label><select class="form-select" id="budget" name="budget" required><option value="">Выберите бюджет</option><option>До 10 000 ₽</option><option>10 000–30 000 ₽</option><option>30 000–100 000 ₽</option><option>100 000–300 000 ₽</option><option>Более 300 000 ₽</option><option>Обсуждается</option></select><div class="invalid-feedback">Укажите бюджет.</div></div>
        <div class="mb-3"><label class="form-label" for="clientComment">Комментарий</label><textarea class="form-control" id="clientComment" name="comment" rows="3" placeholder="Опишите задачу, сроки и пожелания..."></textarea></div>
        <div class="form-check mb-3"><input class="form-check-input" type="checkbox" id="collabAgree" required><label class="form-check-label" for="collabAgree">Согласен(на) на обработку данных для связи со мной</label><div class="invalid-feedback">Необходимо подтвердить согласие.</div></div>
        <button class="btn btn-brand btn-lg w-100" type="submit">Отправить заявку <span>↗</span></button><div class="form-status" id="collabStatus" aria-live="polite"></div>
      </form><p class="micro-note text-start mt-3">Демо-форма: заявка не отправляется на сервер.</p>
    </aside>`;
  document.title=`${creator.name} — CreatorHub`;
  const form=document.getElementById('collabForm');const status=document.getElementById('collabStatus');
  form.addEventListener('submit',e=>{e.preventDefault();e.stopPropagation();form.classList.add('was-validated');if(!form.checkValidity()){status.textContent='Проверьте обязательные поля формы.';status.className='form-status error';const invalid=form.querySelector(':invalid');invalid?.focus();return;}
    status.textContent=`Заявка для ${creator.name} подготовлена! В демонстрационной версии данные не отправляются на сервер.`;status.className='form-status success';window.showToast?.('Форма заполнена корректно. Это демонстрационная отправка.');form.reset();form.classList.remove('was-validated');
  });
})();
