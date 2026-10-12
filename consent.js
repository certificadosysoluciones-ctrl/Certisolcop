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

  function readState() {
    try {
      var v = localStorage.getItem(KEY);
      if (!v) return null;
      if (v === 'accepted') return { ad: true };
      if (v === 'rejected') return { ad: false };
      var o = JSON.parse(v);
      if (o && typeof o === 'object') return { ad: !!o.ad };
    } catch (e) {}
    return null;
  }

  function update(granted) {
    gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
      analytics_storage: 'denied'
    });
  }

  function store(st) {
    current = st;
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
    update(!!st.ad);
  }

  var current = readState();
  if (current) update(!!current.ad);

  var CSS = '' +
    '.cookie-consent{position:fixed;right:18px;bottom:18px;z-index:99999;width:min(400px,calc(100vw - 28px));font-family:inherit;color:#374151}' +
    '.cookie-consent__card{background:#fff;border-radius:14px;box-shadow:0 18px 45px rgba(2,12,27,.30);padding:20px;font-size:.92rem;line-height:1.5}' +
    '.cookie-consent__head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}' +
    '.cookie-consent__title{margin:0;font-size:1.08rem;font-weight:700;color:#0f172a}' +
    '.cookie-consent__close{width:34px;height:34px;display:grid;place-items:center;border:1px solid #d1d5db;border-radius:8px;background:#fff;cursor:pointer;color:#111827;flex:0 0 auto}' +
    '.cookie-consent__close svg{width:14px;height:14px}' +
    '.cookie-consent__close:hover{background:#f3f4f6}' +
    '.cookie-consent__text{margin:0 0 16px}' +
    '.cookie-consent__text a,.cookie-consent__links a{color:#0369a1;text-decoration:underline}' +
    '.cookie-consent__actions{display:grid;gap:10px}' +
    '.cookie-consent__btn{width:100%;padding:12px 16px;border-radius:10px;border:1px solid transparent;font:inherit;font-weight:600;font-size:.95rem;cursor:pointer}' +
    '.cookie-consent__btn--accept{background:#0369a1;color:#fff}' +
    '.cookie-consent__btn--accept:hover{filter:brightness(1.08)}' +
    '.cookie-consent__btn--ghost{background:#fff;color:#1f2937;border-color:#d1d5db}' +
    '.cookie-consent__btn--ghost:hover{background:#f3f4f6}' +
    '.cookie-consent__toggle{width:100%;border:0;background:none;color:#0369a1;font:inherit;font-weight:600;font-size:.9rem;cursor:pointer;padding:10px 0 2px;text-align:center}' +
    '.cookie-consent__toggle:hover{text-decoration:underline}' +
    '.cookie-consent__prefs{list-style:none;margin:0 0 14px;padding:0;display:grid;gap:10px}' +
    '.cookie-consent__pref{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;border:1px solid #e5e7eb;border-radius:10px;padding:12px 14px}' +
    '.cookie-consent__pref h3{margin:0 0 3px;font-size:.95rem;color:#0f172a}' +
    '.cookie-consent__pref p{margin:0;font-size:.83rem;color:#6b7280}' +
    '.cookie-consent__switch{position:relative;flex:0 0 auto;width:46px;height:26px;margin-top:2px}' +
    '.cookie-consent__switch input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}' +
    '.cookie-consent__switch span{position:absolute;inset:0;border-radius:999px;background:#cbd5e1;transition:.2s;pointer-events:none}' +
    '.cookie-consent__switch span::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:.2s}' +
    '.cookie-consent__switch input:checked + span{background:#0369a1}' +
    '.cookie-consent__switch input:checked + span::after{transform:translateX(20px)}' +
    '.cookie-consent__switch input:disabled + span{opacity:.55}' +
    '.cookie-consent__switch input:disabled{cursor:not-allowed}' +
    '.cookie-consent__links{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-top:14px;font-size:.82rem}' +
    '.cookie-consent__fab{position:fixed;right:18px;bottom:18px;z-index:99999;width:46px;height:46px;border-radius:50%;border:0;background:#0369a1;color:#fff;cursor:pointer;display:grid;place-items:center;box-shadow:0 10px 24px rgba(2,12,27,.30)}' +
    '.cookie-consent__fab svg{width:24px;height:24px}' +
    '.cookie-consent__fab:hover{filter:brightness(1.08)}' +
    '@media(max-width:480px){.cookie-consent{right:12px;left:12px;bottom:12px;width:auto}}';

  function injectStyles() {
    if (document.getElementById('cookie-consent-css')) return;
    var style = document.createElement('style');
    style.id = 'cookie-consent-css';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function buildFab() {
    if (document.querySelector('.cookie-consent__fab')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cookie-consent__fab';
    btn.setAttribute('aria-label', 'Configurar cookies');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="9.2" cy="10" r="1.1" fill="currentColor" stroke="none"/><circle cx="14.6" cy="13.4" r="1.1" fill="currentColor" stroke="none"/><circle cx="10.2" cy="15" r="1.1" fill="currentColor" stroke="none"/></svg>';
    btn.addEventListener('click', function () {
      btn.remove();
      buildCard();
    });
    document.body.appendChild(btn);
  }

  function buildCard() {
    injectStyles();

    var wrap = document.createElement('div');
    wrap.className = 'cookie-consent';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', 'Gestionar cookies');
    wrap.innerHTML = [
      '<div class="cookie-consent__card">',
        '<div class="cookie-consent__head">',
          '<h2 class="cookie-consent__title">Gestionar cookies</h2>',
          '<button type="button" class="cookie-consent__close" aria-label="Cerrar"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>',
        '</div>',
        '<p class="cookie-consent__text">Utilizamos cookies de terceros (Google Ads) para medir la eficacia de nuestras campañas y mostrarte contenido relacionado. Puedes aceptarlas, rechazarlas o configurar tus preferencias. <a href="/privacidad.html#cookies">Política de cookies</a>.</p>',
        '<div class="cookie-consent__actions">',
          '<button type="button" class="cookie-consent__btn cookie-consent__btn--accept" data-act="accept">Aceptar</button>',
          '<button type="button" class="cookie-consent__btn cookie-consent__btn--ghost" data-act="reject">Rechazar</button>',
        '</div>',
        '<button type="button" class="cookie-consent__toggle" data-act="prefs" aria-expanded="false">Ver preferencias</button>',
        '<div class="cookie-consent__prefs-view" hidden>',
          '<ul class="cookie-consent__prefs">',
            '<li class="cookie-consent__pref"><div><h3>Técnicas o necesarias</h3><p>Imprescindibles para el funcionamiento de la web.</p></div><label class="cookie-consent__switch"><input type="checkbox" checked disabled aria-label="Cookies técnicas, siempre activas"><span></span></label></li>',
            '<li class="cookie-consent__pref"><div><h3>Publicidad (Google Ads)</h3><p>Medición de conversiones y publicidad relacionada.</p></div><label class="cookie-consent__switch"><input type="checkbox" data-pref="ad" aria-label="Cookies de publicidad"><span></span></label></li>',
          '</ul>',
          '<button type="button" class="cookie-consent__btn cookie-consent__btn--accept" data-act="save">Guardar preferencias</button>',
        '</div>',
        '<div class="cookie-consent__links"><a href="/privacidad.html#cookies">Política de cookies</a><a href="/privacidad.html#datos">Protección de datos</a><a href="/privacidad.html">Privacidad</a></div>',
      '</div>'
    ].join('');
    document.body.appendChild(wrap);

    var prefsView = wrap.querySelector('.cookie-consent__prefs-view');
    var toggleBtn = wrap.querySelector('[data-act="prefs"]');
    var adToggle = wrap.querySelector('[data-pref="ad"]');
    adToggle.checked = current ? !!current.ad : false;

    function close(st) {
      store(st);
      wrap.remove();
      buildFab();
    }

    wrap.addEventListener('click', function (e) {
      if (e.target.closest('.cookie-consent__close')) { close({ ad: false }); return; }
      var btn = e.target.closest('[data-act]');
      if (!btn) return;
      var act = btn.getAttribute('data-act');
      if (act === 'accept') { close({ ad: true }); }
      else if (act === 'reject') { close({ ad: false }); }
      else if (act === 'save') { close({ ad: !!adToggle.checked }); }
      else if (act === 'prefs') {
        var open = prefsView.hidden;
        prefsView.hidden = !open;
        toggleBtn.setAttribute('aria-expanded', String(open));
        toggleBtn.textContent = open ? 'Ocultar preferencias' : 'Ver preferencias';
      }
    });
  }

  function init() {
    injectStyles();
    if (current) buildFab();
    else buildCard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
