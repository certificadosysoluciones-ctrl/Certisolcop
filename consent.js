(function () {
  'use strict';
  var KEY = 'cookies-consent';

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}

  function update(granted) {
    gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied'
    });
  }

  if (choice === 'accepted') update(true);

  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    update(value === 'accepted');
  }

  var CSS = '' +
    '.cookie-banner{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#0f172a;color:#f1f5f9;padding:16px 20px;box-shadow:0 -6px 24px rgba(0,0,0,.28);font-family:inherit;font-size:.95rem;line-height:1.45}' +
    '.cookie-banner__inner{max-width:1100px;margin:0 auto;display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap}' +
    '.cookie-banner__text{margin:0;max-width:72ch}' +
    '.cookie-banner__text a{color:#7dd3fc;text-decoration:underline}' +
    '.cookie-banner__actions{display:flex;gap:10px;flex:0 0 auto}' +
    '.cookie-banner__btn{border:0;border-radius:8px;padding:11px 22px;font:inherit;font-weight:600;font-size:.95rem;cursor:pointer;min-width:120px}' +
    '.cookie-banner__btn--reject{background:#334155;color:#f1f5f9}' +
    '.cookie-banner__btn--accept{background:#0369a1;color:#fff}' +
    '.cookie-banner__btn:hover{filter:brightness(1.1)}' +
    '@media(max-width:640px){.cookie-banner__inner{gap:12px}.cookie-banner__actions{width:100%}.cookie-banner__btn{flex:1}}';

  function build() {
    if (choice) return;

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var box = document.createElement('div');
    box.className = 'cookie-banner';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Aviso de cookies');

    var inner = document.createElement('div');
    inner.className = 'cookie-banner__inner';

    var text = document.createElement('p');
    text.className = 'cookie-banner__text';
    text.innerHTML = 'Usamos cookies de terceros (Google Ads) para medir la eficacia de nuestras campañas publicitarias. Puedes aceptarlas o rechazarlas. <a href="/privacidad.html">Más información</a>.';

    var actions = document.createElement('div');
    actions.className = 'cookie-banner__actions';

    var reject = document.createElement('button');
    reject.type = 'button';
    reject.className = 'cookie-banner__btn cookie-banner__btn--reject';
    reject.textContent = 'Rechazar';

    var accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'cookie-banner__btn cookie-banner__btn--accept';
    accept.textContent = 'Aceptar';

    actions.appendChild(reject);
    actions.appendChild(accept);
    inner.appendChild(text);
    inner.appendChild(actions);
    box.appendChild(inner);
    document.body.appendChild(box);

    function close(value) {
      save(value);
      box.remove();
    }
    accept.addEventListener('click', function () { close('accepted'); });
    reject.addEventListener('click', function () { close('rejected'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
