import { useState, useEffect } from 'react';

interface Ingredient {
  id: number;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface Recipe {
  id: number;
  name: string;
  instructions: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  ingredients: Ingredient[];
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 1. NUEVO ESTADO PARA EL BUSCADOR
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/recipes');
        if (!response.ok) throw new Error('Fallo al cargar las recetas del servidor');
        
        const data = await response.json();
        setRecipes(data.reverse());
      } catch (err) {
        setError('No se pudo conectar con la base de datos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // 2. LÓGICA DEL FILTRO (Busca por título o por ingrediente)
  const filteredRecipes = recipes.filter(recipe => {
    const searchLower = searchTerm.toLowerCase();
    const matchName = recipe.name.toLowerCase().includes(searchLower);
    const matchIngredient = recipe.ingredients.some(ing => 
      ing.name.toLowerCase().includes(searchLower)
    );
    return matchName || matchIngredient;
  });

  return (
    <div className="p-5 space-y-6 min-h-screen bg-slate-50 pb-24">
      <div className="mt-4 space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Mi Recetario</h1>
          <p className="text-slate-500 font-medium mt-1">Tu historial de comidas guardadas 🍳</p>
        </div>

        {/* 3. BARRA DE BÚSQUEDA UI */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-400">🔍</span>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-all"
            placeholder="Buscar por nombre o ingrediente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-2xl border border-red-200">
          <p className="text-red-600 font-bold text-center">⚠️ {error}</p>
        </div>
      )}

      {!loading && !error && recipes.length === 0 && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center space-y-3">
          <p className="text-4xl">🍽️</p>
          <h3 className="text-slate-700 font-bold">Sin recetas todavía</h3>
          <p className="text-sm text-slate-400">Escanea tu primera comida y guárdala para verla aquí.</p>
        </div>
      )}

      {/* 4. MENSAJE SI LA BÚSQUEDA NO ENCUENTRA NADA */}
      {!loading && recipes.length > 0 && filteredRecipes.length === 0 && (
        <div className="text-center py-10 text-slate-500 font-medium">
          No se encontraron recetas con "{searchTerm}"
        </div>
      )}

      <div className="space-y-4">
        {/* 5. AHORA MAPEAMOS 'filteredRecipes' EN LUGAR DE 'recipes' */}
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3 transition-all hover:shadow-md">
            <h2 className="font-extrabold text-lg text-slate-800 leading-tight">
              {recipe.name}
            </h2>
            
            <div className="flex gap-2 text-xs font-bold">
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg">🔥 {recipe.totalCalories} kcal</span>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg">🥩 {recipe.totalProtein}g P</span>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-lg">🌾 {recipe.totalCarbs}g C</span>
            </div>

            <div className="mt-2 bg-slate-50 rounded-xl p-3 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ingredientes</h3>
              <ul className="space-y-1">
                {recipe.ingredients.map((ing) => (
                  <li key={ing.id} className="text-sm text-slate-700 flex justify-between">
                    <span>• {ing.name}</span>
                    <span className="font-medium text-slate-500">{ing.grams}g</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Preparación</h3>
              <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                {recipe.instructions}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}