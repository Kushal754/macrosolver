// src/pages/Gym.tsx
import { useState } from 'react';
import { useMacroContext } from '../context/MacroContext';

export default function Gym() {
  const { addBurnedCalories } = useMacroContext(); 
  const [sessionActive, setSessionActive] = useState(false);
  const [volume, setVolume] = useState(0);

  const exercises = [
    { id: 1, name: "Press de Banca", sets: "4x10", muscle: "Pecho", img: "💪" },
    { id: 2, name: "Aperturas mancuerna", sets: "3x12", muscle: "Pecho", img: "🔥" },
    { id: 3, name: "Press Militar", sets: "4x8", muscle: "Hombro", img: "⚡" },
  ];

  const handleToggleSession = () => {
    if (sessionActive) {
      
      const caloriasCalculadas = Math.round(150 + (volume * 0.08));
      
      
      addBurnedCalories(caloriasCalculadas);
      
      alert(`¡Entrenamiento completado! Has movido ${volume}kg y quemado ${caloriasCalculadas} kcal 🔥`);
      setVolume(0); 
    }
    setSessionActive(!sessionActive);
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">GYM <span className="text-green-500">PRO</span></h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Empuje - Pecho/Hombro</p>
        </div>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">
          {sessionActive ? "⏱️ EN CURSO" : "DÍA 1"}
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl flex justify-between items-center overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Volumen Total (kg)</p>
          <h2 className="text-4xl font-black tracking-tighter mt-1">{volume}</h2>
          {volume > 0 && <p className="text-green-400 text-xs mt-2 font-bold animate-pulse">Calculando gasto energético...</p>}
        </div>
        <div className="text-6xl opacity-20 absolute -right-4 -bottom-2">🏋️</div>
      </div>

      <div className="space-y-4">
        <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest ml-2">Ejercicios de hoy</h3>
        {exercises.map((ex) => (
          <div key={ex.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner italic font-black text-slate-200">
              {ex.img}
            </div>
            <div className="flex-1">
              <h4 className="font-black text-slate-800 tracking-tight">{ex.name}</h4>
              <p className="text-slate-400 text-xs font-bold uppercase">{ex.muscle} • <span className="text-green-500">{ex.sets}</span></p>
            </div>
            <button 
              onClick={() => {
                setVolume(v => v + 800);
                if (!sessionActive) setSessionActive(true);
              }}
              className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-green-500 hover:text-white transition-all shadow-sm active:scale-90"
            >
              ➕
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={handleToggleSession}
        className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 ${
          sessionActive ? 'bg-red-500 text-white shadow-red-500/30' : 'bg-green-500 text-white shadow-green-500/30'
        }`}
      >
        {sessionActive ? "Finalizar Entrenamiento" : "Empezar Rutina"}
      </button>
    </div>
  );
}