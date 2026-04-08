import { useState, useEffect } from "react";

export default function App() {
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = () => {
    if (!repo.trim()) return;

    setLoading(true);
    setData(null);

    setTimeout(() => {
      setLoading(false);
      setData({
        features: ["Authentication system", "Dashboard UI"],
        fixes: ["Login bug fix", "API issue resolved"],
        improvements: ["UI improved", "Performance optimized"],
        milestones: ["Initial release", "v2 update"],
      });
    }, 2000);
  };

  const handleClear = () => {
    setRepo("");
    setData(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] font-[Inter] px-4">
      <div className="w-full max-w-2xl bg-[#111827] rounded-2xl shadow-xl p-6 md:p-8">
        {/* Intro Bird */}
        {showIntro && (
          <div className="flex justify-center mb-6 animate-fadeIn">
            <Bird />
          </div>
        )}

        {/* Header */}
        {!showIntro && (
          <div className="flex items-center justify-center gap-3 mb-6">
            <Bird small />
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-semibold text-white">
                Commit Story
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Turn Git history into meaningful narratives
              </p>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Paste GitHub Repository Link"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              className="flex-1 bg-blue-500 hover:bg-blue-600 transition text-white py-3 rounded-xl font-medium"
            >
              Generate Story
            </button>

            <button
              onClick={handleClear}
              className="flex-1 bg-gray-700 hover:bg-gray-600 transition text-white py-3 rounded-xl font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-6">
            <div className="w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-400 text-sm">
              Analyzing repository...
            </p>
          </div>
        )}

        {/* Output */}
        {!loading && data && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card title="✨ Features" items={data.features} />
            <Card title="🐞 Bug Fixes" items={data.fixes} />
            <Card title="⚡ Improvements" items={data.improvements} />
            <Card title="🏁 Milestones" items={data.milestones} />
          </div>
        )}

        {/* Empty */}
        {!loading && !data && !showIntro && (
          <div className="text-center text-gray-500 text-sm mt-4">
            Enter a repository link to generate insights ✨
          </div>
        )}
      </div>

      {/* Animations */}
      <style>
        {`
        @keyframes fly {
          0% { transform: translateX(-40px) translateY(0); }
          50% { transform: translateX(40px) translateY(-10px); }
          100% { transform: translateX(-40px) translateY(0); }
        }

        @keyframes flap {
          0%,100% { transform: rotate(0deg); }
          50% { transform: rotate(-20deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
        `}
      </style>
    </div>
  );
}

/* 🐦 Bird Component */
function Bird({ small }) {
  return (
    <div className={`${small ? "scale-75" : "scale-100"} relative`}>
      <svg
        width="80"
        height="60"
        viewBox="0 0 120 80"
        style={{ animation: "fly 3s ease-in-out infinite" }}
      >
        {/* Body */}
        <ellipse cx="50" cy="40" rx="15" ry="10" fill="#60a5fa" />

        {/* Wing */}
        <ellipse
          cx="45"
          cy="35"
          rx="12"
          ry="6"
          fill="#3b82f6"
          style={{
            transformOrigin: "center",
            animation: "flap 0.6s infinite",
          }}
        />

        {/* Head */}
        <circle cx="65" cy="35" r="6" fill="#60a5fa" />

        {/* Beak */}
        <polygon points="70,35 78,32 78,38" fill="#facc15" />

        {/* Eye */}
        <circle cx="67" cy="34" r="1" fill="#111" />
      </svg>
    </div>
  );
}

/* Card */
function Card({ title, items }) {
  return (
    <div className="bg-[#0f172a] border border-gray-700 p-4 rounded-2xl shadow-md hover:shadow-lg transition">
      <h3 className="text-white font-medium mb-2">{title}</h3>
      <ul className="text-gray-400 text-sm space-y-1">
        {items.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
