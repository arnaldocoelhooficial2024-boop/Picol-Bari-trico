import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, BookOpen, CheckCircle2, AlertCircle, Target, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Guide() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24"
    >
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen size={20} className="text-brand-500" />
          Como Usar o App
        </h1>
      </header>

      <div className="p-6 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="text-brand-500" /> 1. Seu Dashboard
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-3">
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              O Dashboard é a sua tela principal. Aqui você encontra:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Check-in Diário:</strong> Todo dia que você consumir o Picolé, clique no botão central para registrar e manter sua ofensiva (fogo) acesa.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Dica do Dia:</strong> Uma dica personalizada baseada no seu maior desafio (ansiedade, fome noturna, etc).</span>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertCircle className="text-red-500" /> 2. O Botão SOS
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-3">
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Bateu aquela vontade incontrolável de comer doce ou furar a dieta?
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-red-500 shrink-0 mt-0.5" />
                <span><strong>Respirar:</strong> Siga a animação para acalmar a ansiedade em 1 minuto.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-red-500 shrink-0 mt-0.5" />
                <span><strong>Registrar:</strong> Clique em "Finalizar" para anotar o que causou a vontade. Isso te ajuda a mapear seus gatilhos.</span>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="text-blue-500" /> 3. Acompanhamento (Perfil)
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-3">
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Na aba Perfil, você pode gerenciar seus resultados:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <span><strong>Atualizar Peso:</strong> Clique em "Atualizar" para registrar seu peso atual e ver o gráfico de emagrecimento se formar.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <span><strong>Modo Escuro:</strong> Altere a aparência do aplicativo para não cansar a vista à noite.</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
