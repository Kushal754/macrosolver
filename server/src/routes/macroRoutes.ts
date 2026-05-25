import { Router } from 'express';
import { 
  getDashboard, 
  addConsumedMacros, 
  addBurnedCalories, 
  updateProfile, 
  resetDailyProgress 
} from '../controllers/macroController.js';

import { calculateMacros } from '../controllers/calculatorController.js'; 


import { processImage, upload } from '../controllers/visionController.js';

const router = Router();

router.get('/dashboard', getDashboard);
router.post('/macros/consume', addConsumedMacros);
router.post('/calories/burn', addBurnedCalories);
router.post('/profile', updateProfile);
router.delete('/reset', resetDailyProgress);

router.post('/calculate', calculateMacros);


router.post('/vision/calculate', upload.single('image'), processImage);

export default router;