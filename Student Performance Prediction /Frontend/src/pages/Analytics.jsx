import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

import {
  TrendingUp,
  AlertTriangle,
  Trophy,
  Users,
  Target,
  ShieldAlert,
  Brain,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const [modelMetrics, setModelMetrics] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [featureImportance, setFeatureImportance] = useState([]);

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    const loadAnalytics = () => {
      const savedResults =
        localStorage.getItem("predictionResults");

      if (!savedResults) {
        setPredictions([]);
        return;
      }

      try {
        const data = JSON.parse(savedResults);

        if (Array.isArray(data)) {
          setPredictions(data);
        } else {
          setPredictions([]);
        }
      } catch (error) {
        console.error(
          "Error loading analytics data:",
          error
        );

        setPredictions([]);
      }
    };

    // Load prediction data
    loadAnalytics();

    // =================================================
    // LOAD ML MODEL INFORMATION
    // =================================================

    fetch("http://127.0.0.1:5000/model-info")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch model information"
          );
        }

        return response.json();
      })
      .then((data) => {
        // -----------------------------
        // Model Metrics
        // -----------------------------

        if (data.metrics) {
          setModelMetrics(data.metrics);
        }

        // -----------------------------
        // Feature Importance
        // -----------------------------

        if (data.feature_importance) {
          const formattedFeatures = Object.entries(
            data.feature_importance
          )
            .map(([feature, importance]) => ({
              feature,
              importance,
            }))
            .sort(
              (a, b) =>
                b.importance - a.importance
            );

          setFeatureImportance(
            formattedFeatures
          );
        }
      })
      .catch((error) => {
        console.error(
          "Error loading model metrics:",
          error
        );
      });

    // =================================================
    // LISTEN FOR PREDICTION UPDATES
    // =================================================

    window.addEventListener(
      "predictionUpdated",
      loadAnalytics
    );

    return () => {
      window.removeEventListener(
        "predictionUpdated",
        loadAnalytics
      );
    };
  }, []);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalStudents = predictions.length;

  const totalScore = predictions.reduce(
    (sum, student) =>
      sum +
      Number(student.predicted_score || 0),
    0
  );

  const averageScore =
    totalStudents > 0
      ? totalScore / totalStudents
      : 0;

  const averagePerformance =
    (averageScore / 20) * 100;

  const topPerformers = predictions.filter(
    (student) =>
      Number(student.predicted_score || 0) >= 16
  ).length;

  const highRiskStudents = predictions.filter(
    (student) =>
      student.risk_level === "High Risk"
  ).length;

  const moderateRiskStudents = predictions.filter(
    (student) =>
      student.risk_level === "Moderate Risk"
  ).length;

  const lowRiskStudents = predictions.filter(
    (student) =>
      student.risk_level === "Low Risk"
  ).length;

  const topPerformerPercentage =
    totalStudents > 0
      ? (topPerformers / totalStudents) * 100
      : 0;

  const highRiskPercentage =
    totalStudents > 0
      ? (highRiskStudents / totalStudents) * 100
      : 0;

  // =====================================================
  // PERFORMANCE DISTRIBUTION
  // =====================================================

  const performanceData = [
    {
      category: "Excellent",
      students: predictions.filter(
        (student) =>
          student.performance === "Excellent"
      ).length,
    },
    {
      category: "Good",
      students: predictions.filter(
        (student) =>
          student.performance === "Good"
      ).length,
    },
    {
      category: "Average",
      students: predictions.filter(
        (student) =>
          student.performance === "Average"
      ).length,
    },
    {
      category: "At Risk",
      students: predictions.filter(
        (student) =>
          student.performance === "At Risk"
      ).length,
    },
  ];

  // =====================================================
  // RISK DISTRIBUTION
  // =====================================================

  const riskData = [
    {
      category: "Low Risk",
      students: lowRiskStudents,
    },
    {
      category: "Moderate Risk",
      students: moderateRiskStudents,
    },
    {
      category: "High Risk",
      students: highRiskStudents,
    },
  ];

  // =====================================================
  // INSIGHTS
  // =====================================================

  const getPerformanceInsight = () => {
    if (averagePerformance >= 80) {
      return "Overall student performance is strong.";
    }

    if (averagePerformance >= 60) {
      return "Overall performance is moderate. Some students may need additional support.";
    }

    if (averagePerformance >= 40) {
      return "Overall performance needs improvement. Academic intervention may be useful.";
    }

    return "Overall performance is low. Students may require immediate academic attention.";
  };

  const getRiskInsight = () => {
    if (highRiskStudents === 0) {
      return "No high-risk students were identified in the current prediction data.";
    }

    if (highRiskPercentage <= 10) {
      return `${highRiskStudents} student${
        highRiskStudents > 1
          ? "s are"
          : " is"
      } currently classified as high risk.`;
    }

    return `${highRiskStudents} students are classified as high risk and may require additional academic support.`;
  };

  const getTopPerformerInsight = () => {
    if (topPerformers === 0) {
      return "No students currently meet the top-performer score threshold.";
    }

    return `${topPerformers} student${
      topPerformers > 1 ? "s" : ""
    } achieved a predicted score of 16 or higher.`;
  };

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <MainLayout>

      <div className="space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Analytics
          </h1>

          <p className="text-gray-500 mt-1">
            Detailed analysis of student performance
            and machine learning model performance.
          </p>
        </div>

        {/* =================================================
            ML MODEL PERFORMANCE
        ================================================= */}

        <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <Brain size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                ML Model Performance
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Evaluation metrics from the trained
                Random Forest regression model.
              </p>
            </div>

          </div>

          {modelMetrics ? (

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

              {/* MAE */}

              <div className="bg-violet-50 rounded-2xl p-5">

                <p className="text-sm text-violet-600 font-medium">
                  MAE
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-2">
                  {Number(
                    modelMetrics.mae
                  ).toFixed(3)}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Mean Absolute Error
                </p>

              </div>

              {/* MSE */}

              <div className="bg-blue-50 rounded-2xl p-5">

                <p className="text-sm text-blue-600 font-medium">
                  MSE
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-2">
                  {Number(
                    modelMetrics.mse
                  ).toFixed(4)}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Mean Squared Error
                </p>

              </div>

              {/* RMSE */}

              <div className="bg-green-50 rounded-2xl p-5">

                <p className="text-sm text-green-600 font-medium">
                  RMSE
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-2">
                  {Number(
                    modelMetrics.rmse
                  ).toFixed(4)}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Root Mean Squared Error
                </p>

              </div>

              {/* R2 */}

              <div className="bg-yellow-50 rounded-2xl p-5">

                <p className="text-sm text-yellow-600 font-medium">
                  R² Score
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-2">
                  {Number(
                    modelMetrics.r2_score
                  ).toFixed(4)}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Model explanatory score
                </p>

              </div>

            </div>

          ) : (

            <div className="mt-6 bg-gray-50 rounded-2xl p-5 text-sm text-gray-500">
              Model evaluation metrics are currently
              unavailable. Make sure the Flask backend
              is running.
            </div>

          )}

          {modelMetrics && (

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">

              <div className="text-sm">

                <span className="text-gray-400">
                  Model
                </span>

                <p className="font-semibold text-gray-700 mt-1">
                  {modelMetrics.model_type ||
                    "RandomForestRegressor"}
                </p>

              </div>

              <div className="text-sm">

                <span className="text-gray-400">
                  Training Records
                </span>

                <p className="font-semibold text-gray-700 mt-1">
                  {modelMetrics.training_records ??
                    "-"}
                </p>

              </div>

              <div className="text-sm">

                <span className="text-gray-400">
                  Testing Records
                </span>

                <p className="font-semibold text-gray-700 mt-1">
                  {modelMetrics.testing_records ??
                    "-"}
                </p>

              </div>

              <div className="text-sm">

                <span className="text-gray-400">
                  Features
                </span>

                <p className="font-semibold text-gray-700 mt-1">
                  {modelMetrics.number_of_features ??
                    "-"}
                </p>

              </div>

            </div>

          )}

        </section>

        {/* =================================================
            FEATURE IMPORTANCE
        ================================================= */}

        {featureImportance.length > 0 && (

          <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <Brain size={22} />
              </div>

              <div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Feature Importance
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Relative importance of input features
                  used by the machine learning model.
                </p>

              </div>

            </div>

            <div className="h-[400px] mt-6">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={featureImportance}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    domain={[0, "auto"]}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="feature"
                    width={110}
                    tick={{
                      fontSize: 12,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    formatter={(value) =>
                      Number(value).toFixed(4)
                    }
                  />

                  <Bar
                    dataKey="importance"
                    fill="#7c3aed"
                    radius={[
                      0,
                      8,
                      8,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </section>

        )}

        {/* =================================================
            STUDENT STATISTICS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* Total Students */}

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

            <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center">
              <Users
                size={22}
                className="text-violet-600"
              />
            </div>

            <p className="text-sm text-gray-500 mt-5">
              Total Students
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              {totalStudents}
            </h2>

          </div>

          {/* Average Performance */}

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp
                size={22}
                className="text-green-600"
              />
            </div>

            <p className="text-sm text-gray-500 mt-5">
              Average Performance
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              {averagePerformance.toFixed(1)}%
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Average score:{" "}
              {averageScore.toFixed(1)}/20
            </p>

          </div>

          {/* Top Performers */}

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

            <div className="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Trophy
                size={22}
                className="text-yellow-600"
              />
            </div>

            <p className="text-sm text-gray-500 mt-5">
              Top Performers
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              {topPerformers}
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              {topPerformerPercentage.toFixed(1)}%
              of students
            </p>

          </div>

          {/* High Risk */}

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

            <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle
                size={22}
                className="text-red-500"
              />
            </div>

            <p className="text-sm text-gray-500 mt-5">
              High Risk Students
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              {highRiskStudents}
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              {highRiskPercentage.toFixed(1)}%
              of students
            </p>

          </div>

        </div>

        {/* =================================================
            CHARTS
        ================================================= */}

        {totalStudents > 0 && (

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* Performance */}

            <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

              <h2 className="text-xl font-semibold text-gray-800">
                Performance Analysis
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Students by performance level.
              </p>

              <div className="h-[300px] mt-5">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={performanceData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -10,
                      bottom: 5,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="category"
                      tick={{
                        fontSize: 12,
                      }}
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="students"
                      fill="#7c3aed"
                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </section>

            {/* Risk */}

            <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

              <h2 className="text-xl font-semibold text-gray-800">
                Risk Analysis
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Students by academic risk level.
              </p>

              <div className="h-[300px] mt-5">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={riskData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -10,
                      bottom: 5,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="category"
                      tick={{
                        fontSize: 12,
                      }}
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="students"
                      fill="#ef4444"
                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </section>

          </div>

        )}

        {/* =================================================
            ACADEMIC INSIGHTS
        ================================================= */}

        {totalStudents > 0 && (

          <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <Target size={22} />
              </div>

              <div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Academic Insights
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Automatically generated observations
                  from prediction data.
                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

              {/* Performance Insight */}

              <div className="bg-violet-50 rounded-2xl p-5">

                <div className="flex items-center gap-2">

                  <TrendingUp
                    size={18}
                    className="text-violet-600"
                  />

                  <p className="font-semibold text-violet-700">
                    Performance
                  </p>

                </div>

                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {getPerformanceInsight()}
                </p>

              </div>

              {/* Risk Insight */}

              <div className="bg-red-50 rounded-2xl p-5">

                <div className="flex items-center gap-2">

                  <ShieldAlert
                    size={18}
                    className="text-red-500"
                  />

                  <p className="font-semibold text-red-600">
                    Risk
                  </p>

                </div>

                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {getRiskInsight()}
                </p>

              </div>

              {/* Top Performer Insight */}

              <div className="bg-green-50 rounded-2xl p-5">

                <div className="flex items-center gap-2">

                  <Trophy
                    size={18}
                    className="text-green-600"
                  />

                  <p className="font-semibold text-green-700">
                    Top Performers
                  </p>

                </div>

                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {getTopPerformerInsight()}
                </p>

              </div>

            </div>

          </section>

        )}

        {/* =================================================
            HIGH RISK STUDENTS
        ================================================= */}

        {totalStudents > 0 && (

          <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Students Requiring Attention
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Students currently classified as
                  high risk.
                </p>

              </div>

              <div className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold">
                {highRiskStudents} High Risk
              </div>

            </div>

            {highRiskStudents === 0 ? (

              <div className="bg-green-50 rounded-2xl p-5 flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                  <ShieldAlert size={20} />
                </div>

                <div>

                  <p className="font-semibold text-green-700">
                    No high-risk students
                  </p>

                  <p className="text-sm text-green-600 mt-1">
                    No students in the current
                    prediction data are classified
                    as high risk.
                  </p>

                </div>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="border-b border-gray-100">

                      <th className="text-left py-3 px-3 text-sm font-semibold text-gray-500">
                        Student
                      </th>

                      <th className="text-left py-3 px-3 text-sm font-semibold text-gray-500">
                        Score
                      </th>

                      <th className="text-left py-3 px-3 text-sm font-semibold text-gray-500">
                        Performance
                      </th>

                      <th className="text-left py-3 px-3 text-sm font-semibold text-gray-500">
                        Risk
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {predictions
                      .map((student, index) => ({
                        ...student,
                        originalIndex: index,
                      }))
                      .filter(
                        (student) =>
                          student.risk_level ===
                          "High Risk"
                      )
                      .map((student) => (

                        <tr
                          key={`${student.name}-${student.originalIndex}`}
                          className="border-b border-gray-50 hover:bg-violet-50 transition"
                        >

                          <td className="py-4 px-3">

                            <p className="font-semibold text-gray-800">
                              {student.name ||
                                `Student ${
                                  student.originalIndex +
                                  1
                                }`}
                            </p>

                          </td>

                          <td className="py-4 px-3 text-gray-700">

                            {Number(
                              student.predicted_score ||
                                0
                            ).toFixed(1)}

                            /20

                          </td>

                          <td className="py-4 px-3">

                            <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                              {student.performance ||
                                "At Risk"}
                            </span>

                          </td>

                          <td className="py-4 px-3">

                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                              High Risk
                            </span>

                          </td>

                        </tr>

                      ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        )}

        {/* =================================================
            NO PREDICTION DATA
        ================================================= */}

        {totalStudents === 0 && (

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">

              <TrendingUp size={30} />

            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-5">
              No Student Prediction Data Yet
            </h2>

            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              Generate a student prediction or upload
              a dataset to start viewing student
              performance analytics.
            </p>

          </div>

        )}

      </div>

    </MainLayout>
  );
}

export default Analytics;
