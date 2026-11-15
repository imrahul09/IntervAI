import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    navigate(isAuthenticated ? "/resume-upload" : "/login");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#171d35]">
      {/*Navbar*/}
      <nav className=" sticky top-0 z-50 border-b border-line bg-white/95 botder-b border-gray-200">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a
            href="#top"
            class="flex items-center gap-2.5 font-display text-xl font-bold"
          >
            <span class="grid h-[26px] w-[26px] place-items-center rounded-full">
              <span class="h-2.5 w-2.5 rounded-full bg-white"></span>
            </span>
            IntervAI
          </a>
          <ul class="hidden gap-7 text-[15px] text-muted md:flex">
            <li>
              <a href="#how-it-works">How it works</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#questions">Interview prep</a>
            </li>
          </ul>
          <a
            onClick={handleGetStarted}
            class="bg-[#1125d8d7] glow-btn rounded-xl px-[18px] py-2 text-[15px] font-medium text-white transition hover:-translate-y-px"
          >
            Analyze my resume
          </a>
        </div>
      </nav>

      {/*Hero section*/}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/*Left content*/}
          <div>
            <span className=" inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-full px-4 py-2 text-sm mb-7">
              <span className="w-2 h-2  rounded-full bg-blue-600"></span>
              AI resume & interview coach
            </span>
            <h2 className="text-5xl md:text-6xl font-bold leading-[1.12] tracking-tight">
              Know exactly how prepared you are for your next interview
            </h2>
            <p className="text-gray-600 mt-7 text-lg max-w-xl leading-8">
              Upload your resume, add your target job description , and discover
              your strengths, skill gaps, and areas to improve before your next
              interview.{" "}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-9">
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 mt-8 px-7 py-4 rounded-lg  font-semibold text-white transition  shadow-sm "
              >
                Analyze My Resume
              </button>
            </div>
            <p className="mt-5 text-sm text-gray-500">
              Prapre with clarity.improve with confidence
            </p>
          </div>

          {/*Right preview card*/}
          <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-24 h-24 rounded-full border-[9px] border-blue-600 border-t-blue-100 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">82</span>
                <span className="text-xs text-gray-500">/100</span>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Resume Analysis</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Your personalized performance overview
                </p>

                <span className="text-blue-600 text-sm font-medium">
                  Strong Starting point
                </span>
              </div>
            </div>

            <div className="">
              {[
                ["Technical Skills", 88],
                ["Experience", 81],
                ["Job Requirements", 74],
                ["Resume Impact", 65],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>

                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-blue-600 rounded-full"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-8 pt-6">
              <p className="text-sm font-medium mb-3">Areas to improve</p>

              <div className="">
                {["Technical depth", "project impact ", "Keywords"].map(
                  (item) => (
                    <span
                      key={item}
                      className="bg-gray-100 text-gray-600 px-3 py-2 rounded-full text-xs"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-5">
              Illustrative preview - not an actual analysis
            </p>
          </div>
        </div>
      </section>

      {/* How it works*/}

      <section
        id="#how-it-works"
        className=" max-w-6xl mx-auto px-6 py-20 md:py-28"
      >
        <div className="mt-6">
          <h1 className="max-w-3xl font-bold text-5xl">
            From resume to interview-ready in three stpes
          </h1>

          <div className="grid md:grid-cols-3 border border-gray-200 rounded-xl overflow-hidden mt-5">
            {[
              {
                number: 1,
                title: "Add your resume",
                description:
                  "upload a PDF file. We read it the same way a hiring system does",
              },
              {
                number: 2,
                title: "Add the job description",
                description:
                  "Paste the job description to understand how your profile matches the role.",
              },
              {
                number: 3,
                title: "Get your analysis",
                description:
                  "Discover your strengths, identify skill gaps and get personalized interview questions.",
              },
            ].map((step, index) => (
              <div
                key={step.number}
                className={`p-8 hoover:bg-gray-50 transition ${index !== 2 ? "md:border-r border-gray-200" : ""}`}
              >
                <span className="text-sm text-blue-600 font-semibold">
                  STEP{step.number}
                </span>
                <h3 className="text-xl font-semibold mt-5 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-7 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*features*/}

      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold max-w-xl mb-12">
          Everything you need before you hit apply .
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Resume match score",
              description:
                "A score out of 100 , broken down by skills, experience, keywords and impact, so you know where you stand.",
            },
            {
              title: "Job De",
              description:
                "Compare your skills and experience with the requirements of your target role.",
            },
            {
              title: "Technical Interview Prep",
              description:
                "Practice relevant technical questions based on your resume and target job.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-gray-200
              rounded-xl p-7 hover:border-blue-300 transition"
            >
              <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>

              <p className="text-gray-600 text-sm leading-7">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interview Prep */}
      <section id="interview-prep" className="bg-[#EEF3FA]">
        <div
          className="max-w-7xl mx-auto px-6 py-16
          flex flex-col md:flex-row justify-between
          items-center gap-8"
        >
          <div>
            <h2 className="text-3xl font-bold">
              Your next interview starts here.
            </h2>

            <p className="text-gray-600 mt-3">
              Take the next step towards becoming interview-ready.
            </p>
          </div>

          <button
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700
            text-white px-7 py-4 rounded-lg font-semibold
            transition whitespace-nowrap"
          >
            Get started →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div
          className="max-w-7xl mx-auto px-6 py-8
          flex flex-col md:flex-row justify-between gap-4"
        >
          <h2 className="font-bold text-xl">
            IntervAI<span className="text-blue-600">.</span>
          </h2>

          <p className="text-sm text-gray-500">
            Helping you prepare for what comes next.
          </p>

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} IntervAI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
