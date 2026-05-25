import { useState, type ChangeEvent } from 'react';
import { useMacroContext } from '../context/MacroContext';

interface CalculationResponse {
  success: boolean;
  grams?: Record<string, number>;
  recipe?: string;
  error?: string;
}

export default function Scanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<CalculationResponse | null>(null);

  // 1. EL FIX: Guardamos los valores iniciales como texto (strings)
  const [targetMacros, setTargetMacros] = useState({ protein: "40", carbs: "50", fats: "15" });

  const { addConsumedMacros } = useMacroContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // 2. EL FIX: Permitimos que la caja esté vacía. Si escriben, borramos los ceros a la izquierda (ej: 066 -> 66)
    const cleanValue = value === '' ? '' : value.replace(/^0+(?=\d)/, '');
    setTargetMacros(prev => ({ ...prev, [name]: cleanValue }));
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setResult(null); 

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // 3. EL FIX: Justo antes de mandarlo a la IA, aseguramos que son números reales
      const payloadMacros = {
        protein: Number(targetMacros.protein) || 0,
        carbs: Number(targetMacros.carbs) || 0,
        fats: Number(targetMacros.fats) || 0
      };
      formData.append('targetMacros', JSON.stringify(payloadMacros));

      const response = await fetch('http://localhost:3000/api/v1/vision/calculate', {
        method: 'POST',
        body: formData 
      });

      if (!response.ok) throw new Error("Fallo en el servidor");

      const data: CalculationResponse = await response.json();
      setResult(data); 

    } catch (error) {
      console.error("Error de conexión con el servidor:", error);
      setResult({ success: false, error: "No se pudo analizar la imagen. Comprueba que el backend esté encendido." });
    } finally {
      setIsScanning(false); 
    }
  };

  const handleConsumeFood = async () => {
    try {
      // 4. EL FIX: Convertimos a número antes de guardar en el contexto global
      await addConsumedMacros({
        protein: Number(targetMacros.protein) || 0,
        carbs: Number(targetMacros.carbs) || 0,
        fats: Number(targetMacros.fats) || 0
      });

      alert("¡Comida registrada con éxito! Revisa tu pantalla de Home. 🍽️");
      setResult(null); 
      
    } catch (error) {
      console.error("Error al consumir:", error);
      alert("⚠️ Hubo un error al guardar.");
    }
  };

  const handleSaveRecipe = async () => {
    if (!result || !result.grams) return;

    try {
      // 1. Calculamos los macros totales a partir de tus inputs
      const totalP = Number(targetMacros.protein) || 0;
      const totalC = Number(targetMacros.carbs) || 0;
      const totalF = Number(targetMacros.fats) || 0;
      const totalCals = (totalP * 4) + (totalC * 4) + (totalF * 9);

      // 2. Preparamos el DTO exacto que espera Spring Boot
      const recipePayload = {
        name: "Receta IA - " + new Date().toLocaleDateString('es-ES'),
        instructions: result.recipe || "Instrucciones generadas por la IA.",
        totalCalories: totalCals,
        totalProtein: totalP,
        totalCarbs: totalC,
        totalFats: totalF,
        
        // Mapeamos los gramos que detectó la IA a la entidad Ingredient de Java
        ingredients: Object.entries(result.grams).map(([foodName, amount]) => ({
          name: foodName,
          grams: amount,
          calories: 0, 
          protein: 0,
          carbs: 0,
          fats: 0
        }))
      };

      // 3. Hacemos el POST al servidor de Spring Boot (Puerto 8080)
      const response = await fetch('http://localhost:8080/api/v1/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipePayload)
      });

      if (!response.ok) throw new Error("Fallo en el servidor de base de datos");

      alert("¡Receta guardada en tu base de datos para siempre! 💾");
      
    } catch (error) {
      console.error("Error al guardar la receta:", error);
      alert("⚠️ No se pudo conectar con el backend de Java.");
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24 min-h-screen flex flex-col bg-slate-50">
      
      <div className="text-center mt-2">
        <h1 className="text-2xl font-extrabold text-slate-800">
          Fridge <span className="text-green-500">Vision</span> 📸
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Define tus objetivos y escanea para calcular porciones
        </p>
      </div>

      <div className={`bg-slate-900 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-inner border-4 border-slate-800 transition-all duration-500 ${result ? 'h-48 flex-none' : 'h-64'}`}>
        <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-md"></div>
        <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-md"></div>
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-md"></div>
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-md"></div>

        {isScanning ? (
          <div className="absolute w-full h-1 bg-green-400 shadow-[0_0_15px_3px_rgba(74,222,128,0.5)] animate-scan"></div>
        ) : (
          <p className="text-slate-400 text-xs font-medium animate-pulse text-center p-4">
            {result ? "✓ Análisis completado con éxito" : "Esperando cámara o imagen..."}
          </p>
        )}
      </div>

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
          
          <label
            className={`w-full mt-5 py-4 rounded-2xl font-bold text-base text-white transition-all shadow-lg active:scale-95 flex items-center justify-center cursor-pointer ${
              isScanning ? 'bg-slate-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isScanning ? '🔍 PROCESANDO CON IA...' : '📸 SUBIR FOTO Y CALCULAR'}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              onChange={handleImageUpload} 
              className="hidden" 
              disabled={isScanning}
            />
          </label>
        </div>
      )}

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
              <>
                <button
                  onClick={handleConsumeFood}
                  className="w-full py-4 bg-green-500 text-white font-extrabold rounded-2xl hover:bg-green-600 transition-all text-base shadow-md active:scale-95"
                >
                  🍽️ CONSUMIR HOY
                </button>

                {/* NUEVO BOTÓN CONECTADO A SPRING BOOT */}
                <button
                  onClick={handleSaveRecipe}
                  className="w-full py-4 bg-blue-500 text-white font-extrabold rounded-2xl hover:bg-blue-600 transition-all text-base shadow-md active:scale-95"
                >
                  💾 GUARDAR EN RECETARIO
                </button>
              </>
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