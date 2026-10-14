import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  User,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  FileText,
} from "lucide-react";

function StudentDetails() {
  const { index } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);

  // =====================================================
  // LOAD STUDENT DATA
  // =====================================================

  useEffect(() => {
    const loadStudent = () => {
      const savedResults =
        localStorage.getItem("predictionResults");

      if (!savedResults) {
        setStudent(null);
        return;
      }

      try {
        const predictions = JSON.parse(savedResults);

        if (!Array.isArray(predictions)) {
          setStudent(null);
          return;
        }

        const studentIndex = Number(index);

        if (
          Number.isNaN(studentIndex) ||
          studentIndex < 0 ||
          studentIndex >= predictions.length
        ) {
          setStudent(null);
          return;
        }

        setStudent(predictions[studentIndex]);
      } catch (error) {
        console.error(
          "Error loading student details:",
          error
        );

        setStudent(null);
      }
    };

    loadStudent();

    window.addEventListener(
      "predictionUpdated",
      loadStudent
    );

    return () => {
      window.removeEventListener(
        "predictionUpdated",
        loadStudent
      );
    };
  }, [index]);

  // =====================================================
  // STUDENT NOT FOUND
  // =====================================================

  if (!student) {
    return (
      <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-6">
        <div className="text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
            <User size={30} />
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mt-5">
            Student data not found
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            No prediction data was found for this student.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">

            <button
              onClick={() => navigate("/reports")}
              className="px-5 py-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition font-medium"
            >
              Back to Reports
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
            >
              Dashboard
            </button>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // CALCULATIONS
  // =====================================================

  const score = Number(student.predicted_score || 0);

  const scorePercentage = Math.min(
    Math.max((score / 20) * 100, 0),
    100
  );

  const studentName =
    student.name ||
    `Student ${Number(index) + 1}`;

  // =====================================================
  // PERFORMANCE COLOR
  // =====================================================

  const getPerformanceStyle = () => {
    if (student.performance === "Excellent") {
      return "bg-green-100 text-green-700";
    }

    if (student.performance === "Good") {
      return "bg-violet-100 text-violet-700";
    }

    if (student.performance === "Average") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };

  // =====================================================
  // RISK COLOR
  // =====================================================

  const getRiskStyle = () => {
    if (student.risk_level === "Low Risk") {
      return "bg-green-100 text-green-700";
    }

    if (student.risk_level === "Moderate Risk") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F8F7FC] p-6">

      <div className="max-w-6xl mx-auto">

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="flex flex-wrap items-center gap-3 mb-6">

          <button
            onClick={() => navigate("/reports")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition font-medium"
          >
            <ArrowLeft size={18} />
            Back to Reports
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-600 hover:bg-gray-100 transition font-medium border border-gray-100"
          >
            Dashboard
          </button>

        </div>

        {/* =================================================
            STUDENT HEADER
        ================================================= */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
              <User size={30} />
            </div>

            <div className="flex-1">

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {studentName}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Student Performance Prediction Details
              </p>

            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">

              <FileText size={17} />

              Prediction #{Number(index) + 1}

            </div>

          </div>

        </div>

        {/* =================================================
            MAIN STATS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* SCORE */}

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
              <GraduationCap size={22} />
            </div>

            <p className="text-sm text-gray-500">
              Predicted Score
            </p>

            <div className="flex items-end gap-2 mt-2">

              <h2 className="text-3xl font-bold text-gray-800">
                {score.toFixed(1)}
              </h2>

              <span className="text-gray-400 mb-1">
                /20
              </span>

            </div>

            {/* Progress */}

            <div className="mt-4">

              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Performance Score</span>
                <span>
                  {scorePercentage.toFixed(1)}%
                </span>
              </div>

              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-violet-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${scorePercentage}%`,
                  }}
                />

              </div>

            </div>

          </div>

          {/* PERFORMANCE */}

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
              <TrendingUp size={22} />
            </div>

            <p className="text-sm text-gray-500">
              Performance
            </p>

            <span
              className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-semibold ${getPerformanceStyle()}`}
            >
              {student.performance ||
                "Not available"}
            </span>

            <p className="text-xs text-gray-400 mt-4">
              Based on the predicted academic score.
            </p>

          </div>

          {/* RISK */}

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle size={22} />
            </div>

            <p className="text-sm text-gray-500">
              Risk Level
            </p>

            <span
              className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-semibold ${getRiskStyle()}`}
            >
              {student.risk_level ||
                "Not available"}
            </span>

            <p className="text-xs text-gray-400 mt-4">
              Indicates the level of academic attention required.
            </p>

          </div>

        </div>

        {/* =================================================
            STUDENT INFORMATION
        ================================================= */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <User size={20} />
            </div>

            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                Student Information
              </h2>

              <p className="text-sm text-gray-500">
                Basic information from the prediction record
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Name */}

            <div className="bg-gray-50 rounded-2xl p-4">

              <p className="text-sm text-gray-500">
                Student Name
              </p>

              <p className="font-semibold text-gray-800 mt-1 break-words">
                {student.name ||
                  "Not available"}
              </p>

            </div>

            {/* Subject */}

            <div className="bg-gray-50 rounded-2xl p-4">

              <p className="text-sm text-gray-500">
                Subject
              </p>

              <p className="font-semibold text-gray-800 mt-1 break-words">
                {student.subject ||
                  "Not available"}
              </p>

            </div>

            {/* Score */}

            <div className="bg-gray-50 rounded-2xl p-4">

              <p className="text-sm text-gray-500">
                Predicted Score
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {score.toFixed(1)}/20
              </p>

            </div>

            {/* Risk */}

            <div className="bg-gray-50 rounded-2xl p-4">

              <p className="text-sm text-gray-500">
                Risk Level
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {student.risk_level ||
                  "Not available"}
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            AI RECOMMENDATION
        ================================================= */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <Lightbulb size={22} />
            </div>

            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                AI Recommendation
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Suggested academic support for this student
              </p>

            </div>

          </div>

          <div className="bg-violet-50 rounded-2xl p-5">

            <p className="text-gray-700 leading-relaxed">
              {student.recommendation ||
                "No recommendation available for this student."}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentDetails;
