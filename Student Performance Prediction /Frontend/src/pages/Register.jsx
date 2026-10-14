import { useState } from "react";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:5000/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Registration failed."
        );
        return;
      }

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);

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

        {/* Register Card */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

          <div className="mb-7">

            <h2 className="text-2xl font-bold text-gray-800">
              Create Account
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Create your EduAI account to get started.
            </p>

          </div>

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* Name */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-700 focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
                />

              </div>

            </div>

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
                  placeholder="Enter password"
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

            {/* Confirm Password */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-700 focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
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

            {/* Success */}

            {success && (
              <div className="bg-green-50 border border-green-100 text-green-600 text-sm rounded-xl px-4 py-3">
                {success}
              </div>
            )}

            {/* Register */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* Login Link */}

          <div className="text-center mt-6">

            <p className="text-sm text-gray-500">

              Already have an account?{" "}

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-violet-600 font-semibold hover:text-violet-700"
              >
                Sign In
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

export default Register;
