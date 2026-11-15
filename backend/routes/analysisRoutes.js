import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  analyzeResume,
  getAnalysisHistory,
  getAnalysisById,
} from "../controllers/analysisController.js";

const router = express.Router();

router.post("/", authMiddleware, analyzeResume);
router.get("/history", authMiddleware, getAnalysisHistory);
router.get("/history/:id", authMiddleware, getAnalysisById); // thiis line i wrote

export default router;
