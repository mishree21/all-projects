import { useEffect, useState } from "react";
import {
  Users,
  Star,
  AlertTriangle,
  Trophy,
} from "lucide-react";

import StatCard from "./StatCard";

function StatsSection() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    averagePerformance: 0,
    highRiskStudents: 0,
    topPerformers: 0,
  });

  useEffect(() => {
    const loadStats = () => {
      const savedResults =
        localStorage.getItem("predictionResults");

      if (!savedResults) {
        setStats({
          totalStudents: 0,
          averagePerformance: 0,
          highRiskStudents: 0,
          topPerformers: 0,
        });
        return;
      }

      try {
        const predictions = JSON.parse(savedResults);

        if (!Array.isArray(predictions) || predictions.length === 0) {
          setStats({
            totalStudents: 0,
            averagePerformance: 0,
            highRiskStudents: 0,
            topPerformers: 0,
          });
          return;
        }

        const totalStudents = predictions.length;

        const totalScore = predictions.reduce(
          (sum, student) =>
            sum + Number(student.predicted_score || 0),
          0
        );

        const averageScore =
          totalScore / totalStudents;

        const averagePerformance =
          (averageScore / 20) * 100;

        const highRiskStudents =
          predictions.filter(
            (student) =>
              student.risk_level === "High Risk"
          ).length;

        const topPerformers =
          predictions.filter(
            (student) =>
              Number(student.predicted_score) >= 16
          ).length;

        setStats({
          totalStudents,
          averagePerformance:
            averagePerformance.toFixed(1),
          highRiskStudents,
          topPerformers,
        });
      } catch (error) {
        console.error(
          "Error loading prediction statistics:",
          error
        );
      }
    };

    // Load data when dashboard opens
    loadStats();

    // Listen for new dataset upload
    window.addEventListener(
      "predictionUpdated",
      loadStats
    );

    // Cleanup listener
    return () => {
      window.removeEventListener(
        "predictionUpdated",
        loadStats
      );
    };
  }, []);

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      change: "From latest dataset",
      changeColor: "text-gray-500",
      iconBg: "bg-violet-100",
      icon: (
        <Users
          className="text-violet-600"
          size={22}
        />
      ),
    },
    {
      title: "Avg Performance",
      value: `${stats.averagePerformance}%`,
      change: "Based on predictions",
      changeColor: "text-green-500",
      iconBg: "bg-yellow-100",
      icon: (
        <Star
          className="text-yellow-600"
          size={22}
        />
      ),
    },
    {
      title: "High Risk Students",
      value: stats.highRiskStudents,
      change: "Needs attention",
      changeColor: "text-red-500",
      iconBg: "bg-red-100",
      icon: (
        <AlertTriangle
          className="text-red-500"
          size={22}
        />
      ),
    },
    {
      title: "Top Performers",
      value: stats.topPerformers,
      change: "Score ≥ 16",
      changeColor: "text-green-500",
      iconBg: "bg-violet-100",
      icon: (
        <Trophy
          className="text-violet-600"
          size={22}
        />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {statCards.map((item, index) => (
        <StatCard
          key={index}
          {...item}
        />
      ))}
    </div>
  );
}

export default StatsSection;
