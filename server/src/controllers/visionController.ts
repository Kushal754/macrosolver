import { Request, Response } from 'express';
import multer from 'multer';
import { analyzeImageAndCalculate } from '../services/visionService.js';


const storage = multer.memoryStorage();
export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

export const processImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No se ha subido ninguna imagen' });
      return;
    }

    
    const imageBase64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    
    
    const targetMacros = JSON.parse(req.body.targetMacros || '{}');

    
    const result = await analyzeImageAndCalculate(imageBase64, mimeType, targetMacros);
    
    res.json(result);
  } catch (error) {
    console.error('❌ Error en el controlador de visión:', error);
    res.status(500).json({ error: 'Fallo interno al analizar la imagen' });
  }
};