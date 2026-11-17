import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  analyzeResume,
  getAnalysisHistory,
  getAnalysisById,
} from "../controllers/analysisController.js";

import { generateInterviewQuestions } from "../controllers/interviewController.js";

const router = express.Router();

router.post("/", authMiddleware, analyzeResume);
router.get("/history", authMiddleware, getAnalysisHistory);
router.get("/history/:id", authMiddleware, getAnalysisById); // thiis line i wrote
router.post(
  "/:analysisId/interview-questions",
  authMiddleware,
  generateInterviewQuestions,
);

export default router;
