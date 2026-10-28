// Configure with the verified unit number, including country and area code.
const UNIT_WHATSAPP = '5531989349352';
document.getElementById('year').textContent = new Date().getFullYear();
document.querySelectorAll('[data-course]').forEach(link => link.addEventListener('click', () => { document.getElementById('course').value = link.dataset.course; }));
document.getElementById('lead-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const phone = form.elements.phone.value.replace(/\D/g, '');
  const status = document.getElementById('form-status');
  status.hidden = false;
  if (phone.length < 10 || phone.length > 13) { status.textContent = 'Confira o WhatsApp e inclua o DDD.'; status.focus(); return; }
  const message = `Olá, Code 8734 Lafaiete! Gostaria de consultar uma aula experimental.\nResponsável: ${form.elements.name.value.trim()}\nWhatsApp: ${phone}\nIdade do aluno: ${form.elements.age.value}\nCurso de interesse: ${form.elements.course.value}`;
  if (!UNIT_WHATSAPP) { status.textContent = 'Sua solicitação ainda não foi enviada. O contato da unidade está em configuração. Nenhum dado foi armazenado ou enviado.'; status.focus(); return; }
  window.location.assign(`https://wa.me/${UNIT_WHATSAPP}?text=${encodeURIComponent(message)}`);
});
