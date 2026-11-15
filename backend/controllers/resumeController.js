import { PDFParse } from "pdf-parse";
import Resume from "../models/Resume.js";

export const uploadResume = async (req, res) => {
  try {
    // check file exist
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a pdf resume",
      });
    }

    //extreact text from pdf
    const parser = new PDFParse({
      data: req.file.buffer,
    });

    let resumeText;

    try {
      const data = await parser.getText();
      resumeText = data.text.trim();
    } finally {
      await parser.destroy();
    }

    // check extracted text
    if (!resumeText) {
      return res.status(400).json({
        message: "Could not extract text from the pdf",
      });
    }

    //save resume in mongodb
    const resume = await Resume.create({
      user: req.user,
      fileName: req.file.originalname,
      resumeText,
    });

    res.status(200).json({
      message: "Resume uploaded successfully",
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        resumeText: resume.resumeText,
      },
    });
  } catch (error) {
    console.log("Resume upload error:", error);
    res.status(500).json({
      message: "Failed to upload resume",
    });
  }
};

export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user }) // retrieve only the current user resumes
      .select("fileName createdAt") // select only the field we need
      .sort({ createdAt: -1 }); // sort newest first

    res.status(200).json({
      // return the result
      message: "Resumes fetched suxessfully",
      resumes,
    });
  } catch (error) {
    console.error("Fetch resumes error ", error);
    res.status(500).json({
      message: "Failed to fetch resumes",
    });
  }
};
