import Analysis from "../models/Analysis.js";

import { generateInterviewQuestionsWithGemini } from "../services/aiService.js";

export const generateInterviewQuestions = async (req, res) => {
  try {
    const { analysisId } = req.params;

    // Find analysis belonging to logged-in user
    const analysis = await Analysis.findOne({
      _id: analysisId,
      user: req.user,
    }).populate("resume");

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found",
      });
    }

    // Check whether questions already exist
    if (
      analysis.technicalQuestions?.length > 0 &&
      analysis.hrQuestions?.length > 0
    ) {
      return res.status(200).json({
        message: "Interview questions already generated",
        data: {
          technicalQuestions: analysis.technicalQuestions,
          hrQuestions: analysis.hrQuestions,
        },
      });
    }

    // Generate questions using Gemini
    const questions = await generateInterviewQuestionsWithGemini({
      resumeText: analysis.resume.resumeText,
      jobDescription: analysis.jobDescription,
    });

    // Save questions in MongoDB
    analysis.technicalQuestions = questions.technicalQuestions;
    analysis.hrQuestions = questions.hrQuestions;

    await analysis.save();

    return res.status(200).json({
      message: "Interview questions generated successfully",
      data: questions,
    });
  } catch (error) {
    console.error("Interview question generation error:", error);

    return res.status(500).json({
      message: "Failed to generate interview questions",
    });
  }
};
