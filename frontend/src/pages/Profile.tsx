import { useState } from 'react';

// Estructura de los datos del usuario
interface UserProfile {
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female';
  activityLevel: number;
  goal: 'cut' | 'maintain' | 'bulk';
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
}

export default function Profile() {
  // Inicializamos leyendo de la memoria por si ya se había guardado antes
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      age: 25,
      weight: 70,
      height: 175,
      gender: 'male',
      activityLevel: 1.55, // Actividad moderada por defecto
      goal: 'maintain',
      targetCalories: 0, targetProtein: 0, targetCarbs: 0, targetFats: 0
    };
  });

  const [savedMessage, setSavedMessage] = useState(false);

  // LA MAGIA MATEMÁTICA: Fórmula de Harris-Benedict
  const calculateMacros = () => {
    let bmr; 
    
    if (profile.gender === 'male') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    }

    // Calorías de mantenimiento (Gasto Total Diario)
    let tdee = bmr * profile.activityLevel;

    // Ajuste según el objetivo
    if (profile.goal === 'cut') tdee -= 500; // Déficit para definir
    if (profile.goal === 'bulk') tdee += 500; // Superávit para crecer

    const finalCalories = Math.round(tdee);

    // Reparto de Macros Profesional:
    // Proteína: 2.2g por kilo de peso corporal
    // Grasas: 1g por kilo de peso
    // Carbos: El resto de calorías que sobren
    const protein = Math.round(profile.weight * 2.2);
    const fats = Math.round(profile.weight * 1);
    const proteinCals = protein * 4;
    const fatsCals = fats * 9;
    const carbs = Math.round((finalCalories - proteinCals - fatsCals) / 4);

    const updatedProfile = {
      ...profile,
      targetCalories: finalCalories,
      targetProtein: protein,
      targetFats: fats,
      targetCarbs: carbs
    };

    // Guardamos en estado y en la memoria del navegador
    setProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    // Mostramos feedback visual
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50 pb-32">
      <div className="mt-4">
        <h1 className="text-3xl font-extrabold text-slate-800">Tu Perfil</h1>
        <p className="text-slate-500 font-medium mt-1">Personaliza tu nutrición 🧬</p>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-5">
        
        {/* Fila Edad y Género */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Edad</label>
            <input type="number" value={profile.age} onChange={e => setProfile({...profile, age: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"/>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Género</label>
            <select value={profile.gender} onChange={e => setProfile({...profile, gender: e.target.value as 'male'|'female'})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all">
              <option value="male">Hombre</option>
              <option value="female">Mujer</option>
            </select>
          </div>
        </div>

        {/* Fila Peso y Altura */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Peso (kg)</label>
            <input type="number" value={profile.weight} onChange={e => setProfile({...profile, weight: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"/>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Altura (cm)</label>
            <input type="number" value={profile.height} onChange={e => setProfile({...profile, height: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"/>
          </div>
        </div>

        {/* Actividad y Objetivo */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Nivel de Actividad</label>
          <select value={profile.activityLevel} onChange={e => setProfile({...profile, activityLevel: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all">
            <option value={1.2}>Sedentario (Trabajo de oficina)</option>
            <option value={1.375}>Ligero (Ejercicio 1-3 días)</option>
            <option value={1.55}>Moderado (Ejercicio 3-5 días)</option>
            <option value={1.725}>Intenso (Ejercicio 6-7 días)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Tu Meta</label>
          <select value={profile.goal} onChange={e => setProfile({...profile, goal: e.target.value as 'cut'|'maintain'|'bulk'})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all">
            <option value="cut">Definir (Perder grasa)</option>
            <option value="maintain">Mantenimiento</option>
            <option value="bulk">Volumen (Ganar músculo)</option>
          </select>
        </div>

        <button 
          onClick={calculateMacros}
          className="w-full mt-4 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
        >
          CALCULAR Y GUARDAR
        </button>

        {savedMessage && (
          <p className="text-center text-green-500 font-bold text-sm animate-pulse">¡Perfil actualizado correctamente!</p>
        )}
      </div>

      {/* Resultados de los Macros (Si ya están calculados) */}
      {profile.targetCalories > 0 && (
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl animate-fade-in-up space-y-4">
          <h2 className="text-lg font-bold text-center border-b border-slate-700 pb-3">Tus Macros Diarios</h2>
          
          <div className="flex justify-center items-end gap-2">
            <span className="text-4xl font-black">{profile.targetCalories}</span>
            <span className="text-slate-400 mb-1">kcal</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Proteína</p>
              <p className="text-blue-400 font-bold text-lg">{profile.targetProtein}g</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Carbos</p>
              <p className="text-green-400 font-bold text-lg">{profile.targetCarbs}g</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Grasas</p>
              <p className="text-orange-400 font-bold text-lg">{profile.targetFats}g</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}