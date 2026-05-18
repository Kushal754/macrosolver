// src/context/MacroContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// 1. Definimos las interfaces estrictas (TypeScript)
interface Macros {
  protein: number;
  carbs: number;
  fats: number;
}

interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: 'M' | 'F';
  goal: 'cut' | 'maintain' | 'bulk';
}

interface MacroContextType {
  consumedMacros: Macros;
  targetMacros: Macros;
  burnedCalories: number;
  userProfile: UserProfile | null;
  addConsumedMacros: (macros: Macros) => void;
  addBurnedCalories: (calories: number) => void;
  updateProfileAndTargets: (profile: UserProfile, targets: Macros) => void;
  resetDay: () => void;
}

// 2. Creamos el Contexto vacío
const MacroContext = createContext<MacroContextType | undefined>(undefined);

// 3. Creamos el Provider
export function MacroProvider({ children }: { children: ReactNode }) {
  const [consumedMacros, setConsumedMacros] = useState<Macros>(() => {
    const saved = localStorage.getItem('macrosConsumidos');
    if (saved) {
      try { return JSON.parse(saved); } catch { return { protein: 0, carbs: 0, fats: 0 }; }
    }
    return { protein: 0, carbs: 0, fats: 0 };
  });

  const [targetMacros, setTargetMacros] = useState<Macros>(() => {
    const saved = localStorage.getItem('macroTargets');
    if (saved) {
      try { return JSON.parse(saved); } catch { return { protein: 150, carbs: 200, fats: 65 }; }
    }
    return { protein: 150, carbs: 200, fats: 65 };
  });

  const [burnedCalories, setBurnedCalories] = useState<number>(() => {
    const saved = localStorage.getItem('caloriasQuemadas');
    return saved ? (parseInt(saved, 10) || 0) : 0;
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('macrosConsumidos', JSON.stringify(consumedMacros));
    localStorage.setItem('macroTargets', JSON.stringify(targetMacros));
    localStorage.setItem('caloriasQuemadas', burnedCalories.toString());
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [consumedMacros, targetMacros, burnedCalories, userProfile]);

  const addConsumedMacros = (macros: Macros) => {
    setConsumedMacros(prev => ({
      protein: prev.protein + macros.protein,
      carbs: prev.carbs + macros.carbs,
      fats: prev.fats + macros.fats
    }));
  };

  const addBurnedCalories = (calories: number) => {
    setBurnedCalories(prev => prev + calories);
  };

  const updateProfileAndTargets = (profile: UserProfile, targets: Macros) => {
    setUserProfile(profile);
    setTargetMacros(targets);
  };

  const resetDay = () => {
    setConsumedMacros({ protein: 0, carbs: 0, fats: 0 });
    setBurnedCalories(0);
  };

  return (
    <MacroContext.Provider value={{
      consumedMacros, targetMacros, burnedCalories, userProfile,
      addConsumedMacros, addBurnedCalories, updateProfileAndTargets, resetDay
    }}>
      {children}
    </MacroContext.Provider>
  );
}

// 4. Custom Hook (Silenciamos la regla de recarga rápida de Vite para esta línea)
// eslint-disable-next-line react-refresh/only-export-components
export function useMacroContext() {
  const context = useContext(MacroContext);
  if (context === undefined) {
    throw new Error('useMacroContext debe ser usado dentro de un MacroProvider');
  }
  return context;
}