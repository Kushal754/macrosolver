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

  const handleScan = async () => {
    setIsScanning(true);
    setResult(null); 

    const payload = {
      targetMacros: { protein: 40, carbs: 50, fats: 15 },
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

  // Función para registrar los macros calculados en el almacenamiento local del navegador
  const handleConsumeFood = () => {
    // Definimos los macros de la comida (coincidentes con el payload enviado)
    const comidaActual = { protein: 40, carbs: 50, fats: 15 };
    
    // Recuperamos el histórico del día o inicializamos a cero si es la primera comida
    const datosGuardados = localStorage.getItem('macrosConsumidos');
    const acumuladoActual = datosGuardados 
      ? JSON.parse(datosGuardados) 
      : { protein: 0, carbs: 0, fats: 0 };
    
    // Realizamos la agregación de los nuevos macros consumidos
    const nuevoTotal = {
      protein: acumuladoActual.protein + comidaActual.protein,
      carbs: acumuladoActual.carbs + comidaActual.carbs,
      fats: acumuladoActual.fats + comidaActual.fats
    };
    
    // Persistimos el nuevo estado en localStorage serializado en JSON
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
          Apunta a tu nevera para detectar ingredientes y calcular porciones
        </p>
      </div>

      {/* Visor de la Cámara */}
      <div className={`bg-slate-900 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-inner border-4 border-slate-800 transition-all duration-500 ${result ? 'h-48 flex-none' : 'flex-1'}`}>
        
        {/* Esquinas de enfoque */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-md"></div>
        <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-md"></div>
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-md"></div>
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-md"></div>

        {isScanning ? (
          <div className="absolute w-full h-1 bg-green-400 shadow-[0_0_15px_3px_rgba(74,222,128,0.5)] animate-scan"></div>
        ) : (
          <p className="text-slate-400 text-xs font-medium animate-pulse text-center p-4">
            {result ? "✓ Escaneo completado con éxito" : "Esperando cámara o imagen de la nevera..."}
          </p>
        )}
      </div>

      {/* Botón de Acción principal */}
      {!result && (
        <div>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className={`w-full py-4 rounded-2xl font-bold text-lg text-white transition-all shadow-lg active:scale-95 ${
              isScanning ? 'bg-slate-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isScanning ? '🔍 PROCESANDO CON IA Y MATH...' : 'ESCANEAR NEVERA'}
          </button>
        </div>
      )}

      {/* ========================================== */}
      {/* 4. RENDERIZADO DE RESULTADOS                */}
      {/* ========================================== */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Bloque de Gramos Calculados Matemáticamente */}
          {result.success && result.grams && (
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide text-green-600">
                ⚖️ Porciones Exactas Calculadas
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(result.grams).map(([name, grams]) => (
                  <div key={name} className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                    <span className="block text-xs font-bold text-slate-500 uppercase">{name}</span>
                    <span className="text-lg font-extrabold text-slate-800">{grams}g</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bloque de la Receta Redactada por Gemini */}
          {result.success && result.recipe && (
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide text-blue-600">
                👨‍🍳 Receta Generada por Gemini AI
              </h3>
              <div className="text-sm text-slate-600 leading-relaxed space-y-4 whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
                {result.recipe}
              </div>
            </div>
          )}

          {/* Gestión de Errores en UI */}
          {!result.success && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm font-semibold text-center">
              ⚠️ {result.error}
            </div>
          )}

          {/* BOTONES DE CONTROL DE FLUJO */}
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