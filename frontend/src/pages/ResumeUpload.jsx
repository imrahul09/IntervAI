import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import API from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import JobDescription from "../components/JobDescription.jsx";

const CARD = "rounded-2xl border border-[#D9D6F5] bg-[#FFFFFF]";
const BTN =
  "flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#5B3FE8] px-4 text-sm font-medium text-white transition-[transform,background-color] hover:bg-[#4C33C4] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";

const ResumeSheet = () => (
  <div
    className="flex h-12 w-9 shrink-0 flex-col gap-1 rounded border border-[#D9D6F5]  bg-white p-1.5"
    aria-hidden="true"
  >
    <span className="h-1 w-4 rounded-sm bg-[#14163A]" />
    <span className="h-0.5 w-full rounded-sm bg-[#D9D6F5]" />
    <span className="h-0.5 w-full rounded-sm bg-[#D9D6F5]" />
    <span className="h-0.5 w-3/4 rounded-sm bg-[#D9D6F5]" />
    <span className="h-0.5 w-full rounded-sm bg-[#D9D6F5]" />
  </div>
);

const ResumeUpload = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null); // initialy no resume has been selected
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resumesLoading, setResumesLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [lastUploadedId, setLastUploadedId] = useState(null);

  const { token } = useAuth();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await API.get("/resume", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setResumes(response.data.resumes);
      } catch (error) {
        console.error("Failed to fetch resumes", error);
        setMessage(error.response?.data?.message || "Failed to load resumes.");
      } finally {
        setResumesLoading(false);
      }
    };

    if (token) {
      fetchResumes();
    }
  }, [token]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // when the user select a pdf the browser give the file and react remember

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setMessage("please select a pdf file");
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handelUpload = async () => {
    if (!file) {
      setMessage("please select a resume first");
      return;
    }

    try {
      setLoading(true); //uploading a file take time ,  while the req is running the btn shows uploading..
      setMessage("");

      //A pdf is a file, not a oridinary json data. FormData allows the browser to send the file in a
      //multipart http request . notice the name resume , out backend route must use the same name;
      const formData = new FormData();
      formData.append("resume", file); //

      const response = await API.post("/resume/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`, //the token allows the backend to determine who is uploading the resume
        },
      });

      setMessage(response.data.message);

      const newResume = {
        id: response.data.resume.id,
        fileName: response.data.resume.fileName,
        uploadedAt: new Date().toISOString(),
        status: "Uploaded",
      };
      setResumes((previousResumes) => [newResume, ...previousResumes]);
      setLastUploadedId(newResume._id);
      setFile(null);
    } catch (error) {
      console.log("resume upload failed ", error);

      setMessage(
        error.response?.data?.message ||
          "Resume upload failed. please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F5FF] font-[DM_Sans] text-[#14163A]">
      <div className="mx-auto max-w-5xl px-6 pb-24 sm:px-8">
        <header className="flex h-16 items-center justify-between">
          <span className="text-lg font-medium">IntervAI</span>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-[#5B5EBA] transition-colors hover:text-[#14163A]"
          >
            Back to Dashboard
          </button>
        </header>

        <div className="mb-12 mt-12">
          <h1 className="text-4xl font-medium leading-[1.15]">Resumes</h1>
          <p className="mt-3 max-w-xl text-lg leading-7 text-[#5B5E8A]">
            Upload a PDF, then match it against a job description
          </p>
        </div>

        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          {/* Upload */}
          <section className={`${CARD} p-6`}>
            <h2 className="mb-5 text-base font-medium">Upload a resume</h2>

            <label
              htmlFor="resumeFile"
              className="flex min-h-42 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#C4C0EB] bg-[#F6F5FF] p-6 text-center transition-colors hover:border-[#A79BEA] focus-within:border-[#A79BEA]"
            >
              <UploadCloud
                size={18}
                strokeWidth={1.5}
                className="text-[#6B6E96]"
              />
              <span className="text-sm font-medium">Choose a PDF</span>
              <span className="text-xs text-[#85858b]">PDF only</span>
              <input
                id="resumeFile"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>

            {file && (
              <p className="mt-4 flex items-center gap-2 text-sm text-[#a1a1a6]">
                <FileText
                  size={18}
                  strokeWidth={1.5}
                  className="shrink-0 text-[#a1a1a6]"
                />
                <span className="truncate text-[#ededed]">{file.name}</span>
              </p>
            )}

            <button
              onClick={handelUpload}
              disabled={!file || loading}
              className={`${BTN} mt-5`}
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    strokeWidth={1.5}
                    className="animate-spin"
                  />
                  Uploading
                </>
              ) : (
                "Upload resume"
              )}
            </button>

            {message && (
              <p className="mt-4 text-sm text-[#5B5E8A]" role="status">
                {message}
              </p>
            )}
          </section>

          {/* My resumes */}
          <section className={`${CARD} p-6`}>
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="text-base font-medium">My resumes</h2>
              {!resumesLoading && (
                <span className="font-mono text-xs tabular-nums text-[#6B6E96]">
                  {resumes.length}
                </span>
              )}
            </div>

            {resumesLoading ? (
              <p className="text-sm text-[#5B5E8A]">Loading resumes</p>
            ) : resumes.length === 0 ? (
              <p className="text-sm text-[#5B5E8A]">
                No resumes yet. Upload your first PDF to get started.
              </p>
            ) : (
              <ul className="max-h-80 space-y-2 overflow-y-auto">
                {resumes.map((resume) => (
                  <li
                    key={resume._id}
                    className={`flex items-center gap-4 rounded-lg border-l-2 bg-[#F6F5FF] py-3 pl-3 pr-4 ${
                      resume._id === lastUploadedId
                        ? "border-[#5B3FE0]"
                        : "border-[#D9D6F5]"
                    }`}
                  >
                    <ResumeSheet />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium">
                        {resume.fileName}
                      </h3>
                      <p className="mt-0.5 font-mono text-xs tabular-nums text-[#6B6E96]">
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <JobDescription resumes={resumes} />
      </div>
    </div>
  );
};

export default ResumeUpload;
