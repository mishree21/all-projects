import { UserPlus, Upload, FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

function QuickActions() {
  const navigate = useNavigate();

  // =====================================================
  // EXPORT PREDICTION REPORT
  // =====================================================

  const exportReport = () => {
    const savedResults = localStorage.getItem("predictionResults");

    // No prediction data
    if (!savedResults) {
      alert("No prediction data available. Please upload a dataset first.");
      return;
    }

    try {
      const predictions = JSON.parse(savedResults);

      // Check prediction data
      if (!Array.isArray(predictions) || predictions.length === 0) {
        alert("No prediction data available.");
        return;
      }

      // =====================================================
      // CSV HEADER
      // =====================================================

      const reportData = [
        [
          "Student",
          "Subject",
          "Predicted Score",
          "Performance",
          "Risk Level",
          "Recommendation",
        ],
      ];

      // =====================================================
      // ADD STUDENT DATA
      // =====================================================

      predictions.forEach((student, index) => {
        reportData.push([
          student.name || `Student ${index + 1}`,
          student.subject || "N/A",
          student.predicted_score ?? "N/A",
          student.performance || "N/A",
          student.risk_level || "N/A",
          student.recommendation || "N/A",
        ]);
      });

      // =====================================================
      // CONVERT DATA TO CSV
      // =====================================================

      const csvContent = reportData
        .map((row) =>
          row
            .map((value) => {
              const text = String(value ?? "");

              // Escape double quotes
              return `"${text.replace(/"/g, '""')}"`;
            })
            .join(",")
        )
        .join("\n");

      // =====================================================
      // CREATE CSV FILE
      // =====================================================

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);

      // =====================================================
      // DOWNLOAD FILE
      // =====================================================

      const link = document.createElement("a");

      link.href = url;
      link.download = "eduai-student-performance-report.csv";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      // Clean up URL
      URL.revokeObjectURL(url);

      alert("Report exported successfully!");
    } catch (error) {
      console.error("Error exporting report:", error);

      alert("Unable to export the report.");
    }
  };

  // =====================================================
  // QUICK ACTIONS
  // =====================================================

  const actions = [
    {
      title: "Predict Student",
      description: "Individual assessment",
      icon: <UserPlus size={22} />,
    },
    {
      title: "Upload Dataset",
      description: "Bulk analysis (CSV)",
      icon: <Upload size={22} />,
    },
    {
      title: "Export Report",
      description: "Download prediction results",
      icon: <FileDown size={22} />,
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="w-full min-w-0 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Quick Actions
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Common tasks
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 w-full">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              // Predict Student
              if (action.title === "Predict Student") {
                navigate("/predict-performance");
              }

              // Upload Dataset
              if (action.title === "Upload Dataset") {
                navigate("/upload-dataset");
              }

              // Export Report
              if (action.title === "Export Report") {
                exportReport();
              }
            }}
            className="w-full min-w-0 flex items-center gap-4 p-4 rounded-2xl bg-violet-50 hover:bg-violet-100 transition-all duration-200 text-left"
          >
            {/* Icon */}
            <div className="w-11 h-11 min-w-[44px] rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              {action.icon}
            </div>

            {/* Text */}
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-800">
                {action.title}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;
