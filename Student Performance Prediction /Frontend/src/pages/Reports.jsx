import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";

import {
  FileText,
  Users,
  TrendingUp,
  AlertTriangle,
  Trophy,
  Download,
  Search,
  X,
} from "lucide-react";

function Reports() {
  const [predictions, setPredictions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  // =====================================================
  // LOAD PREDICTION DATA
  // =====================================================

  useEffect(() => {
    const loadReports = () => {
      const savedResults = localStorage.getItem("predictionResults");

      if (!savedResults) {
        setPredictions([]);
        return;
      }

      try {
        const data = JSON.parse(savedResults);

        setPredictions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading reports:", error);
        setPredictions([]);
      }
    };

    loadReports();

    window.addEventListener("predictionUpdated", loadReports);

    return () => {
      window.removeEventListener("predictionUpdated", loadReports);
    };
  }, []);

  // =====================================================
  // SUMMARY CALCULATIONS
  // =====================================================

  const totalStudents = predictions.length;

  const totalScore = predictions.reduce(
    (sum, student) =>
      sum + Number(student.predicted_score || 0),
    0
  );

  const averageScore =
    totalStudents > 0
      ? totalScore / totalStudents
      : 0;

  const averagePerformance =
    (averageScore / 20) * 100;

  const highRiskStudents = predictions.filter(
    (student) => student.risk_level === "High Risk"
  ).length;

  const topPerformers = predictions.filter(
    (student) =>
      Number(student.predicted_score || 0) >= 16
  ).length;

  // =====================================================
  // FILTER STUDENTS
  // =====================================================

  const filteredPredictions = useMemo(() => {
    return predictions.filter((student) => {
      const studentName = String(
        student.name || ""
      ).toLowerCase();

      const matchesSearch =
        studentName.includes(
          searchTerm.toLowerCase()
        );

      const matchesRisk =
        riskFilter === "All" ||
        student.risk_level === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [predictions, searchTerm, riskFilter]);

  // =====================================================
  // EXPORT REPORT
  // =====================================================

  const exportReport = () => {
    if (predictions.length === 0) {
      alert("No prediction data available.");
      return;
    }

    const reportData = [
      [
        "Student",
        "Predicted Score",
        "Performance",
        "Risk Level",
        "Recommendation",
      ],
    ];

    predictions.forEach((student, index) => {
      reportData.push([
        student.name || `Student ${index + 1}`,
        student.predicted_score ?? "N/A",
        student.performance || "N/A",
        student.risk_level || "N/A",
        student.recommendation || "N/A",
      ]);
    });

    const csvContent = reportData
      .map((row) =>
        row
          .map((value) => {
            const text = String(value ?? "");

            return `"${text.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
      "eduai-student-performance-report.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    alert("Report exported successfully!");
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {
    setSearchTerm("");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <MainLayout>
      <div className="space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
                <FileText
                  size={25}
                  className="text-violet-600"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Reports
                </h1>

                <p className="text-gray-500 mt-1">
                  View and export student performance prediction reports.
                </p>
              </div>

            </div>
          </div>

          <button
            onClick={exportReport}
            disabled={predictions.length === 0}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
              predictions.length === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-violet-600 text-white hover:bg-violet-700"
            }`}
          >
            <Download size={19} />
            Export Report
          </button>

        </div>

        {/* =================================================
            SUMMARY CARDS
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

          </div>

          {/* Top Performers */}

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

            <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center">
              <Trophy
                size={22}
                className="text-violet-600"
              />
            </div>

            <p className="text-sm text-gray-500 mt-5">
              Top Performers
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              {topPerformers}
            </h2>

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

          </div>

        </div>

        {/* =================================================
            REPORT TABLE
        ================================================= */}

        <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

          {/* Table Header */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Student Prediction Report
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Latest prediction results.
              </p>
            </div>

            {/* Filters */}

            {predictions.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3">

                {/* Search */}

                <div className="relative">

                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    placeholder="Search student..."
                    className="w-full sm:w-64 pl-10 pr-10 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
                  />

                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}

                </div>

                {/* Risk Filter */}

                <select
                  value={riskFilter}
                  onChange={(e) =>
                    setRiskFilter(e.target.value)
                  }
                  className="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm focus:ring-2 focus:ring-violet-200"
                >
                  <option value="All">
                    All Risk Levels
                  </option>

                  <option value="Low Risk">
                    Low Risk
                  </option>

                  <option value="Moderate Risk">
                    Moderate Risk
                  </option>

                  <option value="High Risk">
                    High Risk
                  </option>
                </select>

              </div>
            )}

          </div>

          {/* =================================================
              NO DATA
          ================================================= */}

          {predictions.length === 0 ? (

            <div className="py-16 text-center">

              <FileText
                size={45}
                className="mx-auto text-gray-300"
              />

              <p className="text-gray-500 mt-4">
                No prediction data available.
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Generate a prediction or upload a dataset
                to create a report.
              </p>

            </div>

          ) : filteredPredictions.length === 0 ? (

            /* =================================================
               NO FILTER RESULTS
            ================================================= */

            <div className="py-16 text-center">

              <Search
                size={45}
                className="mx-auto text-gray-300"
              />

              <p className="text-gray-500 mt-4">
                No students found.
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Try changing your search or risk filter.
              </p>

            </div>

          ) : (

            /* =================================================
               TABLE
            ================================================= */

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>

                  <tr className="border-b border-gray-100">

                    <th className="py-3 px-2 text-sm font-semibold text-gray-500">
                      Student
                    </th>

                    <th className="py-3 px-2 text-sm font-semibold text-gray-500">
                      Score
                    </th>

                    <th className="py-3 px-2 text-sm font-semibold text-gray-500">
                      Performance
                    </th>

                    <th className="py-3 px-2 text-sm font-semibold text-gray-500">
                      Risk
                    </th>

                    <th className="py-3 px-2 text-sm font-semibold text-gray-500">
                      Recommendation
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredPredictions.map(
                    (student, index) => (

                      <tr
                        key={index}
                        className="border-b border-gray-50 hover:bg-gray-50 transition"
                      >

                        {/* Student */}

                        <td className="py-4 px-2">

                          <span className="font-medium text-gray-800">
                            {student.name ||
                              `Student ${index + 1}`}
                          </span>

                        </td>

                        {/* Score */}

                        <td className="py-4 px-2 font-semibold text-gray-800">
                          {student.predicted_score ?? "N/A"}/20
                        </td>

                        {/* Performance */}

                        <td className="py-4 px-2">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              student.performance ===
                              "Excellent"
                                ? "bg-green-100 text-green-700"
                                : student.performance ===
                                  "Good"
                                ? "bg-violet-100 text-violet-700"
                                : student.performance ===
                                  "Average"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {student.performance ||
                              "N/A"}
                          </span>

                        </td>

                        {/* Risk */}

                        <td className="py-4 px-2">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              student.risk_level ===
                              "Low Risk"
                                ? "bg-green-100 text-green-700"
                                : student.risk_level ===
                                  "Moderate Risk"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {student.risk_level ||
                              "N/A"}
                          </span>

                        </td>

                        {/* Recommendation */}

                        <td className="py-4 px-2 text-sm text-gray-500 max-w-md">
                          {student.recommendation ||
                            "No recommendation available."}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

          {/* Filter Result Count */}

          {predictions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Showing {filteredPredictions.length} of{" "}
                {predictions.length} students
              </p>
            </div>
          )}

        </section>

      </div>
    </MainLayout>
  );
}

export default Reports;
