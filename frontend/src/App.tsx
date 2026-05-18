// src/App.tsx
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Gym from './pages/Gym'; 
import Profile from './pages/Profile';
import NotFound from './pages/NotFound'; // El 404 nuevo

interface NavButtonProps {
  active: boolean;
  label: string;
  icon: string;
  onClick: () => void;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Función para determinar qué pestaña está activa según la URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/scanner') return 'scanner';
    if (path === '/gym') return 'gym';
    if (path === '/profile') return 'profile';
    return '';
  };

  const activeTab = getActiveTab();

  return (
    <div className="bg-[#0f172a] min-h-screen flex justify-center items-center font-sans">
      <div className="w-full max-w-md h-screen sm:h-[844px] bg-slate-50 relative shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col sm:rounded-[3rem] sm:border-[8px] sm:border-slate-800">
        
        {/* Barra Superior */}
        <div className="h-10 w-full flex justify-between items-center px-8 pt-4 pb-2 bg-slate-50 z-20">
          <span className="text-xs font-bold text-slate-800">9:41</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-4 rounded-full border-2 border-slate-800"></div>
            <div className="w-4 h-4 bg-slate-800 rounded-full"></div>
          </div>
        </div>

        {/* CONTENEDOR DE RUTAS OFICIALES */}
        <div className="flex-1 overflow-y-auto pb-32 pt-2">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/gym" element={<Gym />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} /> {/* Ruta para el 404 */}
          </Routes>
        </div>

        {/* Barra de Navegación Inferior */}
        <nav className="absolute bottom-0 w-full h-24 bg-white/80 backdrop-blur-xl border-t border-slate-200 flex items-center justify-between px-4 z-50">
          <div className="flex flex-1 justify-around">
            <NavButton active={activeTab === 'home'} label="Home" icon="📊" onClick={() => navigate('/')} />
            <NavButton active={activeTab === 'gym'} label="Rutina" icon="🏋️‍♂️" onClick={() => navigate('/gym')} />
          </div>

          <button 
            onClick={() => navigate('/scanner')}
            className={`-mt-10 mx-2 w-16 h-16 shrink-0 rounded-full flex items-center justify-center text-2xl shadow-xl transition-all duration-300 border-4 border-white ${
              activeTab === 'scanner' ? 'bg-slate-900 text-white' : 'bg-green-500 text-white hover:scale-105'
            }`}
          >
            📸
          </button>
          
          <div className="flex flex-1 justify-around">
            <NavButton active={activeTab === 'profile'} label="Perfil" icon="⚙️" onClick={() => navigate('/profile')} />
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