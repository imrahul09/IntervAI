import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

// A resume drawn as a small paper sheet (same as the resume upload page)
const ResumeSheet = () => (
  <div
    className="flex h-12 w-9 shrink-0 flex-col gap-1 rounded border border-[#D9D6F5] bg-white p-1.5"
    aria-hidden="true"
  >
    <span className="h-1 w-4 rounded-sm bg-[#14163A]" />
    <span className="h-0.5 w-full rounded-sm bg-[#D9D6F5]" />
    <span className="h-0.5 w-full rounded-sm bg-[#D9D6F5]" />
    <span className="h-0.5 w-3/4 rounded-sm bg-[#D9D6F5]" />
    <span className="h-0.5 w-full rounded-sm bg-[#D9D6F5]" />
  </div>
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
          ← Dashboard
        </button>
      </header>
      {children}
    </div>
  </div>
);

const handleDeleteReport = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this analysis report?",
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/analysis/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setHistory((previousHistory) =>
      previousHistory.filter((item) => item._id !== id),
    );
  } catch (error) {
    console.error("Delete report error:", error);

    setMessage(
      error.response?.data?.message || "Failed to delete analysis report",
    );
  }
};

const AnalysisHistory = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await API.get("/analysis/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setHistory(response.data.history);
      } catch (error) {
        console.error("History fetch error", error);
        setMessage(
          error.response?.data?.message || "Failed to load analysis history",
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [token]);

  const goBack = () => navigate("/dashboard");

  if (loading) {
    return (
      <Shell onBack={goBack}>
        <p className="mt-12 text-sm text-[#5B5E8A]">Loading analysis history</p>
      </Shell>
    );
  }

  return (
    <Shell onBack={goBack}>
      <div className="mb-12 mt-12">
        <h1 className="text-4xl font-medium leading-[1.15]">
          Analysis history
        </h1>
        <p className="mt-3 max-w-xl text-lg leading-7 text-[#5B5E8A]">
          Your previous resume reports
        </p>
      </div>

      {message && (
        <p role="alert" className="mb-6 text-sm text-[#B45309]">
          {message}
        </p>
      )}

      {history.length === 0 && !message ? (
        <div className="rounded-2xl border border-[#D9D6F5] bg-white p-8">
          <p className="text-base font-medium">No analyses yet</p>
          <p className="mt-1 text-sm text-[#5B5E8A]">
            Analyze your first resume to see it here.
          </p>
          <button
            onClick={() => navigate("/resume-upload")}
            className="mt-5 h-10 rounded-lg bg-[#5B3FE0] px-4 text-sm font-medium text-white transition-[transform,background-color] hover:bg-[#4C33C4] active:scale-[0.98]"
          >
            Analyze a resume
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {history.map((item) => (
            <li
              key={item._id}
              className="flex flex-wrap items-center gap-x-5 gap-y-4 rounded-2xl border border-[#D9D6F5] bg-white p-5"
            >
              <ResumeSheet />

              <div className="min-w-0 flex-1 basis-48">
                <h2 className="truncate text-base font-medium">
                  {item.resume?.fileName || "Resume unavailable"}
                </h2>
                <p className="mt-0.5 font-mono text-xs tabular-nums text-[#6B6E96]">
                  Analyzed {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="w-32">
                <p className="font-mono text-lg tabular-nums">
                  {item.matchScore}%
                </p>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#EEECFF]">
                  <div
                    className="h-full rounded-full bg-[#5B3FE0]"
                    style={{
                      width: `${Math.min(100, Math.max(0, Number(item.matchScore) || 0))}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-[#6B6E96]">Match score</p>
              </div>

              <button
                onClick={() => navigate(`/analysis-history/${item._id}`)}
                className="h-10 rounded-lg border border-[#D9D6F5] px-4 text-sm font-medium text-[#14163A] transition-[transform,background-color] hover:bg-[#EEECFF] active:scale-[0.98]"
              >
                View report
              </button>

              <button
                onClick={() => handleDeleteReport(item._id)}
                className="h-10 rounded-lg border border-red-200 px-4 text-sm font-medium text-red-600 transition-[transform,background-color] hover:bg-red-50 active:scale-[0.98]"
              >
                Delete report
              </button>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
};

export default AnalysisHistory;
