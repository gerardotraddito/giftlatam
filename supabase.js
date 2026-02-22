// ============================================
// GIFTLATAM — Cliente Supabase centralizado
// v2 — cliente global `sb` disponible en todas las páginas
// ============================================
(function() {
  const SUPABASE_URL = 'https://goibtxrhabumlrqeykwx.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_4003pT5xt2QBDYnj1G9vgA_IQoC77At';

  // La librería CDN expone window.supabase con createClient
  window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
})();
