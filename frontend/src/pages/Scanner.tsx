// src/pages/Scanner.tsx
import { useState } from 'react';

export default function Scanner() {
  
  const [isScanning, setIsScanning] = useState(false);

  
  const handleScan = () => {
    setIsScanning(true); 
    
    
    setTimeout(() => {
      setIsScanning(false); 
      alert("📸 (Simulación) ¡Ingredientes detectados: Pollo, Huevos, Tomate!");
    }, 2500);
  };

  return (
    <div className="p-4 space-y-6 pb-24 h-screen flex flex-col">
      
      {/* 1. Cabecera */}
      <div className="text-center mt-2">
        <h1 className="text-2xl font-extrabold text-slate-800">
          Fridge <span className="text-green-500">Vision</span> 📸
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Apunta a tu nevera para detectar ingredientes
        </p>
      </div>

      {/* 2. El Visor de la Cámara */}
      {/* flex-1 hace que este cuadro ocupe todo el espacio sobrante de la pantalla */}
      <div className="flex-1 bg-slate-900 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-inner border-4 border-slate-800">
        
        {/* Las 4 esquinas de enfoque (como en una cámara de verdad) */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-green-500 rounded-tl-lg"></div>
        <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-green-500 rounded-tr-lg"></div>
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-green-500 rounded-bl-lg"></div>
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-green-500 rounded-br-lg"></div>

        {/* Lógica: Si está escaneando mostramos el láser, si no, un texto */}
        {isScanning ? (
          <div className="absolute w-full h-1 bg-green-400 shadow-[0_0_15px_3px_rgba(74,222,128,0.5)] animate-scan"></div>
        ) : (
          <p className="text-slate-400 text-sm font-medium animate-pulse">
            Esperando cámara...
          </p>
        )}
      </div>

      {/* 3. Botón de Acción */}
      <div className="mt-auto pt-4">
        <button
          onClick={handleScan}
          disabled={isScanning} 
          className={`w-full py-4 rounded-2xl font-bold text-lg text-white transition-all shadow-lg active:scale-95 ${
            isScanning ? 'bg-slate-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isScanning ? '🔍 ANALIZANDO...' : 'ESCANEAR NEVERA'}
        </button>
      </div>

    </div>
  );
}