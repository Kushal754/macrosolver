// src/pages/Home.tsx
import { useState, useEffect } from 'react';

interface MacroState {
  current: number;
  target: number;
}

export default function Home() {
  const [protein, setProtein] = useState<MacroState>(() => {
    const guardado = localStorage.getItem('macrosConsumidos');
    let extra = 0;
    if (guardado) {
      try { 
        extra = JSON.parse(guardado).protein || 0; 
      } catch (error) { 
        console.warn("Error leyendo proteína:", error);
        extra = 0; 
      }
    }
    return { current: 50 + extra, target: 150 };
  });

  const [carbs, setCarbs] = useState<MacroState>(() => {
    const guardado = localStorage.getItem('macrosConsumidos');
    let extra = 0;
    if (guardado) {
      try { 
        extra = JSON.parse(guardado).carbs || 0; 
      } catch (error) { 
        console.warn("Error leyendo carbohidratos:", error);
        extra = 0; 
      }
    }
    return { current: 40 + extra, target: 200 };
  });

  const [fats, setFats] = useState<MacroState>(() => {
    const guardado = localStorage.getItem('macrosConsumidos');
    let extra = 0;
    if (guardado) {
      try { 
        extra = JSON.parse(guardado).fats || 0; 
      } catch (error) { 
        console.warn("Error leyendo grasas:", error);
        extra = 0; 
      }
    }
    return { current: 15 + extra, target: 65 };
  });

  // ESTADO BLINDADO: Calorías quemadas en el gimnasio
  const [burnedCalories, setBurnedCalories] = useState<number>(() => {
    const guardado = localStorage.getItem('caloriasQuemadas');
    return guardado ? (parseInt(guardado, 10) || 0) : 0;
  });

  useEffect(() => {
    const sincronizarDatos = () => {
      // Sincronizar Macros
      const guardadoMacros = localStorage.getItem('macrosConsumidos');
      if (guardadoMacros) {
        try {
          const parsed = JSON.parse(guardadoMacros);
          setProtein({ current: 50 + (parsed.protein || 0), target: 150 });
          setCarbs({ current: 40 + (parsed.carbs || 0), target: 200 });
          setFats({ current: 15 + (parsed.fats || 0), target: 65 });
        } catch (error) {
          console.warn("Error sincronizando macros:", error);
        }
      }

      // Sincronizar Calorías de forma ultra-segura
      const guardadoCalorias = localStorage.getItem('caloriasQuemadas');
      if (guardadoCalorias) {
        setBurnedCalories(parseInt(guardadoCalorias, 10) || 0);
      }
    };

    sincronizarDatos();
    window.addEventListener('storage', sincronizarDatos);
    return () => window.removeEventListener('storage', sincronizarDatos);
  }, []);

  const getPercentage = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100); 
  };

  const handlePanicButton = () => {
    const guardado = localStorage.getItem('macrosConsumidos');
    let extraMacros = { protein: 0, carbs: 0, fats: 0 };
    
    if (guardado) { 
      try { 
        extraMacros = JSON.parse(guardado); 
      } catch (error) {
        console.warn("Error leyendo macros en botón de pánico:", error);
      } 
    }

    const nuevosExtra = {
      protein: extraMacros.protein || 0,
      carbs: (extraMacros.carbs || 0) + 35,
      fats: (extraMacros.fats || 0) + 18
    };

    localStorage.setItem('macrosConsumidos', JSON.stringify(nuevosExtra));
    setCarbs((prev) => ({ ...prev, current: prev.current + 35 }));
    setFats((prev) => ({ ...prev, current: prev.current + 18 }));
    alert("🚨 ¡Pánico! Donut registrado. Hemos ajustado tus barras.");
  };

  const handleResetDay = () => {
    localStorage.removeItem('macrosConsumidos');
    localStorage.removeItem('caloriasQuemadas'); 
    setProtein({ current: 50, target: 150 });
    setCarbs({ current: 40, target: 200 });
    setFats({ current: 15, target: 65 });
    setBurnedCalories(0);
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
          onClick={handleResetDay}
          title="Reiniciar progreso diario"
          className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-lg shadow-sm hover:bg-slate-100 active:scale-95 transition-all"
        >
          🔄
        </button>
      </div>

      <div className="bg-slate-800 text-white p-5 rounded-3xl shadow-lg">
        <h2 className="text-xs font-bold tracking-wider text-slate-400 mb-4 uppercase">
          Tus Macros (Hoy)
        </h2>
        <div className="space-y-5">
          
          <div>
            <div className="flex justify-between text-sm mb-1 font-medium">
              <span className="flex items-center gap-1">🥩 Proteína</span>
              <span className="text-slate-300">{protein.current}g / {protein.target}g</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div className="bg-red-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${getPercentage(protein.current, protein.target)}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1 font-medium">
              <span className="flex items-center gap-1">🍚 Carbohidratos</span>
              <span className="text-slate-300">{carbs.current}g / {carbs.target}g</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div className="bg-blue-400 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${getPercentage(carbs.current, carbs.target)}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1 font-medium">
              <span className="flex items-center gap-1">🥑 Grasas</span>
              <span className="text-slate-300">{fats.current}g / {fats.target}g</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${getPercentage(fats.current, fats.target)}%` }}></div>
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