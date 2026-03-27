import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Apple, Heart, ChevronRight, X, Activity, ChevronDown } from 'lucide-react';
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

export function Bonus() {
  const [activeTab, setActiveTab] = useState<'diet' | 'sweet' | 'savory' | 'pilates'>('diet');
  const [selectedSweet, setSelectedSweet] = useState<any | null>(null);
  const [selectedSavory, setSelectedSavory] = useState<any | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24"
    >
      {/* Premium Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="bg-slate-900 dark:bg-slate-950 text-white pt-12 pb-8 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden transition-colors duration-300"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 dark:bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-md mx-auto">
          <h2 className="text-4xl font-serif font-bold tracking-tight mb-2">Bônus</h2>
          <p className="text-brand-200 dark:text-brand-400 text-sm">Acelere seus resultados com materiais exclusivos.</p>
          
          <div className="pt-8 pb-2">
            <div className="relative">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as 'diet' | 'sweet' | 'savory' | 'pilates')}
                className="w-full appearance-none bg-white/10 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-white rounded-2xl px-5 py-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 backdrop-blur-md shadow-lg transition-all"
              >
                <option value="diet" className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">Dietas do Cefit</option>
                <option value="sweet" className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">Doces Fit</option>
                <option value="savory" className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">Salgados Fit</option>
                <option value="pilates" className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">Pilates na Parede</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-white/70">
                <ChevronDown size={20} strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="p-6 space-y-8 max-w-md mx-auto mt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'diet' && (
            <motion.div
              key="diet"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              className="space-y-6"
            >
              {appData.bonus.diet_plans.map((plan) => (
                <motion.div 
                  variants={itemVariants}
                  key={plan.id} 
                  className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-5 mb-6">
                    <motion.div 
                      whileHover={{ rotate: 10, scale: 1.05 }}
                      className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center shrink-0"
                    >
                      <Apple className="text-brand-600 dark:text-brand-400" size={28} strokeWidth={2} />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white leading-tight">{plan.name}</h3>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-brand-500 dark:text-brand-400 mt-1.5">{plan.level}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{plan.description}</p>
                  <div className="space-y-1 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-3xl border border-slate-100/50 dark:border-slate-700/50">
                    <MealRow label="Café" desc={plan.meals.breakfast} />
                    <MealRow label="Almoço" desc={plan.meals.lunch} />
                    <MealRow label="Lanche" desc={plan.meals.snack} />
                    <MealRow label="Jantar" desc={plan.meals.dinner} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'sweet' && (
            <motion.div
              key="sweet"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              className="space-y-4"
            >
              {appData.bonus.sweet_recipes.map((recipe) => (
                <motion.button 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={recipe.id}
                  onClick={() => setSelectedSweet(recipe)}
                  className="w-full text-left bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 p-6 shadow-sm flex items-center justify-between group hover:border-pink-200 dark:hover:border-pink-800 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-5">
                    {recipe.imageUrl ? (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-pink-100 dark:group-hover:bg-pink-500/20 transition-all duration-300">
                        <Heart className="text-pink-500 dark:text-pink-400" size={24} strokeWidth={2} />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white font-serif text-lg">{recipe.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-1">{recipe.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors shrink-0" />
                </motion.button>
              ))}
            </motion.div>
          )}

          {activeTab === 'savory' && (
            <motion.div
              key="savory"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              className="space-y-4"
            >
              {appData.bonus.savory_recipes.map((recipe) => (
                <motion.button 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={recipe.id}
                  onClick={() => setSelectedSavory(recipe)}
                  className="w-full text-left bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 p-6 shadow-sm flex items-center justify-between group hover:border-orange-200 dark:hover:border-orange-800 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-5">
                    {recipe.imageUrl ? (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 transition-all duration-300">
                        <Activity className="text-orange-500 dark:text-orange-400" size={24} strokeWidth={2} />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white font-serif text-lg">{recipe.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-1">{recipe.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors shrink-0" />
                </motion.button>
              ))}
            </motion.div>
          )}

          {activeTab === 'pilates' && (
            <motion.div
              key="pilates"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              className="space-y-4"
            >
              {appData.bonus.pilates.map((exercise, idx) => (
                <motion.div 
                  variants={itemVariants}
                  key={idx} 
                  className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-5 mb-5">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-xl font-serif shrink-0"
                    >
                      {exercise.day}
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white font-serif text-lg leading-tight">{exercise.name}</h4>
                      <p className="text-[9px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-widest mt-1.5">{exercise.description}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-5 rounded-2xl border border-slate-100/50 dark:border-slate-700/50 leading-relaxed">
                    {exercise.instruction}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal for Sweet Recipes */}
      {createPortal(
        <AnimatePresence>
          {selectedSweet && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6"
              onClick={() => setSelectedSweet(null)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-pink-50 dark:from-pink-900/20 to-white dark:to-slate-800 relative z-20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center">
                      <Heart className="text-pink-500 dark:text-pink-400" size={24} />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white leading-tight">{selectedSweet.name}</h3>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedSweet(null)}
                    className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm border border-slate-100 dark:border-slate-600"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
                
                <div className="overflow-y-auto">
                  {selectedSweet.imageUrl && (
                    <div className="w-full h-48 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                      <img 
                        src={selectedSweet.imageUrl} 
                        alt={selectedSweet.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div className="p-6 space-y-8">
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{selectedSweet.description}</p>
                  
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center text-[10px]">1</span>
                        Ingredientes
                      </h4>
                      <ul className="space-y-3">
                        {selectedSweet.ingredients.map((ing: string, i: number) => (
                          <motion.li 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i} 
                            className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-700/50"
                          >
                            <div className="w-2 h-2 rounded-full bg-pink-400 dark:bg-pink-500 mt-1.5 shrink-0"></div>
                            <span className="leading-relaxed">{ing}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center text-[10px]">2</span>
                        Modo de Preparo
                      </h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-pink-50/50 dark:bg-pink-500/10 p-5 rounded-2xl border border-pink-100/50 dark:border-pink-500/20">
                        {selectedSweet.preparation}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {selectedSavory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6"
              onClick={() => setSelectedSavory(null)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-orange-50 dark:from-orange-900/20 to-white dark:to-slate-800 relative z-20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                      <Activity className="text-orange-500 dark:text-orange-400" size={24} />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white leading-tight">{selectedSavory.name}</h3>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedSavory(null)}
                    className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm border border-slate-100 dark:border-slate-600"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
                
                <div className="overflow-y-auto">
                  {selectedSavory.imageUrl && (
                    <div className="w-full h-48 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                      <img 
                        src={selectedSavory.imageUrl} 
                        alt={selectedSavory.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div className="p-6 space-y-8">
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{selectedSavory.description}</p>
                  
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center text-[10px]">1</span>
                        Ingredientes
                      </h4>
                      <ul className="space-y-3">
                        {selectedSavory.ingredients.map((ing: string, i: number) => (
                          <motion.li 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i} 
                            className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-700/50"
                          >
                            <div className="w-2 h-2 rounded-full bg-orange-400 dark:bg-orange-500 mt-1.5 shrink-0"></div>
                            <span className="leading-relaxed">{ing}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center text-[10px]">2</span>
                        Modo de Preparo
                      </h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-orange-50/50 dark:bg-orange-500/10 p-5 rounded-2xl border border-orange-100/50 dark:border-orange-500/20">
                        {selectedSavory.preparation}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}

function MealRow({ label, desc }: { label: string, desc: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 items-start p-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-white dark:hover:bg-slate-700 transition-colors rounded-2xl">
      <span className="text-[9px] font-bold uppercase tracking-widest text-brand-500 dark:text-brand-400 w-16 shrink-0 sm:mt-0.5">{label}</span>
      <span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{desc}</span>
    </div>
  );
}
