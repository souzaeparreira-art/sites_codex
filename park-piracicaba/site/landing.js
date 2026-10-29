/* Site Cinematográfico · Labrego IA */
(() => {
  'use strict';
  const form = document.querySelector('#captura');
  const status = document.querySelector('#status');
  const config = window.SITE || {};
  const button = form.querySelector('button');
  const phone = form.elements.whatsapp;
  const endpoint = config.leadEndpoint ? new URL(config.leadEndpoint, location.origin) : null;
  const ready = endpoint && endpoint.origin === location.origin;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    const reveals = document.querySelectorAll('.experiencia-heading, .motivo, .manifesto .painel, .convite, .perguntas > .painel, .final .painel');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    reveals.forEach(element => { element.dataset.reveal = ''; revealObserver.observe(element); });
    document.documentElement.classList.add('reveal-ready');
  }
  document.querySelector('#integration-note').hidden = Boolean(ready);
  phone.addEventListener('input', () => phone.setCustomValidity(''));
  if ('IntersectionObserver' in window) {
    const floating = document.querySelector('.cta-mobile');
    let formVisible = false;
    let fieldFocused = false;
    const updateFloating = () => floating.classList.toggle('oculta', formVisible || fieldFocused);
    new IntersectionObserver(entries => {
      formVisible = entries.some(entry => entry.isIntersecting);
      updateFloating();
    }, { threshold: 0.15 }).observe(document.querySelector('#cadastro'));
    form.addEventListener('focusin', () => { fieldFocused = true; updateFloating(); });
    form.addEventListener('focusout', () => {
      setTimeout(() => { fieldFocused = form.contains(document.activeElement); updateFloating(); }, 0);
    });
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const digits = phone.value.replace(/\D/g, '');
    phone.setCustomValidity(/^(?:55)?[1-9]\d(?:9\d{8}|[2-5]\d{7})$/.test(digits) ? '' : 'Informe um WhatsApp válido com DDD.');
    if (!form.reportValidity() || form.elements.website.value) return;
    if (!ready) {
      status.textContent = 'O cadastro ainda não está conectado ao atendimento. Seus dados não foram enviados. O envio será liberado assim que a escola configurar o destino.';
      return;
    }
    const params = new URLSearchParams(location.search);
    const attribution = {};
    for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) {
      if (params.has(key)) attribution[key] = params.get(key).slice(0, 250);
    }
    const payload = {
      nome: form.elements.nome.value.trim(),
      whatsapp: digits,
      email: form.elements.email.value.trim(),
      consentimento: true,
      finalidade: 'Contato sobre Aula Experimental',
      versao_privacidade: 'minuta-2026-10-27',
      atribuicao: attribution,
      pagina_origem: location.pathname,
      data_envio: new Date().toISOString()
    };
    button.disabled = true; button.textContent = 'Enviando seu contato…';
    status.textContent = 'Enviando…';
    try {
      const response = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload), signal:AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error('HTTP');
      const result = await response.json();
      if (result.accepted !== true) throw new Error('not accepted');
      form.reset();
      status.textContent = 'Contato recebido! A equipe vai conversar com você sobre sua Aula Experimental. Aguarde a confirmação do dia e horário.';
    } catch {
      status.textContent = 'Não foi possível confirmar o cadastro. Tente novamente. Seus dados continuam preenchidos e nenhuma aula foi agendada.';
    } finally {
      button.disabled = false; button.replaceChildren(document.createTextNode('Quero minha aula experimental '));
      const arrow = document.createElement('span'); arrow.setAttribute('aria-hidden','true'); arrow.textContent = '↗'; button.append(arrow);
    }
  });
})();
