import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function GradeDistribution() {
  const [gradeData, setGradeData] = useState([]);

  // =====================================================
  // LOAD PREDICTION DATA
  // =====================================================

  useEffect(() => {
    const loadData = () => {
      const savedResults =
        localStorage.getItem("predictionResults");

      // No prediction data
      if (!savedResults) {
        setGradeData([]);
        return;
      }

      try {
        const predictions = JSON.parse(savedResults);

        // Check if data is valid
        if (
          !Array.isArray(predictions) ||
          predictions.length === 0
        ) {
          setGradeData([]);
          return;
        }

        // =================================================
        // COUNT PERFORMANCE LEVELS
        // =================================================

        const excellent = predictions.filter(
          (student) =>
            student.performance === "Excellent"
        ).length;

        const good = predictions.filter(
          (student) =>
            student.performance === "Good"
        ).length;

        const average = predictions.filter(
          (student) =>
            student.performance === "Average"
        ).length;

        const atRisk = predictions.filter(
          (student) =>
            student.performance === "At Risk"
        ).length;

        // =================================================
        // UPDATE PIE CHART DATA
        // =================================================

        setGradeData([
          {
            name: "Excellent",
            value: excellent,
            color: "#7c3aed",
          },
          {
            name: "Good",
            value: good,
            color: "#8b5cf6",
          },
          {
            name: "Average",
            value: average,
            color: "#facc15",
          },
          {
            name: "At Risk",
            value: atRisk,
            color: "#ef4444",
          },
        ]);
      } catch (error) {
        console.error(
          "Error loading grade distribution:",
          error
        );

        setGradeData([]);
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
    // CLEANUP EVENT LISTENER
    // =====================================================

    return () => {
      window.removeEventListener(
        "predictionUpdated",
        loadData
      );
    };
  }, []);

  // =====================================================
  // TOTAL STUDENTS
  // =====================================================

  const totalStudents = gradeData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-[300px]">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Grade Distribution
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Overall student performance
        </p>
      </div>

      {/* No Data */}
      {totalStudents === 0 ? (
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-gray-400 text-sm text-center">
            No prediction data available.
            <br />
            Upload a dataset to view distribution.
          </p>
        </div>
      ) : (

        /* Chart + Legend */
        <div className="flex items-center justify-between h-[210px]">

          {/* Pie Chart */}
          <div className="w-1/2 h-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={gradeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {gradeData.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="w-1/2 space-y-3">

            {gradeData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >

                <div className="flex items-center gap-2">

                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        item.color,
                    }}
                  ></span>

                  <span className="text-sm text-gray-600">
                    {item.name}
                  </span>

                </div>

                <span className="text-sm font-semibold text-gray-800">
                  {item.value}
                </span>

              </div>
            ))}

          </div>

        </div>
      )}

    </section>
  );
}

export default GradeDistribution;
