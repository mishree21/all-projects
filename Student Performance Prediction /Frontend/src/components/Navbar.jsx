import { useEffect, useState } from "react";
import {
  FiBell,
  FiBellOff,
  FiSearch,
  FiX,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const defaultProfile = {
  name: "EduAI User",
  email: "admin@eduai.com",
  institution: "Educational Institution",
  role: "Administrator",
};

function Navbar() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  const [profile, setProfile] = useState(defaultProfile);

  const [searchTerm, setSearchTerm] = useState("");
  const [predictions, setPredictions] = useState([]);

  // NEW: notification list
  const [notificationList, setNotificationList] = useState([]);

  // =========================
  // LOAD SETTINGS
  // =========================
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem("eduaiSettings");

      if (!savedSettings) {
        setNotifications(true);
        return;
      }

      try {
        const settings = JSON.parse(savedSettings);

        setNotifications(settings.notifications ?? true);

        if (!settings.notifications) {
          setShowNotification(false);
        }
      } catch (error) {
        console.error("Error loading navbar settings:", error);
      }
    };

    loadSettings();

    window.addEventListener("settingsUpdated", loadSettings);

    return () => {
      window.removeEventListener("settingsUpdated", loadSettings);
    };
  }, []);

  // =========================
  // LOAD PROFILE
  // =========================
  useEffect(() => {
    const loadProfile = () => {
      const savedProfile = localStorage.getItem("eduaiProfile");

      if (!savedProfile) {
        setProfile(defaultProfile);
        return;
      }

      try {
        const data = JSON.parse(savedProfile);

        setProfile({
          ...defaultProfile,
          ...data,
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();

    window.addEventListener("profileUpdated", loadProfile);

    return () => {
      window.removeEventListener("profileUpdated", loadProfile);
    };
  }, []);

  // =========================
  // LOAD PREDICTIONS
  // =========================
  useEffect(() => {
    const loadPredictions = () => {
      const savedResults = localStorage.getItem("predictionResults");

      if (!savedResults) {
        setPredictions([]);
        return;
      }

      try {
        const data = JSON.parse(savedResults);

        const results = Array.isArray(data) ? data : [];

        setPredictions(results);

        // Create notifications from high-risk students
        const highRiskStudents = results.filter(
          (student) => student.risk_level === "High Risk"
        );

        const newNotifications = highRiskStudents.map(
          (student, index) => ({
            id: `${student.name}-${index}`,
            type: "warning",
            title: "High Risk Student",
            message: `${student.name || "A student"} has been identified as high risk.`,
          })
        );

        setNotificationList(newNotifications);
      } catch (error) {
        console.error("Error loading predictions:", error);

        setPredictions([]);
        setNotificationList([]);
      }
    };

    loadPredictions();

    window.addEventListener("predictionUpdated", loadPredictions);

    return () => {
      window.removeEventListener(
        "predictionUpdated",
        loadPredictions
      );
    };
  }, []);

  // =========================
  // NOTIFICATION CLICK
  // =========================
  const handleNotificationClick = () => {
    if (!notifications) return;

    setShowNotification((previous) => !previous);
  };

  // =========================
  // SEARCH
  // =========================
  const filteredStudents = predictions.filter((student) => {
    if (!searchTerm.trim()) return false;

    const name = String(student.name || "").toLowerCase();

    return name.includes(searchTerm.toLowerCase());
  });

  const handleStudentClick = (index) => {
    setSearchTerm("");

    navigate(`/student-details/${index}`);
  };

  return (
    <div className="h-20 bg-white flex items-center justify-between px-8 shadow-sm">

      {/* =========================
          SEARCH BAR
      ========================= */}
      <div className="relative">

        <div className="flex items-center bg-[#F8F7FC] rounded-xl px-4 py-2 w-96">

          <FiSearch className="text-gray-500" />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search students..."
            className="ml-3 bg-transparent outline-none w-full"
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={18} />
            </button>
          )}

        </div>

        {/* Search Results */}
        {searchTerm.trim() && (
          <div className="absolute top-14 left-0 w-96 bg-white border border-gray-100 rounded-2xl shadow-lg z-50 overflow-hidden">

            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => {

                const originalIndex = predictions.indexOf(student);

                return (
                  <button
                    key={`${student.name}-${index}`}
                    onClick={() =>
                      handleStudentClick(originalIndex)
                    }
                    className="w-full text-left px-4 py-3 hover:bg-violet-50 transition border-b border-gray-50 last:border-b-0"
                  >

                    <p className="font-semibold text-gray-800">
                      {student.name || "Unknown Student"}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Performance:{" "}
                      {student.performance || "Not available"}
                      {" • "}
                      Risk:{" "}
                      {student.risk_level || "Not available"}
                    </p>

                  </button>
                );
              })
            ) : (
              <div className="px-4 py-5 text-center">

                <FiSearch
                  size={22}
                  className="mx-auto text-gray-300 mb-2"
                />

                <p className="text-sm text-gray-500">
                  No students found
                </p>

              </div>
            )}

          </div>
        )}

      </div>

      {/* =========================
          RIGHT SIDE
      ========================= */}
      <div className="flex items-center gap-6">

        {/* =========================
            NOTIFICATIONS
        ========================= */}
        <div className="relative">

          <button
            onClick={handleNotificationClick}
            disabled={!notifications}
            className={`relative p-2 rounded-xl transition ${
              notifications
                ? "text-gray-600 hover:bg-violet-50 hover:text-violet-600 cursor-pointer"
                : "text-gray-300 cursor-not-allowed"
            }`}
            title={
              notifications
                ? "Notifications"
                : "Notifications are disabled"
            }
          >

            {notifications ? (
              <FiBell size={22} />
            ) : (
              <FiBellOff size={22} />
            )}

            {/* Notification count */}
            {notifications && notificationList.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {notificationList.length}
              </span>
            )}

          </button>

          {/* Notification Popup */}
          {notifications && showNotification && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-2xl shadow-lg z-50 overflow-hidden">

              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100">

                <div className="flex items-center justify-between">

                  <h3 className="font-semibold text-gray-800">
                    Notifications
                  </h3>

                  {notificationList.length > 0 && (
                    <span className="text-xs text-red-500 font-medium">
                      {notificationList.length} alert
                      {notificationList.length > 1 ? "s" : ""}
                    </span>
                  )}

                </div>

              </div>

              {/* Notifications */}
              <div className="max-h-80 overflow-y-auto">

                {notificationList.length > 0 ? (

                  notificationList.map((notification) => (

                    <button
                      key={notification.id}
                      onClick={() => {
                        setShowNotification(false);
                        navigate("/predictions");
                      }}
                      className="w-full flex items-start gap-3 p-4 text-left hover:bg-violet-50 transition border-b border-gray-50"
                    >

                      <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">

                        <FiAlertCircle size={18} />

                      </div>

                      <div>

                        <p className="text-sm font-semibold text-gray-800">
                          {notification.title}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {notification.message}
                        </p>

                      </div>

                    </button>

                  ))

                ) : (

                  <div className="p-6 text-center">

                    <FiCheckCircle
                      size={25}
                      className="mx-auto text-green-500 mb-2"
                    />

                    <p className="text-sm font-medium text-gray-700">
                      No new notifications
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Everything looks good!
                    </p>

                  </div>

                )}

              </div>

            </div>
          )}

        </div>

        {/* =========================
            PROFILE
        ========================= */}
        <div className="flex items-center gap-3">

          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="w-11 h-11 rounded-full"
          />

          <div>

            <h3 className="font-semibold text-gray-800">
              {profile.name}
            </h3>

            <p className="text-sm text-gray-500">
              {profile.role}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Navbar;
