import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyem95bGpmeHhhcmthdWpocnBpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzk3MTY5MCwiZXhwIjoyMDg5NTQ3NjkwfQ.XPxMTurueJs4jJLxlVsLdUOFF2oMR8XbYRgeRDQbd5w';

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.warn('VITE_SUPABASE_URL inválida ou ausente no backend. Usando URL de fallback.');
  supabaseUrl = 'https://frzoyljfxxarkaujhrpi.supabase.co';
}

if (!supabaseServiceKey || supabaseServiceKey === 'YOUR_SUPABASE_SERVICE_ROLE_KEY') {
  console.warn('SUPABASE_SERVICE_ROLE_KEY inválida ou ausente no backend.');
  supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';
}

// O uso da SERVICE_ROLE_KEY garante que o backend ignore o RLS 
// e tenha permissão total para criar usuários e gravar na tabela.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});
