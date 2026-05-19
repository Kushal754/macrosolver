// src/pages/Home.tsx
import { useMacroContext } from '../context/MacroContext';

export default function Home() {
  // Consumimos todo lo que necesitamos del estado global con una sola línea
  const { consumedMacros, targetMacros, burnedCalories, resetDay, addConsumedMacros } = useMacroContext();

  const getPercentage = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100); 
  };

  const handlePanicButton = () => {
    // Registramos directamente el extra en el estado global
    addConsumedMacros({
      protein: 0,
      carbs: 35,
      fats: 18
    });
    alert("🚨 ¡Pánico! Donut registrado directamente en el estado global.");
  };

  return (
    <div className="p-4 space-y-6 pb-24 bg-slate-50 min-h-screen">
      
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            MacroSolver <span className="text-green-500">AI</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">Tu panel de control nutricional</p>
        </div>
        <button 
          onClick={resetDay} // Llama a la función global de reseteo
          title="Reiniciar progreso diario"
          className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-lg shadow-sm hover:bg-slate-100 active:scale-95 transition-all"
        >
          🔄
        </button>
      </div>

      {/* Panel de Macros Dinámico conectado al contexto */}
      <div className="bg-slate-800 text-white p-5 rounded-3xl shadow-lg">
        <h2 className="text-xs font-bold tracking-wider text-slate-400 mb-4 uppercase">
          Tus Macros (Hoy)
        </h2>
        <div className="space-y-5">
          
          <div>
            <div className="flex justify-between text-sm mb-1 font-medium">
              <span className="flex items-center gap-1">🥩 Proteína</span>
              <span className="text-slate-300">
                {consumedMacros.protein}g / {targetMacros.protein}g
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div 
                className="bg-red-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${getPercentage(consumedMacros.protein, targetMacros.protein)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1 font-medium">
              <span className="flex items-center gap-1">🍚 Carbohidratos</span>
              <span className="text-slate-300">
                {consumedMacros.carbs}g / {targetMacros.carbs}g
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div 
                className="bg-blue-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${getPercentage(consumedMacros.carbs, targetMacros.carbs)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1 font-medium">
              <span className="flex items-center gap-1">🥑 Grasas</span>
              <span className="text-slate-300">
                {consumedMacros.fats}g / {targetMacros.fats}g
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div 
                className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${getPercentage(consumedMacros.fats, targetMacros.fats)}%` }}
              ></div>
            </div>
          </div>

        </div>
      </div>

      {/* WIDGET: Fuego Metabólico */}
      <div className="bg-orange-50 border border-orange-200 p-5 rounded-3xl flex justify-between items-center shadow-sm">
        <div>
          <h3 className="text-orange-800 font-bold text-sm tracking-wide flex items-center gap-2">
            🔥 Fuego Metabólico
          </h3>
          <p className="text-xs text-orange-600 font-medium mt-1">Calorías quemadas hoy</p>
        </div>
        <div className="text-3xl font-black text-orange-500 tracking-tighter">
          {burnedCalories} <span className="text-sm font-bold text-orange-400 uppercase">kcal</span>
        </div>
      </div>

      {/* BOTÓN DE PÁNICO */}
      <div className="bg-red-50 border-2 border-red-200 p-5 rounded-3xl text-center shadow-sm">
        <h3 className="text-red-800 font-bold mb-3 text-sm tracking-wide">🚨 BOTÓN DE PÁNICO</h3>
        <button 
          onClick={handlePanicButton}
          className="bg-red-500 text-white font-bold py-3 px-6 rounded-2xl w-full hover:bg-red-600 transition-all active:scale-95 shadow-md">
          ¡HE PECADO! (Recalibrar)
        </button>
        <p className="text-xs text-red-500 mt-3 font-medium">Pulsa aquí si te has saltado la dieta</p>
      </div>

    </div>
  );
}