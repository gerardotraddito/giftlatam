// ============================================
// GIFTLATAM — Auth global v4
// Dropdown perfil + barra de búsqueda global
// ============================================

const PROTECTED_PAGES = ['publicar.html', 'panel.html', 'pago.html', 'disputas.html', 'transacciones.html'];
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
let isLoggingOut = false;
let _searchTimer = null;

const DROPDOWN_CSS = `
  #gl-search-wrap {
    flex:1;max-width:340px;min-width:0;position:relative;
  }
  #gl-search-input {
    width:100%;background:#141414;border:1px solid #222;border-radius:20px;
    padding:8px 36px 8px 14px;font-size:13px;color:#f0f0f0;
    font-family:'Inter',sans-serif;outline:none;transition:border-color 0.15s;
  }
  #gl-search-input:focus { border-color:rgba(0,200,83,0.4); }
  #gl-search-btn {
    position:absolute;right:10px;top:50%;transform:translateY(-50%);
    color:#555;cursor:pointer;background:none;border:none;padding:2px;
    display:flex;align-items:center;transition:color 0.15s;
  }
  #gl-search-btn:hover { color:#00C853; }
  #gl-search-results {
    position:absolute;top:calc(100% + 6px);left:0;right:0;
    background:#111;border:1px solid #222;border-radius:14px;
    box-shadow:0 8px 32px rgba(0,0,0,0.6);z-index:99997;
    overflow:hidden;display:none;max-height:320px;overflow-y:auto;
  }
  #gl-search-results.open { display:block; }
  .gl-sr-item {
    display:flex;align-items:center;gap:10px;padding:10px 14px;
    cursor:pointer;transition:background 0.1s;text-decoration:none;
  }
  .gl-sr-item:hover { background:rgba(255,255,255,0.04); }
  .gl-sr-icon { width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0; }
  .gl-sr-info { flex:1;min-width:0; }
  .gl-sr-title { font-size:13px;font-weight:600;color:#f0f0f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
  .gl-sr-sub { font-size:11px;color:#666;margin-top:1px; }
  .gl-sr-price { font-size:13px;font-weight:700;color:#00C853;flex-shrink:0; }
  .gl-sr-empty { padding:16px;text-align:center;color:#555;font-size:13px; }
  .gl-sr-all { display:block;padding:10px 14px;text-align:center;font-size:12px;font-weight:700;color:#00C853;border-top:1px solid #1e1e1e;cursor:pointer;text-decoration:none; }

  #gl-profile-btn {
    display:flex;align-items:center;gap:8px;background:rgba(0,200,83,0.08);
    border:1px solid rgba(0,200,83,0.2);border-radius:20px;padding:5px 12px 5px 6px;
    cursor:pointer;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;
    color:#f0f0f0;position:relative;transition:background 0.15s;flex-shrink:0;
  }
  #gl-profile-btn:hover { background:rgba(0,200,83,0.14); }
  #gl-avatar-mini {
    width:28px;height:28px;border-radius:50%;background:rgba(0,200,83,0.2);
    display:flex;align-items:center;justify-content:center;font-size:13px;
    font-weight:800;color:#00C853;overflow:hidden;flex-shrink:0;
  }
  #gl-avatar-mini img { width:100%;height:100%;object-fit:cover;border-radius:50%; }
  #gl-dropdown {
    position:fixed;top:54px;right:12px;width:260px;
    background:#111;border:1px solid #222;border-radius:16px;
    box-shadow:0 8px 40px rgba(0,0,0,0.6);z-index:99999;
    display:none;overflow:hidden;
  }
  #gl-dropdown.open { display:block;animation:glDD 0.15s ease; }
  @keyframes glDD { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  #gl-saldo-box { background:rgba(0,200,83,0.08);border-bottom:1px solid #1e1e1e;padding:14px 16px; }
  #gl-saldo-label { font-size:11px;color:#666;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.06em; }
  #gl-saldo-num { font-size:22px;font-weight:800;color:#00C853; }
  #gl-saldo-sub { font-size:11px;color:#555;margin-top:2px; }
  .gl-menu-item {
    display:flex;align-items:center;gap:10px;padding:12px 16px;
    font-size:13px;font-weight:600;color:#d0d0d0;cursor:pointer;
    text-decoration:none;transition:background 0.1s;font-family:'Inter',sans-serif;
    border:none;background:transparent;width:100%;text-align:left;
  }
  .gl-menu-item:hover { background:rgba(255,255,255,0.04); }
  .gl-menu-item .gl-icon { font-size:16px;width:20px;text-align:center; }
  .gl-menu-divider { height:1px;background:#1e1e1e;margin:4px 0; }
  .gl-menu-item.gl-logout { color:#ff4444; }
  #gl-overlay { position:fixed;inset:0;z-index:99996;display:none; }
  #gl-overlay.open { display:block; }

  @media(max-width:600px){
    #gl-search-wrap { max-width:none; }
    #gl-profile-btn span:not([style]) { display:none; }
  }
`;

