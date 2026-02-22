// ============================================
// GIFTLATAM — Auth global
// Maneja sesión, nav dinámico, protección de rutas
// Requiere: supabase.js cargado antes
// ============================================

// Páginas que requieren login obligatorio
const PROTECTED_PAGES = ['publicar.html', 'panel.html', 'pago.html', 'disputas.html'];

// Página actual
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// ── Inicializar auth en cada página ──
async function initAuth() {
  const { data: { session } } = await sb.auth.getSession();

  // Redirigir si página protegida y no hay sesión
  if (PROTECTED_PAGES.includes(currentPage) && !session) {
    window.location.href = 'login.html?from=' + currentPage;
    return null;
  }

  // Actualizar nav con estado real
  updateNav(session);

  return session;
}

// ── Actualizar nav según sesión ──
function updateNav(session) {
  // Nav actions (desktop + mobile)
  const navActions = document.getElementById('navActions');
  if (!navActions) return;

  if (session) {
    const meta = session.user.user_metadata || {};
    const usuario = meta.usuario || meta.nombre || session.user.email.split('@')[0];
    navActions.innerHTML = `
      <span style="font-size:12px;color:#888;display:none" class="hide-mobile">
        <strong style="color:#f0f0f0">${usuario}</strong>
      </span>
      <button class="btn-vender" onclick="window.location='publicar.html'">+ Vender</button>
      <button class="btn-login" onclick="window.location='panel.html'">Mi panel</button>
    `;
  } else {
    navActions.innerHTML = `
      <button class="btn-login" onclick="window.location='login.html'">Iniciar sesión</button>
      <button class="btn-vender" onclick="window.location='publicar.html'">+ Vender</button>
    `;
  }
}

// ── Logout global ──
async function logout() {
  await sb.auth.signOut();
  window.location.href = 'index.html';
}

// ── Cargar datos del perfil para panel ──
async function loadUserProfile(userId) {
  const { data } = await sb
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}

// ── Ejecutar al cargar cualquier página ──
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});
