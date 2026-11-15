// we have to save the resume text in the db

import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
  },
  {
    timeStamps: true,
  },
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
