import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  User,
  BookOpen,
  Calculator,
  GraduationCap,
  Users,
  Wifi,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
} from "lucide-react";

function PredictPerformance() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    Medu: "",
    Fedu: "",
    studyTime: "",
    failures: "",
    absences: "",
    previousScore: "",
    secondPeriodScore: "",
    famsup: "",
    internet: "",
    higher: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            age: Number(formData.age),
            Gender: formData.gender,
            Medu: Number(formData.Medu),
            Fedu: Number(formData.Fedu),
            studytime: Number(formData.studyTime),
            failures: Number(formData.failures),
            absences: Number(formData.absences),

            // Convert 0-100 score to dataset 0-20 scale
            G1: Number(formData.previousScore) / 5,
            G2: Number(formData.secondPeriodScore) / 5,

            famsup: formData.famsup,
            internet: formData.internet,
            higher: formData.higher,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Prediction failed"
        );
      }

      const score = Number(data.predicted_score);

      // ==============================
      // PERFORMANCE LEVEL
      // ==============================

      let result;

      if (score >= 16) {
        result = "Excellent";
      } else if (score >= 12) {
        result = "Good";
      } else if (score >= 10) {
        result = "Average";
      } else {
        result = "At Risk";
      }

      // ==============================
      // RISK LEVEL + RECOMMENDATION
      // ==============================

      let riskLevel;
      let riskColor;
      let riskBg;
      let recommendation;

      if (score >= 16) {
        riskLevel = "Low Risk";
        riskColor = "text-green-600";
        riskBg = "bg-green-50";

        recommendation =
          "The student is performing very well. Maintain the current study routine, continue regular revision, and focus on advanced learning activities to achieve consistent high performance.";
      } else if (score >= 12) {
        riskLevel = "Low Risk";
        riskColor = "text-green-600";
        riskBg = "bg-green-50";

        recommendation =
          "The student is showing good academic performance. Encourage consistent study habits, regular revision, and additional practice in weaker subjects to improve further.";
      } else if (score >= 10) {
        riskLevel = "Moderate Risk";
        riskColor = "text-yellow-600";
        riskBg = "bg-yellow-50";

        recommendation =
          "The student may need additional academic support. Increase study time, reduce unnecessary absences, revise previous topics regularly, and provide extra practice in difficult subjects.";
      } else {
        riskLevel = "High Risk";
        riskColor = "text-red-600";
        riskBg = "bg-red-50";

        recommendation =
          "The student may require immediate academic attention. Consider a personalized study plan, additional tutoring, regular progress monitoring, family support, and focused intervention in weak subjects.";
      }

      // ==============================
      // RESULT FOR UI
      // ==============================

      setPrediction({
        score: score.toFixed(1),
        result,
        riskLevel,
        riskColor,
        riskBg,
        recommendation,
      });

      // ==============================
      // SAVE PREDICTION
      // ==============================

      const newPrediction = {
        name: formData.name,
        predicted_score: Number(score.toFixed(1)),
        performance: result,
        risk_level: riskLevel,
        recommendation: recommendation,
      };

      const existingResults =
        localStorage.getItem("predictionResults");

      let predictionResults = [];

      if (existingResults) {
        try {
          const parsedResults =
            JSON.parse(existingResults);

          if (Array.isArray(parsedResults)) {
            predictionResults = parsedResults;
          }
        } catch (error) {
          console.error(
            "Error reading existing predictions:",
            error
          );
        }
      }

      predictionResults.push(newPrediction);

      localStorage.setItem(
        "predictionResults",
        JSON.stringify(predictionResults)
      );

      localStorage.setItem(
        "predictionResultsUpdatedAt",
        new Date().toISOString()
      );

      // Tell dashboard components to refresh
      window.dispatchEvent(
        new Event("predictionUpdated")
      );

    } catch (error) {
      console.error(
        "Prediction error:",
        error
      );

      alert(
        "Prediction failed. Make sure Flask is running on http://127.0.0.1:5000"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7fc] p-8">

      <button
  onClick={() => navigate("/")}
  className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition font-medium"
>
  <ArrowLeft size={18} />
  Back to Dashboard
</button>

      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
            <Brain
              className="text-violet-600"
              size={25}
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Predict Student Performance
            </h1>

            <p className="text-gray-500 mt-1">
              Enter student information to generate an AI performance
              prediction.
            </p>
          </div>

        </div>
      </div>

      {/* ================= MAIN GRID ================= */}

      <div className="grid grid-cols-3 gap-6">

        {/* ===================================================== */}
        {/* FORM */}
        {/* ===================================================== */}

        <div className="col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

          <h2 className="text-xl font-semibold text-gray-800 mb-8">
            Student Information
          </h2>

          <form onSubmit={handleSubmit}>

            {/* ================================================= */}
            {/* PERSONAL INFORMATION */}
            {/* ================================================= */}

            <div className="flex items-center gap-2 mb-5">

              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                <User
                  size={18}
                  className="text-violet-600"
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  Personal Information
                </h3>

                <p className="text-xs text-gray-400">
                  Basic student details
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-6">

              {/* STUDENT NAME */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>

              {/* AGE */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  min="15"
                  max="25"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>

              {/* GENDER */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="F">
                    Female
                  </option>

                  <option value="M">
                    Male
                  </option>
                </select>
              </div>

              {/* MOTHER EDUCATION */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mother's Education
                </label>

                <select
                  name="Medu"
                  value={formData.Medu}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                >
                  <option value="">
                    Select education level
                  </option>

                  <option value="0">
                    None
                  </option>

                  <option value="1">
                    Primary Education
                  </option>

                  <option value="2">
                    5th to 9th Grade
                  </option>

                  <option value="3">
                    Secondary Education
                  </option>

                  <option value="4">
                    Higher Education
                  </option>
                </select>

                <p className="text-xs text-gray-400 mt-1">
                  Dataset scale: 0 - 4
                </p>
              </div>

              {/* FATHER EDUCATION */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Father's Education
                </label>

                <select
                  name="Fedu"
                  value={formData.Fedu}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                >
                  <option value="">
                    Select education level
                  </option>

                  <option value="0">
                    None
                  </option>

                  <option value="1">
                    Primary Education
                  </option>

                  <option value="2">
                    5th to 9th Grade
                  </option>

                  <option value="3">
                    Secondary Education
                  </option>

                  <option value="4">
                    Higher Education
                  </option>
                </select>

                <p className="text-xs text-gray-400 mt-1">
                  Dataset scale: 0 - 4
                </p>
              </div>

            </div>

            {/* ================================================= */}
            {/* ACADEMIC INFORMATION */}
            {/* ================================================= */}

            <div className="flex items-center gap-2 mt-10 mb-5">

              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                <GraduationCap
                  size={18}
                  className="text-violet-600"
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  Academic Information
                </h3>

                <p className="text-xs text-gray-400">
                  Student academic performance
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-6">

              {/* STUDY TIME */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Study Time
                </label>

                <div className="relative">

                  <BookOpen
                    size={19}
                    className="absolute left-4 top-3.5 text-gray-400"
                  />

                  <input
                    type="number"
                    name="studyTime"
                    value={formData.studyTime}
                    onChange={handleChange}
                    placeholder="1 - 4"
                    min="1"
                    max="4"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />

                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Dataset scale: 1 - 4
                </p>

              </div>

              {/* FAILURES */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Failures
                </label>

                <input
                  type="number"
                  name="failures"
                  value={formData.failures}
                  onChange={handleChange}
                  placeholder="Enter number of failures"
                  min="0"
                  max="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />

                <p className="text-xs text-gray-400 mt-1">
                  Dataset scale: 0 - 4
                </p>

              </div>

              {/* ABSENCES */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Absences
                </label>

                <input
                  type="number"
                  name="absences"
                  value={formData.absences}
                  onChange={handleChange}
                  placeholder="Enter number of absences"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />

              </div>

              {/* PREVIOUS SCORE */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Score
                </label>

                <input
                  type="number"
                  name="previousScore"
                  value={formData.previousScore}
                  onChange={handleChange}
                  placeholder="0 - 100"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />

                <p className="text-xs text-gray-400 mt-1">
                  Converted to dataset G1 scale (0 - 20)
                </p>

              </div>

              {/* SECOND PERIOD SCORE */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Second Period Score
                </label>

                <div className="relative">

                  <Calculator
                    size={19}
                    className="absolute left-4 top-3.5 text-gray-400"
                  />

                  <input
                    type="number"
                    name="secondPeriodScore"
                    value={formData.secondPeriodScore}
                    onChange={handleChange}
                    placeholder="0 - 100"
                    min="0"
                    max="100"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />

                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Converted to dataset G2 scale (0 - 20)
                </p>

              </div>

            </div>

            {/* ================================================= */}
            {/* STUDENT SUPPORT */}
            {/* ================================================= */}

            <div className="flex items-center gap-2 mt-10 mb-5">

              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                <Users
                  size={18}
                  className="text-violet-600"
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  Student Support
                </h3>

                <p className="text-xs text-gray-400">
                  Learning environment and support
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-6">

              {/* FAMILY SUPPORT */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family Support
                </label>

                <select
                  name="famsup"
                  value={formData.famsup}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                >
                  <option value="">
                    Select option
                  </option>

                  <option value="yes">
                    Yes
                  </option>

                  <option value="no">
                    No
                  </option>
                </select>

              </div>

              {/* INTERNET */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Internet Access
                </label>

                <div className="relative">

                  <Wifi
                    size={19}
                    className="absolute left-4 top-3.5 text-gray-400"
                  />

                  <select
                    name="internet"
                    value={formData.internet}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  >
                    <option value="">
                      Select option
                    </option>

                    <option value="yes">
                      Yes
                    </option>

                    <option value="no">
                      No
                    </option>
                  </select>

                </div>

              </div>

              {/* HIGHER EDUCATION */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wants Higher Education
                </label>

                <select
                  name="higher"
                  value={formData.higher}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                >
                  <option value="">
                    Select option
                  </option>

                  <option value="yes">
                    Yes
                  </option>

                  <option value="no">
                    No
                  </option>
                </select>

              </div>

            </div>

            {/* ================================================= */}
            {/* BUTTON */}
            {/* ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className={`mt-10 px-8 py-3 rounded-xl font-semibold transition text-white ${
                loading
                  ? "bg-violet-400 cursor-not-allowed"
                  : "bg-violet-600 hover:bg-violet-700"
              }`}
            >
              {loading
                ? "Generating Prediction..."
                : "Generate Prediction"}
            </button>

          </form>

        </div>

        {/* ===================================================== */}
        {/* PREDICTION RESULT */}
        {/* ===================================================== */}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 h-fit">

          {/* RESULT HEADER */}

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center">
              <Brain
                className="text-violet-600"
                size={22}
              />
            </div>

            <div>

              <h2 className="font-semibold text-gray-800">
                AI Prediction
              </h2>

              <p className="text-sm text-gray-500">
                Prediction result
              </p>

            </div>

          </div>

          {/* NO PREDICTION */}

          {!prediction ? (

            <div className="text-center py-12">

              <User
                size={45}
                className="mx-auto text-gray-300"
              />

              <p className="text-gray-400 mt-4">
                Enter student information and generate a prediction.
              </p>

            </div>

          ) : (

            <div>

              {/* ================= STUDENT ================= */}

              <div className="mb-5 p-4 rounded-2xl bg-violet-50">

                <p className="text-sm text-gray-500">
                  Student
                </p>

                <p className="text-lg font-bold text-gray-800 mt-1">
                  {formData.name}
                </p>

              </div>

              {/* ================= SCORE ================= */}

              <div className="text-center">

                <p className="text-sm text-gray-500">
                  Predicted Score
                </p>

                <h3 className="text-5xl font-bold text-violet-600 mt-2">
                  {prediction.score}/20
                </h3>

              </div>

              {/* ================= PERFORMANCE ================= */}

              <div className="mt-6 p-4 rounded-2xl bg-violet-50 text-center">

                <p className="text-sm text-gray-500">
                  Performance Level
                </p>

                <p className="text-xl font-bold text-violet-700 mt-1">
                  {prediction.result}
                </p>

              </div>

              {/* ================= RISK LEVEL ================= */}

              <div
                className={`mt-4 p-4 rounded-2xl ${prediction.riskBg}`}
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`w-10 h-10 rounded-xl ${prediction.riskBg} flex items-center justify-center`}
                  >

                    {prediction.riskLevel === "High Risk" ? (
                      <AlertTriangle
                        size={21}
                        className={prediction.riskColor}
                      />
                    ) : (
                      <ShieldCheck
                        size={21}
                        className={prediction.riskColor}
                      />
                    )}

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Risk Level
                    </p>

                    <p
                      className={`text-lg font-bold ${prediction.riskColor}`}
                    >
                      {prediction.riskLevel}
                    </p>

                  </div>

                </div>

              </div>

              {/* ================= AI RECOMMENDATION ================= */}

              <div className="mt-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">

                <div className="flex items-center gap-2 mb-3">

                  <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">

                    <Lightbulb
                      size={19}
                      className="text-violet-600"
                    />

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      AI Recommendation
                    </p>

                    <p className="font-semibold text-gray-800">
                      Suggested Action
                    </p>

                  </div>

                </div>

                <p className="text-sm text-gray-600 leading-6">
                  {prediction.recommendation}
                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default PredictPerformance;
