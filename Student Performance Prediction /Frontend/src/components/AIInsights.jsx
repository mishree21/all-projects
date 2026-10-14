import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

function AIInsights() {
  const [averagePerformance, setAveragePerformance] = useState(0);
  const [highRiskStudents, setHighRiskStudents] = useState(0);
  const [topPerformers, setTopPerformers] = useState(0);

  const navigate = useNavigate();

  // =====================================================
  // LOAD PREDICTION DATA
  // =====================================================

  useEffect(() => {
    const loadData = () => {
      const savedResults =
        localStorage.getItem("predictionResults");

      // No prediction data
      if (!savedResults) {
        setAveragePerformance(0);
        setHighRiskStudents(0);
        setTopPerformers(0);
        return;
      }

      try {
        const predictions = JSON.parse(savedResults);

        // Check if data is valid
        if (
          !Array.isArray(predictions) ||
          predictions.length === 0
        ) {
          setAveragePerformance(0);
          setHighRiskStudents(0);
          setTopPerformers(0);
          return;
        }

        // =================================================
        // CALCULATE AVERAGE PERFORMANCE
        // =================================================

        const totalScore = predictions.reduce(
          (sum, student) =>
            sum + Number(student.predicted_score || 0),
          0
        );

        const averageScore =
          totalScore / predictions.length;

        const performance =
          (averageScore / 20) * 100;

        setAveragePerformance(
          Number(performance.toFixed(1))
        );

        // =================================================
        // COUNT HIGH-RISK STUDENTS
        // =================================================

        const highRisk = predictions.filter(
          (student) =>
            student.risk_level === "High Risk"
        ).length;

        setHighRiskStudents(highRisk);

        // =================================================
        // COUNT TOP PERFORMERS
        // =================================================

        const topPerformersCount =
          predictions.filter(
            (student) =>
              Number(student.predicted_score || 0) >= 16
          ).length;

        setTopPerformers(topPerformersCount);

      } catch (error) {
        console.error(
          "Error loading AI insight data:",
          error
        );

        setAveragePerformance(0);
        setHighRiskStudents(0);
        setTopPerformers(0);
      }
    };

    // Load data when dashboard opens
    loadData();

    // =====================================================
    // LISTEN FOR NEW PREDICTION DATA
    // =====================================================

    window.addEventListener(
      "predictionUpdated",
      loadData
    );

    // =====================================================
    // CLEANUP
    // =====================================================

    return () => {
      window.removeEventListener(
        "predictionUpdated",
        loadData
      );
    };
  }, []);

  // =====================================================
  // AI RECOMMENDATION
  // =====================================================

  const getRecommendation = () => {
    if (averagePerformance >= 80) {
      return "Overall performance is strong. Continue regular revision and provide advanced learning activities for high-performing students.";
    }

    if (averagePerformance >= 60) {
      return "Students are showing moderate performance. Consider additional practice sessions and regular revision in weaker subjects.";
    }

    if (averagePerformance >= 40) {
      return "Overall performance needs improvement. Increase academic support, study time, and monitoring for struggling students.";
    }

    return "Immediate academic attention is recommended. Consider personalized study plans, tutoring, and focused intervention.";
  };

  // =====================================================
  // PERFORMANCE MESSAGE
  // =====================================================

  const getPerformanceMessage = () => {
    if (averagePerformance >= 70) {
      return `Overall student performance is currently ${averagePerformance}%, showing a positive performance level.`;
    }

    if (averagePerformance >= 50) {
      return `Overall student performance is currently ${averagePerformance}%, indicating a moderate performance level.`;
    }

    return `Overall student performance is currently ${averagePerformance}%, indicating that additional academic support may be required.`;
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 min-h-[390px]">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">

        <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
          <Sparkles size={24} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            AI Insights
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Smart analysis of student performance
          </p>
        </div>

      </div>

      {/* Performance Overview */}
      <div className="bg-green-50 rounded-2xl p-5 mb-4">

        <div className="flex items-start gap-4">

          <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-green-700">
              Performance Overview
            </h3>

            <p className="text-sm text-green-700 mt-2 leading-relaxed">
              {averagePerformance === 0
                ? "Upload a student dataset to generate performance insights."
                : getPerformanceMessage()}
            </p>
          </div>

        </div>

      </div>

      {/* Students Need Attention */}
      <div className="bg-red-50 rounded-2xl p-5 mb-4">

        <div className="flex items-start gap-4">

          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-red-600">
              Students Need Attention
            </h3>

            <p className="text-sm text-red-600 mt-2 leading-relaxed">
              {highRiskStudents === 0
                ? "No high-risk students have been identified in the latest predictions."
                : `${highRiskStudents} student${
                    highRiskStudents > 1 ? "s" : ""
                  } ${
                    highRiskStudents > 1
                      ? "have"
                      : "has"
                  } been identified as high-risk based on predicted performance.`}
            </p>
          </div>

        </div>

      </div>

      {/* AI Recommendation */}
      <div className="bg-violet-50 rounded-2xl p-5">

        <div className="flex items-start gap-4">

          <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
            <Lightbulb size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-violet-700">
              AI Recommendation
            </h3>

            <p className="text-sm text-violet-700 mt-2 leading-relaxed">
              {getRecommendation()}
            </p>
          </div>

        </div>

      </div>

      {/* Top Performers Summary */}
      {topPerformers > 0 && (
        <div className="mt-4 text-xs text-gray-400 text-right">
          {topPerformers} top performer
          {topPerformers > 1 ? "s" : ""} identified
        </div>
      )}

      {/* View AI Assistant Button */}
      <button
        onClick={() => navigate("/ai-assistant")}
        className="w-full mt-5 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all duration-200"
      >
        View AI Assistant
      </button>

    </section>
  );
}

export default AIInsights;
