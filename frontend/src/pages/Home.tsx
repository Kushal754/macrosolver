// src/pages/Home.tsx
import { useState } from 'react';

export default function Home() {
  
  const [protein] = useState({ current: 50, target: 150 });
  const [carbs, setCarbs] = useState({ current: 40, target: 200 });
  const [fats, setFats] = useState({ current: 15, target: 65 });

  
  const getPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100); 
  };

  
  const handlePanicButton = () => {
   
    setCarbs((prev) => ({ ...prev, current: prev.current + 35 }));
    setFats((prev) => ({ ...prev, current: prev.current + 18 }));
    
    
    alert("🚨 ¡Pánico! Donut registrado. Hemos ajustado tus barras de Carbohidratos y Grasas.");
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-800">
          MacroSolver <span className="text-green-500">AI</span>
        </h1>
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-xl shadow-sm">
          🧑🏻‍💻
        </div>
      </div>

      {/* Panel de Macros Dinámico */}
      <div className="bg-slate-800 text-white p-5 rounded-3xl shadow-lg">
        <h2 className="text-xs font-bold tracking-wider text-slate-400 mb-4 uppercase">
          Tus Macros (Hoy)
        </h2>
        <div className="space-y-5">
          
          {/* Barra de Proteína */}
          <div>
            <div className="flex justify-between text-sm mb-1 font-medium">
              <span className="flex items-center gap-1">🥩 Proteína</span>
              <span className="text-slate-300">{protein.current}g / {protein.target}g</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div 
                className="bg-red-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${getPercentage(protein.current, protein.target)}%` }}>
              </div>
            </div>
          </div>

          {/* Barra de Carbohidratos */}
          <div>
            <div className="flex justify-between text-sm mb-1 font-medium">
              <span className="flex items-center gap-1">🍚 Carbohidratos</span>
              <span className="text-slate-300">{carbs.current}g / {carbs.target}g</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div 
                className="bg-blue-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${getPercentage(carbs.current, carbs.target)}%` }}>
              </div>
            </div>
          </div>

          {/* Barra de Grasas */}
          <div>
            <div className="flex justify-between text-sm mb-1 font-medium">
              <span className="flex items-center gap-1">🥑 Grasas</span>
              <span className="text-slate-300">{fats.current}g / {fats.target}g</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div 
                className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${getPercentage(fats.current, fats.target)}%` }}>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Botón de Pánico Dinámico */}
      <div className="bg-red-50 border-2 border-red-200 p-5 rounded-3xl text-center shadow-sm">
        <h3 className="text-red-800 font-bold mb-3 text-sm tracking-wide">🚨 BOTÓN DE PÁNICO</h3>
        <button 
          onClick={handlePanicButton}
          className="bg-red-500 text-white font-bold py-3 px-6 rounded-2xl w-full hover:bg-red-600 transition-all active:scale-95 shadow-md">
          ¡HE PECADO! (Recalibrar)
        </button>
        <p className="text-xs text-red-500 mt-3 font-medium">Pulsa aquí si te has saltado la dieta</p>
      </div>

      {/* Salvavidas de Antojos */}
      {/* ... (El resto del código se mantiene igual) ... */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4 text-sm">🧠 ¿Qué te pide el cerebro hoy?</h3>
        <div className="grid grid-cols-3 gap-3">
          <button className="bg-amber-100 text-amber-900 p-3 rounded-2xl text-xs font-bold flex flex-col items-center hover:bg-amber-200 transition-colors">
            <span className="text-2xl mb-1">🍟</span> Fast-Food
          </button>
          <button className="bg-pink-100 text-pink-900 p-3 rounded-2xl text-xs font-bold flex flex-col items-center hover:bg-pink-200 transition-colors">
            <span className="text-2xl mb-1">🍪</span> Dulce
          </button>
          <button className="bg-orange-100 text-orange-900 p-3 rounded-2xl text-xs font-bold flex flex-col items-center hover:bg-orange-200 transition-colors">
            <span className="text-2xl mb-1">🍕</span> Crujiente
          </button>
        </div>
      </div>

    </div>
  );
}