var LOGOS={xbox:'https://cdn.simpleicons.org/xbox/107C10',playstation:'https://cdn.simpleicons.org/playstation/003791',psn:'https://cdn.simpleicons.org/playstation/003791',steam:'https://cdn.simpleicons.org/steam/66c0f4',apple:'https://cdn.simpleicons.org/apple/f5f5f7',spotify:'https://cdn.simpleicons.org/spotify/1ED760',netflix:'https://cdn.simpleicons.org/netflix/E50914',nintendo:'https://cdn.simpleicons.org/nintendo/E60012',roblox:'https://cdn.simpleicons.org/roblox/E2231A',youtube:'https://cdn.simpleicons.org/youtube/FF0000',amazon:'https://cdn.simpleicons.org/amazon/FF9900',discord:'https://cdn.simpleicons.org/discord/5865F2',twitch:'https://cdn.simpleicons.org/twitch/9146FF'};
var BG_S={steam:'rgba(102,192,244,0.15)',xbox:'rgba(16,124,16,0.18)',playstation:'rgba(0,55,145,0.18)',psn:'rgba(0,55,145,0.18)',spotify:'rgba(30,215,96,0.18)',netflix:'rgba(229,9,20,0.18)',apple:'rgba(255,255,255,0.07)',nintendo:'rgba(230,0,18,0.18)',roblox:'rgba(226,35,26,0.18)',youtube:'rgba(255,0,0,0.18)',amazon:'rgba(255,153,0,0.18)',discord:'rgba(88,101,242,0.18)',twitch:'rgba(145,70,255,0.18)'};
var EMOJI_S={steam:'🎮',xbox:'🎮',playstation:'🎮',psn:'🎮',nintendo:'🎮',spotify:'🎵',netflix:'🎬',youtube:'📺',amazon:'🛒',apple:'🍎',discord:'💬',twitch:'📡',roblox:'🎮'};

function bkeyS(m){ return (m||'').toLowerCase().trim().split(/[\s-]/)[0]; }

function injectStyles() {
  if (document.getElementById('gl-auth-css')) return;
  const s = document.createElement('style');
  s.id = 'gl-auth-css';
  s.textContent = DROPDOWN_CSS;
  document.head.appendChild(s);
}

function toggleDropdown() {
  const dd = document.getElementById('gl-dropdown');
  const ov = document.getElementById('gl-overlay');
  if (!dd) return;
  const open = dd.classList.toggle('open');
  if (ov) ov.classList.toggle('open', open);
}

function closeDropdown() {
  const dd = document.getElementById('gl-dropdown');
  const ov = document.getElementById('gl-overlay');
  if (dd) dd.classList.remove('open');
  if (ov) ov.classList.remove('open');
}

function closeSearch() {
  const r = document.getElementById('gl-search-results');
  if (r) r.classList.remove('open');
}

