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

  function apply(st) {
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
    update(!!st.ad);
  }

  var state = readState();
  if (state) update(!!state.ad);

  var CSS = '' +
    '.cookie-consent{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;pointer-events:none}' +
    '.cookie-consent__card{pointer-events:auto;position:relative;background:#fff;color:#374151;width:100%;max-width:660px;border-radius:14px;box-shadow:0 20px 55px rgba(2,12,27,.32);padding:28px 28px 22px;font-family:inherit;font-size:.95rem;line-height:1.55}' +
    '.cookie-consent__title{margin:0 0 14px;font-size:1.3rem;font-weight:700;color:#0f172a;text-align:center}' +
    '.cookie-consent__close{position:absolute;top:14px;right:14px;width:42px;height:42px;display:grid;place-items:center;border:1px solid #d1d5db;border-radius:8px;background:#fff;cursor:pointer;color:#111827}' +
    '.cookie-consent__close svg{width:16px;height:16px}' +
    '.cookie-consent__close:hover{background:#f3f4f6}' +
    '.cookie-consent__text{margin:0 0 20px}' +
    '.cookie-consent__text a,.cookie-consent__links a{color:#0369a1;text-decoration:underline}' +
    '.cookie-consent__actions{display:flex;gap:12px;flex-wrap:wrap}' +
    '.cookie-consent__btn{flex:1 1 0;min-width:150px;padding:13px 18px;border-radius:10px;border:1px solid transparent;font:inherit;font-weight:600;font-size:.97rem;cursor:pointer}' +
    '.cookie-consent__btn--accept{background:#0369a1;color:#fff}' +
    '.cookie-consent__btn--ghost{background:#fff;color:#1f2937;border-color:#d1d5db}' +
    '.cookie-consent__btn--accept:hover{filter:brightness(1.08)}' +
    '.cookie-consent__btn--ghost:hover{background:#f3f4f6}' +
    '.cookie-consent__links{display:flex;gap:22px;justify-content:center;flex-wrap:wrap;margin-top:18px;font-size:.88rem}' +
    '.cookie-consent__prefs{list-style:none;margin:0 0 20px;padding:0;display:grid;gap:12px}' +
    '.cookie-consent__pref{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px}' +
    '.cookie-consent__pref h3{margin:0 0 4px;font-size:1rem;color:#0f172a}' +
    '.cookie-consent__pref p{margin:0;font-size:.88rem;color:#6b7280}' +
    '.cookie-consent__switch{position:relative;flex:0 0 auto;width:48px;height:28px}' +
    '.cookie-consent__switch input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}' +
    '.cookie-consent__switch span{position:absolute;inset:0;border-radius:999px;background:#cbd5e1;transition:.2s;pointer-events:none}' +
    '.cookie-consent__switch span::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:.2s}' +
    '.cookie-consent__switch input:checked + span{background:#0369a1}' +
    '.cookie-consent__switch input:checked + span::after{transform:translateX(20px)}' +
    '.cookie-consent__switch input:disabled + span{opacity:.55}' +
    '.cookie-consent__switch input:disabled{cursor:not-allowed}' +
    '@media(max-width:640px){.cookie-consent{align-items:flex-end;padding:0}.cookie-consent__card{border-radius:16px 16px 0 0;max-width:none;padding:22px 20px}.cookie-consent__actions{flex-direction:column}.cookie-consent__btn{min-width:0}}';

  function build() {
    if (state) return;

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var wrap = document.createElement('div');
    wrap.className = 'cookie-consent';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', 'Gestionar cookies');
    wrap.innerHTML = [
      '<div class="cookie-consent__card">',
        '<button type="button" class="cookie-consent__close" aria-label="Cerrar">',
          '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
        '</button>',
        '<div class="cookie-consent__main">',
          '<h2 class="cookie-consent__title">Gestionar cookies</h2>',
          '<p class="cookie-consent__text">Utilizamos cookies de terceros (Google Ads) para medir la eficacia de nuestras campañas publicitarias y mostrarte contenido relacionado. Puedes aceptarlas, rechazarlas o configurar tus preferencias. Tienes más información en nuestra <a href="/privacidad.html#cookies">política de cookies</a>.</p>',
          '<div class="cookie-consent__actions">',
            '<button type="button" class="cookie-consent__btn cookie-consent__btn--accept" data-act="accept">Aceptar</button>',
            '<button type="button" class="cookie-consent__btn cookie-consent__btn--ghost" data-act="reject">Rechazar</button>',
            '<button type="button" class="cookie-consent__btn cookie-consent__btn--ghost" data-act="prefs">Ver preferencias</button>',
          '</div>',
          '<div class="cookie-consent__links"><a href="/privacidad.html#cookies">Política de cookies</a><a href="/privacidad.html#datos">Protección de datos</a><a href="/privacidad.html">Privacidad</a></div>',
        '</div>',
        '<div class="cookie-consent__prefs-view" hidden>',
          '<h2 class="cookie-consent__title">Preferencias de cookies</h2>',
          '<p class="cookie-consent__text">Elige qué cookies aceptas. Las técnicas son necesarias para que la web funcione y no se pueden desactivar.</p>',
          '<ul class="cookie-consent__prefs">',
            '<li class="cookie-consent__pref"><div><h3>Técnicas o necesarias</h3><p>Imprescindibles para el funcionamiento de la web.</p></div><label class="cookie-consent__switch"><input type="checkbox" checked disabled aria-label="Cookies técnicas, siempre activas"><span></span></label></li>',
            '<li class="cookie-consent__pref"><div><h3>Publicidad (Google Ads)</h3><p>Medición de conversiones y publicidad relacionada.</p></div><label class="cookie-consent__switch"><input type="checkbox" data-pref="ad" aria-label="Cookies de publicidad"><span></span></label></li>',
          '</ul>',
          '<div class="cookie-consent__actions">',
            '<button type="button" class="cookie-consent__btn cookie-consent__btn--accept" data-act="save">Guardar preferencias</button>',
            '<button type="button" class="cookie-consent__btn cookie-consent__btn--ghost" data-act="accept">Aceptar todas</button>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');
    document.body.appendChild(wrap);

    var mainView = wrap.querySelector('.cookie-consent__main');
    var prefsView = wrap.querySelector('.cookie-consent__prefs-view');
    var adToggle = wrap.querySelector('[data-pref="ad"]');

    function close(st) {
      apply(st);
      wrap.remove();
    }

    wrap.addEventListener('click', function (e) {
      if (e.target.closest('.cookie-consent__close')) { close({ ad: false }); return; }
      var btn = e.target.closest('[data-act]');
      if (!btn) return;
      var act = btn.getAttribute('data-act');
      if (act === 'accept') { close({ ad: true }); }
      else if (act === 'reject') { close({ ad: false }); }
      else if (act === 'prefs') { mainView.hidden = true; prefsView.hidden = false; }
      else if (act === 'save') { close({ ad: !!adToggle.checked }); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
