// ============================================
// GIFTLATAM — Reset Password Flow
// Usado en: reset-password-request.html y reset-password.html
// Requiere: js/supabase.js cargado antes
// ============================================

// ── PASO 1: Enviar email de recuperación ──
async function enviarReset() {
  const emailInput = document.getElementById('emailInput');
  const alertErr   = document.getElementById('alertErr');
  const btn        = document.getElementById('btnEnviar');

  alertErr.classList.remove('show');
  const email = emailInput.value.trim();

  if (!email) {
    emailInput.classList.add('error');
    alertErr.textContent = '❌ Ingresá tu email';
    alertErr.classList.add('show');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailInput.classList.add('error');
    alertErr.textContent = '❌ El email no es válido';
    alertErr.classList.add('show');
    return;
  }

  emailInput.classList.remove('error');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://giftlatam12.vercel.app/reset-password.html'
  });

  if (error) {
    alertErr.textContent = '❌ ' + error.message;
    alertErr.classList.add('show');
    btn.disabled = false;
    btn.textContent = '📧 Enviar link de recuperación';
    return;
  }

  // Éxito: mostrar estado de email enviado
  document.getElementById('formState').style.display   = 'none';
  document.getElementById('successState').style.display = 'block';
  document.getElementById('emailSent').textContent      = email;
}

// Enter key en el input
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('emailInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') enviarReset();
    });
    input.focus();
  }
});
