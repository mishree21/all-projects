import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RecentPredictions() {
  const [predictions, setPredictions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const savedResults =
      localStorage.getItem("predictionResults");

    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);

        setPredictions(parsedResults);
      } catch (error) {
        console.error(
          "Error loading prediction results:",
          error
        );
      }
    }
  }, []);

  return (
    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Predictions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Latest student performance predictions
          </p>
        </div>

       <button
  onClick={() => navigate("/predictions")}
  className="text-sm font-semibold text-violet-600 hover:text-violet-800"
>
  View All
</button>

      </div>

      {/* No Data */}
      {predictions.length === 0 ? (

        <div className="text-center py-10">

          <p className="text-gray-500">
            No predictions available yet.
          </p>

          <p className="text-sm text-gray-400 mt-1">
            Upload a student dataset to see predictions here.
          </p>

        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            {/* Table Header */}
            <thead>

              <tr className="border-b border-gray-100">

                <th className="py-3 text-sm font-semibold text-gray-500">
                  Student
                </th>

                <th className="py-3 text-sm font-semibold text-gray-500">
                  Subject
                </th>

                <th className="py-3 text-sm font-semibold text-gray-500">
                  Prediction
                </th>

                <th className="py-3 text-sm font-semibold text-gray-500">
                  Performance
                </th>

                <th className="py-3 text-sm font-semibold text-gray-500">
                  Risk
                </th>

                <th className="py-3 text-sm font-semibold text-gray-500">
                  Action
                </th>

              </tr>

            </thead>

            {/* Table Body */}
            <tbody>

              {predictions.map((student, index) => (

                <tr
                  key={index}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >

                  {/* Student */}
                  <td className="py-4">

                    <span className="font-medium text-gray-800">
                      {student.name ||
                        `Student ${index + 1}`}
                    </span>

                  </td>

                  {/* Subject */}
                  <td className="py-4 text-gray-500">
                    {student.subject || "—"}
                  </td>

                  {/* Prediction */}
                  <td className="py-4 font-semibold text-gray-800">
                    {student.predicted_score}/20
                  </td>

                  {/* Performance */}
                  <td className="py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        student.performance === "Excellent"
                          ? "bg-green-100 text-green-700"
                          : student.performance === "Good"
                          ? "bg-violet-100 text-violet-700"
                          : student.performance === "Average"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.performance ||
                        "Not Available"}
                    </span>

                  </td>

                  {/* Risk */}
                  <td className="py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        student.risk_level === "Low Risk"
                          ? "bg-green-100 text-green-700"
                          : student.risk_level ===
                            "Moderate Risk"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.risk_level ||
                        "Not Available"}
                    </span>

                  </td>

                  {/* Action */}
                  <td className="py-4">

                    <button
                      onClick={() =>
                        navigate(
                          `/student-details/${index}`
                        )
                      }
                      className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center hover:bg-violet-100 transition"
                      title="View prediction"
                    >
                      <Eye size={18} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
}

export default RecentPredictions;
