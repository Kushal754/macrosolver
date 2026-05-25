import OpenAI from "openai";

export const analyzeImageAndCalculate = async (imageBase64: string, mimeType: string, targetMacros: any) => {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN no definido");

    const openai = new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: token,
    });

    const promptText = `
      Objetivo de macros: ${JSON.stringify(targetMacros)}
      
      1. Analiza la imagen adjunta e identifica todos los ingredientes comestibles que veas.
      2. Calcula los gramos necesarios de los ingredientes encontrados para cumplir los macros objetivo.
      3. Devuelve ÚNICAMENTE un JSON con esta estructura exacta:
      {"success": true, "grams": {"Ingrediente1": 150, "Ingrediente2": 60}, "recipe": "Paso 1..."}
    `;

    // Llamada con soporte de Visión
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un experto en nutrición. Respondes siempre en JSON puro." },
        { 
          role: "user", 
          content: [
            { type: "text", text: promptText },
            { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` } }
          ] 
        }
      ],
      response_format: { type: "json_object" }
    });

    const cleanText = response.choices[0].message.content || "{}";
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("❌ ERROR EN EL SERVICIO DE VISIÓN:", error);
    throw new Error("No se pudo procesar la imagen.");
  }
};