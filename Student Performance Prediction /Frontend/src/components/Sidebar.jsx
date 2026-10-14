import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Bot,
  FileText,
  User,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Predict Performance",
    path: "/predict-performance",
    icon: TrendingUp,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    name: "AI Assistant",
    path: "/ai-assistant",
    icon: Bot,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: FileText,
  },
];

function Sidebar() {
  const navigate = useNavigate();

  // =====================================================
  // AI ASSISTANT SETTING
  // =====================================================

  const [aiAssistant, setAiAssistant] =
    useState(true);

  // =====================================================
  // LOAD AI SETTING
  // =====================================================

  const loadSettings = () => {
    const savedSettings =
      localStorage.getItem("eduaiSettings");

    if (!savedSettings) {
      setAiAssistant(true);
      return;
    }

    try {
      const settings =
        JSON.parse(savedSettings);

      setAiAssistant(
        settings.aiAssistant ?? true
      );
    } catch (error) {
      console.error(
        "Error loading sidebar settings:",
        error
      );
    }
  };

  // =====================================================
  // LISTEN FOR SETTING CHANGES
  // =====================================================

  useEffect(() => {
    loadSettings();

    window.addEventListener(
      "settingsUpdated",
      loadSettings
    );

    return () => {
      window.removeEventListener(
        "settingsUpdated",
        loadSettings
      );
    };
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

 const handleLogout = () => {
  localStorage.removeItem("eduaiUser");
  navigate("/login", { replace: true });
};

  // =====================================================
  // FILTER MENU
  // =====================================================

  const visibleMenuItems =
    menuItems.filter((item) => {
      if (item.name === "AI Assistant") {
        return aiAssistant;
      }

      return true;
    });

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col justify-between">

      <div>

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="flex items-center gap-3 p-6">

          <div className="bg-violet-600 rounded-xl p-3">

            <GraduationCap
              className="text-white"
              size={24}
            />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-violet-600">
              EduAI
            </h1>

            <p className="text-xs text-gray-500 tracking-widest">
              ACADEMIC EXCELLENCE
            </p>

          </div>

        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="px-4 mt-8 space-y-2">

          {visibleMenuItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "bg-violet-600 text-white"
                      : "text-gray-600 hover:bg-violet-50"
                  }`
                }
              >

                <Icon size={20} />

                {item.name}

              </NavLink>
            );

          })}

        </nav>

      </div>

      {/* =================================================
          BOTTOM MENU
      ================================================= */}

      <div className="border-t p-4 space-y-2">

        {/* Profile */}

        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 transition"
        >

          <User size={20} />

          Profile

        </button>

        {/* Settings */}

        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 transition"
        >

          <Settings size={20} />

          Settings

        </button>

        {/* Logout */}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition"
        >

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;
