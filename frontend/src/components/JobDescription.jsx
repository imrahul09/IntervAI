import { useState } from "react";
import {
  FileText,
  Sparkles,
  Target,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  Loader2,
  BriefcaseBusiness,
} from "lucide-react";
import { motion } from "framer-motion";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const CARD = "rounded-[20px] border border-[#D9D6F5] bg-[#FFFFFF]";
const FIELD =
  "w-full rounded-xl border border-[#D9D6F5] bg-[#F6F5FF] text-[#14163A] outline-none transition placeholder:text-[#5B5E8A] focus:border-[#5B3FE0] focus:ring-2 focus:ring-[#5B3FE0]/25";
const GRAD = "bg-[linear-gradient(135deg,#5B3FE0,#4F8CFF_60%,#0891B2)]";
const HEAD = "font-[Bricolage_Grotesque] tracking-tight";

const TONES = {
  green: { text: "text-[#059669]", dot: "bg-[#059669]" },
  yellow: { text: "text-[#B45309]", dot: "bg-[#B45309]" },
  purple: { text: "text-[#5B3FE0]", dot: "bg-[#5B3FE0]" },
};

const AnalysisSection = ({ title, items, icon: Icon, tone }) => {
  return (
    <div className={`${CARD} p-6`}>
      <div className="mb-4 flex items-center gap-2">
        <Icon className={`h-5 w-5 ${tone.text}`} />
        <h3 className={`${HEAD} text-lg font-bold text-[#14163A]`}>{title}</h3>
        <span className="ml-auto rounded-full bg-[#EEECFF] px-2.5 py-0.5 text-xs text-[#5B5E8A]">
          {items.length}
        </span>
      </div>

      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2.5 text-sm text-[#3E4170]"
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${tone.dot}`}
              />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#5B5E8A]">No items found</p>
      )}
    </div>
  );
};

const SkillChips = ({ title, skills, icon: Icon, chip, iconColor, empty }) => (
  <div className={`${CARD} p-6`}>
    <div className="mb-4 flex items-center gap-2">
      <Icon className={`h-5 w-5 ${iconColor}`} />
      <h3 className={`${HEAD} text-lg font-bold text-[#14163A]`}>{title}</h3>
      <span className="ml-auto rounded-full bg-[#EEECFF] px-2.5 py-0.5 text-xs text-[#5B5E8A]">
        {skills.length}
      </span>
    </div>
    <div className="flex flex-wrap gap-2">
      {skills.length > 0 ? (
        skills.map((skill, index) => (
          <span
            key={index}
            className={`rounded-full border px-3 py-1 text-sm ${chip}`}
          >
            {skill}
          </span>
        ))
      ) : (
        <p className="text-sm text-[#5B5E8A]">{empty}</p>
      )}
    </div>
  </div>
);

const JobDescription = ({ resumes }) => {
  const { token } = useAuth();
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [analysisData, setAnalysisData] = useState(null);

  const [questions, setQuestions] = useState({
    technicalQuestions: [],
    hrQuestions: [],
  });
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsMessage, setQuestionsMessage] = useState("");
  const [activeTab, setActiveTab] = useState("technical");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedResumeId) {
      setMessage("Please select a Resume");
      return;
    }

    if (!jobDescription.trim()) {
      setMessage("Please enter a job description");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setAnalysisData(null);

      const response = await API.post(
        "/analysis",
        {
          resumeId: selectedResumeId,
          jobDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAnalysisData(response.data.data);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "something went wrong. please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  const generateQuestions = async () => {
    try {
      setQuestionsLoading(true);
      setQuestionsMessage("");

      const response = await API.post(
        `/analysis/${id}/interview-questions`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setQuestions({
        technicalQuestions: response.data.data.technicalQuestions || [],
        hrQuestions: response.data.data.hrQuestions || [],
      });
    } catch (error) {
      console.error("Question generation error:", error);

      setQuestionsMessage(
        error.response?.data?.message ||
          "Failed to generate interview questions.",
      );
    } finally {
      setQuestionsLoading(false);
    }
  };
  const matchedSkills = analysisData?.matchedSkills || [];
  const missingSkills = analysisData?.missingSkills || [];
  const strengths = analysisData?.strengths || [];
  const weakness = analysisData?.weaknesss || [];
  const suggestions = analysisData?.suggestions || [];

  const score = Math.min(
    100,
    Math.max(0, Number(analysisData?.matchScore) || 0),
  );

  const getScoreLabel = () => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Moderate Match";
    return "Needs Improvement";
  };

  return (
    <div className="w-full space-y-8">
      {/* Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`${CARD} bg-linear-to-b from-[#EEECFF] to-[#FFFFFF] p-6 sm:p-8`}
      >
        <div className="mb-6 flex items-center gap-3">
          <div className={`rounded-xl p-3 ${GRAD}`}>
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#0891B2]">
              <Sparkles size={14} /> AI POWERED ANALYSIS
            </div>
            <h2 className={`${HEAD} text-2xl font-bold text-[#14163A]`}>
              Match your resume to a job
            </h2>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[320px_1fr]"
        >
          {/* Resume Selection */}
          <div>
            <label
              htmlFor="resume"
              className="mb-2 block text-sm font-medium text-[#14163A]"
            >
              Select Resume
            </label>
            <select
              id="resume"
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className={`${FIELD} p-3`}
            >
              <option value="">Choose an uploaded resume</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.fileName}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-[#5B5E8A]">
              Upload a resume above if the list is empty.
            </p>
          </div>

          {/* Job Description */}
          <div>
            <label
              htmlFor="jobDescription"
              className="mb-2 block text-sm font-medium text-[#14163A]"
            >
              Job Description
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here..."
              rows={8}
              className={`${FIELD} resize-y p-4 text-sm`}
            />
            <div className="mt-2 flex justify-between text-xs text-[#5B5E8A]">
              <span>Include required skills and responsibilities.</span>
              <span>{jobDescription.length} characters</span>
            </div>
          </div>

          <div className="lg:col-span-2">
            {message && (
              <p className="mb-4 text-sm text-[#5B3FE0]" role="status">
                {message}
              </p>
            )}
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={loading}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold text-white shadow-[0_8px_32px_rgba(124,92,255,0.35)] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 ${GRAD}`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing with Gemini...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Analysis Results */}
      {analysisData && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className={`${HEAD} text-3xl font-bold text-[#14163A]`}>
                Your Analysis Report
              </h2>
              <p className="mt-1 text-sm text-[#5B5E8A]">
                AI-generated insights based on your resume and job description.
              </p>
            </div>
            <span className="rounded-full border border-[#059669]/30 bg-[#059669]/10 px-3 py-1.5 text-xs font-medium text-[#059669]">
              Analysis Complete
            </span>
          </div>

          {/* Score + Skills */}
          <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
            <div
              className={`${CARD} flex flex-col items-center bg-linear-to-b from-[#EEECFF] to-[#FFFFFF] p-6 text-center shadow-[0_30px_80px_-30px_rgba(124,92,255,0.35)]`}
            >
              <div className="mb-4 flex items-center gap-2 text-[#0891B2]">
                <Target size={18} />
                <span className="text-sm font-medium">Overall Match</span>
              </div>

              <div
                className="grid h-40 w-40 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(#0891B2 ${score}%, #D9D6F5 0)`,
                }}
              >
                <div className="grid h-33 w-33 place-items-center rounded-full bg-[#FFFFFF]">
                  <div>
                    <p
                      className={`${HEAD} text-5xl font-bold leading-none text-[#14163A]`}
                    >
                      {score}
                      <span className="text-2xl">%</span>
                    </p>
                  </div>
                </div>
              </div>

              <p className={`${HEAD} mt-5 text-lg font-bold text-[#14163A]`}>
                {getScoreLabel()}
              </p>
              <p className="mt-1 text-sm text-[#5B5E8A]">
                {matchedSkills.length} matched · {missingSkills.length} missing
                skills
              </p>
            </div>

            <div className="grid gap-5">
              <SkillChips
                title="Matched Skills"
                skills={matchedSkills}
                icon={CheckCircle2}
                iconColor="text-[#059669]"
                chip="border-[#059669]/40 text-[#059669]"
                empty="No matched skills found."
              />
              <SkillChips
                title="Missing Skills"
                skills={missingSkills}
                icon={AlertCircle}
                iconColor="text-[#B45309]"
                chip="border-[#B45309]/40 text-[#B45309]"
                empty="No missing skills found."
              />
            </div>
          </div>

          {/* Strengths and Weakness */}
          <div className="grid gap-5 md:grid-cols-2">
            <AnalysisSection
              title="Your Strengths"
              items={strengths}
              icon={TrendingUp}
              tone={TONES.green}
            />
            <AnalysisSection
              title="Areas to Improve"
              items={weakness}
              icon={AlertCircle}
              tone={TONES.yellow}
            />
          </div>

          {/* Recommendations */}
          <AnalysisSection
            title="AI Recommendations"
            items={suggestions}
            icon={Lightbulb}
            tone={TONES.purple}
          />

          <div
            className={`${CARD} flex items-center gap-2 p-4 text-sm text-[#5B5E8A]`}
          >
            <BriefcaseBusiness size={18} className="shrink-0 text-[#0891B2]" />
            Use these insights to improve your resume for the target role.
          </div>

          {/* Interview Questions */}
          <div className={CARD}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium">Interview Preparation</h2>
                <p className="mt-1 text-sm text-[#5B5E8A]">
                  Personalized questions based on your resume and job
                  description.
                </p>
              </div>

              <button
                onClick={generateQuestions}
                disabled={questionsLoading}
                className="rounded-lg bg-[#5B3FE0] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4930C5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {questionsLoading ? "Generating..." : "Generate Questions"}
              </button>
            </div>

            {questionsMessage && (
              <p className="mt-4 text-sm text-[#B45309]" role="alert">
                {questionsMessage}
              </p>
            )}

            {(questions.technicalQuestions.length > 0 ||
              questions.hrQuestions.length > 0) && (
              <div className="mt-7">
                <div className="flex gap-6 border-b border-[#D9D6F5]">
                  <button
                    onClick={() => setActiveTab("technical")}
                    className={`pb-3 text-sm font-medium ${
                      activeTab === "technical"
                        ? "border-b-2 border-[#5B3FE0] text-[#5B3FE0]"
                        : "text-[#5B5E8A]"
                    }`}
                  >
                    Technical ({questions.technicalQuestions.length})
                  </button>

                  <button
                    onClick={() => setActiveTab("hr")}
                    className={`pb-3 text-sm font-medium ${
                      activeTab === "hr"
                        ? "border-b-2 border-[#5B3FE0] text-[#5B3FE0]"
                        : "text-[#5B5E8A]"
                    }`}
                  >
                    HR ({questions.hrQuestions.length})
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  {(activeTab === "technical"
                    ? questions.technicalQuestions
                    : questions.hrQuestions
                  ).map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[#D9D6F5] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-xs text-[#6B6E96]">
                          QUESTION {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="rounded-full bg-[#EEECFF] px-3 py-1 text-xs text-[#5B3FE0]">
                          {activeTab === "technical"
                            ? item.difficulty
                            : item.category}
                        </span>
                      </div>

                      <h3 className="mt-3 text-sm font-medium leading-6">
                        {item.question}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-[#5B5E8A]">
                        {activeTab === "technical"
                          ? `Topic: ${item.topic}`
                          : `Relevance: ${item.relevance}`}
                      </p>

                      {activeTab === "technical" && (
                        <p className="mt-1 text-xs leading-5 text-[#5B5E8A]">
                          Relevance: {item.relevance}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default JobDescription;
