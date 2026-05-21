import { Request, Response } from 'express';
import { macroService } from '../services/macroService.js';

export const getDashboard = (_req: Request, res: Response) => { res.status(200).json(macroService.getDashboardData()); };
export const addConsumedMacros = (req: Request, res: Response) => { res.status(201).json(macroService.addConsumed(req.body)); };
export const addBurnedCalories = (req: Request, res: Response) => { res.status(201).json({ burnedCalories: macroService.addCalories(req.body.calories) }); };
export const updateProfile = (req: Request, res: Response) => { res.status(200).json(macroService.updateProfile(req.body.profile, req.body.targets)); };
export const resetDailyProgress = (_req: Request, res: Response) => { res.status(200).json(macroService.resetState()); };