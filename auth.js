// ============================================
// GIFTLATAM — Auth global v3
// Fix: logout loop, signOut correcto, 
//      flag para evitar doble redirección
// ============================================

const PROTECTED_PAGES = ['publicar.html', 'panel.html', 'pago.html', 'disputas.html'];
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Flag para evitar que onAuthStateChange dispare redirect durante logout
let isLoggingOut = false;

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
  // Página protegida sin sesión → login
  if (PROTECTED_PAGES.includes(currentPage) && !session) {
    window.location.href = 'login.html?from=' + currentPage;
    return false;
  }
  // Ya logueado en login/registro → panel
  if (session && (currentPage === 'login.html' || currentPage === 'registro.html')) {
    window.location.href = 'panel.html';
    return false;
  }
  return true;
}

// ── Init ──
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await sb.auth.getSession();

  if (!checkProtection(session)) return;

  updateNav(session);

  // Escuchar cambios — pero ignorar si estamos haciendo logout
  sb.auth.onAuthStateChange((_event, newSession) => {
    if (isLoggingOut) return;
    updateNav(newSession);
    if (!newSession && PROTECTED_PAGES.includes(currentPage)) {
      window.location.href = 'login.html';
    }
  });
});

// ── Logout global ──
async function logout() {
  isLoggingOut = true;           // Bloquear onAuthStateChange
  await sb.auth.signOut();       // Destruir sesión en Supabase
  window.location.href = 'index.html'; // Redirigir SIN pasar por login
}
