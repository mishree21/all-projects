import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  LayoutDashboard,
  Bot,
  ShieldCheck,
  Trash2,
} from "lucide-react";

function Settings() {
  const [notifications, setNotifications] = useState(true);

  const [aiAssistant, setAiAssistant] = useState(true);

  const [compactDashboard, setCompactDashboard] =
    useState(false);

  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  useEffect(() => {
    const savedSettings =
      localStorage.getItem("eduaiSettings");

    if (!savedSettings) {
      return;
    }

    try {
      const settings = JSON.parse(savedSettings);

      setNotifications(
        settings.notifications ?? true
      );

      setAiAssistant(
        settings.aiAssistant ?? true
      );

      setCompactDashboard(
        settings.compactDashboard ?? false
      );
    } catch (error) {
      console.error(
        "Error loading settings:",
        error
      );
    }
  }, []);

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const saveSettings = (updatedSettings) => {
    localStorage.setItem(
      "eduaiSettings",
      JSON.stringify(updatedSettings)
    );

    // Notify other components that settings changed
    window.dispatchEvent(
      new Event("settingsUpdated")
    );
  };

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const handleNotifications = () => {
    const value = !notifications;

    setNotifications(value);

    saveSettings({
      notifications: value,
      aiAssistant,
      compactDashboard,
    });
  };

  // =====================================================
  // AI ASSISTANT
  // =====================================================

  const handleAI = () => {
    const value = !aiAssistant;

    setAiAssistant(value);

    saveSettings({
      notifications,
      aiAssistant: value,
      compactDashboard,
    });
  };

  // =====================================================
  // COMPACT DASHBOARD
  // =====================================================

  const handleCompactDashboard = () => {
    const value = !compactDashboard;

    setCompactDashboard(value);

    saveSettings({
      notifications,
      aiAssistant,
      compactDashboard: value,
    });
  };

  // =====================================================
  // CLEAR PREDICTION DATA
  // =====================================================

  const clearPredictionData = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all prediction data?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      "predictionResults"
    );

    localStorage.removeItem(
      "predictionResultsUpdatedAt"
    );

    window.dispatchEvent(
      new Event("predictionUpdated")
    );

    alert(
      "Prediction data has been cleared."
    );
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

        <div>

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">

              <SettingsIcon
                size={25}
                className="text-violet-600"
              />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-800">
                Settings
              </h1>

              <p className="text-gray-500 mt-1">
                Manage your EduAI application preferences.
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">

              <Bell
                size={20}
                className="text-violet-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                Notifications
              </h2>

              <p className="text-sm text-gray-500">
                Control application notifications.
              </p>

            </div>

          </div>

          <div className="flex items-center justify-between py-4">

            <div>

              <p className="font-semibold text-gray-800">
                Enable Notifications
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Receive important academic alerts and updates.
              </p>

            </div>

            <button
              onClick={handleNotifications}
              className={`relative w-12 h-6 rounded-full transition ${
                notifications
                  ? "bg-violet-600"
                  : "bg-gray-300"
              }`}
            >

              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                  notifications
                    ? "left-7"
                    : "left-1"
                }`}
              />

            </button>

          </div>

        </section>

        {/* =================================================
            APPEARANCE
        ================================================= */}

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">

              <Moon
                size={20}
                className="text-violet-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                Appearance
              </h2>

              <p className="text-sm text-gray-500">
                Manage the appearance of the application.
              </p>

            </div>

          </div>

          <div className="p-4 rounded-2xl bg-violet-50">

            <p className="font-semibold text-gray-800">
              Current Theme
            </p>

            <p className="text-sm text-gray-500 mt-1">
              EduAI is currently using the light theme.
            </p>

          </div>

        </section>

        {/* =================================================
            DASHBOARD
        ================================================= */}

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">

              <LayoutDashboard
                size={20}
                className="text-violet-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                Dashboard
              </h2>

              <p className="text-sm text-gray-500">
                Customize dashboard behavior.
              </p>

            </div>

          </div>

          <div className="flex items-center justify-between py-4">

            <div>

              <p className="font-semibold text-gray-800">
                Compact Dashboard
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Use a more compact dashboard layout.
              </p>

            </div>

            <button
              onClick={handleCompactDashboard}
              className={`relative w-12 h-6 rounded-full transition ${
                compactDashboard
                  ? "bg-violet-600"
                  : "bg-gray-300"
              }`}
            >

              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                  compactDashboard
                    ? "left-7"
                    : "left-1"
                }`}
              />

            </button>

          </div>

        </section>

        {/* =================================================
            AI ASSISTANT
        ================================================= */}

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">

              <Bot
                size={20}
                className="text-violet-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                AI Assistant
              </h2>

              <p className="text-sm text-gray-500">
                Manage AI assistant preferences.
              </p>

            </div>

          </div>

          <div className="flex items-center justify-between py-4">

            <div>

              <p className="font-semibold text-gray-800">
                Enable AI Assistant
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Allow EduAI to provide academic insights and recommendations.
              </p>

            </div>

            <button
              onClick={handleAI}
              className={`relative w-12 h-6 rounded-full transition ${
                aiAssistant
                  ? "bg-violet-600"
                  : "bg-gray-300"
              }`}
            >

              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                  aiAssistant
                    ? "left-7"
                    : "left-1"
                }`}
              />

            </button>

          </div>

        </section>

        {/* =================================================
            DATA & PRIVACY
        ================================================= */}

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">

              <ShieldCheck
                size={20}
                className="text-green-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                Data & Privacy
              </h2>

              <p className="text-sm text-gray-500">
                Manage locally stored prediction data.
              </p>

            </div>

          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50">

            <div>

              <p className="font-semibold text-gray-800">
                Clear Prediction Data
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Remove all prediction results stored in this browser.
              </p>

            </div>

            <button
              onClick={clearPredictionData}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition font-semibold"
            >

              <Trash2 size={18} />

              Clear Data

            </button>

          </div>

        </section>

      </div>

    </MainLayout>
  );
}

export default Settings;
