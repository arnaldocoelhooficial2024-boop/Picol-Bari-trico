import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Flame, Trophy, ChevronRight, Sparkles, Target, Scale, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function Dashboard() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [goalWeight, setGoalWeight] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [userName, setUserName] = useState('Vencedora');
  const [challenge, setChallenge] = useState<string | null>(null);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('gm_onboarding_completed');
    if (!onboardingCompleted) {
      navigate('/onboarding');
      return;
    }

    const savedUser = localStorage.getItem('gm_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.name) setUserName(parsedUser.name);
      if (parsedUser.challenge) setChallenge(parsedUser.challenge);
    }

    const savedCompleted = localStorage.getItem('completedDays');
    if (savedCompleted) {
      const completedArray = JSON.parse(savedCompleted);
      setProgress(completedArray.length);
      
      let currentStreak = 0;
      for (let i = 1; i <= 30; i++) {
        if (completedArray.includes(i)) {
          currentStreak++;
        } else {
          break;
        }
      }
      setStreak(currentStreak);
    }

    // Health data
    const savedHistory = localStorage.getItem('gm_weight_history');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      if (history.length > 0) {
        setCurrentWeight(history[history.length - 1].weight);
      }
    }
    
    const savedGoal = localStorage.getItem('gm_goal_weight');
    if (savedGoal) setGoalWeight(parseFloat(savedGoal));

    const savedHeight = localStorage.getItem('gm_height');
    if (savedHeight) setHeight(parseFloat(savedHeight));
  }, []);

  const handleCheckIn = () => {
    const savedCompleted = localStorage.getItem('completedDays');
    let completedArray: number[] = savedCompleted ? JSON.parse(savedCompleted) : [];
    
    // Find the first uncompleted day
    let nextDay = 1;
    while (completedArray.includes(nextDay) && nextDay <= 30) {
      nextDay++;
    }

    if (nextDay <= 30) {
      completedArray.push(nextDay);
      localStorage.setItem('completedDays', JSON.stringify(completedArray));
      setProgress(completedArray.length);
      
      let currentStreak = 0;
      for (let i = 1; i <= 30; i++) {
        if (completedArray.includes(i)) {
          currentStreak++;
        } else {
          break;
        }
      }
      setStreak(currentStreak);
    }
  };

  const kilosToLose = currentWeight && goalWeight ? (currentWeight - goalWeight).toFixed(1) : null;
  const imc = currentWeight && height ? (currentWeight / ((height / 100) * (height / 100))).toFixed(1) : null;

  const getImcCategory = (imcValue: number) => {
    if (imcValue < 18.5) return { label: 'Abaixo do peso', color: 'text-blue-500 dark:text-blue-400' };
    if (imcValue < 24.9) return { label: 'Peso normal', color: 'text-emerald-500 dark:text-emerald-400' };
    if (imcValue < 29.9) return { label: 'Sobrepeso', color: 'text-amber-500 dark:text-amber-400' };
    if (imcValue < 34.9) return { label: 'Obesidade I', color: 'text-orange-500 dark:text-orange-400' };
    if (imcValue < 39.9) return { label: 'Obesidade II', color: 'text-rose-500 dark:text-rose-400' };
    return { label: 'Obesidade III', color: 'text-red-600 dark:text-red-500' };
  };

  const imcCategory = imc ? getImcCategory(parseFloat(imc)) : null;

  const getPersonalizedTip = () => {
    switch (challenge) {
      case 'sweets':
        return {
          title: 'Vontade de doce?',
          desc: 'Lembre-se: o Picolé Bariátrico é seu aliado. Tome um agora mesmo para saciar a vontade!',
          icon: <Sparkles size={20} className="text-amber-400" />
        };
      case 'night':
        return {
          title: 'Fome noturna?',
          desc: 'Tome seu Picolé Bariátrico 30 minutos antes do horário que a fome costuma atacar.',
          icon: <Sparkles size={20} className="text-indigo-400" />
        };
      case 'emotional':
        return {
          title: 'Ansiedade batendo?',
          desc: 'Respire fundo. Use o botão SOS acima se precisar de ajuda para se acalmar.',
          icon: <Sparkles size={20} className="text-blue-400" />
        };
      case 'portions':
        return {
          title: 'Controle as porções',
          desc: 'O Picolé Bariátrico vai te ajudar a se sentir cheia mais rápido. Confie no processo.',
          icon: <Sparkles size={20} className="text-emerald-400" />
        };
      default:
        return null;
    }
  };

  const tip = getPersonalizedTip();

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 space-y-8 max-w-md mx-auto pb-24"
    >
      <motion.header variants={itemVariants} className="flex justify-between items-start mt-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">Olá, {userName}!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pronta para continuar sua transformação?</p>
        </div>
        <Link to="/sos" className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-500/30 transition-colors shadow-sm border border-rose-200 dark:border-rose-500/30">
          <ShieldAlert size={24} />
        </Link>
      </motion.header>

      {tip && (
        <motion.section 
          variants={itemVariants}
          className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-4 flex items-start gap-4 shadow-lg border border-slate-700"
        >
          <div className="mt-1 bg-white/10 p-2 rounded-full">
            {tip.icon}
          </div>
          <div>
            <h4 className="font-bold text-sm mb-1">{tip.title}</h4>
            <p className="text-slate-300 text-xs leading-relaxed">{tip.desc}</p>
          </div>
        </motion.section>
      )}

      {/* Premium Progress Widget */}
      <motion.section 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-brand-600 to-brand-800 text-white rounded-[2rem] p-8 shadow-xl shadow-brand-900/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex justify-between items-start mb-8">
          <div className="space-y-1">
            <p className="text-brand-200 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1.5">
              <Target size={12} /> Progresso do Protocolo
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-bold tracking-tighter font-serif leading-none text-white">{progress}</span>
              <span className="text-brand-200 text-lg font-medium">/ 30 dias</span>
            </div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex flex-col items-center bg-white/10 px-4 py-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner cursor-default"
          >
            <Flame className="text-orange-300 mb-1 drop-shadow-md" size={24} />
            <span className="font-bold text-xl leading-none text-white">{streak}</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-brand-200 mt-1">Fogo</span>
          </motion.div>
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between text-xs font-medium text-brand-200 mb-2 px-1">
            <span>Início</span>
            <span>Meta (30d)</span>
          </div>
          <div className="h-3 bg-brand-900/50 rounded-full overflow-hidden shadow-inner border border-brand-800/50">
            <motion.div 
              className="h-full bg-white rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${(progress / 30) * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Weight Tracking Widget */}
      <motion.section variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
              <Scale className="text-emerald-500" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white font-serif">Seu Progresso</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Acompanhe suas medidas</p>
            </div>
          </div>
          <Link to="/profile" className="text-brand-600 dark:text-brand-400 text-sm font-bold flex items-center gap-1 hover:underline">
            Atualizar <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 transition-colors hover:border-brand-200 dark:hover:border-brand-700">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Peso Atual</p>
            <p className="font-serif text-2xl font-bold text-slate-800 dark:text-white">
              {currentWeight || '--'} <span className="text-sm text-slate-500">kg</span>
            </p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 transition-colors hover:border-brand-200 dark:hover:border-brand-700">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Meta</p>
            <p className="font-serif text-2xl font-bold text-slate-800 dark:text-white">
              {goalWeight || '--'} <span className="text-sm text-slate-500">kg</span>
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-brand-50 dark:bg-brand-900/20 rounded-2xl p-4 border border-brand-100 dark:border-brand-800/50 transition-colors hover:border-brand-300 dark:hover:border-brand-600">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-1">A Perder</p>
            <p className="font-serif text-xl font-bold text-brand-700 dark:text-brand-300">
              {kilosToLose ? `${kilosToLose} kg` : '--'}
            </p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-800/50 transition-colors hover:border-indigo-300 dark:hover:border-indigo-600">
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">Seu IMC</p>
            <div className="flex items-baseline gap-2">
              <p className="font-serif text-xl font-bold text-indigo-700 dark:text-indigo-300">
                {imc || '--'}
              </p>
              {imcCategory && (
                <span className={`text-[10px] font-bold uppercase tracking-widest ${imcCategory.color}`}>
                  {imcCategory.label}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Action Buttons */}
      <motion.section variants={itemVariants} className="grid grid-cols-2 gap-4">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCheckIn}
          disabled={progress >= 30}
          className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 shadow-sm hover:border-brand-200 dark:hover:border-brand-700 hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 dark:from-brand-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-14 h-14 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10 border border-brand-100 dark:border-brand-800">
            <CheckCircle2 className="text-brand-600 dark:text-brand-400" size={28} strokeWidth={2} />
          </div>
          <span className="font-bold text-slate-700 dark:text-slate-200 text-sm relative z-10">Check-in Diário</span>
        </motion.button>
        
        <Link to="/protocol" className="block">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-300 group relative overflow-hidden h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 dark:from-slate-700/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10 border border-slate-100 dark:border-slate-600">
              <Trophy className="text-slate-600 dark:text-slate-400" size={28} strokeWidth={2} />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm relative z-10">Ver Protocolo</span>
          </motion.div>
        </Link>
      </motion.section>

      {/* Accelerators Banner */}
      <motion.section 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-brand-600 to-pink-600 text-white rounded-[2rem] p-6 flex items-center justify-between shadow-lg shadow-brand-900/20 relative overflow-hidden group"
      >
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl group-hover:bg-brand-500/30 transition-colors duration-500"></div>
        <div className="relative z-10">
          <h3 className="font-bold text-xl mb-1 font-serif flex items-center gap-2">
            <Sparkles size={20} className="text-brand-400" /> Aceleradores
          </h3>
          <p className="text-slate-400 text-sm">Potencialize seus resultados hoje.</p>
        </div>
        <Link to="/bonus" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors relative z-10 backdrop-blur-md border border-white/10 group-hover:scale-110">
          <ChevronRight size={20} />
        </Link>
      </motion.section>
    </motion.div>
  );
}
