// frontend/src/context/MacroContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiClient, type Macros, type UserProfile } from '../api/client';

interface MacroContextType {
  consumedMacros: Macros;
  targetMacros: Macros;
  burnedCalories: number;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  addConsumedMacros: (macros: Macros) => Promise<void>;
  addBurnedCalories: (calories: number) => Promise<void>;
  updateProfileAndTargets: (profile: UserProfile, targets: Macros) => Promise<void>;
  resetDay: () => Promise<void>;
}

const MacroContext = createContext<MacroContextType | undefined>(undefined);

export function MacroProvider({ children }: { children: ReactNode }) {
  const [consumedMacros, setConsumedMacros] = useState<Macros>({ protein: 0, carbs: 0, fats: 0 });
  const [targetMacros, setTargetMacros] = useState<Macros>({ protein: 150, carbs: 200, fats: 65 });
  const [burnedCalories, setBurnedCalories] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiClient.getDashboard();
        setConsumedMacros(data.consumedMacros);
        setTargetMacros(data.targetMacros);
        setBurnedCalories(data.burnedCalories);
        setUserProfile(data.userProfile);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error de conexión con el servidor';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const addConsumedMacros = async (macros: Macros) => {
    try {
      const updated = await apiClient.addConsumedMacros(macros);
      setConsumedMacros(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const addBurnedCalories = async (calories: number) => {
    try {
      const result = await apiClient.addBurnedCalories(calories);
      setBurnedCalories(result.burnedCalories);
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfileAndTargets = async (profile: UserProfile, targets: Macros) => {
    try {
      await apiClient.updateProfile(profile, targets);
      setUserProfile(profile);
      setTargetMacros(targets);
    } catch (err) {
      console.error(err);
    }
  };

  const resetDay = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.resetDay();
      setConsumedMacros(data.consumedMacros);
      setTargetMacros(data.targetMacros);
      setBurnedCalories(data.burnedCalories);
      setUserProfile(data.userProfile);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MacroContext.Provider value={{
      consumedMacros, targetMacros, burnedCalories, userProfile, isLoading, error,
      addConsumedMacros, addBurnedCalories, updateProfileAndTargets, resetDay
    }}>
      {isLoading ? (
        <div className="bg-[#0f172a] min-h-screen flex justify-center items-center font-sans text-white font-bold animate-pulse">
          Conectando al servidor... 🚀
        </div>
      ) : error ? (
        <div className="bg-[#0f172a] min-h-screen flex justify-center items-center font-sans text-red-500 font-bold p-8 text-center">
          Error: {error} <br/> ¿Tienes el servidor encendido en el puerto 3000?
        </div>
      ) : (
        children
      )}
    </MacroContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMacroContext() {
  const context = useContext(MacroContext);
  if (context === undefined) {
    throw new Error('useMacroContext debe ser usado dentro de un MacroProvider');
  }
  return context;
}