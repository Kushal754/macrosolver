export interface Macros { protein: number; carbs: number; fats: number; }
export interface UserProfile { weight: number; height: number; age: number; gender: 'M' | 'F'; goal: 'cut' | 'maintain' | 'bulk'; }

class MacroService {
  private consumedMacros: Macros = { protein: 0, carbs: 0, fats: 0 };
  private targetMacros: Macros = { protein: 150, carbs: 200, fats: 65 };
  private burnedCalories: number = 0;
  private userProfile: UserProfile | null = null;

  public getDashboardData() {
    return { consumedMacros: this.consumedMacros, targetMacros: this.targetMacros, burnedCalories: this.burnedCalories, userProfile: this.userProfile };
  }

  public addConsumed(macros: Macros) {
    this.consumedMacros.protein += macros.protein;
    this.consumedMacros.carbs += macros.carbs;
    this.consumedMacros.fats += macros.fats;
    return this.consumedMacros;
  }

  public addCalories(calories: number) {
    this.burnedCalories += calories;
    return this.burnedCalories;
  }

  public updateProfile(profile: UserProfile, targets: Macros) {
    this.userProfile = profile;
    this.targetMacros = targets;
    return { profile: this.userProfile, targets: this.targetMacros };
  }

  public resetState() {
    this.consumedMacros = { protein: 0, carbs: 0, fats: 0 };
    this.burnedCalories = 0;
    return this.getDashboardData();
  }
}
export const macroService = new MacroService();