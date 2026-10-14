import { HiSparkles } from "react-icons/hi2";

function WelcomeBanner() {
  return (
    <div className="bg-gradient-to-r from-violet-500 to-purple-400 rounded-3xl p-8 flex justify-between items-center shadow-lg">

      {/* Left Content */}
      <div>

        <p className="text-violet-100 text-lg">
          Welcome Back 👋
        </p>

        <h1 className="text-4xl font-bold text-white mt-2">
          Misri
        </h1>

        <p className="text-violet-100 mt-3 max-w-xl">
          Predict student performance using Artificial Intelligence and
          Machine Learning.
        </p>

        <button className="mt-6 bg-white text-violet-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
          Predict Now
        </button>

      </div>

      {/* Right Content */}
      <div className="hidden lg:flex">

        <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center">

          <HiSparkles
            className="text-white"
            size={70}
          />

        </div>

      </div>

    </div>
  );
}

export default WelcomeBanner;
