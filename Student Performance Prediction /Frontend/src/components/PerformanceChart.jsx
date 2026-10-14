import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function PerformanceChart() {
  const [averagePerformance, setAveragePerformance] = useState(0);

  useEffect(() => {
    const loadData = () => {
      const savedResults =
        localStorage.getItem("predictionResults");

      if (!savedResults) {
        setAveragePerformance(0);
        return;
      }

      try {
        const predictions = JSON.parse(savedResults);

        if (
          !Array.isArray(predictions) ||
          predictions.length === 0
        ) {
          setAveragePerformance(0);
          return;
        }

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
      } catch (error) {
        console.error(
          "Error loading performance data:",
          error
        );

        setAveragePerformance(0);
      }
    };

    loadData();

    window.addEventListener(
      "predictionUpdated",
      loadData
    );

    return () => {
      window.removeEventListener(
        "predictionUpdated",
        loadData
      );
    };
  }, []);

  /*
    Since the current backend only provides the
    latest prediction results and does not provide
    historical monthly data, we show the current
    overall performance as a single data point.
  */

  const chartData = [
    {
      category: "Current",
      performance: averagePerformance,
    },
  ];

  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-[420px]">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Performance Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Current average across all students
          </p>
        </div>
      </div>

      {averagePerformance === 0 ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">
              No prediction data available.
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Upload a dataset to view performance.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full h-[310px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 5,
              }}
              barCategoryGap="35%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e9d5ff"
              />

              <XAxis
                dataKey="category"
                tick={{
                  fontSize: 13,
                  fill: "#64748b",
                }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tick={{
                  fontSize: 13,
                  fill: "#64748b",
                }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `${value}%`
                }
              />

              <Tooltip
                cursor={{
                  fill: "#f5f3ff",
                }}
                formatter={(value) => [
                  `${value}%`,
                  "Performance",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />

              <Bar
                dataKey="performance"
                fill="#7c3aed"
                radius={[
                  10,
                  10,
                  0,
                  0,
                ]}
                maxBarSize={100}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default PerformanceChart;
