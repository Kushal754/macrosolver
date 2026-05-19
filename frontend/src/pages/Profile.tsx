// src/pages/Profile.tsx
import { useState } from 'react';
import { useMacroContext } from '../context/MacroContext';

export default function Profile() {
  
  const { userProfile, updateProfileAndTargets } = useMacroContext();

  
  const [weight, setWeight] = useState<number>(userProfile?.weight || 70);
  const [height, setHeight] = useState<number>(userProfile?.height || 175);
  const [age, setAge] = useState<number>(userProfile?.age || 25);
  const [gender, setGender] = useState<'M' | 'F'>(userProfile?.gender || 'M');
  const [goal, setGoal] = useState<'cut' | 'maintain' | 'bulk'>(userProfile?.goal || 'maintain');
  
  const [saved, setSaved] = useState(false);

  const calculateAndSave = () => {
    
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = gender === 'M' ? bmr + 5 : bmr - 161;

    let tdee = bmr * 1.55;

    if (goal === 'cut') tdee -= 500; 
    if (goal === 'bulk') tdee += 500; 

    
    const proteinTarget = Math.round(weight * 2.2);
    const fatsTarget = Math.round((tdee * 0.25) / 9);
    const remainingKcal = tdee - (proteinTarget * 4) - (fatsTarget * 9);
    const carbsTarget = Math.round(remainingKcal / 4);

    const profileData = { weight, height, age, gender, goal };
    const macroTargets = { protein: proteinTarget, carbs: carbsTarget, fats: fatsTarget };
    
    
    updateProfileAndTargets(profileData, macroTargets);

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">PERFIL <span className="text-blue-500">BIO</span></h1>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Motor metabólico</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
        
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Género Biológico</label>
          <div className="flex gap-2">
            <button onClick={() => setGender('M')} className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${gender === 'M' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 text-slate-400'}`}>Hombre</button>
            <button onClick={() => setGender('F')} className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${gender === 'F' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'bg-slate-50 text-slate-400'}`}>Mujer</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Peso (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 text-center font-bold text-slate-700 focus:ring-2 focus:ring-blue-400 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Altura (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 text-center font-bold text-slate-700 focus:ring-2 focus:ring-blue-400 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Edad</label>
            <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 text-center font-bold text-slate-700 focus:ring-2 focus:ring-blue-400 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Objetivo Nutricional</label>
          <div className="flex flex-col gap-2">
            <button onClick={() => setGoal('cut')} className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all ${goal === 'cut' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>🔥 Definición (Perder Grasa)</button>
            <button onClick={() => setGoal('maintain')} className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all ${goal === 'maintain' ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/30' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>⚖️ Mantenimiento</button>
            <button onClick={() => setGoal('bulk')} className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all ${goal === 'bulk' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>💪 Volumen (Ganar Masa)</button>
          </div>
        </div>

        <button 
          onClick={calculateAndSave}
          className={`w-full mt-4 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 active:scale-95'}`}
        >
          {saved ? "¡Cálculos Guardados! ✓" : "Generar Plan Inteligente"}
        </button>

      </div>
    </div>
  );
}