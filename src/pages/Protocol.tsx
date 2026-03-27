import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, CheckCircle, Clock, Droplet, Brain, Sparkles, Info, Check } from 'lucide-react';
import { appData } from '../data/appData';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function Protocol() {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    const saved = localStorage.getItem('completedDays');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleDayCompletion = (day: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedDays(prev => {
      const newCompleted = prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day];
      localStorage.setItem('completedDays', JSON.stringify(newCompleted));
      return newCompleted;
    });
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 space-y-8 max-w-md mx-auto pb-24"
    >
      <motion.header variants={itemVariants} className="space-y-2 mt-2">
        <h2 className="text-4xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">Protocolo</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Seu mapa diário para o emagrecimento.</p>
      </motion.header>

      {/* Protocol Explanation Card */}
      <motion.section 
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-brand-900/20 relative overflow-hidden text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 shadow-inner"
            >
              <Sparkles className="text-brand-200" size={28} />
            </motion.div>
            <div>
              <h3 className="font-bold font-serif text-2xl leading-tight text-white drop-shadow-sm">{appData.protocol_explanation.title}</h3>
              <p className="text-brand-200 text-sm font-medium mt-1">O segredo da saciedade</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 shadow-sm">
              <h4 className="text-brand-100 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <CheckCircle size={14} className="text-brand-300" />
                Como Consumir
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-brand-500/50 flex items-center justify-center mb-3 border border-brand-400/30">
                    <span className="text-lg font-bold text-white">1</span>
                  </div>
                  <p className="text-xs font-medium text-white/90 leading-relaxed">
                    Prepare o <strong className="text-white">Picolé Bariátrico</strong>
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-brand-500/50 flex items-center justify-center mb-3 border border-brand-400/30">
                    <span className="text-lg font-bold text-white">2</span>
                  </div>
                  <p className="text-xs font-medium text-white/90 leading-relaxed">
                    Coma <strong className="text-white">1 picolé 30 min antes do almoço</strong>
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-brand-500/50 flex items-center justify-center mb-3 border border-brand-400/30">
                    <span className="text-lg font-bold text-white">3</span>
                  </div>
                  <p className="text-xs font-medium text-white/90 leading-relaxed">
                    Coma <strong className="text-white">1 picolé 30 min antes do jantar</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm p-5 rounded-3xl border border-white/10 shadow-inner flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-brand-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Info size={16} className="text-brand-200" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-300 block mb-1">Por que funciona?</span>
                <p className="text-sm text-white/90 leading-relaxed font-medium">
                  {appData.protocol_explanation.mechanism}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div variants={containerVariants} className="space-y-4">
        <motion.h3 variants={itemVariants} className="font-serif font-bold text-xl text-slate-800 dark:text-slate-200 px-2 mt-8 mb-4">Sua Jornada de 30 Dias</motion.h3>
        {appData.protocol.map((day) => (
          <motion.div variants={itemVariants} key={day.day}>
            <DayCard 
              data={day} 
              isExpanded={expandedDay === day.day}
              isCompleted={completedDays.includes(day.day)}
              onToggle={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
              onToggleCompletion={(e) => toggleDayCompletion(day.day, e)}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

const DayCard: React.FC<{ 
  data: any, 
  isExpanded: boolean, 
  isCompleted: boolean,
  onToggle: () => void,
  onToggleCompletion: (e: React.MouseEvent) => void
}> = ({ data, isExpanded, isCompleted, onToggle, onToggleCompletion }) => {
  return (
    <motion.div 
      layout
      className={`bg-white dark:bg-slate-800 rounded-[2rem] border transition-colors duration-300 overflow-hidden ${isExpanded ? 'border-brand-300 dark:border-brand-600 shadow-lg shadow-brand-500/10 dark:shadow-brand-900/20' : isCompleted ? 'border-emerald-200 dark:border-emerald-800/50 shadow-sm' : 'border-slate-100 dark:border-slate-700 shadow-sm hover:border-brand-200 dark:hover:border-brand-700'}`}
    >
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <div className="flex items-center gap-5">
          <motion.div 
            layout
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl font-serif transition-colors relative ${isCompleted ? 'bg-emerald-500 text-white shadow-inner' : isExpanded ? 'bg-brand-600 dark:bg-brand-500 text-white shadow-inner' : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-600'}`}
          >
            <AnimatePresence mode="wait">
              {isCompleted ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <Check size={28} strokeWidth={3} />
                </motion.div>
              ) : (
                <motion.span
                  key="number"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {data.day}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
          <div>
            <h3 className={`font-bold text-lg font-serif transition-colors ${isCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{data.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-medium">{data.description}</p>
          </div>
        </div>
        <motion.div 
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0 ${isExpanded ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' : 'bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 space-y-6">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-6"></div>
              
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex gap-4 items-start bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700"
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-sm border border-slate-100 dark:border-slate-700">
                  <Clock className="text-brand-600 dark:text-brand-400" size={20} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-[10px] uppercase tracking-widest mb-1.5">Consumo do Picolé</h4>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">{data.gelatina}</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20">
                  <Droplet className="text-blue-500 dark:text-blue-400" size={20} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-[10px] uppercase tracking-widest mb-1.5">Dica de Dieta</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{data.diet_tip}</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-500/20">
                  <Brain className="text-purple-500 dark:text-purple-400" size={20} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-[10px] uppercase tracking-widest mb-1.5">Comportamento</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{data.behavior_tip}</p>
                </div>
              </motion.div>

              <motion.button 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onToggleCompletion}
                className={`w-full mt-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${isCompleted ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-emerald-500/10 hover:bg-emerald-200 dark:hover:bg-emerald-900/50' : 'bg-gradient-to-r from-brand-600 to-pink-600 text-white hover:from-brand-700 hover:to-pink-700 shadow-brand-600/20 dark:shadow-brand-900/20'}`}
              >
                <CheckCircle size={20} strokeWidth={2} className={isCompleted ? "text-emerald-600 dark:text-emerald-400" : ""} />
                {isCompleted ? 'Concluído' : 'Marcar como Concluído'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
