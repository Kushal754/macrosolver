import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// 1. Añadimos la interfaz del Historial
interface DailyRecord {
  date: string;
  consumedCalories: number;
  burnedCalories: number;
  targetCalories: number;
}

interface UserGoals { protein: number; carbs: number; fats: number; calories: number; }
interface DailyProgress { consumedProtein: number; consumedCarbs: number; consumedFats: number; consumedCalories: number; burnedCalories: number; }

interface MacroContextType {
  goals: UserGoals;
  progress: DailyProgress;
  history: DailyRecord[]; // <-- Nuevo estado
  updateGoals: (newGoals: Partial<UserGoals>) => void;
  addConsumedMacros: (macros: { protein: number; carbs: number; fats: number }) => void;
  addBurnedCalories: (calories: number) => void;
  closeDay: () => void; // <-- Nueva función
  resetDaily: () => void;
}

const MacroContext = createContext<MacroContextType | undefined>(undefined);

export const MacroProvider = ({ children }: { children: ReactNode }) => {
  
  const [goals, setGoals] = useState<UserGoals>(() => {
    const saved = localStorage.getItem('fridge_goals');
    return saved ? JSON.parse(saved) : { protein: 150, carbs: 200, fats: 60, calories: 2000 };
  });

  const [progress, setProgress] = useState<DailyProgress>(() => {
    const saved = localStorage.getItem('fridge_progress');
    return saved ? JSON.parse(saved) : {
      consumedProtein: 0, consumedCarbs: 0, consumedFats: 0,
      consumedCalories: 0, burnedCalories: 0
    };
  });

  // <-- NUEVO: Estado para el historial
  const [history, setHistory] = useState<DailyRecord[]>(() => {
    const saved = localStorage.getItem('fridge_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Observadores de guardado
  useEffect(() => { localStorage.setItem('fridge_goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('fridge_progress', JSON.stringify(progress)); }, [progress]);
  useEffect(() => { localStorage.setItem('fridge_history', JSON.stringify(history)); }, [history]);

  const updateGoals = (newGoals: Partial<UserGoals>) => { setGoals(prev => ({ ...prev, ...newGoals })); };

  const addConsumedMacros = (macros: { protein: number; carbs: number; fats: number }) => {
    const newCalories = (macros.protein * 4) + (macros.carbs * 4) + (macros.fats * 9);
    setProgress(prev => ({
      ...prev,
      consumedProtein: prev.consumedProtein + macros.protein,
      consumedCarbs: prev.consumedCarbs + macros.carbs,
      consumedFats: prev.consumedFats + macros.fats,
      consumedCalories: prev.consumedCalories + newCalories
    }));
  };

  const addBurnedCalories = (calories: number) => {
    setProgress(prev => ({ ...prev, burnedCalories: prev.burnedCalories + calories }));
  };

  const resetDaily = () => {
    setProgress({ consumedProtein: 0, consumedCarbs: 0, consumedFats: 0, consumedCalories: 0, burnedCalories: 0 });
  };

  // <-- NUEVA FUNCIÓN: Cerrar el día
  const closeDay = () => {
    const today = new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
    
    const newRecord: DailyRecord = {
      date: today,
      consumedCalories: progress.consumedCalories,
      burnedCalories: progress.burnedCalories,
      targetCalories: goals.calories
    };

    setHistory(prev => {
      // Guardamos un máximo de 7 días
      const newHistory = [...prev, newRecord];
      return newHistory.slice(-7); 
    });

    resetDaily(); // Empezamos limpios al día siguiente
  };

  return (
    <MacroContext.Provider value={{ goals, progress, history, updateGoals, addConsumedMacros, addBurnedCalories, closeDay, resetDaily }}>
      {children}
    </MacroContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMacroContext = () => {
  const context = useContext(MacroContext);
  if (!context) throw new Error("useMacroContext debe usarse dentro de un MacroProvider");
  return context;
};