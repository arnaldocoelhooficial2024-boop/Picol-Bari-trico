import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, KeyRound } from 'lucide-react';
import { Logo } from '../components/Logo';
import { supabase } from '../lib/supabase';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError('E-mail ou senha incorretos. Se for seu primeiro acesso, clique em "Primeiro acesso / Criar senha".');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Por favor, digite seu e-mail da compra no campo acima primeiro.');
      return;
    }

    setIsResetting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccessMessage('Enviamos um link para seu e-mail. Acesse sua caixa de entrada para criar sua senha.');
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'Erro ao enviar e-mail de recuperação. Verifique se o e-mail está correto.');
    } finally {
      setIsResetting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

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
        {/* Dark/Light Gradient Overlay for readability */}
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
          <motion.h1 variants={itemVariants} className="text-3xl font-serif font-bold tracking-tight text-white drop-shadow-md">Bem-vinda de volta</motion.h1>
          <motion.p variants={itemVariants} className="text-slate-200 text-sm drop-shadow">Acesse seu protocolo Picolé Bariátrico</motion.p>
        </div>

        {/* Glassmorphism Card */}
        <motion.div variants={itemVariants} className="space-y-5 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/10">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl text-sm text-red-100 text-center"
            >
              {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-xl text-sm text-emerald-100 text-center"
            >
              {successMessage}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-200 ml-1 drop-shadow-sm">E-mail da Compra</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-300 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-200 ml-1 drop-shadow-sm">Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-300 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={handleResetPassword}
                disabled={isResetting}
                className="text-xs font-bold text-slate-300 hover:text-white transition-colors drop-shadow-sm"
              >
                Esqueci minha senha
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all shadow-xl mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Entrando...' : (
                <>Entrar <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-slate-300 backdrop-blur-sm">ou</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleResetPassword}
            disabled={isResetting}
            className="w-full bg-gradient-to-r from-brand-500/80 to-pink-500/80 backdrop-blur-md border border-white/20 text-white py-3 px-4 rounded-2xl font-bold flex flex-col items-center justify-center gap-1 hover:from-brand-500 hover:to-pink-500 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isResetting ? 'Enviando link...' : (
              <>
                <div className="flex items-center gap-2">
                  <span>Primeiro Acesso</span>
                  <KeyRound size={16} className="shrink-0" />
                </div>
                <span className="text-[10px] font-normal opacity-80">Criar senha</span>
              </>
            )}
          </motion.button>
        </motion.div>

        <motion.p variants={itemVariants} className="text-center text-sm text-slate-300 drop-shadow-sm">
          Ainda não comprou?{' '}
          <Link to="/register" className="font-bold text-white hover:underline drop-shadow-md">
            Garantir acesso
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
