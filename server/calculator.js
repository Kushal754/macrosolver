// server/calculator.js
const solver = require('javascript-lp-solver');

// Esta función recibe los ingredientes que tiene el usuario y los macros que quiere
function calculateGrams(ingredients, targetMacros) {
  
  // 1. Preparamos los datos para que el Solver los entienda
  const variables = {};
  
  ingredients.forEach(ing => {
    // Definimos qué aporta cada ingrediente por cada 1 gramo
    variables[ing.name] = {
      protein: ing.macros.protein / 100, // Ej: si el pollo tiene 25g/100g, por gramo tiene 0.25g
      carbs: ing.macros.carbs / 100,
      fats: ing.macros.fats / 100,
      cost: 1 // Queremos minimizar la cantidad total de gramos
    };
  });

  // 2. Definimos las reglas del juego (El "Modelo")
  const model = {
    optimize: "cost", // Queremos la menor cantidad posible de comida para llegar al objetivo
    opType: "min",
    constraints: {
      protein: { equal: targetMacros.protein }, // La proteína tiene que ser EXACTA a la pedida
      carbs: { equal: targetMacros.carbs },     // Los carbos tienen que ser EXACTOS
      fats: { equal: targetMacros.fats }        // Las grasas tienen que ser EXACTAS
    },
    variables: variables
  };

  // 3. ¡Que la magia matemática actúe!
  const results = solver.Solve(model);
  
  return results;
}

// Exportamos la función para poder usarla en index.js
module.exports = { calculateGrams };