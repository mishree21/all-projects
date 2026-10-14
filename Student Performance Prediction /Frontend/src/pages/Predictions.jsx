import { useEffect, useState } from "react";
import {
  Eye,
  Search,
  ArrowLeft,
  Trash2,
  Users,
  AlertTriangle,
  Trophy,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function Predictions() {
  const navigate = useNavigate();

  const [predictions, setPredictions] = useState([]);
  const [search, setSearch] = useState("");
  const [performanceFilter, setPerformanceFilter] =
    useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortOption, setSortOption] = useState("default");

  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // =====================================================
  // LOAD PREDICTIONS
  // =====================================================

  useEffect(() => {
    const loadPredictions = () => {
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
          "Error loading predictions:",
          error
        );

        setPredictions([]);
      }
    };

    loadPredictions();

    window.addEventListener(
      "predictionUpdated",
      loadPredictions
    );

    return () => {
      window.removeEventListener(
        "predictionUpdated",
        loadPredictions
      );
    };
  }, []);

  // =====================================================
  // FILTER PREDICTIONS
  // =====================================================

  const filteredPredictions = predictions
    .map((student, index) => ({
      ...student,
      originalIndex: index,
    }))
    .filter((student) => {
      const studentName = String(
        student.name || ""
      );

      const matchesSearch = studentName
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesPerformance =
        performanceFilter === "All" ||
        student.performance === performanceFilter;

      const matchesRisk =
        riskFilter === "All" ||
        student.risk_level === riskFilter;

      return (
        matchesSearch &&
        matchesPerformance &&
        matchesRisk
      );
    });

  // =====================================================
  // SORT PREDICTIONS
  // =====================================================

  const sortedPredictions = [...filteredPredictions].sort(
    (a, b) => {
      if (sortOption === "score-high") {
        return (
          Number(b.predicted_score || 0) -
          Number(a.predicted_score || 0)
        );
      }

      if (sortOption === "score-low") {
        return (
          Number(a.predicted_score || 0) -
          Number(b.predicted_score || 0)
        );
      }

      if (sortOption === "name-az") {
        return String(a.name || "").localeCompare(
          String(b.name || "")
        );
      }

      if (sortOption === "name-za") {
        return String(b.name || "").localeCompare(
          String(a.name || "")
        );
      }

      return 0;
    }
  );

  // =====================================================
  // PAGINATION CALCULATIONS
  // =====================================================

  const totalPages = Math.ceil(
    sortedPredictions.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const paginatedPredictions =
    sortedPredictions.slice(
      startIndex,
      endIndex
    );

  // =====================================================
  // DELETE SINGLE PREDICTION
  // =====================================================

  const handleDelete = (index) => {
    const student = predictions[index];

    const studentName =
      student?.name ||
      `Student ${index + 1}`;

    const confirmed = window.confirm(
      `Delete prediction for ${studentName}?`
    );

    if (!confirmed) return;

    const updatedPredictions =
      predictions.filter(
        (_, predictionIndex) =>
          predictionIndex !== index
      );

    localStorage.setItem(
      "predictionResults",
      JSON.stringify(updatedPredictions)
    );

    localStorage.setItem(
      "predictionResultsUpdatedAt",
      new Date().toISOString()
    );

    setPredictions(updatedPredictions);

    window.dispatchEvent(
      new Event("predictionUpdated")
    );
  };

  // =====================================================
  // CLEAR ALL PREDICTIONS
  // =====================================================

  const handleClearAll = () => {
    if (predictions.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete all prediction data? This cannot be undone."
    );

    if (!confirmed) return;

    localStorage.removeItem("predictionResults");

    localStorage.removeItem(
      "predictionResultsUpdatedAt"
    );

    setPredictions([]);

    setCurrentPage(1);

    window.dispatchEvent(
      new Event("predictionUpdated")
    );
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setPerformanceFilter("All");
    setRiskFilter("All");
    setSortOption("default");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    performanceFilter !== "All" ||
    riskFilter !== "All" ||
    sortOption !== "default";

  // =====================================================
  // RESET PAGE WHEN FILTER/SORT CHANGES
  // =====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    performanceFilter,
    riskFilter,
    sortOption,
  ]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalStudents = predictions.length;

  const topPerformers = predictions.filter(
    (student) =>
      Number(student.predicted_score || 0) >= 16
  ).length;

  const highRiskStudents = predictions.filter(
    (student) =>
      student.risk_level === "High Risk"
  ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="max-w-7xl mx-auto w-full">

          {/* =================================================
              BACK BUTTON
          ================================================= */}

          <button
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition font-medium"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>

                <h1 className="text-2xl font-bold text-gray-800">
                  All Predictions
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  View and analyze all student performance
                  predictions.
                </p>

              </div>

              {predictions.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition font-medium"
                >
                  <Trash2 size={17} />
                  Clear All
                </button>
              )}

            </div>

          </div>

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">

            {/* Total */}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">

              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <Users size={20} />
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Total Predictions
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {totalStudents}
              </h2>

            </div>

            {/* Top performers */}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">

              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <Trophy size={20} />
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Top Performers
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {topPerformers}
              </h2>

            </div>

            {/* High risk */}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">

              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>

              <p className="text-sm text-gray-500 mt-4">
                High Risk Students
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {highRiskStudents}
              </h2>

            </div>

          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">

            <div className="flex flex-col lg:flex-row gap-4">

              {/* Search */}

              <div className="relative flex-1">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search student..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-700 focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={17} />
                  </button>
                )}

              </div>

              {/* Performance */}

              <select
                value={performanceFilter}
                onChange={(e) =>
                  setPerformanceFilter(e.target.value)
                }
                className="lg:w-56 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-700 focus:ring-2 focus:ring-violet-200 cursor-pointer"
              >
                <option value="All">
                  All Performance
                </option>

                <option value="Excellent">
                  Excellent
                </option>

                <option value="Good">
                  Good
                </option>

                <option value="Average">
                  Average
                </option>

                <option value="At Risk">
                  At Risk
                </option>
              </select>

              {/* Risk */}

              <select
                value={riskFilter}
                onChange={(e) =>
                  setRiskFilter(e.target.value)
                }
                className="lg:w-56 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-700 focus:ring-2 focus:ring-violet-200 cursor-pointer"
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

              {/* Sort */}

              <select
                value={sortOption}
                onChange={(e) =>
                  setSortOption(e.target.value)
                }
                className="lg:w-56 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-700 focus:ring-2 focus:ring-violet-200 cursor-pointer"
              >
                <option value="default">
                  Sort By
                </option>

                <option value="score-high">
                  Highest Score
                </option>

                <option value="score-low">
                  Lowest Score
                </option>

                <option value="name-az">
                  Name A–Z
                </option>

                <option value="name-za">
                  Name Z–A
                </option>
              </select>

              {/* Clear */}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition font-medium text-sm"
                >
                  Clear Filters
                </button>
              )}

            </div>

          </div>

          {/* =================================================
              RESULTS
          ================================================= */}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">

              <div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Student Predictions
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Showing{" "}
                  <span className="font-semibold text-gray-700">
                    {paginatedPredictions.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-700">
                    {sortedPredictions.length}
                  </span>{" "}
                  filtered students
                </p>

              </div>

            </div>

            {/* =================================================
                NO DATA
            ================================================= */}

            {predictions.length === 0 ? (

              <div className="text-center py-16">

                <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
                  <Users size={26} />
                </div>

                <p className="text-gray-600 font-semibold mt-5">
                  No prediction data available
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Upload a student dataset or generate
                  an individual prediction.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3 mt-5">

                  <button
                    onClick={() =>
                      navigate("/upload-dataset")
                    }
                    className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition"
                  >
                    Upload Dataset
                  </button>

                  <button
                    onClick={() =>
                      navigate("/predict-performance")
                    }
                    className="px-5 py-2.5 rounded-xl bg-violet-50 text-violet-600 font-semibold hover:bg-violet-100 transition"
                  >
                    Predict Student
                  </button>

                </div>

              </div>

            ) : filteredPredictions.length === 0 ? (

              /* =================================================
                 NO FILTER RESULTS
              ================================================= */

              <div className="text-center py-16">

                <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center">
                  <Search size={26} />
                </div>

                <p className="text-gray-600 font-semibold mt-5">
                  No students match your filters
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Try changing your search or filter options.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition font-medium"
                >
                  Clear Filters
                </button>

              </div>

            ) : (

              /* =================================================
                 TABLE
              ================================================= */

              <>
                <div className="overflow-x-auto">

                  <table className="w-full text-left">

                    <thead>

                      <tr className="border-b border-gray-100">

                        <th className="py-3 px-3 text-sm font-semibold text-gray-500">
                          #
                        </th>

                        <th className="py-3 px-3 text-sm font-semibold text-gray-500">
                          Student
                        </th>

                        <th className="py-3 px-3 text-sm font-semibold text-gray-500">
                          Score
                        </th>

                        <th className="py-3 px-3 text-sm font-semibold text-gray-500">
                          Performance
                        </th>

                        <th className="py-3 px-3 text-sm font-semibold text-gray-500">
                          Risk
                        </th>

                        <th className="py-3 px-3 text-sm font-semibold text-gray-500">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {paginatedPredictions.map(
                        (student) => {

                          const index =
                            student.originalIndex;

                          return (
                            <tr
                              key={index}
                              className="border-b border-gray-50 hover:bg-violet-50/50 transition"
                            >

                              {/* Number */}

                              <td className="py-4 px-3 text-sm text-gray-500">
                                {index + 1}
                              </td>

                              {/* Student */}

                              <td className="py-4 px-3">

                                <div className="flex items-center gap-3">

                                  <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-semibold">
                                    {(
                                      student.name ||
                                      "S"
                                    )
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <div>

                                    <p className="font-semibold text-gray-800">
                                      {student.name ||
                                        `Student ${
                                          index + 1
                                        }`}
                                    </p>

                                    {student.subject && (
                                      <p className="text-xs text-gray-400 mt-0.5">
                                        {student.subject}
                                      </p>
                                    )}

                                  </div>

                                </div>

                              </td>

                              {/* Score */}

                              <td className="py-4 px-3">

                                <span className="font-semibold text-gray-800">
                                  {Number(
                                    student.predicted_score ||
                                      0
                                  ).toFixed(1)}
                                  /20
                                </span>

                              </td>

                              {/* Performance */}

                              <td className="py-4 px-3">

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
                                    "Unknown"}
                                </span>

                              </td>

                              {/* Risk */}

                              <td className="py-4 px-3">

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
                                    "Unknown"}
                                </span>

                              </td>

                              {/* Actions */}

                              <td className="py-4 px-3">

                                <div className="flex items-center gap-2">

                                  {/* View */}

                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/student-details/${index}`
                                      )
                                    }
                                    className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center hover:bg-violet-100 transition"
                                    title="View student details"
                                  >
                                    <Eye size={18} />
                                  </button>

                                  {/* Delete */}

                                  <button
                                    onClick={() =>
                                      handleDelete(index)
                                    }
                                    className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition"
                                    title="Delete prediction"
                                  >
                                    <Trash2 size={17} />
                                  </button>

                                </div>

                              </td>

                            </tr>
                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>

                {/* =================================================
                    PAGINATION
                ================================================= */}

                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-5 border-t border-gray-100">

                    <p className="text-sm text-gray-500">
                      Page{" "}
                      <span className="font-semibold text-gray-700">
                        {currentPage}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-gray-700">
                        {totalPages}
                      </span>
                    </p>

                    <div className="flex items-center gap-2">

                      {/* Previous */}

                      <button
                        onClick={() =>
                          setCurrentPage(
                            (page) =>
                              Math.max(1, page - 1)
                          )
                        }
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-violet-50 text-violet-600 hover:bg-violet-100"
                        }`}
                      >
                        Previous
                      </button>

                      {/* Page numbers */}

                      <div className="flex items-center gap-1">

                        {Array.from(
                          { length: totalPages },
                          (_, index) =>
                            index + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() =>
                              setCurrentPage(page)
                            }
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                              currentPage === page
                                ? "bg-violet-600 text-white"
                                : "bg-gray-50 text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                      </div>

                      {/* Next */}

                      <button
                        onClick={() =>
                          setCurrentPage(
                            (page) =>
                              Math.min(
                                totalPages,
                                page + 1
                              )
                          )
                        }
                        disabled={
                          currentPage === totalPages
                        }
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-violet-50 text-violet-600 hover:bg-violet-100"
                        }`}
                      >
                        Next
                      </button>

                    </div>

                  </div>
                )}

              </>

            )}

          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default Predictions;
