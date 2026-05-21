import { GoogleGenerativeAI } from "@google/generative-ai";

// Pegamos la clave a fuego (hardcoded) solo para esta prueba
const genAI = new GoogleGenerativeAI("AIzaSyAEoIEQ_-OtjQtj_4LHvQ9KQd-83jF3mu8"); 

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Responde solo con la palabra FUNCIONA.");
    console.log("✅ RESPUESTA:", result.response.text());
  } catch (error) {
    console.error("❌ ERROR:", error.message);
  }
}

test();
