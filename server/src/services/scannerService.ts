// server/src/services/scannerService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const analyzeFoodImage = async (base64Image: string, mimeType: string) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
    Analiza esta imagen de comida. Estima las calorías, proteínas, carbohidratos y grasas.
    Devuelve SOLO un objeto JSON sin formato markdown:
    { "name": "Nombre", "calories": 0, "protein": 0, "carbs": 0, "fats": 0 }
  `;

  const imagePart = { inlineData: { data: base64Image, mimeType: mimeType } };
  const result = await model.generateContent([prompt, imagePart]);
  const responseText = result.response.text();
  return JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
};