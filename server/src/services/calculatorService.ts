import OpenAI from "openai";

export const calculatePortionsAndRecipe = async (targetMacros: any, ingredients: any) => {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN no está definido en el .env");

    // Configuramos el cliente para que apunte a los servidores gratuitos de GitHub
    const openai = new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: token,
    });

    const prompt = `
      Objetivo de macros: ${JSON.stringify(targetMacros)}
      Ingredientes disponibles: ${JSON.stringify(ingredients)}
      
      Calcula los gramos necesarios de cada ingrediente para cumplir los macros.
      Debes devolver ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
      {"success": true, "grams": {"Pollo": 150, "Arroz": 60, "Aceite_Oliva": 10}, "recipe": "Paso 1: Cocina el arroz..."}
    `;

    // Llamamos al modelo gpt-4o-mini (rápido, inteligente y gratis en GitHub)
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un experto en nutrición deportiva. Respondes siempre en JSON puro." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const cleanText = response.choices[0].message.content || "{}";
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("❌ ERROR EN EL TRY DE GITHUB:", error);
    
    const polloGrams = Math.round((targetMacros.protein / 31) * 100) || 0;
    const arrozGrams = Math.round((targetMacros.carbs / 28) * 100) || 0;
    const aceiteGrams = targetMacros.fats || 0;

    return {
      success: true,
      grams: {
        "Pollo": polloGrams,
        "Arroz": arrozGrams,
        "Aceite_Oliva": aceiteGrams
      },
      recipe: `*(Generado por el Motor de Respaldo)*\n\n1. Pesa exactamente ${polloGrams}g de pollo, ${arrozGrams}g de arroz y ${aceiteGrams}g de aceite.\n2. Cuece el arroz en agua con sal.\n3. Cocina el pollo a la plancha.\n4. ¡Listo!`
    };
  }
};