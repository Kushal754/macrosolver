// src/pages/NotFound.tsx
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4 animate-fadeIn">
      <div className="text-8xl mb-4">🛸</div>
      <h1 className="text-5xl font-black text-slate-800 tracking-tighter">404</h1>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Página no encontrada</p>
      <p className="text-slate-400 text-xs mb-8">Parece que te has perdido en el hiperespacio nutricional.</p>
      
      <button 
        onClick={() => navigate('/')}
        className="bg-blue-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/30 hover:scale-105 transition-all"
      >
        Volver a la Base
      </button>
    </div>
  );
}