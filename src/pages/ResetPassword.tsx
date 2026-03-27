import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { supabase } from '../lib/supabase';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Check if using placeholder key
        if (import.meta.env.VITE_SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY' || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          throw new Error('Supabase não configurado. Por favor, configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no painel de Secrets.');
        }

        // 1) CAPTURAR TOKEN CORRETAMENTE
        const hash = window.location.hash;
        
        if (hash) {
          // Remove o '#' inicial para usar o URLSearchParams
          const hashParams = new URLSearchParams(hash.substring(1));
          const access_token = hashParams.get('access_token');
          const refresh_token = hashParams.get('refresh_token');
          const type = hashParams.get('type');

          if (access_token && refresh_token && type === 'recovery') {
            // 2) INICIALIZAR SESSÃO COM O TOKEN
            const { error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token
            });

            if (sessionError) {
              throw new Error('Link inválido ou expirado');
            }

            // 8) SEGURANÇA: limpar token após uso (remove o hash da URL)
            window.history.replaceState(null, '', window.location.pathname);
            setIsSessionValid(true);
          } else {
            throw new Error('Link inválido ou expirado');
          }
        } else {
          // Fallback: verifica se já existe uma sessão ativa (caso o usuário recarregue a página)
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsSessionValid(true);
          } else {
            throw new Error('Link inválido ou expirado');
          }
        }
      } catch (err: any) {
        console.error('Erro de sessão:', err);
        if (err.message?.includes('Supabase não configurado') || err.message?.includes('Invalid API key')) {
          setError('Erro de configuração: As chaves do Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) não foram configuradas corretamente no painel de Secrets.');
        } else {
          setError('Link inválido ou expirado');
        }
        setIsSessionValid(false);
      } finally {
        setIsCheckingSession(false);
      }
    };

    initializeSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 3) VALIDAÇÕES DO FORMULÁRIO
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if using placeholder key
      if (import.meta.env.VITE_SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY' || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Supabase não configurado. Por favor, configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no painel de Secrets.');
      }

      // 4) ATUALIZAR SENHA
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        throw new Error('Erro ao redefinir senha');
      }

      // Sucesso
      setSuccess(true);
      
      // 5) LOGIN AUTOMÁTICO + REDIRECIONAMENTO
      setTimeout(() => {
        // Redireciona para a raiz (Dashboard) forçando o recarregamento para limpar estados
        window.location.href = '/';
      }, 2000);

    } catch (err: any) {
      console.error('Erro ao atualizar senha:', err);
      if (err.message?.includes('Supabase não configurado') || err.message?.includes('Invalid API key')) {
        setError('Erro de configuração: As chaves do Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) não foram configuradas corretamente no painel de Secrets.');
      } else {
        setError(err.message || 'Erro ao redefinir senha');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Tela de Loading inicial (verificando o token)
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-slate-900 dark:text-white relative overflow-hidden">
        {/* Premium Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&q=80" 
            alt="Premium Fitness Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-900/60 to-slate-900/80 dark:from-slate-900/60 dark:via-slate-900/80 dark:to-slate-900/95"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-white mb-4 drop-shadow-md" />
          <p className="text-slate-200 font-medium drop-shadow">Validando link de segurança...</p>
        </div>
      </div>
    );
  }

  // Tela de Erro (Token inválido ou expirado)
  if (!isSessionValid && !success) {
    return (
      <div className="min-h-screen flex flex-col justify-center p-6 text-slate-900 dark:text-white relative overflow-hidden">
        {/* Premium Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&q=80" 
            alt="Premium Fitness Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-900/60 to-slate-900/80 dark:from-slate-900/60 dark:via-slate-900/80 dark:to-slate-900/95"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-auto bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/10 text-center space-y-6 relative z-10"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-500/20 backdrop-blur-md rounded-full flex items-center justify-center text-red-100 border border-red-500/30">
              <Lock size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white drop-shadow-md">Link inválido ou expirado</h2>
          <p className="text-slate-200 drop-shadow-sm">
            O link de recuperação que você acessou não é mais válido. Por favor, solicite um novo link na tela de login.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all shadow-xl"
          >
            Voltar para o Login
          </button>
        </motion.div>
      </div>
    );
  }

  // Tela de Sucesso
  if (success) {
    return (
      <div className="min-h-screen flex flex-col justify-center p-6 text-slate-900 dark:text-white transition-colors duration-300 relative overflow-hidden">
        {/* Premium Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&q=80" 
            alt="Premium Fitness Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-900/60 to-slate-900/80 dark:from-slate-900/60 dark:via-slate-900/80 dark:to-slate-900/95"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-auto bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/10 text-center space-y-6 relative z-10"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-500/20 backdrop-blur-md rounded-full flex items-center justify-center text-emerald-100 border border-emerald-500/30">
              <CheckCircle2 size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white drop-shadow-md">Senha atualizada com sucesso</h2>
          <p className="text-slate-200 drop-shadow-sm">
            Você será redirecionado para o seu painel em instantes...
          </p>
          <Loader2 className="w-6 h-6 animate-spin text-white mx-auto mt-4 drop-shadow" />
        </motion.div>
      </div>
    );
  }

  // Formulário de Nova Senha
  return (
    <div className="min-h-screen flex flex-col justify-center p-6 text-slate-900 dark:text-white transition-colors duration-300 relative overflow-hidden">
      {/* Premium Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&q=80" 
          alt="Premium Fitness Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-900/60 to-slate-900/80 dark:from-slate-900/60 dark:via-slate-900/80 dark:to-slate-900/95"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full mx-auto space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <motion.div variants={itemVariants} className="flex justify-center mb-6 drop-shadow-lg">
            <Logo className="w-64 h-auto text-white" />
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-3xl font-serif font-bold tracking-tight text-white drop-shadow-md">Criar Nova Senha</motion.h1>
          <motion.p variants={itemVariants} className="text-slate-200 text-sm drop-shadow">
            Digite sua nova senha de acesso ao protocolo
          </motion.p>
        </div>

        <motion.form variants={itemVariants} onSubmit={handleResetPassword} className="space-y-5 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/10">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl text-sm text-red-100 text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-200 ml-1 drop-shadow-sm">Nova Senha</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-300 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Mínimo de 6 caracteres"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-200 ml-1 drop-shadow-sm">Confirmar Nova Senha</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-300 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Repita a senha"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all shadow-xl mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <><Loader2 size={18} className="animate-spin" /> Salvando...</>
            ) : (
              <>Salvar nova senha <ArrowRight size={18} /></>
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
