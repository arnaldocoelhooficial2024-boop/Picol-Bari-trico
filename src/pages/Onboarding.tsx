import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Target, Scale, Ruler, Activity, Heart, Coffee, Moon, Frown, Loader2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { supabase } from '../lib/supabase';

const steps = [
  { id: 'welcome', title: 'Bem-vinda' },
  { id: 'goal', title: 'Objetivo' },
  { id: 'challenge', title: 'Desafio' },
  { id: 'metrics', title: 'Medidas' },
  { id: 'calculating', title: 'Calculando' }
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    challenge: '',
    weight: '',
    height: '',
    goalWeight: ''
  });

  useEffect(() => {
    // Pre-fill name if available from auth metadata
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.name) {
        setFormData(prev => ({ ...prev, name: user.user_metadata.name }));
      }
    };
    fetchUser();
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const finishOnboarding = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Usuário não autenticado');

      // 1. Salvar no user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          nome: formData.name || 'Vencedora',
          desafio_principal: formData.challenge,
          peso_inicial: formData.weight ? parseFloat(formData.weight) : null,
          peso_meta: formData.goalWeight ? parseFloat(formData.goalWeight) : null,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (profileError) throw profileError;

      // 2. Salvar o primeiro peso no weight_logs
      if (formData.weight) {
        const { error: weightError } = await supabase
          .from('weight_logs')
          .insert({
            user_id: user.id,
            peso: parseFloat(formData.weight),
            data_registro: new Date().toISOString().split('T')[0]
          });
          
        if (weightError) console.error('Erro ao salvar peso inicial:', weightError);
      }

      // Fallback local para altura (já que não tem na tabela profile, ou podemos adicionar depois)
      if (formData.height) localStorage.setItem('gm_height', formData.height);
      
      // Marca como concluído localmente para não repetir
      localStorage.setItem('gm_onboarding_completed', 'true');
      
      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar onboarding:', error);
      // Fallback local em caso de erro
      localStorage.setItem('gm_onboarding_completed', 'true');
      navigate('/');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Qual o seu nome?</h2>
              <p className="text-slate-500 dark:text-slate-400">Como você gostaria de ser chamada na sua jornada?</p>
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl py-4 px-6 text-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all text-center font-medium"
              placeholder="Seu nome ou apelido"
              autoFocus
            />
            <button
              onClick={handleNext}
              disabled={!formData.name.trim()}
              className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-600/20"
            >
              Continuar <ArrowRight size={20} />
            </button>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Qual seu objetivo principal?</h2>
              <p className="text-slate-500 dark:text-slate-400">Isso nos ajuda a personalizar sua experiência.</p>
            </div>
            <div className="space-y-3">
              {[
                { id: 'lose_weight', label: 'Emagrecer rápido', icon: <Activity className="text-brand-500" /> },
                { id: 'health', label: 'Melhorar a saúde', icon: <Heart className="text-rose-500" /> },
                { id: 'maintain', label: 'Manter o peso e desinchar', icon: <Target className="text-emerald-500" /> }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => {
                    setFormData({ ...formData, goal: option.id });
                    setTimeout(handleNext, 300);
                  }}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                    formData.goal === option.id 
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' 
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-brand-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0">
                    {option.icon}
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-lg text-left">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Qual seu maior desafio?</h2>
              <p className="text-slate-500 dark:text-slate-400">O que mais atrapalha seu emagrecimento hoje?</p>
            </div>
            <div className="space-y-3">
              {[
                { id: 'sweets', label: 'Vontade de doces', icon: <Coffee className="text-amber-500" /> },
                { id: 'night', label: 'Fome noturna', icon: <Moon className="text-indigo-500" /> },
                { id: 'emotional', label: 'Ansiedade / Fome emocional', icon: <Frown className="text-blue-500" /> },
                { id: 'portions', label: 'Dificuldade com porções', icon: <Scale className="text-emerald-500" /> }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => {
                    setFormData({ ...formData, challenge: option.id });
                    setTimeout(handleNext, 300);
                  }}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                    formData.challenge === option.id 
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' 
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-brand-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0">
                    {option.icon}
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-lg text-left">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Suas medidas</h2>
              <p className="text-slate-500 dark:text-slate-400">Para calcularmos seu progresso corretamente.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Peso Atual (kg)</label>
                <div className="relative">
                  <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all font-medium"
                    placeholder="Ex: 75.5"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Altura (cm)</label>
                <div className="relative">
                  <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all font-medium"
                    placeholder="Ex: 165"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Peso Desejado (kg)</label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="number"
                    value={formData.goalWeight}
                    onChange={(e) => setFormData({ ...formData, goalWeight: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all font-medium"
                    placeholder="Ex: 65.0"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                handleNext();
                // Simulate calculation delay
                setTimeout(() => {
                  finishOnboarding();
                }, 3000);
              }}
              disabled={!formData.weight || !formData.height || !formData.goalWeight || isSaving}
              className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-600/20 mt-8"
            >
              {isSaving ? (
                <><Loader2 size={20} className="animate-spin" /> Salvando...</>
              ) : (
                <>Finalizar <Check size={20} /></>
              )}
            </button>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-8"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-brand-500"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Logo className="w-12 h-12 text-brand-500" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Preparando seu protocolo...</h2>
              <p className="text-slate-500 dark:text-slate-400">Personalizando a experiência do Picolé Bariátrico para você.</p>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        {currentStep > 0 && currentStep < 4 ? (
          <button 
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <ArrowLeft size={20} />
          </button>
        ) : (
          <div className="w-10 h-10" /> // Spacer
        )}
        
        {currentStep < 4 && (
          <div className="flex gap-2">
            {steps.slice(0, 4).map((step, index) => (
              <div 
                key={step.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'w-8 bg-brand-500' 
                    : index < currentStep 
                      ? 'w-4 bg-brand-300 dark:bg-brand-800' 
                      : 'w-4 bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        )}
        
        <div className="w-10 h-10" /> // Spacer
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col justify-center p-6 max-w-md w-full mx-auto">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </main>
    </div>
  );
}
