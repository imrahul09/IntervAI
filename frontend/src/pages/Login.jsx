import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const INPUT =
  "h-10 w-full rounded-lg border border-[#D9D6F5] bg-[#F6F5FF] px-3 text-sm text-[#14163A] outline-none transition-colors placeholder:text-[#6B6E96] focus:border-[#5B3FE0] focus:ring-2 focus:ring-[#5B3FE0]/20";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await API.post("/auth/login", { email, password });

      const { token, user } = response.data;
      login(user, token);

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F5FF] font-[DM_Sans] text-[#14163A]">
      <header className="mx-auto flex h-16 w-full max-w-5xl items-center px-6 sm:px-8">
        <Link to="/" className="text-lg font-medium">
          IntervAI
        </Link>
      </header>

      <main className="flex flex-1 items-start justify-center px-6 pb-24 pt-12 sm:pt-20">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-medium leading-[1.15]">Log in</h1>
          <p className="mt-3 text-base text-[#5B5E8A]">
            Welcome back. Pick up where you left off
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-[#D9D6F5] bg-white p-6"
          >
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT}
            />

            <label
              htmlFor="password"
              className="mb-2 mt-5 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={INPUT}
            />

            {error && (
              <p role="alert" className="mt-4 text-sm text-[#B45309]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#5B3FE0] px-4 text-sm font-medium text-white transition-[transform,background-color] hover:bg-[#4C33C4] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    strokeWidth={1.5}
                    className="animate-spin"
                  />
                  Logging in
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#5B5E8A]">
            New to IntervAI?{" "}
            <Link
              to="/signup"
              className="font-medium text-[#5B3FE0] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
