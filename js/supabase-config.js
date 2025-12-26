const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

let supabaseClient = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn('Supabase credentials not configured. Please add them to js/supabase-config.js');
}
