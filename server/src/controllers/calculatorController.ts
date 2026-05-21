// server/src/controllers/calculatorController.ts
import { Request, Response } from 'express';
import { calculatePortionsAndRecipe } from '../services/calculatorService.js';

export const calculateMacros = async (req: Request, res: Response): Promise<void> => {
  try {
    const { targetMacros, ingredients } = req.body;

    if (!targetMacros || !ingredients) {
      res.status(400).json({ success: false, error: "Faltan objetivos o ingredientes" });
      return;
    }

    const data = await calculatePortionsAndRecipe(targetMacros, ingredients);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: "Fallo en el servidor al calcular la receta" });
  }
};