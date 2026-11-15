import Resume from "../models/Resume.js";
import Analysis from "../models/Analysis.js";
import { analyzeResumeWithGemini } from "../services/aiService.js";

export const analyzeResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        message: "Resume ID and job description are required",
      });
    }

    // find the resume belonging to the logged-in-user
    const resume = await Resume.findOne({ _id: resumeId, user: req.user });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    // prepare the data for AI analysis
    const analysis = await analyzeResumeWithGemini({
      resumeText: resume.resumeText,
      jobDescription: jobDescription.trim(),
    });

    const savedAnalysis = await Analysis.create({
      user: req.user,
      resume: resume._id,
      jobDescription: jobDescription.trim(),

      matchScore: analysis.matchScore,
      matchedSkills: analysis.matchedSkills,
      missingSkills: analysis.missingSkills,
      strengths: analysis.strengths,
      weakness: analysis.weakness,
      suggestions: analysis.suggestions,
    });

    return res.status(200).json({
      message: "Resume analyze and saved successfully",
      data: {
        ...analysis,
        analysisId: savedAnalysis._id,
      },
    });
  } catch (error) {
    console.error("Resume analysis error", error);

    return res.status(500).json({
      message: "Failed to prepare resume analysis",
    });
  }
};

export const getAnalysisHistory = async (req, res) => {
  try {
    const history = await Analysis.find({ user: req.user }) // find saved analysis only the logged-in users
      .populate("resume", "fileName") // retrieve the associated resumes filename
      .select("-jobDescription") // exclude the potentially large job description
      .sort({ createdAt: -1 }); // shows newest first

    return res.status(200).json({
      message: "Analysis history fetched successfully",
      history,
    });
  } catch (error) {
    console.error("Analysis history error:", error);
    return res.status(500).json({
      message: "Failed to fetch analysis history",
    });
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id, // identifies the particular reporrt
      user: req.user, // ensure the report belongs to the currently logged-in user
    }).populate("resume", "fileName");

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis report not found",
      });
    }

    return res.status(200).json({
      message: "Analysis report fetched successfully",
      analysis,
    });
  } catch (error) {
    console.error("Fetch analysis report error", error);

    return res.status(500).json({
      message: "Failed to fetch analysis report",
    });
  }
};
