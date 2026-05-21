import { GoogleGenerativeAI } from "@google/generative-ai";

// Pegamos la clave nueva directamente aquí. Sin variables de entorno.
const genAI = new GoogleGenerativeAI("AIzaSy...PEGA_TU_NUEVA_CLAVE_AQUI");

async function run() {
  try {
    console.log("Conectando con Google...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Responde solo con la palabra BINGO.");
    console.log("✅ RESPUESTA DE GOOGLE:", result.response.text());
  } catch (error) {
    console.error("❌ ERROR REAL:", error.message);
  }
}

run();