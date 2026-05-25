import { useState } from 'react';
import { useMacroContext } from '../context/MacroContext';

export default function Gym() {
  const { addBurnedCalories } = useMacroContext();
  
  const [customCalories, setCustomCalories] = useState('');
  const [lastWorkout, setLastWorkout] = useState<string | null>(null);

  // Función para registrar rutinas predefinidas
  const handlePredefinedWorkout = (calories: number, name: string) => {
    addBurnedCalories(calories);
    setLastWorkout(`✅ Registrado: ${name} (-${calories} kcal)`);
    hideMessage();
  };

  // Función para registrar calorías manuales (ej: leídas de un reloj inteligente)
  const handleCustomWorkout = () => {
    const cals = Number(customCalories);
    if (cals > 0) {
      addBurnedCalories(cals);
      setLastWorkout(`✅ Registrado: Entrenamiento libre (-${cals} kcal)`);
      setCustomCalories('');
      hideMessage();
    }
  };

  // Ocultar el mensaje de éxito después de 3 segundos
  const hideMessage = () => {
    setTimeout(() => {
      setLastWorkout(null);
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50 pb-24">
      
      <div className="mt-4">
        <h1 className="text-2xl font-extrabold text-slate-800">Tus Entrenamientos</h1>
        <p className="text-sm text-slate-500 font-medium">Registra tu actividad para ajustar tus calorías</p>
      </div>

      {/* Alerta flotante de éxito */}
      {lastWorkout && (
        <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-sm font-bold animate-fadeIn">
          {lastWorkout}
        </div>
      )}

      {/* SECCIÓN 1: Rutinas Predefinidas */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2">
          ⚡ Entrenamientos Rápidos
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={() => handlePredefinedWorkout(300, 'Fuerza (Pesas) - 45 min')}
            className="flex justify-between items-center bg-slate-50 hover:bg-orange-50 border border-slate-100 p-4 rounded-2xl transition-all active:scale-95"
          >
            <div className="text-left">
              <span className="block font-bold text-slate-700">🏋️ Fuerza (Pesas)</span>
              <span className="text-xs text-slate-400 font-medium">Intensidad Alta • 45 min</span>
            </div>
            <span className="font-extrabold text-orange-500">-300 kcal</span>
          </button>

          <button 
            onClick={() => handlePredefinedWorkout(400, 'Cardio (Correr) - 30 min')}
            className="flex justify-between items-center bg-slate-50 hover:bg-orange-50 border border-slate-100 p-4 rounded-2xl transition-all active:scale-95"
          >
            <div className="text-left">
              <span className="block font-bold text-slate-700">🏃 Cardio (Correr)</span>
              <span className="text-xs text-slate-400 font-medium">Intensidad Media • 30 min</span>
            </div>
            <span className="font-extrabold text-orange-500">-400 kcal</span>
          </button>

          <button 
            onClick={() => handlePredefinedWorkout(200, 'Yoga / Estiramientos - 60 min')}
            className="flex justify-between items-center bg-slate-50 hover:bg-orange-50 border border-slate-100 p-4 rounded-2xl transition-all active:scale-95"
          >
            <div className="text-left">
              <span className="block font-bold text-slate-700">🧘 Yoga / Movilidad</span>
              <span className="text-xs text-slate-400 font-medium">Intensidad Baja • 60 min</span>
            </div>
            <span className="font-extrabold text-orange-500">-200 kcal</span>
          </button>
        </div>
      </div>

      {/* SECCIÓN 2: Entrada Manual (Smartwatch) */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2">
          ⌚ Registro Manual (Reloj Inteligente)
        </h3>
        
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input 
              type="number" 
              value={customCalories}
              onChange={(e) => setCustomCalories(e.target.value)}
              placeholder="Ej: 520"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-400"
            />
            <span className="absolute right-4 top-3 text-sm text-slate-400 font-bold pointer-events-none">kcal</span>
          </div>
          <button 
            onClick={handleCustomWorkout}
            disabled={!customCalories}
            className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-bold px-6 rounded-2xl transition-all active:scale-95"
          >
            AÑADIR
          </button>
        </div>
      </div>

    </div>
  );
}