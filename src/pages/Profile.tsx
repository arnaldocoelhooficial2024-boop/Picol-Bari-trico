import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Settings, LogOut, Moon, Sun, Award, ChevronRight, Bell, Shield, HelpCircle, Check, Activity, Target, Scale, Ruler, Edit2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

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

export function Profile() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [streak, setStreak] = useState(0);
  
  // Health Data
  const [weightHistory, setWeightHistory] = useState<{date: string, weight: number}[]>([]);
  const [currentWeight, setCurrentWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [tempWeight, setTempWeight] = useState('');
  const [tempHeight, setTempHeight] = useState('');
  const [tempGoal, setTempGoal] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Check dark mode
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
    
    // Get user
    const userData = localStorage.getItem('gm_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setTempName(parsedUser.name);
    } else {
      setUser({ name: 'Vencedora', email: 'aluna@picolebariatrico.com' });
      setTempName('Vencedora');
    }

    // Get streak
    const savedCompleted = localStorage.getItem('completedDays');
    if (savedCompleted) {
      const completedArray = JSON.parse(savedCompleted);
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

    // Get health data
    const savedHistory = localStorage.getItem('gm_weight_history');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setWeightHistory(history);
      if (history.length > 0) {
        setCurrentWeight(history[history.length - 1].weight.toString());
      }
    }
    
    setHeight(localStorage.getItem('gm_height') || '');
    setGoalWeight(localStorage.getItem('gm_goal_weight') || '');
    setPhotoUrl(localStorage.getItem('gm_photo_url') || null);
  }, []);

  const handleSaveHealth = () => {
    if (tempWeight && !isNaN(parseFloat(tempWeight))) {
      const weightNum = parseFloat(tempWeight);
      setCurrentWeight(weightNum.toString());
      
      // Add to history
      const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const newHistory = [...weightHistory];
      
      // Update today's weight if already exists, else push
      const todayIndex = newHistory.findIndex(entry => entry.date === today);
      if (todayIndex >= 0) {
        newHistory[todayIndex].weight = weightNum;
      } else {
        newHistory.push({ date: today, weight: weightNum });
      }
      
      setWeightHistory(newHistory);
      localStorage.setItem('gm_weight_history', JSON.stringify(newHistory));
    }

    if (tempHeight && !isNaN(parseFloat(tempHeight))) {
      setHeight(tempHeight);
      localStorage.setItem('gm_height', tempHeight);
    }

    if (tempGoal && !isNaN(parseFloat(tempGoal))) {
      setGoalWeight(tempGoal);
      localStorage.setItem('gm_goal_weight', tempGoal);
    }

    setIsEditingHealth(false);
  };

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gm_user');
    navigate('/login');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoUrl(base64String);
        localStorage.setItem('gm_photo_url', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveName = () => {
    if (user && tempName.trim()) {
      const updatedUser = { ...user, name: tempName };
      setUser(updatedUser);
      localStorage.setItem('gm_user', JSON.stringify(updatedUser));
    }
    setIsEditingName(false);
  };

  // Calculate IMC
  let imc = 0;
  let imcCategory = '';
  if (currentWeight && height) {
    const w = parseFloat(currentWeight);
    const h = parseFloat(height) / 100; // Assuming height is in cm
    if (h > 0) {
      imc = w / (h * h);
      if (imc < 18.5) imcCategory = 'Abaixo do peso';
      else if (imc < 24.9) imcCategory = 'Peso normal';
      else if (imc < 29.9) imcCategory = 'Sobrepeso';
      else if (imc < 34.9) imcCategory = 'Obesidade Grau I';
      else if (imc < 39.9) imcCategory = 'Obesidade Grau II';
      else imcCategory = 'Obesidade Grau III';
    }
  }

  // Calculate weight lost and progress
  let weightLost = '0.0';
  let progressPercentage = 0;
  if (weightHistory.length > 0) {
    const initialWeight = weightHistory[0].weight;
    const current = weightHistory[weightHistory.length - 1].weight;
    weightLost = (initialWeight - current).toFixed(1);
    // if negative, it means gained weight, but let's just show it as is or 0
    if (parseFloat(weightLost) < 0) weightLost = '0.0';

    if (goalWeight && !isNaN(parseFloat(goalWeight))) {
      const goal = parseFloat(goalWeight);
      if (initialWeight > goal) {
        progressPercentage = ((initialWeight - current) / (initialWeight - goal)) * 100;
        if (progressPercentage > 100) progressPercentage = 100;
        if (progressPercentage < 0) progressPercentage = 0;
      }
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 px-6 pb-24"
    >
      <motion.header variants={itemVariants} className="flex justify-between items-center mb-6 mt-2">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Perfil</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Gerencie sua conta e progresso</p>
        </div>
      </motion.header>

      {/* Guide Banner */}
      <motion.div variants={itemVariants} className="mb-6">
        <button 
          onClick={() => navigate('/guide')} 
          className="w-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-3xl p-5 flex items-center justify-between text-white shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <BookOpen size={24} className="text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg leading-tight">Como usar o app</h3>
              <p className="text-brand-100 text-sm mt-0.5">Aprenda a extrair o máximo</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-brand-200" />
        </button>
      </motion.div>

      {/* User Info Card */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-5"
      >
        <div className="relative">
          <label htmlFor="photo-upload" className="cursor-pointer block">
            <div className="w-20 h-20 bg-gradient-to-tr from-brand-600 to-brand-400 rounded-full flex items-center justify-center shadow-lg shadow-brand-500/20 text-white text-2xl font-serif font-bold italic shrink-0 overflow-hidden border-2 border-white dark:border-slate-800">
              {photoUrl ? (
                <img src={photoUrl} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'V'
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-600">
              <span className="text-[10px]">📷</span>
            </div>
          </label>
          <input 
            id="photo-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handlePhotoUpload}
          />
        </div>
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                autoFocus
              />
              <button 
                onClick={handleSaveName}
                className="p-1.5 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors"
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">{user?.name}</h2>
              <button 
                onClick={() => setIsEditingName(true)}
                className="text-slate-400 hover:text-brand-500 transition-colors"
              >
                <Edit2 size={14} />
              </button>
            </div>
          )}
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-2 truncate">{user?.email}</p>
          <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Award size={14} />
            Membro Premium
          </div>
        </div>
      </motion.div>

      {/* Gamification Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 text-center"
        >
          <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">{streak}</div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Dias Seguidos</div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 text-center"
        >
          <div className="text-3xl font-bold text-emerald-500 mb-1">{weightLost}</div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Kg Perdidos</div>
        </motion.div>
      </motion.div>

      {/* Health Tracking Section */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="text-brand-500" size={20} />
            Acompanhamento
          </h3>
          {!isEditingHealth ? (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setTempWeight(currentWeight);
                setTempHeight(height);
                setTempGoal(goalWeight);
                setIsEditingHealth(true);
              }}
              className="text-sm font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-4 py-2 rounded-full hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors"
            >
              Atualizar
            </motion.button>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveHealth}
              className="text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-pink-600 px-4 py-2 rounded-full hover:from-brand-700 hover:to-pink-700 transition-all flex items-center gap-1 shadow-md shadow-brand-600/20"
            >
              <Check size={16} /> Salvar
            </motion.button>
          )}
        </div>

        {isEditingHealth ? (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 mb-6"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Peso Atual (kg)</label>
              <div className="relative">
                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="number" 
                  step="0.1"
                  value={tempWeight}
                  onChange={(e) => setTempWeight(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                  placeholder="Ex: 75.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Altura (cm)</label>
                <div className="relative">
                  <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="number" 
                    value={tempHeight}
                    onChange={(e) => setTempHeight(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                    placeholder="Ex: 165"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Meta (kg)</label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="number" 
                    step="0.1"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                    placeholder="Ex: 65.0"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-700/50">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Peso</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{currentWeight || '--'} <span className="text-sm font-normal text-slate-500">kg</span></div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-700/50">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Meta</div>
              <div className="text-xl font-bold text-brand-600 dark:text-brand-400">{goalWeight || '--'} <span className="text-sm font-normal text-brand-500/70">kg</span></div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-700/50">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">IMC</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{imc > 0 ? imc.toFixed(1) : '--'}</div>
              {imcCategory && <div className="text-[10px] font-medium text-slate-500 mt-1 leading-tight">{imcCategory}</div>}
            </div>
          </motion.div>
        )}

        {/* Progress Bar */}
        {!isEditingHealth && goalWeight && currentWeight && (
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Progresso até a meta</span>
              <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-brand-500 to-pink-500 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Chart */}
        {weightHistory.length > 0 ? (
          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: isDarkMode ? '#94a3b8' : '#64748b' }} 
                  dy={10}
                />
                <YAxis 
                  domain={['dataMin - 2', 'dataMax + 2']} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: isDarkMode ? '#94a3b8' : '#64748b' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ color: '#ec4899', fontWeight: 'bold' }}
                />
                {goalWeight && !isNaN(parseFloat(goalWeight)) && (
                  <ReferenceLine y={parseFloat(goalWeight)} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Meta', fill: '#10b981', fontSize: 12 }} />
                )}
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#ec4899" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#ec4899', strokeWidth: 2, stroke: isDarkMode ? '#1e293b' : '#ffffff' }}
                  activeDot={{ r: 6, fill: '#ec4899', strokeWidth: 0 }}
                  name="Peso (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center px-4">
              Adicione seu peso atual para começar a acompanhar seu progresso no gráfico.
            </p>
          </div>
        )}
      </motion.div>

      {/* Settings List */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Preferências</h3>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          <motion.button 
            whileHover={{ backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(248, 250, 252, 1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between p-5 transition-colors"
          >
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <span className="font-medium">Modo Escuro</span>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-600'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </motion.button>

          <motion.button 
            whileHover={{ backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(248, 250, 252, 1)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between p-5 transition-colors"
          >
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <Bell size={20} />
              </div>
              <span className="font-medium">Notificações</span>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </motion.button>
        </div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Conta</h3>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          <motion.button 
            whileHover={{ backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(248, 250, 252, 1)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between p-5 transition-colors"
          >
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <User size={20} />
              </div>
              <span className="font-medium">Editar Perfil</span>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </motion.button>

          <motion.button 
            whileHover={{ backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(248, 250, 252, 1)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between p-5 transition-colors"
          >
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <Shield size={20} />
              </div>
              <span className="font-medium">Privacidade e Segurança</span>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </motion.button>

          <motion.button 
            whileHover={{ backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(248, 250, 252, 1)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between p-5 transition-colors"
          >
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <HelpCircle size={20} />
              </div>
              <span className="font-medium">Ajuda e Suporte</span>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </motion.button>
        </div>
      </motion.div>

      <motion.button 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 p-5 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-colors"
      >
        <LogOut size={20} />
        Sair da Conta
      </motion.button>

      <motion.div variants={itemVariants} className="text-center pb-8 pt-4">
        <p className="text-xs text-slate-400">Picolé Bariátrico v1.0.0</p>
      </motion.div>
    </motion.div>
  );
}
