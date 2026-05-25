import { useState } from 'react';
import { useMacroContext } from '../context/MacroContext';

export default function Profile() {
  const { updateGoals } = useMacroContext();
  
  const [formData, setFormData] = useState({
    gender: 'M',
    age: 18,
    weight: 70,
    height: 175,
    activity: 1.55, 
    goal: 'maintain' 
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaved(false); 
  };

  const calculateAndSave = () => {
    const { gender, age, weight, height, activity, goal } = formData;
    
    // 1. Fórmula Mifflin-St Jeor para TMB
    let tmb = (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age));
    tmb = gender === 'M' ? tmb + 5 : tmb - 161;

    // 2. Calorías de Mantenimiento (TMB x Factor de Actividad)
    const maintenanceCalories = tmb * Number(activity);

    // 3. Ajuste por Objetivo
    let targetCalories = maintenanceCalories;
    if (goal === 'lose') targetCalories -= 500; // Déficit
    if (goal === 'gain') targetCalories += 500; // Superávit

    // 4. Reparto de Macros Estándar (Fitness)
    // Proteína: 2.2g por kg de peso
    const targetProtein = Math.round(Number(weight) * 2.2);
    // Grasas: 1g por kg de peso
    const targetFats = Math.round(Number(weight) * 1);
    
    // Carbohidratos: El resto de las calorías
    // (Proteína = 4kcal/g, Grasas = 9kcal/g, Carbos = 4kcal/g)
    const caloriesFromProteinAndFats = (targetProtein * 4) + (targetFats * 9);
    const targetCarbs = Math.round((targetCalories - caloriesFromProteinAndFats) / 4);

    // 5. Inyectamos los nuevos objetivos en el Cerebro Global
    updateGoals({
      calories: Math.round(targetCalories),
      protein: targetProtein,
      carbs: targetCarbs,
      fats: targetFats
    });

    setSaved(true);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50 pb-24">
      <div className="mt-4">
        <h1 className="text-2xl font-extrabold text-slate-800">Tu Perfil Físico</h1>
        <p className="text-sm text-slate-500 font-medium">Calcula tus objetivos calóricos al milímetro</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
        
        {/* Género y Edad */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Género</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400">
              <option value="M">Hombre</option>
              <option value="F">Mujer</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Edad</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 text-center" />
          </div>
        </div>

        {/* Peso y Altura */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Peso (kg)</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 text-center" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Altura (cm)</label>
            <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 text-center" />
          </div>
        </div>

        {/* Nivel de Actividad */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Actividad Diaria</label>
          <select name="activity" value={formData.activity} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400">
            <option value="1.2">Sedentario (Trabajo de oficina, sin ejercicio)</option>
            <option value="1.375">Ligero (Ejercicio suave 1-3 días/semana)</option>
            <option value="1.55">Moderado (Ejercicio moderado 3-5 días/semana)</option>
            <option value="1.725">Activo (Ejercicio fuerte 6-7 días/semana)</option>
          </select>
        </div>

        {/* Objetivo */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tu Meta</label>
          <select name="goal" value={formData.goal} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400">
            <option value="lose">Perder Grasa (Déficit Calórico)</option>
            <option value="maintain">Mantener Peso (Normocalórica)</option>
            <option value="gain">Ganar Masa Muscular (Superávit)</option>
          </select>
        </div>

        {/* Botón de Guardado */}
        <button
          onClick={calculateAndSave}
          className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-md mt-4 active:scale-95 ${
            saved ? 'bg-green-500' : 'bg-slate-800 hover:bg-slate-900'
          }`}
        >
          {saved ? '✅ OBJETIVOS ACTUALIZADOS' : 'CALCULAR Y GUARDAR PERFIL'}
        </button>

      </div>
    </div>
  );
}