async function doSearch(q) {
  const results = document.getElementById('gl-search-results');
  if (!results) return;
  q = q.trim();
  if (!q) { closeSearch(); return; }

  results.innerHTML = '<div class="gl-sr-empty">Buscando...</div>';
  results.classList.add('open');

  try {
    const r = await sb.from('gift_cards')
      .select('id,titulo,marca,precio_venta')
      .eq('estado','activo').gt('cantidad',0)
      .or('titulo.ilike.%'+q+'%,marca.ilike.%'+q+'%')
      .limit(6);

    const data = r.data || [];
    if (!data.length) {
      results.innerHTML = '<div class="gl-sr-empty">Sin resultados para "'+q+'"</div>' +
        '<a href="explorar.html?q='+encodeURIComponent(q)+'" class="gl-sr-all">Ver todo en explorar →</a>';
      return;
    }

    results.innerHTML = data.map(function(g) {
      var k = bkeyS(g.marca);
      var bg = BG_S[k] || 'rgba(0,200,83,0.1)';
      var em = EMOJI_S[k] || '🎁';
      var logo = LOGOS[k];
      var img = logo ? '<img src="'+logo+'" width="18" height="18" style="object-fit:contain">' : em;
      return '<a href="detalle.html?id='+g.id+'" class="gl-sr-item" onclick="closeSearch()">' +
        '<div class="gl-sr-icon" style="background:'+bg+'">'+img+'</div>' +
        '<div class="gl-sr-info"><div class="gl-sr-title">'+(g.titulo||g.marca||'')+'</div><div class="gl-sr-sub">'+(g.marca||'')+'</div></div>' +
        '<div class="gl-sr-price">$'+parseFloat(g.precio_venta||0).toFixed(2)+'</div>' +
      '</a>';
    }).join('') + '<a href="explorar.html?q='+encodeURIComponent(q)+'" class="gl-sr-all">Ver todos los resultados →</a>';

  } catch(e) {
    results.innerHTML = '<div class="gl-sr-empty">Error en búsqueda</div>';
  }
}

function ejecutarBusqueda() {
  var input = document.getElementById('gl-search-input');
  var q = input ? input.value.trim() : '';
  window.location.href = q ? 'explorar.html?q=' + encodeURIComponent(q) : 'explorar.html';
}

function initSearch() {
  const wrap = document.getElementById('gl-search-wrap');
  if (!wrap) return;
  const input = document.getElementById('gl-search-input');
  if (!input) return;

  input.addEventListener('input', function() {
    clearTimeout(_searchTimer);
    _searchTimer = setTimeout(function(){ doSearch(input.value); }, 250);
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') ejecutarBusqueda();
    if (e.key === 'Escape') closeSearch();
  });

  document.addEventListener('click', function(e) {
    if (!wrap.contains(e.target)) closeSearch();
  });
}

async function loadSaldo(uid) {
  try {
    const r = await sb.from('saldos').select('balance').eq('seller_id', uid).maybeSingle();
    const bal = r.data ? parseFloat(r.data.balance || 0).toFixed(2) : '0.00';
    const el = document.getElementById('gl-saldo-num');
    if (el) el.textContent = '$' + bal + ' USDT';
  } catch(e) {}
}

async function loadAvatar(uid) {
  try {
    const r = await sb.from('profiles').select('avatar_url').eq('id', uid).maybeSingle();
    const av = document.getElementById('gl-avatar-mini');
    if (av && r.data && r.data.avatar_url) {
      av.innerHTML = '<img src="' + r.data.avatar_url + '">';
    }
  } catch(e) {}
}

function buildSearchBar() {
  return `
    <div id="gl-search-wrap">
      <input id="gl-search-input" type="text" placeholder="Buscar Netflix, Steam, PSN..." autocomplete="off">
      <button id="gl-search-btn" onclick="ejecutarBusqueda()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </button>
      <div id="gl-search-results"></div>
    </div>
  `;
}

