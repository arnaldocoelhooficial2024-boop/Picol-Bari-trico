import { useState, useEffect } from 'react';
import { Check, Flame, Droplets, Leaf, Moon, Zap, Clock, UtensilsCrossed, ChevronRight } from 'lucide-react';
import { appData } from '../data/appData';
import { motion, AnimatePresence } from 'motion/react';

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

export function Recipe() {
  const [recipes, setRecipes] = useState(appData.recipes);
  const [selectedRecipeId, setSelectedRecipeId] = useState(appData.recipes[0].id);
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('gm_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const challenge = parsedUser.challenge;
      
      if (challenge) {
        let sortedRecipes = [...appData.recipes];
        sortedRecipes.sort((a, b) => {
          const aTags = a.tags.join(' ').toLowerCase();
          const bTags = b.tags.join(' ').toLowerCase();
          
          let aScore = 0;
          let bScore = 0;
          
          if (challenge === 'sweets') {
            if (aTags.includes('glicêmico') || aTags.includes('antioxidante')) aScore++;
            if (bTags.includes('glicêmico') || bTags.includes('antioxidante')) bScore++;
          } else if (challenge === 'night') {
            if (aTags.includes('relaxante') || aTags.includes('sono')) aScore++;
            if (bTags.includes('relaxante') || bTags.includes('sono')) bScore++;
          } else if (challenge === 'portions') {
            if (aTags.includes('saciedade') || aTags.includes('fibras')) aScore++;
            if (bTags.includes('saciedade') || bTags.includes('fibras')) bScore++;
          } else if (challenge === 'emotional') {
            if (aTags.includes('relaxante') || aTags.includes('sono')) aScore++;
            if (bTags.includes('relaxante') || bTags.includes('sono')) bScore++;
          }
          
          return bScore - aScore;
        });
        
        setRecipes(sortedRecipes);
        setSelectedRecipeId(sortedRecipes[0].id);
      }
    }
  }, []);

  const recipe = recipes.find(r => r.id === selectedRecipeId) || recipes[0];

  const toggleIngredient = (index: number) => {
    setCheckedIngredients(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleRecipeChange = (id: string) => {
    setSelectedRecipeId(id);
    setCheckedIngredients([]);
  };

  const getTagIcon = (tag: string) => {
    if (tag.includes('Termo')) return <Flame className="text-orange-500 mb-2" size={24} strokeWidth={2} />;
    if (tag.includes('Detox')) return <Droplets className="text-blue-500 mb-2" size={24} strokeWidth={2} />;
    if (tag.includes('Fibras')) return <Leaf className="text-emerald-500 mb-2" size={24} strokeWidth={2} />;
    if (tag.includes('Sono') || tag.includes('Relaxante')) return <Moon className="text-indigo-500 mb-2" size={24} strokeWidth={2} />;
    return <Zap className="text-amber-500 mb-2" size={24} strokeWidth={2} />;
  };

  return (
    <div className="pb-24">
      {/* Premium Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 dark:bg-slate-950 text-white pt-12 pb-8 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden transition-colors duration-300"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 dark:bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-md mx-auto">
          <h2 className="text-4xl font-serif font-bold tracking-tight mb-2">Receitas</h2>
          <p className="text-brand-200 dark:text-brand-400 text-sm">Variações exclusivas para o seu protocolo.</p>
          
          <div className="pt-8 pb-2">
            <div className="relative group">
              <select
                value={selectedRecipeId}
                onChange={(e) => handleRecipeChange(e.target.value)}
                className="w-full appearance-none bg-white/10 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-white rounded-2xl px-5 py-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 backdrop-blur-md shadow-lg transition-all group-hover:bg-white/15"
              >
                {recipes.map((r) => (
                  <option key={r.id} value={r.id} className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">
                    {r.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-white/70 group-hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5 rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="p-6 max-w-md mx-auto mt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={recipe.id}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-4 text-center">
              {recipe.imageUrl && (
                <div className="w-full h-48 rounded-[2rem] overflow-hidden mb-6 shadow-md relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white leading-tight">{recipe.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-4">{recipe.description}</p>
              
              <div className="flex items-center justify-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full">
                  <Clock size={14} className="text-brand-500 dark:text-brand-400" /> 5 Min
                </div>
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full">
                  <UtensilsCrossed size={14} className="text-brand-500 dark:text-brand-400" /> 1 Porção
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-4 overflow-x-auto snap-x hide-scrollbar pb-2 pt-2">
              {recipe.tags.map((tag, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="snap-center shrink-0 flex flex-col items-center justify-center bg-white dark:bg-slate-800 w-24 h-24 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-default"
                >
                  {getTagIcon(tag)}
                  <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest text-center px-2">{tag}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.section variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm font-sans">1</span>
                  Ingredientes
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                  {checkedIngredients.length}/{recipe.ingredients.length}
                </span>
              </div>
              
              <motion.ul 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {recipe.ingredients.map((item, idx) => (
                  <motion.li 
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={idx} 
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm ${
                      checkedIngredients.includes(idx) 
                        ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800 text-brand-800 dark:text-brand-300' 
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-200 dark:hover:border-brand-700 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                    onClick={() => toggleIngredient(idx)}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      checkedIngredients.includes(idx) ? 'bg-brand-500 dark:bg-brand-600 border-brand-500 dark:border-brand-600' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}>
                      <AnimatePresence>
                        {checkedIngredients.includes(idx) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check size={14} className="text-white" strokeWidth={3} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <span className={`text-sm leading-relaxed transition-all ${checkedIngredients.includes(idx) ? 'line-through opacity-60' : ''}`}>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-300">
              <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm font-sans">2</span>
                Modo de Preparo
              </h3>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-200 dark:before:from-brand-800 before:via-brand-100 dark:before:via-brand-900/50 before:to-transparent"
              >
                {recipe.preparation.map((step, idx) => (
                  <motion.div variants={itemVariants} key={idx} className="relative flex items-start gap-6 group">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-400 shadow-sm shrink-0 z-10 font-bold text-sm group-hover:bg-brand-500 dark:group-hover:bg-brand-600 group-hover:text-white transition-colors cursor-default"
                    >
                      {idx + 1}
                    </motion.div>
                    <div className="pt-2 pb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 w-full group-hover:border-brand-200 dark:group-hover:border-brand-700 transition-colors">
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>

            <motion.section 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-[2rem] p-8 border border-orange-100/50 dark:border-orange-900/30 shadow-sm relative overflow-hidden transition-colors duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/30 dark:bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <h3 className="font-bold text-orange-800 dark:text-orange-500 mb-3 uppercase tracking-widest text-[10px] flex items-center gap-2">
                  <Flame size={14} /> Dica de Ouro
                </h3>
                <p className="text-orange-900/80 dark:text-orange-200/80 text-sm leading-relaxed font-medium">{recipe.tips[0]}</p>
              </div>
            </motion.section>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
