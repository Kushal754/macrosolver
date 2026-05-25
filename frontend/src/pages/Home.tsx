import { useMacroContext } from '../context/MacroContext';

export default function Home() {
  // 1. Nos conectamos al Cerebro actualizado
  const { goals, progress } = useMacroContext();

  // 2. Cálculos matemáticos en tiempo real
  const caloriasRestantes = goals.calories - progress.consumedCalories + progress.burnedCalories;
  
  // Porcentajes para las barras de progreso
  const percentProtein = Math.min((progress.consumedProtein / goals.protein) * 100, 100) || 0;
  const percentCarbs = Math.min((progress.consumedCarbs / goals.carbs) * 100, 100) || 0;
  const percentFats = Math.min((progress.consumedFats / goals.fats) * 100, 100) || 0;

  return (
    <div className="p-6 space-y-8 min-h-screen bg-slate-50 pb-24">
      
      {/* Cabecera de Bienvenida */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Tu Resumen Hoy</h1>
          <p className="text-sm text-slate-500 font-medium">Mantén el ritmo, vas genial 🚀</p>
        </div>
      </div>

      {/* TARJETA PRINCIPAL: Calorías */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Calorías Restantes</p>
          <h2 className={`text-4xl font-extrabold mt-1 ${caloriasRestantes < 0 ? 'text-red-500' : 'text-slate-800'}`}>
            {caloriasRestantes} <span className="text-lg text-slate-500 font-semibold">kcal</span>
          </h2>
          <div className="flex gap-4 mt-3 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1"><span className="text-green-500">🍔 +{progress.consumedCalories}</span> Ingeridas</span>
            <span className="flex items-center gap-1"><span className="text-orange-500">🔥 -{progress.burnedCalories}</span> Quemadas</span>
          </div>
        </div>
        
        {/* Gráfico circular */}
        <div className="w-24 h-24 rounded-full border-8 border-slate-100 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 border-8 border-green-400 rounded-full" style={{ clipPath: 'polygon(50% 0%, 100% 0, 100% 100%, 50% 100%)' }}></div>
             <span className="text-slate-800 font-bold z-10 text-sm">Objetivo</span>
        </div>
      </div>

      {/* TARJETAS DE MACRONUTRIENTES */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Desglose de Macros</h3>
        
        {/* Proteína */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="text-red-500">Proteína</span>
            <span className="text-slate-600">{progress.consumedProtein}g / <span className="text-slate-400">{goals.protein}g</span></span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${percentProtein}%` }}></div>
          </div>
        </div>

        {/* Carbohidratos */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="text-blue-500">Carbohidratos</span>
            <span className="text-slate-600">{progress.consumedCarbs}g / <span className="text-slate-400">{goals.carbs}g</span></span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${percentCarbs}%` }}></div>
          </div>
        </div>

        {/* Grasas */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="text-yellow-500">Grasas</span>
            <span className="text-slate-600">{progress.consumedFats}g / <span className="text-slate-400">{goals.fats}g</span></span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-yellow-500 h-full transition-all duration-500" style={{ width: `${percentFats}%` }}></div>
          </div>
        </div>
      </div>

    </div>
  );
}