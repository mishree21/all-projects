import { useState } from "react";
import { GraduationCap, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:5000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Invalid email or password."
        );
        return;
      }

      // Store JWT token
      localStorage.setItem(
        "eduaiToken",
        data.access_token
      );

      // Store logged-in user
      localStorage.setItem(
        "eduaiUser",
        JSON.stringify(data.user)
      );

      navigate("/", { replace: true });

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please make sure Flask is running."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-6">

      <div className="w-full max-w-md">

        {/* Logo */}

        <div className="text-center mb-8">

          <div className="flex justify-center mb-4">

            <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg">

              <GraduationCap
                size={32}
                className="text-white"
              />

            </div>

          </div>

          <h1 className="text-3xl font-bold text-violet-600">
            EduAI
          </h1>

          <p className="text-xs text-gray-500 tracking-widest mt-1">
            ACADEMIC EXCELLENCE
          </p>

        </div>

        {/* Login Card */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

          <div className="mb-7">

            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Sign in to access your EduAI dashboard.
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-700 focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-700 focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >

                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}

                </button>

              </div>

            </div>

            {/* Error */}

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Login */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >

              {loading ? "Signing In..." : "Sign In"}

            </button>

          </form>

          {/* Backend Credentials */}

          <div className="mt-6 p-4 rounded-xl bg-violet-50 border border-violet-100">

            <p className="text-xs font-semibold text-violet-700 mb-2">
              Test Credentials
            </p>

            <p className="text-xs text-gray-600">
              Email: test@eduai.com
            </p>

            <p className="text-xs text-gray-600 mt-1">
              Password: test123
            </p>

          </div>

          <div className="text-center mt-6">
  <p className="text-sm text-gray-500">
    Don't have an account?{" "}
    <button
      type="button"
      onClick={() => navigate("/register")}
      className="text-violet-600 font-semibold hover:text-violet-700"
    >
      Create Account
    </button>
  </p>
</div>

        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          EduAI Student Performance Prediction System
        </p>

      </div>

    </div>
  );
}

export default Login;
