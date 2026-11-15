import { useNavigate } from "react-router-dom";
import { UploadCloud, History, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const HEAD = "font-[Bricolage_Grotesque] tracking-tight";
const GRAD = "bg-[linear-gradient(135deg,#5B3FE0,#4F8CFF_60%,#0891B2)]";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const actions = [
    {
      title: "Upload Resume",
      text: "Add a resume and match it to a job description.",
      icon: UploadCloud,
      path: "/resume-upload",
    },
    {
      title: "Analysis History",
      text: "Review your past reports and scores.",
      icon: History,
      path: "/analysis-history",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F6F5FF] text-[#14163A]">
      <div className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#5B3FE0]/30 blur-[90px]" />
      <div className="pointer-events-none absolute -right-24 top-40 h-[360px] w-[360px] rounded-full bg-[#0891B2]/20 blur-[90px]" />

      <div className="relative mx-auto max-w-4xl px-6 pb-16">
        <header className="flex h-16 items-center justify-between">
          <span className={`${HEAD} text-xl font-bold`}>IntervAI</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-[#D9D6F5] px-3.5 py-2 text-sm text-[#5B5E8A] transition hover:text-[#14163A]"
          >
            <LogOut size={16} /> Log out
          </button>
        </header>

        <div className="mb-10 mt-10">
          <h1
            className={`${HEAD} text-4xl font-bold leading-[1.1] md:text-5xl`}
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-[#5B3FE0] to-[#0891B2] bg-clip-text text-transparent">
              IntervAI
            </span>
          </h1>
          <h2 className="mt-4 text-xl">Hello, {user?.name}</h2>
          <p className="mt-1 text-[#5B5E8A]">Email: {user?.email}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {actions.map(({ title, text, icon: Icon, path }) => (
            <button
              key={title}
              onClick={() => navigate(path)}
              className="group rounded-[20px] border border-[#D9D6F5] bg-gradient-to-b from-[#EEECFF] to-[#FFFFFF] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#5B3FE0]"
            >
              <div
                className={`mb-5 grid h-11 w-11 place-items-center rounded-xl ${GRAD}`}
              >
                <Icon size={22} className="text-white" />
              </div>
              <h3 className={`${HEAD} text-xl font-bold`}>{title}</h3>
              <p className="mt-1 text-sm text-[#5B5E8A]">{text}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm text-[#0891B2]">
                Open{" "}
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
