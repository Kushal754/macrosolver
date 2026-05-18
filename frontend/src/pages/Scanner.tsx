// src/pages/Scanner.tsx
import { useState } from 'react';

interface CalculationResponse {
  success: boolean;
  grams?: {
    [key: string]: number;
  };
  recipe?: string;
  error?: string;
}

export default function Scanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<CalculationResponse | null>(null);

  // NUEVO ESTADO: Controla lo que el usuario escribe en los inputs
  const [targetMacros, setTargetMacros] = useState({ protein: 40, carbs: 50, fats: 15 });

  // Función para actualizar los macros cuando el usuario escribe
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTargetMacros(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleScan = async () => {
    setIsScanning(true);
    setResult(null); 

    // AHORA ES DINÁMICO: Leemos targetMacros del estado en lugar de números fijos
    const payload = {
      targetMacros: targetMacros,
      ingredients: [
        { name: "Pollo", macros: { protein: 31, carbs: 0, fats: 3.6 } },
        { name: "Arroz", macros: { protein: 2.7, carbs: 28, fats: 0.3 } },
        { name: "Aceite_Oliva", macros: { protein: 0, carbs: 0, fats: 100 } }
      ]
    };

    try {
      const response = await fetch('http://localhost:3000/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data: CalculationResponse = await response.json();
      setResult(data); 

    } catch (error) {
      console.error("Error de conexión con el servidor:", error);
      setResult({ success: false, error: "No se pudo conectar con el servidor backend." });
    } finally {
      setIsScanning(false); 
    }
  };

  const handleConsumeFood = () => {
    // AHORA ES DINÁMICO: Sumamos a la Home lo que el usuario pidió realmente
    const comidaActual = targetMacros;
    
    const datosGuardados = localStorage.getItem('macrosConsumidos');
    const acumuladoActual = datosGuardados 
      ? JSON.parse(datosGuardados) 
      : { protein: 0, carbs: 0, fats: 0 };
    
    const nuevoTotal = {
      protein: acumuladoActual.protein + comidaActual.protein,
      carbs: acumuladoActual.carbs + comidaActual.carbs,
      fats: acumuladoActual.fats + comidaActual.fats
    };
    
    localStorage.setItem('macrosConsumidos', JSON.stringify(nuevoTotal));
    alert("¡Comida registrada con éxito! Los macros se han sumado a tu progreso diario. 🍽️");
  };

  return (
    <div className="p-4 space-y-6 pb-24 min-h-screen flex flex-col bg-slate-50">
      
      {/* Cabecera */}
      <div className="text-center mt-2">
        <h1 className="text-2xl font-extrabold text-slate-800">
          Fridge <span className="text-green-500">Vision</span> 📸
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Define tus objetivos y escanea para calcular porciones
        </p>
      </div>

      {/* Visor de la Cámara */}
      <div className={`bg-slate-900 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-inner border-4 border-slate-800 transition-all duration-500 ${result ? 'h-48 flex-none' : 'h-64'}`}>
        <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-md"></div>
        <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-md"></div>
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-md"></div>
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-md"></div>

        {isScanning ? (
          <div className="absolute w-full h-1 bg-green-400 shadow-[0_0_15px_3px_rgba(74,222,128,0.5)] animate-scan"></div>
        ) : (
          <p className="text-slate-400 text-xs font-medium animate-pulse text-center p-4">
            {result ? "✓ Escaneo completado con éxito" : "Esperando cámara..."}
          </p>
        )}
      </div>

      {/* PANEL DINÁMICO DE ENTRADA DE DATOS */}
      {!result && (
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 text-xs uppercase tracking-wide flex items-center gap-2">
            🎯 Define tu objetivo actual
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Proteína</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="protein"
                  value={targetMacros.protein}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-400 text-center"
                />
                <span className="absolute right-2 top-2 text-xs text-slate-400 font-bold pointer-events-none">g</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Carbos</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="carbs"
                  value={targetMacros.carbs}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                />
                <span className="absolute right-2 top-2 text-xs text-slate-400 font-bold pointer-events-none">g</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Grasas</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="fats"
                  value={targetMacros.fats}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-center"
                />
                <span className="absolute right-2 top-2 text-xs text-slate-400 font-bold pointer-events-none">g</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleScan}
            disabled={isScanning}
            className={`w-full mt-5 py-4 rounded-2xl font-bold text-base text-white transition-all shadow-lg active:scale-95 ${
              isScanning ? 'bg-slate-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isScanning ? '🔍 PROCESANDO...' : 'CALCULAR Y GENERAR RECETA'}
          </button>
        </div>
      )}

      {/* RENDERIZADO DE RESULTADOS */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          
          {result.success && result.grams && (
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide text-green-600">
                ⚖️ Porciones Exactas Calculadas
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(result.grams).map(([name, grams]) => (
                  <div key={name} className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase truncate">{name}</span>
                    <span className="text-lg font-extrabold text-slate-800">{grams}g</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.success && result.recipe && (
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide text-blue-600">
                👨‍🍳 Receta Generada por IA
              </h3>
              <div className="text-sm text-slate-600 leading-relaxed space-y-4 whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
                {result.recipe}
              </div>
            </div>
          )}

          {!result.success && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm font-semibold text-center">
              ⚠️ {result.error}
            </div>
          )}

          <div className="space-y-3">
            {result.success && (
              <button
                onClick={handleConsumeFood}
                className="w-full py-4 bg-green-500 text-white font-extrabold rounded-2xl hover:bg-green-600 transition-all text-base shadow-md active:scale-95"
              >
                🍽️ CONSUMIR Y REGISTRAR COMIDA
              </button>
            )}

            <button
              onClick={() => setResult(null)}
              className="w-full py-3 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-900 transition-all text-sm shadow-md"
            >
              NUEVO ESCANEO
            </button>
          </div>

        </div>
      )}

    </div>
  );
}