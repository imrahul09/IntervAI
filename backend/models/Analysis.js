import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    matchScore: {
      type: Number,
      required: true,
    },

    matchedSkills: [String],
    missingSkills: [String],
    strengths: [String],
    weakness: [String],
    suggestions: [String],

    technicalQuestions: [
      {
        question: {
          type: String,
        },
        topic: {
          type: String,
        },
        difficulty: {
          type: String,
        },
        relevance: {
          type: String,
        },
      },
    ],

    hrQuestions: [
      {
        question: {
          type: String,
        },
        category: {
          type: String,
        },
        relevance: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true },
);

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;
