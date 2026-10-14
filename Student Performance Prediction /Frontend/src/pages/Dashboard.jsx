import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

import WelcomeBanner from "../components/WelcomeBanner";
import StatsSection from "../components/StatsSection";
import PerformanceChart from "../components/PerformanceChart";
import AIInsights from "../components/AIInsights";
import GradeDistribution from "../components/GradeDistribution";
import QuickActions from "../components/QuickActions";
import RecentPredictions from "../components/RecentPredictions";

function Dashboard() {
  const [compactDashboard, setCompactDashboard] = useState(false);

  // Load dashboard setting
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem("eduaiSettings");

      if (!savedSettings) {
        setCompactDashboard(false);
        return;
      }

      try {
        const settings = JSON.parse(savedSettings);
        setCompactDashboard(settings.compactDashboard ?? false);
      } catch (error) {
        console.error("Error loading dashboard settings:", error);
      }
    };

    loadSettings();

    // Update dashboard when Settings changes
    window.addEventListener("settingsUpdated", loadSettings);

    return () => {
      window.removeEventListener("settingsUpdated", loadSettings);
    };
  }, []);

  return (
   <MainLayout compact={compactDashboard}>
      <main
        className={
          compactDashboard
            ? "space-y-4"
            : "space-y-6"
        }
      >
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Statistics Cards */}
        <StatsSection />

        {/* Performance Chart + AI Insights */}
        <section
          className={
            compactDashboard
              ? "grid grid-cols-3 gap-4"
              : "grid grid-cols-3 gap-6"
          }
        >
          <div className="col-span-2">
            <PerformanceChart />
          </div>

          <AIInsights />
        </section>

        {/* Grade Distribution + Quick Actions */}
        <section
          className={
            compactDashboard
              ? "grid grid-cols-3 gap-4"
              : "grid grid-cols-3 gap-6"
          }
        >
          <GradeDistribution />

          <div className="col-span-2">
            <QuickActions />
          </div>
        </section>

        {/* Recent Predictions */}
        <RecentPredictions />
      </main>
    </MainLayout>
  );
}

export default Dashboard;
