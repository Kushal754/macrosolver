// src/App.tsx
import React, { useState } from 'react';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Gym from './pages/Gym'; 

// Interfaz estricta para las propiedades del botón de navegación
interface NavButtonProps {
  active: boolean;
  label: string;
  icon: string;
  onClick: () => void;
}

export default function App() {
  // Forzamos al estado a aceptar únicamente nuestras tres pantallas válidas
  const [activeTab, setActiveTab] = useState<string>('home');

  return (
    <div className="bg-[#0f172a] min-h-screen flex justify-center items-center font-sans">
      
      {/* Marco de teléfono profesional */}
      <div className="w-full max-w-md h-screen sm:h-[844px] bg-slate-50 relative shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col sm:rounded-[3rem] sm:border-[8px] sm:border-slate-800">
        
        {/* Barra de Estado Superior */}
        <div className="h-10 w-full flex justify-between items-center px-8 pt-4 pb-2 bg-slate-50 z-20">
          <span className="text-xs font-bold text-slate-800">9:41</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-4 rounded-full border-2 border-slate-800"></div>
            <div className="w-4 h-4 bg-slate-800 rounded-full"></div>
          </div>
        </div>

        {/* Contenedor de Pantallas */}
        <div className="flex-1 overflow-y-auto pb-32 pt-2">
          {activeTab === 'home' && <Home />}
          {activeTab === 'scanner' && <Scanner />}
          {activeTab === 'gym' && <Gym />}
        </div>

        {/* Barra de Navegación Inferior */}
        <nav className="absolute bottom-0 w-full h-24 bg-white/80 backdrop-blur-xl border-t border-slate-200 flex items-center justify-around px-6 z-50">
          <NavButton 
            active={activeTab === 'home'} 
            label="Dashboard" 
            icon="📊" 
            onClick={() => setActiveTab('home')} 
          />
          
          <button 
            onClick={() => setActiveTab('scanner')}
            className={`-mt-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-xl transition-all duration-300 border-4 border-white ${
              activeTab === 'scanner' ? 'bg-slate-900 text-white' : 'bg-green-500 text-white'
            }`}
          >
            📸
          </button>
          
          <NavButton 
            active={activeTab === 'gym'} 
            label="Rutina" 
            icon="🏋️‍♂️" 
            onClick={() => setActiveTab('gym')} 
          />
        </nav>
      </div>
    </div>
  );
}

// Componente secundario NavButton con tipado explícito
function NavButton({ active, label, icon, onClick }: NavButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${
        active ? 'text-green-600 scale-110' : 'text-slate-400 opacity-70 hover:opacity-100'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}