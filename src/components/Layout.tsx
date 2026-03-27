import { Outlet, NavLink, Link } from 'react-router-dom';
import { Home, Calendar, Utensils, Gift, User } from 'lucide-react';
import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { Logo } from './Logo';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans selection:bg-brand-200 selection:text-brand-900 pb-32 transition-colors duration-300 relative">
      {/* Premium Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
      </div>
      
      {/* Subtle Gradient Orbs */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none z-0"></div>

      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 px-6 py-3 flex justify-between items-center z-30 border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300 shadow-sm">
        <Link to="/" className="flex items-center">
          <Logo className="w-40 h-auto" />
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/profile" className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-100 to-brand-50 dark:from-brand-900 dark:to-brand-800 border border-brand-200 dark:border-brand-700 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-sm shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95">
            <User size={18} />
          </Link>
        </div>
      </header>
      
      <main className="relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Outlet />
        </motion.div>
      </main>

      <div className="fixed bottom-6 left-4 right-4 z-40 pointer-events-none">
        <motion.nav 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.2 }}
          className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] rounded-3xl px-6 py-4 flex justify-between items-center pointer-events-auto max-w-md mx-auto transition-colors duration-300"
        >
          <NavItem to="/" icon={<Home size={22} strokeWidth={2.5} />} label="Início" />
          <NavItem to="/protocol" icon={<Calendar size={22} strokeWidth={2.5} />} label="Protocolo" />
          <NavItem to="/recipe" icon={<Utensils size={22} strokeWidth={2.5} />} label="Receitas" />
          <NavItem to="/bonus" icon={<Gift size={22} strokeWidth={2.5} />} label="Bônus" />
        </motion.nav>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex flex-col items-center gap-1.5 transition-all duration-300 ${
          isActive ? 'text-brand-600 dark:text-brand-400 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
        }`
      }
    >
      {({ isActive }) => (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center gap-1.5"
        >
          {icon}
          <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
          {isActive && (
            <motion.div
              layoutId="nav-indicator"
              className="absolute -bottom-2 w-1 h-1 rounded-full bg-brand-500 dark:bg-brand-400"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            />
          )}
        </motion.div>
      )}
    </NavLink>
  );
}
