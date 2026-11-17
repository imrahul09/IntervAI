import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const CARD = "rounded-2xl border border-[#D9D6F5] bg-white p-6";

const Count = ({ n }) => (
  <span className="font-mono text-xs tabular-nums text-[#6B6E96]">{n}</span>
);

const Shell = ({ onBack, children }) => (
  <div className="min-h-screen bg-[#F6F5FF] font-[DM_Sans] text-[#14163A]">
    <div className="mx-auto max-w-5xl px-6 pb-24 sm:px-8">
      <header className="flex h-16 items-center justify-between">
        <span className="text-lg font-medium">IntervAI</span>
        <button
          onClick={onBack}
          className="text-sm text-[#5B5E8A] transition-colors hover:text-[#14163A]"
        >
          ← Back to history
        </button>
      </header>
      {children}
    </div>
  </div>
);

const AnalysisSection = ({ title, items = [], dot }) => {
  return (
    <div className={CARD}>
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-base font-medium">{title}</h2>
        <Count n={items.length} />
      </div>

      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm leading-6 text-[#3E4170]"
            >
              <span
                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`}
              />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#5B5E8A]">No data available.</p>
      )}
    </div>
  );
};

const SkillChips = ({ title, items = [], chip }) => (
  <div className={CARD}>
    <div className="mb-5 flex items-baseline justify-between">
      <h2 className="text-base font-medium">{title}</h2>
      <Count n={items.length} />
    </div>
    {items.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {items.map((skill, index) => (
          <span
            key={index}
            className={`rounded-full border px-3 py-1 text-sm ${chip}`}
          >
            {skill}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-sm text-[#5B5E8A]">No data available.</p>
    )}
  </div>
);

const AnalysisReport = () => {
  const { id } = useParams(); // it extract the dynamic id from the url
  const navigate = useNavigate();
  const { token } = useAuth();

  const [analysis, setAnalysis] = useState(null); // null until the report loads
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [questions, setQuestions] = useState({
    technicalQuestions: [],
    hrQuestions: [],
  });
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsMessage, setQuestionsMessage] = useState("");
  const [activeTab, setActiveTab] = useState("technical");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await API.get(`/analysis/history/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAnalysis(response.data.analysis);
      } catch (error) {
        console.error("Report fetch error", error);
        setMessage(
          error.response?.data?.message || "Failed to load analysis report",
        );
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchReport();
    } else {
      setLoading(false);
    }
  }, [id, token]);

  const goBack = () => navigate("/analysis-history");

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

  if (loading) {
    return (
      <Shell onBack={goBack}>
        <p className="mt-12 text-sm text-[#5B5E8A]">Loading report</p>
      </Shell>
    );
  }

  if (message || !analysis) {
    return (
      <Shell onBack={goBack}>
        <div className={`${CARD} mt-12 max-w-md`}>
          <p role="alert" className="text-sm text-[#B45309]">
            {message || "Analysis report not found"}
          </p>
          <button
            onClick={goBack}
            className="mt-5 h-10 rounded-lg border border-[#D9D6F5] px-4 text-sm font-medium transition-[transform,background-color] hover:bg-[#EEECFF] active:scale-[0.98]"
          >
            Back to history
          </button>
        </div>
      </Shell>
    );
  }

  const score = Math.min(100, Math.max(0, Number(analysis.matchScore) || 0));
  const scoreLabel =
    score >= 80
      ? "Excellent match"
      : score >= 60
        ? "Good match"
        : score >= 40
          ? "Moderate match"
          : "Needs improvement";
  // accepts either spelling in case the backend field differs
  const weakness =
    analysis.weakness || analysis.weaknesss || analysis.weaknesses || [];

  return (
    <Shell onBack={goBack}>
      {/* Header */}
      <div className="mb-12 mt-12">
        <h1 className="text-4xl font-medium leading-[1.15]">Analysis report</h1>
        <p className="mt-3 text-lg text-[#5B5E8A]">
          {analysis.resume?.fileName || "Resume unavailable"}
        </p>
        <p className="mt-1 font-mono text-xs tabular-nums text-[#6B6E96]">
          Analyzed {new Date(analysis.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-6">
        {/* Match score */}
        <div className={`${CARD} flex flex-wrap items-center gap-x-10 gap-y-5`}>
          <div>
            <h2 className="text-sm text-[#5B5E8A]">Resume match score</h2>
            <p className="mt-1 font-mono text-5xl font-medium tabular-nums leading-none">
              {score}%
            </p>
          </div>
          <div className="min-w-50 flex-1">
            <p className="mb-2 text-sm font-medium">{scoreLabel}</p>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#EEECFF]">
              <div
                className="h-full rounded-full bg-[#5B3FE0] transition-all"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="grid gap-6 md:grid-cols-2">
          <SkillChips
            title="Matched skills"
            items={analysis.matchedSkills}
            chip="border-[#059669]/40 text-[#059669]"
          />
          <SkillChips
            title="Missing skills"
            items={analysis.missingSkills}
            chip="border-[#B45309]/40 text-[#B45309]"
          />
        </div>

        {/* Strengths and weakness */}
        <div className="grid gap-6 md:grid-cols-2">
          <AnalysisSection
            title="Strengths"
            items={analysis.strengths}
            dot="bg-[#059669]"
          />
          <AnalysisSection
            title="Weaknesses"
            items={weakness}
            dot="bg-[#B45309]"
          />
        </div>

        {/* Suggestions */}
        <div className={CARD}>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-base font-medium">Improvement suggestions</h2>
            <Count n={analysis.suggestions?.length || 0} />
          </div>

          {analysis.suggestions?.length > 0 ? (
            <ol className="space-y-4">
              {analysis.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex gap-4 text-sm leading-6 text-[#3E4170]"
                >
                  <span className="w-5 shrink-0 font-mono text-xs leading-6 tabular-nums text-[#5B3FE0]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {suggestion}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-[#5B5E8A]">No suggestions available</p>
          )}
        </div>

        {/* Interview Questions */}
        <div className={CARD}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium">Interview Preparation</h2>
              <p className="mt-1 text-sm text-[#5B5E8A]">
                Personalized questions based on your resume and job description.
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
      </div>
    </Shell>
  );
};
export default AnalysisReport;
