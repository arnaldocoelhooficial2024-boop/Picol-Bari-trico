import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export function AcessoNegado() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 text-center">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6"
      >
        <ShieldAlert className="text-red-600 dark:text-red-500" size={40} />
      </motion.div>
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4"
      >
        Acesso Pendente
      </motion.h1>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-slate-600 dark:text-slate-400 max-w-md mb-8 leading-relaxed"
      >
        Seu pagamento ainda está sendo processado ou não foi aprovado. 
        Assim que a Cakto confirmar o pagamento, seu acesso será liberado automaticamente.
      </motion.p>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Link 
          to="/login" 
          className="bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl transition-all inline-block shadow-lg shadow-brand-600/20"
        >
          Voltar para o Login
        </Link>
      </motion.div>
    </div>
  );
}
