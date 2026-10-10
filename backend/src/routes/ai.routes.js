import { Router } from "express";
import { generateImprovementPlan } from "../controllers/ai.controller.js";

const router = Router();

router.post("/improvement-plan", generateImprovementPlan);

export default router;