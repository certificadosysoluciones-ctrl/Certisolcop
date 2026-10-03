(() => {
  'use strict';
  const config = window.siteConfig;
  const all = selector => document.querySelectorAll(selector);
  const $ = selector => document.querySelector(selector);
  const phone = String(config.phone).replace(/[^+\d]/g, '');
  const whatsappUrl = 'https://wa.me/' + String(config.whatsapp).replace(/\D/g, '');
  all('[data-phone]').forEach(link => { link.href = 'tel:' + phone; link.textContent = config.phoneLabel || config.phone; });
  all('[data-email]').forEach(link => { link.href = 'mailto:' + config.email; link.textContent = config.email; });
  all('[data-whatsapp]').forEach(link => { link.href = whatsappUrl; });
  all('[data-address]').forEach(el => { el.textContent = config.address; });
  all('[data-map]').forEach(link => { link.href = config.mapUrl; });
  all('[data-booking]').forEach(link => { link.href = config.bookingUrl || '#contacto'; if (!config.bookingUrl) { link.removeAttribute('target'); link.textContent = 'Consultar disponibilidad'; } });
  if ($('#year')) $('#year').textContent = new Date().getFullYear();

  const toggle = $('.menu-toggle');
  const nav = $('#main-nav');
  function closeMenu() {
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Abrir menú');
  }
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  all('#main-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav?.classList.contains('is-open')) { closeMenu(); toggle.focus(); } });
  document.addEventListener('click', event => { if (nav?.classList.contains('is-open') && !event.target.closest('.site-header')) closeMenu(); });

  const currency = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
  // Función independiente para mantener y comprobar las tarifas sin depender del formulario.
  function calculateQuote(type, areaInput, cpInput) {
    const rates = window.tarifas;
    const cp = String(cpInput).trim();
    if (!cp) return { status: 'empty' };
    if (!/^\d{5}$/.test(cp)) return { status: 'invalid', message: 'Introduce un código postal de 5 cifras.' };
    if (type === 'edificio') return { status: 'consult' };
    if (!Object.prototype.hasOwnProperty.call(rates.base, type)) return { status: 'invalid', message: 'Selecciona un tipo de inmueble.' };
    if (String(areaInput).trim() === '') return { status: 'empty' };
    const area = Number(areaInput);
    if (!Number.isFinite(area) || area <= 0) return { status: 'invalid', message: 'Introduce una superficie mayor que cero.' };
    const band = rates.tramos.find(tramo => area <= tramo.hasta);
    if (!band) return { status: 'consult' };
    const known = Object.prototype.hasOwnProperty.call(rates.cp, cp);
    const surcharge = known ? rates.cp[cp] : 0;
    const descuento = 5;
    const raw = (rates.base[type] + band.extra + surcharge + (known && surcharge === 0 ? band.ciudad : 0)) * rates.iva - descuento;
    return { status: 'price', total: Number(raw.toFixed(2)) };
  }
  window.calculateQuote = calculateQuote;
  const priceForm = $('#price-form');
  let quote = { status: 'empty' };
  if (priceForm) {
    const price = $('#price');
    const error = $('#price-error');
    function updatePrice() {
      quote = calculateQuote($('#property-type').value, $('#area').value, $('#postal-code').value);
      error.textContent = quote.message || '';
      price.textContent = quote.status === 'price' ? currency.format(quote.total) : ['consult', 'outside'].includes(quote.status) ? 'Precio a consultar' : '—';
      price.classList.toggle('consult', ['consult', 'outside'].includes(quote.status));
      $('#postal-code').setAttribute('aria-invalid', String(quote.status === 'invalid' && !/^\d{5}$/.test($('#postal-code').value.trim())));
      $('#area').setAttribute('aria-invalid', String(quote.status === 'invalid' && /^\d{5}$/.test($('#postal-code').value.trim())));
    }
    priceForm.addEventListener('input', updatePrice);
    priceForm.addEventListener('change', updatePrice);
    priceForm.addEventListener('submit', event => { event.preventDefault(); updatePrice(); });
    $('#price-cta').addEventListener('click', () => {
      const type = $('#property-type').selectedOptions[0].textContent;
      const cp = $('#postal-code').value.trim();
      if (/^\d{5}$/.test(cp)) $('#contact-postal').value = cp;
      const area = $('#area').value;
      const note = `Solicitud de certificado: ${type}${area ? ', ' + area + ' m²' : ''}${cp ? ', CP ' + cp : ''}.${quote.status === 'price' ? ' Precio calculado: ' + currency.format(quote.total) + ' (IVA incluido).' : ''}`;
      $('#message').value = note;
    });
    updatePrice();
  }
  all('[data-service]').forEach(link => link.addEventListener('click', () => { $('#message').value = 'Me gustaría recibir información sobre: ' + link.dataset.service + '.'; }));

  const form = $('#contact-form');
  if (config.formEndpoint && $('#privacy-form-description')) $('#privacy-form-description').textContent = 'Al enviar una solicitud, los datos que introduces se transmiten al servicio de formularios habilitado para entregarlos al equipo de contacto. Se utilizan para responder a tu consulta.';
  if (!form) return;
  const submit = $('#contact-submit');
  const status = $('#form-status');
  let sending = false;
  if (config.formEndpoint) {
    submit.textContent = 'Enviar solicitud →';
    $('#form-help').textContent = 'Enviaremos tu solicitud al equipo para que se ponga en contacto contigo.';
  } else {
    $('#form-help').textContent = 'Prepararemos un email para que lo revises y lo envíes desde tu aplicación de correo.';
  }
  form.addEventListener('input', () => { if (!sending) { status.replaceChildren(); status.classList.remove('error'); } });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    status.replaceChildren();
    status.classList.remove('error');
    const data = new FormData(form);
    if (config.formAccessKey) data.append('access_key', config.formAccessKey);
    if (!config.formEndpoint) {
      const body = `Hola, me gustaría solicitar información.\n\nNombre: ${data.get('nombre')}\nTeléfono: ${data.get('telefono')}\nEmail: ${data.get('email')}\nCódigo postal: ${data.get('codigo_postal')}\n\n${data.get('comentarios') || ''}\n\nHe leído la información de privacidad y solicito que me contacten.`;
      const link = document.createElement('a');
      link.href = 'mailto:' + config.email + '?subject=' + encodeURIComponent('Solicitud de certificado energético') + '&body=' + encodeURIComponent(body);
      link.className = 'text-link';
      link.textContent = 'Abrir mi correo y revisar la solicitud →';
      status.append(document.createTextNode('Solicitud preparada. Todavía no se ha enviado. '), link);
      return;
    }
    sending = true;
    submit.disabled = true;
    submit.textContent = 'Enviando…';
    status.textContent = 'Estamos enviando tu solicitud.';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const endpoint = new URL(config.formEndpoint);
      if (endpoint.protocol !== 'https:') throw new Error('Endpoint inválido');
      const response = await fetch(endpoint.href, { method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: controller.signal });
      if (!response.ok) throw new Error('Envío no confirmado');
      status.textContent = 'Solicitud enviada. Gracias; nos pondremos en contacto contigo.';
      form.reset();
    } catch {
      status.classList.add('error');
      status.textContent = 'No hemos podido confirmar el envío. Tus datos siguen aquí; puedes volver a intentarlo o contactarnos por teléfono o WhatsApp.';
    } finally {
      clearTimeout(timeout);
      sending = false;
      submit.disabled = false;
      submit.textContent = 'Enviar solicitud →';
    }
  });
})();
