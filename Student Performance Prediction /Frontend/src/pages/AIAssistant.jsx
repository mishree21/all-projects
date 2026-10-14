import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bot,
  Send,
  User,
  Sparkles,
  ArrowLeft,
  Trash2,
} from "lucide-react";

function AIAssistant() {
  const navigate = useNavigate();

  // =====================================================
  // DEFAULT MESSAGE
  // =====================================================

  const defaultMessage = {
    role: "ai",
    text: "Hello! I'm your EduAI Assistant. How can I help you today?",
  };

  // =====================================================
  // CHAT MESSAGES
  // =====================================================

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("eduaiChatHistory");

    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    }

    return [defaultMessage];
  });

  // =====================================================
  // SAVE CHAT HISTORY
  // =====================================================

  useEffect(() => {
    localStorage.setItem(
      "eduaiChatHistory",
      JSON.stringify(messages)
    );
  }, [messages]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // CLEAR CHAT
  // =====================================================

  const handleClearChat = () => {
    localStorage.removeItem("eduaiChatHistory");

    setMessages([defaultMessage]);
  };

  // =====================================================
  // SUGGESTED QUESTIONS
  // =====================================================

  const suggestedQuestions = [
    "Which students are at high risk?",
    "Who are the top performers?",
    "How many students need attention?",
    "What is the overall performance?",
    "Give recommendations for struggling students.",
  ];

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const handleSend = async (question = input) => {
    if (!question.trim() || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      text: question,
    };

    const userInput = question;

    // ===================================================
    // SAVE USER MESSAGE
    // ===================================================

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {
      // =================================================
      // GET PREDICTION DATA
      // =================================================

      const savedResults =
        localStorage.getItem("predictionResults");

      const predictionData = savedResults
        ? JSON.parse(savedResults)
        : [];

      // =================================================
      // GET CONVERSATION HISTORY
      // =================================================

      const conversationHistory = [
        ...messages,
        userMessage,
      ].map((message) => ({
        role:
          message.role === "ai"
            ? "assistant"
            : "user",

        content: message.text,
      }));

      // =================================================
      // DEBUG
      // =================================================

      console.log(
        "Prediction data sent to AI:",
        predictionData
      );

      console.log(
        "Number of students:",
        predictionData.length
      );

      console.log(
        "Conversation history:",
        conversationHistory
      );

      // =================================================
      // SEND DATA TO FLASK
      // =================================================

      const response = await fetch(
        "http://127.0.0.1:5000/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: userInput,

            predictionData:
              predictionData,

            conversationHistory:
              conversationHistory,
          }),
        }
      );

      const data = await response.json();

      // =================================================
      // CHECK API RESPONSE
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Something went wrong"
        );
      }

      // =================================================
      // ADD AI RESPONSE
      // =================================================

      const aiMessage = {
        role: "ai",
        text: data.response,
      };

      setMessages((previous) => [
        ...previous,
        aiMessage,
      ]);

    } catch (error) {
      console.error(
        "AI Chat Error:",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          text: "Sorry, I couldn't connect to the AI service. Please make sure the Flask backend is running.",
        },
      ]);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSend();
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-5xl mx-auto">

        {/* =================================================
            BACK TO DASHBOARD
        ================================================= */}

        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition font-medium"
        >
          <ArrowLeft size={18} />

          Back to Dashboard
        </button>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">

              <Bot size={28} />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-800">
                EduAI Assistant
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                AI-powered student performance assistant
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            CHAT CONTAINER
        ================================================= */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* =================================================
              CHAT HEADER
          ================================================= */}

          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">

                <Sparkles size={18} />

              </div>

              <div>

                <h2 className="font-semibold text-gray-800">
                  AI Student Assistant
                </h2>

                <p className="text-xs text-green-500">

                  ●{" "}

                  {loading
                    ? "Thinking..."
                    : "Ready to help"}

                </p>

              </div>

            </div>

            {/* =================================================
                CLEAR CHAT BUTTON
            ================================================= */}

            <button
              onClick={handleClearChat}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear chat history"
            >
              <Trash2 size={16} />
              Clear Chat
            </button>

          </div>

          {/* =================================================
              MESSAGES
          ================================================= */}

          <div className="h-[500px] overflow-y-auto p-6 space-y-5">

            {messages.map(
              (message, index) => (

                <div
                  key={index}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`flex items-start gap-3 max-w-[75%] ${
                      message.role === "user"
                        ? "flex-row-reverse"
                        : ""
                    }`}
                  >

                    {/* Avatar */}

                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-violet-600 text-white"
                          : "bg-violet-100 text-violet-600"
                      }`}
                    >

                      {message.role === "user" ? (
                        <User size={18} />
                      ) : (
                        <Bot size={18} />
                      )}

                    </div>

                    {/* Message */}

                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        message.role === "user"
                          ? "bg-violet-600 text-white rounded-tr-sm"
                          : "bg-gray-100 text-gray-700 rounded-tl-sm"
                      }`}
                    >

                      {message.text}

                    </div>

                  </div>

                </div>

              )
            )}

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

              <div className="flex justify-start">

                <div className="flex items-start gap-3">

                  <div className="w-9 h-9 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">

                    <Bot size={18} />

                  </div>

                  <div className="bg-gray-100 text-gray-500 px-4 py-3 rounded-2xl rounded-tl-sm text-sm">

                    EduAI is thinking...

                  </div>

                </div>

              </div>

            )}

          </div>

          {/* =================================================
              SUGGESTED QUESTIONS
          ================================================= */}

          <div className="px-6 pt-4">

            <p className="text-sm font-semibold text-gray-600 mb-3">
              Suggested Questions
            </p>

            <div className="flex flex-wrap gap-2">

              {suggestedQuestions.map(
                (question) => (

                  <button
                    key={question}
                    onClick={() =>
                      handleSend(question)
                    }
                    disabled={loading}
                    className="px-4 py-2 rounded-full bg-violet-50 text-violet-700 border border-violet-100 text-sm font-medium hover:bg-violet-100 hover:border-violet-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {question}
                  </button>

                )
              )}

            </div>

          </div>

          {/* =================================================
              INPUT
          ================================================= */}

          <div className="border-t border-gray-100 p-4 mt-4">

            <div className="flex items-center gap-3">

              <input
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask about student performance..."
                disabled={loading}
                className="flex-1 px-5 py-3 rounded-2xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-700 focus:ring-2 focus:ring-violet-200 focus:border-violet-300 disabled:opacity-60"
              />

              <button
                onClick={() => handleSend()}
                disabled={
                  loading ||
                  !input.trim()
                }
                className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >

                <Send size={19} />

              </button>

            </div>

            <p className="text-xs text-gray-400 mt-2 text-center">
              EduAI can analyze student performance and provide academic recommendations.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AIAssistant;
