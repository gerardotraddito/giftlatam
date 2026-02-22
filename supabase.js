// ============================================
// GIFTLATAM — Cliente Supabase centralizado
// Incluir en todas las páginas ANTES de auth.js
// ============================================

const SUPABASE_URL = 'https://goibtxrhabumlrqeykwx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4003pT5xt2QBDYnj1G9vgA_IQoC77At';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
