import { useMacroContext } from '../context/MacroContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts';

export default function Stats() {
  const { history, closeDay, progress } = useMacroContext();

  const handleCloseDay = () => {
    if (confirm("¿Estás seguro de cerrar el día de hoy? Tus datos actuales se guardarán en el historial y los contadores se pondrán a cero para mañana.")) {
      closeDay();
    }
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-slate-50 pb-24">
      
      <div className="flex justify-between items-center mt-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Tu Progreso</h1>
          <p className="text-sm text-slate-500 font-medium">Analiza tu tendencia semanal 📊</p>
        </div>
        
        {/* Botón de Cerrar Día */}
        <button 
          onClick={handleCloseDay}
          disabled={progress.consumedCalories === 0 && progress.burnedCalories === 0}
          className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 shadow-md"
        >
          🌙 CERRAR DÍA
        </button>
      </div>

      {history.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center space-y-3">
          <p className="text-4xl">📭</p>
          <h3 className="text-slate-700 font-bold">Aún no hay datos</h3>
          <p className="text-sm text-slate-400">Usa la aplicación durante el día y pulsa "Cerrar Día" para generar tus primeros gráficos.</p>
        </div>
      ) : (
        <>
          {/* GRÁFICO 1: Consumo vs Objetivo */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wide">Calorías Ingeridas</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                  <Bar dataKey="consumedCalories" name="Ingeridas" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  {/* Línea que marca el objetivo */}
                  <ReferenceLine y={history[history.length - 1]?.targetCalories || 2000} stroke="#ef4444" strokeDasharray="3 3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-400 text-center mt-2 font-medium">La línea roja indica tu objetivo calórico diario.</p>
          </div>

          {/* GRÁFICO 2: Calorías Quemadas */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wide">Actividad y Ejercicio</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="burnedCalories" name="Quemadas (Actividad)" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

    </div>
  );
}