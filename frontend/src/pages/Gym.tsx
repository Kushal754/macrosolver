import { useState } from 'react';
// import { useMacroContext } from '../context/MacroContext'; // <-- Descomenta esto cuando uses tu contexto real

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  tip: string;
}

interface DailyRoutine {
  date: string;
  focus: string;
  motivation: string;
  exercises: Exercise[];
}

export default function Gym() {
  // 1. Datos del usuario (Usa tu contexto real aquí cuando lo conectes)
  // const { progress } = useMacroContext();
  
  // Mock temporal mientras terminas de conectar el contexto global
  const progress = { consumedCarbs: 150, consumedProtein: 120, consumedCalories: 1800 }; 

  // 2. Inicialización Profesional (Lazy State) sin useEffect
  const [routine, setRoutine] = useState<DailyRoutine | null>(() => {
    const savedRoutine = localStorage.getItem('dailyRoutine');
    if (savedRoutine) {
      const parsedRoutine = JSON.parse(savedRoutine);
      // Si la rutina guardada es de hoy, la cargamos al instante
      if (parsedRoutine.date === new Date().toLocaleDateString()) {
        return parsedRoutine;
      } else {
        // Si es de ayer, la limpiamos de la memoria
        localStorage.removeItem('dailyRoutine');
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3. Llamada real a tu microservicio de Node.js
  const generateAIAssistedRoutine = async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toLocaleDateString();
      
      // Asegúrate de que este puerto (3000) coincida con donde tienes levantado Node.js
      const response = await fetch('http://localhost:3000/api/generate-routine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carbs: progress.consumedCarbs,
          protein: progress.consumedProtein,
          calories: progress.consumedCalories
        })
      });

      if (!response.ok) {
        throw new Error('Fallo al conectar con la IA en el servidor');
      }

      const generatedRoutineData = await response.json();

      // Le añadimos la fecha de hoy para el control de caducidad interno
      const fullRoutine: DailyRoutine = {
        date: today,
        ...generatedRoutineData
      };

      // Guardamos en la vista y en la memoria del navegador del móvil
      setRoutine(fullRoutine);
      localStorage.setItem('dailyRoutine', JSON.stringify(fullRoutine));

    } catch (err) {
      console.error("Error al generar la rutina:", err);
      setError("No se pudo conectar con el servidor. ¿Está encendido Node.js?");
    } finally {
      setLoading(false);
    }
  };

  // 4. Renderizado de la UI
  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50 pb-32">
      <div className="mt-4">
        <h1 className="text-3xl font-extrabold text-slate-800">Entrenamiento</h1>
        <p className="text-slate-500 font-medium mt-1">Tu plan inteligente para hoy 🤖🏋️‍♂️</p>
      </div>

      {!routine && !loading && (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center space-y-6 mt-10">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-4xl">
            ⚡
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Crea tu rutina de hoy</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              La IA analizará lo que has comido hoy ({progress.consumedCalories} kcal) y tu nivel de energía para crear el entrenamiento perfecto.
            </p>
          </div>
          
          {/* Mensaje de error si Node.js está apagado */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100">
              ⚠️ {error}
            </div>
          )}

          <button 
            onClick={generateAIAssistedRoutine}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
          >
            GENERAR CON IA
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col justify-center items-center py-24 space-y-4">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-slate-900"></div>
          <p className="text-slate-500 font-medium animate-pulse text-sm">Analizando tus macros diarios...</p>
        </div>
      )}

      {routine && !loading && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Cabecera de la Rutina */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="bg-white/20 px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider backdrop-blur-sm">
                Objetivo de Hoy
              </span>
              <h2 className="text-2xl font-black">{routine.focus}</h2>
              <p className="text-slate-300 text-sm italic border-l-2 border-green-400 pl-3 mt-4">
                "{routine.motivation}"
              </p>
            </div>
          </div>

          {/* Lista de Ejercicios */}
          <div className="space-y-4">
            <div className="flex justify-between items-end px-1">
              <h3 className="font-bold text-slate-800 text-lg">Ejercicios</h3>
              <span className="text-xs font-bold text-slate-400">{routine.exercises?.length || 0} bloques</span>
            </div>
            
            {routine.exercises && routine.exercises.map((ex, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex gap-4 items-center group active:border-blue-200 transition-all">
                <div className="w-12 h-12 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-300 text-xl border border-slate-100">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 leading-tight">{ex.name}</h4>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs font-bold">
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{ex.sets} Series</span>
                    <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">{ex.reps} Reps</span>
                    <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">⏱️ {ex.rest}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-snug">
                    💡 {ex.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Botón para resetear si el usuario quiere cambiar algo */}
          <button 
            onClick={() => { localStorage.removeItem('dailyRoutine'); setRoutine(null); }}
            className="w-full py-4 text-sm font-bold text-slate-400 active:text-slate-600 transition-colors"
          >
            Descartar y generar otra vez
          </button>
        </div>
      )}
    </div>
  );
}