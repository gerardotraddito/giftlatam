// ============================================
// GIFTLATAM — Auth global v2
// Fixes: onAuthStateChange, nav dinámico real,
//        protección de rutas, sesión persistente
// ============================================

const PROTECTED_PAGES = ['publicar.html', 'panel.html', 'pago.html', 'disputas.html'];
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// ── Actualizar nav según sesión ──
function updateNav(session) {
  const navActions = document.getElementById('navActions');
  if (!navActions) return;

  if (session && session.user) {
    const meta = session.user.user_metadata || {};
    const usuario = meta.usuario || meta.nombre || session.user.email.split('@')[0];
    navActions.innerHTML = `
      <button class="btn-vender" onclick="window.location='publicar.html'">+ Vender</button>
      <button class="btn-login" onclick="window.location='panel.html'">@${usuario}</button>
    `;
  } else {
    navActions.innerHTML = `
      <button class="btn-login" onclick="window.location='login.html'">Iniciar sesión</button>
      <button class="btn-vender" onclick="window.location='publicar.html'">+ Vender</button>
    `;
  }
}

// ── Proteger rutas ──
function checkProtection(session) {
  if (PROTECTED_PAGES.includes(currentPage) && !session) {
    window.location.href = 'login.html?from=' + currentPage;
    return false;
  }
  // Si ya está logueado y va a login/registro, redirigir a panel
  if (session && (currentPage === 'login.html' || currentPage === 'registro.html')) {
    window.location.href = 'panel.html';
    return false;
  }
  return true;
}

// ── Init: sesión actual + escuchar cambios ──
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Sesión actual
  const { data: { session } } = await sb.auth.getSession();

  // 2. Proteger si corresponde
  if (!checkProtection(session)) return;

  // 3. Actualizar nav inmediatamente
  updateNav(session);

  // 4. Escuchar cambios en tiempo real (login, logout, refresh)
  sb.auth.onAuthStateChange((_event, newSession) => {
    updateNav(newSession);
    // Si expira sesión en página protegida, redirigir
    if (!newSession && PROTECTED_PAGES.includes(currentPage)) {
      window.location.href = 'login.html?from=' + currentPage;
    }
  });
});

// ── Logout global ──
async function logout() {
  await sb.auth.signOut();
  window.location.href = 'index.html';
}
