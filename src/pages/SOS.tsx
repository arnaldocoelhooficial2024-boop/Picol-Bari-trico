import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Wind, Coffee, ArrowLeft, ShieldAlert, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SOS() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'breathe' | 'tips' | 'distract'>('breathe');
  const [breatheState, setBreatheState] = useState<'Inspirar' | 'Segurar' | 'Expirar'>('Inspirar');

  useEffect(() => {
    if (activeTab === 'breathe') {
      const interval = setInterval(() => {
        setBreatheState(prev => {
          if (prev === 'Inspirar') return 'Segurar';
          if (prev === 'Segurar') return 'Expirar';
          return 'Inspirar';
        });
      }, 4000); // 4 seconds per phase
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b border-slate-800">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-serif font-bold flex items-center gap-2 text-rose-500">
          <ShieldAlert size={24} /> Botão SOS
        </h1>
        <div className="w-10 h-10" />
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col p-6 max-w-md w-full mx-auto">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl font-bold">Respire fundo.</h2>
          <p className="text-slate-400 text-sm">Você está no controle. Escolha uma opção abaixo para se acalmar.</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-800 p-1 rounded-2xl mb-8">
          <button
            onClick={() => setActiveTab('breathe')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'breathe' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wind size={16} /> Respirar
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'tips' ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coffee size={16} /> Dicas
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {activeTab === 'breathe' && (
              <motion.div
                key="breathe"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center space-y-12"
              >
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: breatheState === 'Inspirar' ? 1.5 : breatheState === 'Segurar' ? 1.5 : 1,
                      opacity: breatheState === 'Segurar' ? 0.8 : 0.5
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 bg-rose-500/30 rounded-full blur-xl"
                  />
                  <motion.div
                    animate={{ 
                      scale: breatheState === 'Inspirar' ? 1.2 : breatheState === 'Segurar' ? 1.2 : 1,
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="w-32 h-32 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center shadow-2xl shadow-rose-500/50 z-10"
                  >
                    <Heart size={40} className="text-white" />
                  </motion.div>
                </div>
                <div className="text-center space-y-2">
                  <motion.h3 
                    key={breatheState}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-serif font-bold text-rose-400"
                  >
                    {breatheState}
                  </motion.h3>
                  <p className="text-slate-400">Acompanhe o círculo por 1 minuto.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'tips' && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {[
                  { title: 'Beba um copo de água', desc: 'Muitas vezes a sede é confundida com fome.' },
                  { title: 'Tome o Picolé Bariátrico', desc: 'Ele vai ocupar espaço no estômago e tirar a vontade de doce.' },
                  { title: 'Mude de ambiente', desc: 'Saia da cozinha ou da sala. Vá para o quarto ou dê uma volta.' },
                  { title: 'Escove os dentes', desc: 'O sabor da menta ajuda a cortar a vontade de comer.' }
                ].map((tip, idx) => (
                  <div key={idx} className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                    <h4 className="font-bold text-lg mb-1">{tip.title}</h4>
                    <p className="text-slate-400 text-sm">{tip.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
