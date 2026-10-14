import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lightbulb,
  ArrowLeft,
} from "lucide-react";

function UploadDataset() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =====================================================
  // FILE SELECTION
  // =====================================================

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setError("");
    setResults([]);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Check CSV file
    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a CSV file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // =====================================================
  // UPLOAD CSV + PREDICT
  // =====================================================

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      // Create FormData
      const formData = new FormData();

      // "file" must match Flask:
      // request.files["file"]
      formData.append("file", file);

      // Send CSV to Flask
      const response = await fetch(
        "http://127.0.0.1:5000/predict-bulk",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      // Check backend error
      if (!response.ok) {
        throw new Error(
          data.error || "Dataset prediction failed."
        );
      }

      // =================================================
      // GET RESULTS FROM FLASK
      // =================================================

      const predictionResults = data.results || [];

      // Display results on this page
      setResults(predictionResults);

      // =================================================
      // SAVE RESULTS TO LOCAL STORAGE
      // =================================================

      localStorage.setItem(
        "predictionResults",
        JSON.stringify(predictionResults)
      );

      // Also save the upload time
      localStorage.setItem(
        "predictionResultsUpdatedAt",
        new Date().toISOString()
      );

      // =================================================
      // NOTIFY DASHBOARD
      // =================================================
      // This tells dashboard components that new
      // prediction data is available.

      window.dispatchEvent(
        new Event("predictionUpdated")
      );

    } catch (error) {
      console.error("Upload error:", error);

      setError(
        error.message ||
          "Upload failed. Make sure Flask is running on http://127.0.0.1:5000"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f8f7fc] p-8">

      {/* =================================================
          BACK TO DASHBOARD
      ================================================= */}

      <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition font-medium"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">

            <Upload
              className="text-violet-600"
              size={25}
            />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Upload Dataset
            </h1>

            <p className="text-gray-500 mt-1">
              Upload a student dataset for bulk performance prediction.
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          UPLOAD CARD
      ================================================= */}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

        <div className="max-w-3xl mx-auto">

          {/* Upload Area */}

          <label
            htmlFor="dataset"
            className="block border-2 border-dashed border-violet-200 rounded-3xl p-12 text-center cursor-pointer hover:bg-violet-50 transition"
          >

            <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-100 flex items-center justify-center">

              <FileSpreadsheet
                size={32}
                className="text-violet-600"
              />

            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-5">
              Upload Student Dataset
            </h2>

            <p className="text-gray-500 mt-2">
              Select a CSV file containing student information.
            </p>

            <p className="text-sm text-gray-400 mt-3">
              Supported format: CSV
            </p>

            <input
              id="dataset"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />

          </label>

          {/* =================================================
              SELECTED FILE
          ================================================= */}

          {file && (

            <div className="mt-5 p-4 rounded-2xl bg-violet-50 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">

                  <FileSpreadsheet
                    size={20}
                    className="text-violet-600"
                  />

                </div>

                <div>

                  <p className="font-semibold text-gray-800">
                    {file.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>

                </div>

              </div>

              <CheckCircle
                size={22}
                className="text-green-500"
              />

            </div>

          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="mt-5 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3">

              <AlertCircle
                size={20}
                className="text-red-500"
              />

              <p className="text-sm text-red-600">
                {error}
              </p>

            </div>

          )}

          {/* =================================================
              UPLOAD BUTTON
          ================================================= */}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full mt-6 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >

            {loading ? (

              <>
                <Loader2
                  size={20}
                  className="animate-spin"
                />

                Processing Dataset...
              </>

            ) : (

              <>
                <Upload size={20} />

                Upload & Predict
              </>

            )}

          </button>

        </div>

      </div>

      {/* =================================================
          RESULTS
      ================================================= */}

      {results.length > 0 && (

        <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

          {/* Results Header */}

          <div className="mb-6">

            <h2 className="text-xl font-semibold text-gray-800">
              Prediction Results
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              ML predictions generated for uploaded students.
            </p>

          </div>

          {/* =================================================
              RESULTS TABLE
          ================================================= */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-gray-100 text-left">

                  <th className="py-4 px-4 text-sm font-semibold text-gray-600">
                    Student
                  </th>

                  <th className="py-4 px-4 text-sm font-semibold text-gray-600">
                    Predicted Score
                  </th>

                  <th className="py-4 px-4 text-sm font-semibold text-gray-600">
                    Performance
                  </th>

                  <th className="py-4 px-4 text-sm font-semibold text-gray-600">
                    Risk Level
                  </th>

                  <th className="py-4 px-4 text-sm font-semibold text-gray-600">
                    Recommendation
                  </th>

                </tr>

              </thead>

              <tbody>

                {results.map((student, index) => (

                  <tr
                    key={index}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >

                    {/* Student */}

                    <td className="py-4 px-4 font-medium text-gray-800 whitespace-nowrap">

                      {student.name ||
                        `Student ${index + 1}`}

                    </td>

                    {/* Predicted Score */}

                    <td className="py-4 px-4 text-gray-700 font-semibold whitespace-nowrap">

                      {student.predicted_score}/20

                    </td>

                    {/* Performance */}

                    <td className="py-4 px-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          student.performance === "Excellent"
                            ? "bg-green-100 text-green-700"
                            : student.performance === "Good"
                            ? "bg-violet-100 text-violet-700"
                            : student.performance === "Average"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >

                        {student.performance}

                      </span>

                    </td>

                    {/* Risk Level */}

                    <td className="py-4 px-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          student.risk_level === "Low Risk"
                            ? "bg-green-100 text-green-700"
                            : student.risk_level ===
                              "Moderate Risk"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >

                        {student.risk_level}

                      </span>

                    </td>

                    {/* Recommendation */}

                    <td className="py-4 px-4 min-w-[300px]">

                      <div className="flex items-start gap-2">

                        <Lightbulb
                          size={18}
                          className="text-violet-600 mt-0.5 flex-shrink-0"
                        />

                        <p className="text-sm text-gray-600 leading-relaxed">

                          {student.recommendation ||
                            "No recommendation available."}

                        </p>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
}

export default UploadDataset;
