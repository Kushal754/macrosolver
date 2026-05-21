
import { Router } from 'express';
import { 
  getDashboard, 
  addConsumedMacros, 
  addBurnedCalories, 
  updateProfile, 
  resetDailyProgress 
} from '../controllers/macroController.js';


import { calculateMacros } from '../controllers/calculatorController.js'; 

const router = Router();

router.get('/dashboard', getDashboard);
router.post('/macros/consume', addConsumedMacros);
router.post('/calories/burn', addBurnedCalories);
router.post('/profile', updateProfile);
router.delete('/reset', resetDailyProgress);


router.post('/calculate', calculateMacros);

export default router;