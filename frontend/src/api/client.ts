// frontend/src/api/client.ts

const API_URL = 'http://localhost:3000/api/v1';

export interface Macros {
  protein: number;
  carbs: number;
  fats: number;
}

export interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: 'M' | 'F';
  goal: 'cut' | 'maintain' | 'bulk';
}

export interface DashboardData {
  consumedMacros: Macros;
  targetMacros: Macros;
  burnedCalories: number;
  userProfile: UserProfile | null;
}

export interface ProfileUpdateResponse {
  profile: UserProfile;
  targets: Macros;
}

export const apiClient = {
  getDashboard: async (): Promise<DashboardData> => {
    const res = await fetch(`${API_URL}/dashboard`);
    if (!res.ok) throw new Error('Error al cargar el dashboard');
    return res.json() as Promise<DashboardData>;
  },

  addConsumedMacros: async (macros: Macros): Promise<Macros> => {
    const res = await fetch(`${API_URL}/macros/consume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(macros),
    });
    if (!res.ok) throw new Error('Error al registrar macros');
    return res.json() as Promise<Macros>;
  },

  addBurnedCalories: async (calories: number): Promise<{ burnedCalories: number }> => {
    const res = await fetch(`${API_URL}/calories/burn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ calories }),
    });
    if (!res.ok) throw new Error('Error al registrar calorías');
    return res.json() as Promise<{ burnedCalories: number }>;
  },

  updateProfile: async (profile: UserProfile, targets: Macros): Promise<ProfileUpdateResponse> => {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, targets }),
    });
    if (!res.ok) throw new Error('Error al guardar el perfil');
    return res.json() as Promise<ProfileUpdateResponse>;
  },

  resetDay: async (): Promise<DashboardData> => {
    const res = await fetch(`${API_URL}/reset`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al reiniciar el día');
    return res.json() as Promise<DashboardData>;
  }
};