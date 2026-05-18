// src/App.tsx
import { useState } from 'react';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Gym from './pages/Gym'; 
import Profile from './pages/Profile'; // <-- Aquí importamos la 4ª pantalla

interface NavButtonProps {
  active: boolean;
  label: string;
  icon: string;
  onClick: () => void;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  return (
    <div className="bg-[#0f172a] min-h-screen flex justify-center items-center font-sans">
      <div className="w-full max-w-md h-screen sm:h-[844px] bg-slate-50 relative shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col sm:rounded-[3rem] sm:border-[8px] sm:border-slate-800">
        
        <div className="h-10 w-full flex justify-between items-center px-8 pt-4 pb-2 bg-slate-50 z-20">
          <span className="text-xs font-bold text-slate-800">9:41</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-4 rounded-full border-2 border-slate-800"></div>
            <div className="w-4 h-4 bg-slate-800 rounded-full"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-32 pt-2">
          {activeTab === 'home' && <Home />}
          {activeTab === 'scanner' && <Scanner />}
          {activeTab === 'gym' && <Gym />}
          {activeTab === 'profile' && <Profile />}
        </div>

        {/* Barra de Navegación con los 4 botones */}
        <nav className="absolute bottom-0 w-full h-24 bg-white/80 backdrop-blur-xl border-t border-slate-200 flex items-center justify-between px-4 z-50">
          
          <div className="flex flex-1 justify-around">
            <NavButton active={activeTab === 'home'} label="Home" icon="📊" onClick={() => setActiveTab('home')} />
            <NavButton active={activeTab === 'gym'} label="Rutina" icon="🏋️‍♂️" onClick={() => setActiveTab('gym')} />
          </div>

          <button 
            onClick={() => setActiveTab('scanner')}
            className={`-mt-10 mx-2 w-16 h-16 shrink-0 rounded-full flex items-center justify-center text-2xl shadow-xl transition-all duration-300 border-4 border-white ${
              activeTab === 'scanner' ? 'bg-slate-900 text-white' : 'bg-green-500 text-white'
            }`}
          >
            📸
          </button>
          
          <div className="flex flex-1 justify-around">
            <NavButton active={activeTab === 'profile'} label="Perfil" icon="⚙️" onClick={() => setActiveTab('profile')} />
          </div>

        </nav>
      </div>
    </div>
  );
}

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