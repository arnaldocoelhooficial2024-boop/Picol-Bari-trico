import { createClient } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback para a URL correta caso a variável de ambiente não tenha sido carregada ou esteja com o valor placeholder
if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.warn('VITE_SUPABASE_URL inválida ou ausente. Usando URL de fallback.');
  supabaseUrl = 'https://frzoyljfxxarkaujhrpi.supabase.co';
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn('VITE_SUPABASE_ANON_KEY inválida ou ausente.');
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'; // Placeholder seguro para não quebrar a inicialização
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
