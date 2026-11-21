(function(){
  const creators=window.CREATORS||[];
  const formatCount=n=>n>=1000000?(n/1000000).toFixed(1).replace('.',',')+' млн':n>=1000?Math.round(n/1000).toLocaleString('ru-RU')+' тыс.':n.toLocaleString('ru-RU');
  const badgeClass=badge=>badge==='Популярный'?'':badge==='Новый автор'?'badge-blue':'badge-green';
  const cardHTML=c=>`<div class="col-sm-6 col-lg-4 col-xl-3"><article class="creator-card reveal is-visible">
    <div class="creator-card-image"><img src="${c.photo}" alt="Портрет: ${c.name}" loading="lazy"><div class="creator-badges"><span class="creator-badge ${badgeClass(c.badge)}">${c.badge}</span></div></div>
    <div class="creator-card-body"><div class="creator-name-line"><h3>${c.name}</h3>${c.verified?'<span class="verified-mark" title="Профиль отмечен">✓</span>':''}</div><div class="creator-handle">${c.handle} · ${c.platforms.join(' · ')}</div><span class="creator-category">${c.category}</span><div class="creator-meta"><div><small>Подписчики</small><strong>${formatCount(c.followers)}</strong></div><div><small>Вовлечённость</small><strong>${c.engagement}</strong></div></div>
    <div class="creator-card-actions"><button class="btn btn-soft" type="button" data-modal-creator="${c.id}">Подробнее</button><a class="btn btn-brand" href="creator.html?id=${c.id}">Профиль ↗</a></div></div></article></div>`;

  const featured=document.getElementById('featuredCreators');
  if(featured){featured.innerHTML=creators.filter(c=>['alina','max','dmitry','polina'].includes(c.id)).map(cardHTML).join('');}

  const grid=document.getElementById('creatorsGrid');
  if(!grid)return;
  const search=document.getElementById('creatorSearch'),platform=document.getElementById('platformFilter'),category=document.getElementById('categoryFilter'),followers=document.getElementById('followersFilter'),sort=document.getElementById('sortFilter');
  const resultsText=document.getElementById('resultsText'),total=document.getElementById('catalogTotal'),empty=document.getElementById('emptyState');
  const params=new URLSearchParams(location.search);const initialPlatform=params.get('platform');if(initialPlatform){const match=[...platform.options].find(o=>o.value.toLowerCase()===initialPlatform.toLowerCase());if(match)platform.value=match.value;}
  function matchesRange(c){const n=c.followers;switch(followers.value){case'micro':return n<10000;case'small':return n>=10000&&n<100000;case'medium':return n>=100000&&n<500000;case'large':return n>=500000;default:return true;}}
  function render(){let list=creators.filter(c=>{const q=search.value.trim().toLowerCase();const searchable=(c.name+' '+c.handle+' '+c.category+' '+c.platforms.join(' ')).toLowerCase();return(!q||searchable.includes(q))&&(platform.value==='all'||c.platforms.includes(platform.value))&&(category.value==='all'||c.category===category.value)&&matchesRange(c);});
    if(sort.value==='low')list.sort((a,b)=>a.followers-b.followers);else if(sort.value==='high')list.sort((a,b)=>b.followers-a.followers);else if(sort.value==='new')list.sort((a,b)=>(a.badge==='Новый автор'?0:1)-(b.badge==='Новый автор'?0:1));else list.sort((a,b)=>b.followers-a.followers);
    grid.innerHTML=list.map(cardHTML).join('');resultsText.textContent=`Найдено ${list.length} ${list.length===1?'креатор':list.length>=2&&list.length<=4?'креатора':'креаторов'}`;total.textContent=list.length;empty.classList.toggle('d-none',list.length!==0);grid.classList.toggle('d-none',list.length===0);
  }
  [search,platform,category,followers,sort].forEach(el=>el.addEventListener(el===search?'input':'change',render));
  function reset(){search.value='';platform.value='all';category.value='all';followers.value='all';sort.value='popular';render();}
  document.getElementById('resetFilters')?.addEventListener('click',reset);document.getElementById('emptyReset')?.addEventListener('click',reset);
  render();

  // Модальное окно с краткой информацией об авторе.
  document.addEventListener('click',e=>{const button=e.target.closest('[data-modal-creator]');if(!button)return;const c=creators.find(item=>item.id===button.dataset.modalCreator);if(!c)return;
    document.querySelector('.modal-backdrop-custom')?.remove();const modal=document.createElement('div');modal.className='modal-backdrop-custom';modal.innerHTML=`<div class="creator-modal" role="dialog" aria-modal="true" aria-labelledby="creatorModalTitle"><button class="modal-close" type="button" aria-label="Закрыть">×</button><div class="modal-cover"><img src="${c.photo}" alt="Портрет: ${c.name}"></div><div class="modal-content-custom"><span class="creator-category">${c.category}</span><h2 id="creatorModalTitle">${c.name} ${c.verified?'✓':''}</h2><p>${c.handle} · ${c.platforms.join(' · ')}</p><p>${c.bio}</p><div class="modal-stat-row"><div><strong>${formatCount(c.followers)}</strong><small>Подписчиков</small></div><div><strong>${c.engagement}</strong><small>Вовлечённость</small></div><div><strong>${c.location}</strong><small>Город</small></div></div><a href="creator.html?id=${c.id}" class="btn btn-brand w-100">Открыть профиль <span>↗</span></a></div></div>`;
    modal.addEventListener('click',ev=>{if(ev.target===modal||ev.target.closest('.modal-close'))modal.remove();});document.body.appendChild(modal);modal.querySelector('.modal-close').focus();
  });
})();