function updateNav(session) {
  const navActions = document.getElementById('navActions');
  const navSpacer  = document.querySelector('.nav-spacer');
  if (!navActions) return;
  injectStyles();

  // Inyectar barra de búsqueda en el nav si no existe
  if (!document.getElementById('gl-search-wrap') && navSpacer) {
    navSpacer.outerHTML = buildSearchBar();
    setTimeout(initSearch, 50);
  } else if (!document.getElementById('gl-search-wrap')) {
    // Insertar antes de navActions
    const bar = document.createElement('div');
    bar.innerHTML = buildSearchBar();
    navActions.parentNode.insertBefore(bar.firstElementChild, navActions);
    setTimeout(initSearch, 50);
  }

  if (session && session.user) {
    const meta    = session.user.user_metadata || {};
    const usuario = meta.usuario || meta.nombre || session.user.email.split('@')[0];
    const uid     = session.user.id;

    navActions.innerHTML = `
      <div id="gl-profile-btn" onclick="toggleDropdown()">
        <div id="gl-avatar-mini">${usuario[0].toUpperCase()}</div>
        <span>@${usuario}</span>
        <span style="color:#555;font-size:10px">▼</span>
      </div>
      <div id="gl-overlay" onclick="closeDropdown()"></div>
      <div id="gl-dropdown">
        <div id="gl-saldo-box">
          <div id="gl-saldo-label">Saldo disponible</div>
          <div id="gl-saldo-num">Cargando...</div>
          <div id="gl-saldo-sub">USDT en tu cuenta</div>
        </div>
        <a href="transacciones.html" class="gl-menu-item" onclick="closeDropdown()"><span class="gl-icon">📦</span> Historial</a>
        <a href="panel.html" class="gl-menu-item" onclick="closeDropdown()"><span class="gl-icon">🏪</span> Mi panel</a>
        <a href="mis-ventas.html" class="gl-menu-item" onclick="closeDropdown()"><span class="gl-icon">💰</span> Mis ventas</a>
        <div class="gl-menu-divider"></div>
        <a href="publicar.html" class="gl-menu-item" onclick="closeDropdown()"><span class="gl-icon">➕</span> Publicar producto</a>
        <a href="disputas.html" class="gl-menu-item" onclick="closeDropdown()"><span class="gl-icon">⚖️</span> Disputas</a>
        <div class="gl-menu-divider"></div>
        <a href="soporte.html" class="gl-menu-item" onclick="closeDropdown()"><span class="gl-icon">🆘</span> Soporte</a>
        <div class="gl-menu-divider"></div>
        <button class="gl-menu-item gl-logout" onclick="logout()"><span class="gl-icon">🚪</span> Cerrar sesión</button>
      </div>
    `;

    loadSaldo(uid);
    loadAvatar(uid);

  } else {
    navActions.innerHTML = `
      <button class="btn-login" onclick="window.location='login.html'">Iniciar sesión</button>
      <button class="btn-vender" onclick="window.location='publicar.html'">+ Vender</button>
    `;
  }
}

function checkProtection(session) {
  if (PROTECTED_PAGES.includes(currentPage) && !session) {
    window.location.href = 'login.html?from=' + currentPage;
    return false;
  }
  if (session && (currentPage === 'login.html' || currentPage === 'registro.html')) {
    window.location.href = 'panel.html';
    return false;
  }
  return true;
}

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await sb.auth.getSession();
  if (!checkProtection(session)) return;
  updateNav(session);
  sb.auth.onAuthStateChange((_event, newSession) => {
    if (isLoggingOut) return;
    updateNav(newSession);
    if (!newSession && PROTECTED_PAGES.includes(currentPage)) {
      window.location.href = 'login.html';
    }
  });
});

async function logout() {
  isLoggingOut = true;
  await sb.auth.signOut();
  window.location.href = 'index.html';
}
