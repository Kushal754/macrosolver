// server/index.js

// ==========================================
// 1. IMPORTACIONES Y CONFIGURACIÓN
// ==========================================
const express = require('express');
const cors = require('cors');
const solver = require('javascript-lp-solver');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Importamos el SDK de Gemini
require('dotenv').config();

const app = express();

app.use(cors()); 
app.use(express.json()); 


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ==========================================
// 2. LÓGICA INTERNA: ALGORITMO MATEMÁTICO
// ==========================================
function calculateGrams(ingredients, targetMacros) {
  const variables = {};
  
  ingredients.forEach(ing => {
    variables[ing.name] = {
      protein: ing.macros.protein / 100,
      carbs: ing.macros.carbs / 100,
      fats: ing.macros.fats / 100,
      cost: 1 
    };
  });

  const model = {
    optimize: "cost", 
    opType: "min",
    constraints: {
      protein: { equal: targetMacros.protein }, 
      carbs: { equal: targetMacros.carbs },     
      fats: { equal: targetMacros.fats }        
    },
    variables: variables
  };

  return solver.Solve(model);
}

// ==========================================
// 3. RUTAS DEL SERVIDOR
// ==========================================

app.get('/api/test', (req, res) => {
  res.json({ mensaje: '¡Conexión exitosa! Hola desde el Backend 🚀' });
});

// Endpoint unificado: Calcula gramos y genera la receta con IA
app.post('/api/calculate', async (req, res) => {
  try {
    const { ingredients, targetMacros } = req.body;
    
    // 1. Ejecutar cálculo matemático
    const mathResults = calculateGrams(ingredients, targetMacros);

    
    if (!mathResults.feasible) {
      return res.json({
        success: false,
        error: 'No es posible cuadrar esos macros exactos con los ingredientes proporcionados.'
      });
    }

    
    const exactGrams = {};
    ingredients.forEach(ing => {
      exactGrams[ing.name] = mathResults[ing.name] ? Math.round(mathResults[ing.name] * 10) / 10 : 0;
    });


    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    
    const prompt = `Actúa como un chef experto y nutricionista clínico.
    Te proporciono una lista de ingredientes con sus cantidades exactas calculadas matemáticamente para cumplir con una dieta:
    ${JSON.stringify(exactGrams)}g.
    
    Por favor, genera una receta culinaria rápida, saludable y bien estructurada utilizando exclusivamente estos ingredientes (puedes asumir que el usuario tiene sal, pimienta y agua). 
    
    Estructura la respuesta estrictamente con las siguientes secciones en formato texto plano limpio:
    - Nombre de la receta (atractivo)
    - Tiempo estimado de preparación
    - Instrucciones paso a paso detalladas
    - Un consejo técnico de cocina para mejorar el sabor.`;

    const aiResponse = await model.generateContent(prompt);
    const recipeText = aiResponse.response.text();

   
    res.json({
      success: true,
      grams: exactGrams,
      recipe: recipeText
    });

  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ success: false, error: 'Fallo crítico en el procesamiento del servidor.' });
  }
});

// ==========================================
// 4. ENCENDIDO DEL SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
  console.log(`✅ Servidor Backend corriendo perfectamente en http://localhost:${PORT}`);
});