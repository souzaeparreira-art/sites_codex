/* Site Cinematográfico · Labrego IA. No private credentials in this file. */
(() => {
  'use strict';
  const config = window.SITE || {};
  const attributionKeys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const currentParams = new URLSearchParams(location.search);
  // Keep attribution in same-origin links without storage, cookies or third-party requests.
  document.querySelectorAll('a[href]').forEach(link => {
    const target = new URL(link.getAttribute('href'), location.href);
    if (target.origin !== location.origin) return;
    attributionKeys.forEach(key => { if (currentParams.has(key)) target.searchParams.set(key, currentParams.get(key).slice(0, 250)); });
    link.href = target.pathname + target.search + target.hash;
  });
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#menu');
  function closeMenu() { menu.classList.remove('aberto'); menuButton.setAttribute('aria-expanded', 'false'); }
  menuButton?.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menu.classList.toggle('aberto', open); });
  menu?.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu?.classList.contains('aberto')) { closeMenu(); menuButton.focus(); } });
  const cine = document.querySelector('.cine');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (cine) {
    const moments = [...cine.querySelectorAll('.momento')];
    const progressBar = cine.querySelector('.scroll-track i');
    const graphic = cine.querySelector('.seta-grafica');
    let pending = false;
    const paint = () => {
      pending = false;
      const top = parseFloat(getComputedStyle(cine.querySelector('.cine-sticky')).top) || 0;
      const distance = cine.offsetHeight - (innerHeight - top);
      const progress = reducedMotion.matches ? 0 : Math.min(1, Math.max(0, (top - cine.getBoundingClientRect().top) / Math.max(1, distance)));
      const active = Math.min(2, Math.floor(progress * 3));
      moments.forEach((moment, i) => { moment.hidden = i !== active; });
      progressBar.style.width = `${progress * 100}%`;
      if (graphic && !reducedMotion.matches) graphic.style.transform = `translateY(${progress * 40}px) rotate(${-6 + progress * 12}deg)`;
    };
    const update = () => { if (!pending) { pending = true; requestAnimationFrame(paint); } };
    addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); reducedMotion.addEventListener('change', update); paint();
    // Optional real generated frame sequence, enabled only when valid assets are configured.
    if (config.frames?.total > 0 && !reducedMotion.matches) {
      const target = cine.querySelector('.foto-rede img');
      const source = matchMedia('(max-width:760px)').matches ? config.frames.mobile : config.frames.desktop;
      let lastFrame = -1;
      addEventListener('scroll', () => {
        const top = parseFloat(getComputedStyle(cine.querySelector('.cine-sticky')).top) || 0;
        const p = Math.min(1, Math.max(0, (top - cine.getBoundingClientRect().top) / Math.max(1, cine.offsetHeight - innerHeight + top)));
        const frame = Math.round(p * (config.frames.total - 1));
        if (frame !== lastFrame && target) { lastFrame = frame; const image = new Image(); image.onload = () => { if (lastFrame === frame) target.src = image.src; }; image.src = source.replace('{n}', String(frame + 1).padStart(4, '0')); }
      }, { passive: true });
    }
  }
  document.querySelector('#load-map')?.addEventListener('click', e => {
    const iframe = document.createElement('iframe');
    iframe.title = 'Mapa da Park Piracicaba'; iframe.loading = 'lazy'; iframe.referrerPolicy = 'no-referrer';
    iframe.src = 'https://maps.google.com/maps?q=Rua+Saldanha+Marinho+1245+Piracicaba+SP&output=embed';
    e.currentTarget.closest('.mapa').replaceChildren(iframe);
  });
  const form = document.querySelector('#lead-form');
  if (!form) return;
  const status = document.querySelector('#form-status');
  const course = form.elements.curso;
  const selected = new URLSearchParams(location.search).get('curso');
  if (['infantil', 'adolescentes', 'adulto'].includes(selected)) course.value = selected;
  const updateProfile = () => {
    const responsible = ['infantil', 'adolescentes'].includes(course.value);
    document.querySelector('#name-label').firstChild.textContent = responsible ? 'Nome do responsável' : 'Nome completo';
    document.querySelector('#age-field').hidden = !responsible;
    // Age ranges are not yet confirmed. Never restrict to invented commercial ranges.
    form.elements.idade.required = false;
    form.elements.idade.disabled = !responsible;
  };
  course.addEventListener('change', updateProfile); updateProfile();
  function validate(fieldset) {
    for (const control of fieldset.querySelectorAll('input,select')) {
      if (!control.disabled && !control.reportValidity()) return false;
    }
    return true;
  }
  function showStep(step) {
    form.querySelectorAll('fieldset').forEach(el => { el.hidden = el.dataset.step !== String(step); });
    form.querySelectorAll('.etapas span').forEach((el, index) => el.classList.toggle('ativa', index + 1 === step));
    form.querySelector(`fieldset[data-step="${step}"] select,fieldset[data-step="${step}"] input`)?.focus();
    status.textContent = '';
  }
  document.querySelector('#next-step').addEventListener('click', () => { if (validate(form.querySelector('[data-step="1"]'))) showStep(2); });
  document.querySelector('#previous-step').addEventListener('click', () => showStep(1));
  form.elements.telefone.addEventListener('input', () => form.elements.telefone.setCustomValidity(''));
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate(form.querySelector('[data-step="1"]'))) { showStep(1); return; }
    const digits = form.elements.telefone.value.replace(/\D/g, '');
    form.elements.telefone.setCustomValidity(/^(?:55)?\d{10,11}$/.test(digits) ? '' : 'Informe um telefone com DDD válido.');
    if (!validate(form.querySelector('[data-step="2"]'))) return;
    if (form.elements.website.value) return;
    if (!config.leadEndpoint) { status.textContent = 'Prévia: seus dados não foram enviados. O canal de atendimento ainda precisa ser conectado pela escola. Nenhuma aula foi agendada.'; return; }
    const endpoint = new URL(config.leadEndpoint, location.origin);
    if (endpoint.origin !== location.origin) { status.textContent = 'O canal de atendimento precisa de uma configuração segura. Nenhum dado foi enviado.'; return; }
    const button = form.querySelector('[type="submit"]');
    const payload = Object.fromEntries(new FormData(form));
    payload.atribuicao = {};
    // Attribution is collected only for this submission, never persisted before consent.
    const params = new URLSearchParams(location.search);
    for (const key of attributionKeys) {
      if (params.has(key)) payload.atribuicao[key] = params.get(key).slice(0, 250);
    }
    payload.pagina_origem = location.pathname; payload.data_envio = new Date().toISOString();
    button.disabled = true; button.textContent = 'Enviando…'; status.textContent = 'Enviando sua solicitação…';
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error('HTTP');
      const result = await response.json();
      if (result.accepted !== true) throw new Error('Rejected');
      form.reset(); updateProfile(); showStep(1);
      status.textContent = 'Solicitação recebida. Aguarde o contato da equipe para consultar a disponibilidade. Seu horário ainda não está confirmado.';
    } catch {
      status.textContent = 'Não foi possível confirmar o envio. Seus dados continuam no formulário para tentar novamente. Nenhuma aula foi agendada.';
    } finally { button.disabled = false; button.textContent = 'Solicitar contato ↗'; }
  });
})();
