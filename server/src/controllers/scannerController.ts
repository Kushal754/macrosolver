// server/src/controllers/scannerController.ts
import { Request, Response } from 'express';
import { analyzeFoodImage } from '../services/scannerService.js';

export const scanFood = async (req: Request, res: Response) => {
  try {
    const { image, mimeType } = req.body;
    const analysis = await analyzeFoodImage(image, mimeType);
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error procesando la imagen', error });
  }
};