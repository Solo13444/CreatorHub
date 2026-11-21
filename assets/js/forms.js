(function(){
  const form=document.getElementById('contactForm');if(!form)return;
  const status=document.getElementById('contactStatus');
  form.addEventListener('submit',e=>{e.preventDefault();e.stopPropagation();form.classList.add('was-validated');if(!form.checkValidity()){status.textContent='Проверьте заполнение обязательных полей.';status.className='form-status error';form.querySelector(':invalid')?.focus();return;}
    status.textContent='Спасибо! Сообщение подготовлено. В демонстрационной версии оно не отправляется на сервер.';status.className='form-status success';window.showToast?.('Форма заполнена корректно. Спасибо за обращение!');form.reset();form.classList.remove('was-validated');
  });
  document.querySelectorAll('.faq-question').forEach(button=>button.addEventListener('click',()=>{const item=button.closest('.faq-item');const open=item.classList.toggle('open');button.setAttribute('aria-expanded',String(open));}));
})();
