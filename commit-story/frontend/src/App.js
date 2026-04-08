import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900&family=JetBrains+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
    .font-mono, code { font-family: 'JetBrains Mono', monospace; }

    @keyframes tail-splash {
      0%   { transform: rotate(0deg); }
      12%  { transform: rotate(40deg); }
      30%  { transform: rotate(-34deg); }
      48%  { transform: rotate(28deg); }
      65%  { transform: rotate(-22deg); }
      82%  { transform: rotate(14deg); }
      100% { transform: rotate(0deg); }
    }
    .animate-tail-splash { animation: tail-splash 0.6s ease-in-out infinite; }

    @keyframes tail-idle {
      0%, 100% { transform: rotate(0deg); }
      35%       { transform: rotate(18deg); }
      70%       { transform: rotate(-14deg); }
    }
    .animate-tail-idle { animation: tail-idle 1.2s ease-in-out infinite; }

    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .animate-shimmer { animation: shimmer 1.8s ease-in-out infinite; }

    @keyframes spin { to { transform: rotate(360deg); } }
    .animate-spin { animation: spin 0.75s linear infinite; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeUp { animation: fadeUp 0.45s ease-out forwards; }

    @keyframes cardIn {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-cardIn { animation: cardIn 0.38s ease-out forwards; }

    @keyframes blobPulse {
      0%, 100% { opacity: 0.35; transform: scale(1); }
      50%       { opacity: 0.6; transform: scale(1.06); }
    }
    .animate-blob { animation: blobPulse 4s ease-in-out infinite; }

    @keyframes dotBounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
      40%           { transform: translateY(-7px); opacity: 1; }
    }
    .animate-dot { animation: dotBounce 1.2s ease-in-out infinite; }

    @keyframes msgFade {
      0%   { opacity: 0; transform: translateY(6px); }
      15%  { opacity: 1; transform: translateY(0); }
      85%  { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-6px); }
    }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #d1cdc7; border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: #b8b3ac; }
  `}</style>
);

/* ─────────────────────────────────────────────────────────────────────────────
   CAT SVGs
───────────────────────────────────────────────────────────────────────────── */
function GingerCat({ size = 160, splash = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none"
      style={{ filter: "drop-shadow(0 8px 24px rgba(180,120,60,0.18))" }}
    >
      <g
        style={{ transformOrigin: "38px 105px" }}
        className={splash ? "animate-tail-splash" : "animate-tail-idle"}
      >
        <path
          d="M38 105 Q10 95 6 75 Q2 55 20 48 Q30 44 35 52"
          stroke="#c87830"
          strokeWidth="8.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M38 105 Q12 96 8 77 Q4 58 21 50"
          stroke="#a05a18"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        <circle cx="35" cy="52" r="5.5" fill="#e09040" />
        <circle cx="35" cy="52" r="2.8" fill="#fdf4ec" />
      </g>
      <ellipse cx="60" cy="95" rx="31" ry="29" fill="#d08840" />
      <path
        d="M38 82 Q45 78 52 82"
        stroke="#a06020"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M68 82 Q75 78 82 82"
        stroke="#a06020"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M44 92 Q52 88 60 92 Q68 88 76 92"
        stroke="#a06020"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.35"
      />
      <ellipse cx="60" cy="100" rx="17" ry="19" fill="#f5e0c0" />
      <ellipse cx="60" cy="55" rx="27" ry="25" fill="#d08840" />
      <polygon points="36,36 28,14 46,30" fill="#d08840" />
      <polygon points="84,36 92,14 74,30" fill="#d08840" />
      <polygon points="37,34 31,18 44,30" fill="#f0a8b8" />
      <polygon points="83,34 89,18 76,30" fill="#f0a8b8" />
      <line
        x1="32"
        y1="22"
        x2="38"
        y2="30"
        stroke="#a06020"
        strokeWidth="1.4"
        opacity="0.45"
      />
      <line
        x1="88"
        y1="22"
        x2="82"
        y2="30"
        stroke="#a06020"
        strokeWidth="1.4"
        opacity="0.45"
      />
      <path
        d="M48 36 Q52 30 56 36"
        stroke="#a06020"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M64 36 Q68 30 72 36"
        stroke="#a06020"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M54 28 Q60 24 66 28"
        stroke="#a06020"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.35"
      />
      <ellipse cx="49" cy="53" rx="7.5" ry="6.5" fill="#1a2010" />
      <ellipse cx="71" cy="53" rx="7.5" ry="6.5" fill="#1a2010" />
      <ellipse cx="49" cy="53" rx="5.5" ry="5.5" fill="#c08820" />
      <ellipse cx="71" cy="53" rx="5.5" ry="5.5" fill="#c08820" />
      <ellipse cx="49" cy="53" rx="2.4" ry="3.8" fill="#0c0c0c" />
      <ellipse cx="71" cy="53" rx="2.4" ry="3.8" fill="#0c0c0c" />
      <circle cx="51" cy="50.5" r="1.4" fill="white" opacity="0.9" />
      <circle cx="73" cy="50.5" r="1.4" fill="white" opacity="0.9" />
      <path d="M57 63 L60 66 L63 63 Q60 60 57 63Z" fill="#e88898" />
      <path
        d="M60 66 Q56 70 53 68"
        stroke="#c06070"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M60 66 Q64 70 67 68"
        stroke="#c06070"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <line
        x1="20"
        y1="60"
        x2="48"
        y2="63"
        stroke="#f5e0c0"
        strokeWidth="1.1"
        opacity="0.85"
      />
      <line
        x1="20"
        y1="65"
        x2="48"
        y2="65"
        stroke="#f5e0c0"
        strokeWidth="1.1"
        opacity="0.85"
      />
      <line
        x1="20"
        y1="70"
        x2="48"
        y2="67"
        stroke="#f5e0c0"
        strokeWidth="1.1"
        opacity="0.85"
      />
      <line
        x1="100"
        y1="60"
        x2="72"
        y2="63"
        stroke="#f5e0c0"
        strokeWidth="1.1"
        opacity="0.85"
      />
      <line
        x1="100"
        y1="65"
        x2="72"
        y2="65"
        stroke="#f5e0c0"
        strokeWidth="1.1"
        opacity="0.85"
      />
      <line
        x1="100"
        y1="70"
        x2="72"
        y2="67"
        stroke="#f5e0c0"
        strokeWidth="1.1"
        opacity="0.85"
      />
      <ellipse cx="42" cy="122" rx="10.5" ry="7.5" fill="#b86c28" />
      <ellipse cx="78" cy="122" rx="10.5" ry="7.5" fill="#b86c28" />
      <ellipse cx="36" cy="122" rx="3.8" ry="4.8" fill="#d08840" />
      <ellipse cx="42" cy="124" rx="3.8" ry="4.8" fill="#d08840" />
      <ellipse cx="48" cy="122" rx="3.8" ry="4.8" fill="#d08840" />
      <ellipse cx="72" cy="122" rx="3.8" ry="4.8" fill="#d08840" />
      <ellipse cx="78" cy="124" rx="3.8" ry="4.8" fill="#d08840" />
      <ellipse cx="84" cy="122" rx="3.8" ry="4.8" fill="#d08840" />
      <ellipse cx="38" cy="62" rx="6.5" ry="3.5" fill="#f09888" opacity="0.3" />
      <ellipse cx="82" cy="62" rx="6.5" ry="3.5" fill="#f09888" opacity="0.3" />
    </svg>
  );
}

function MiniCat({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none"
    >
      <g
        style={{ transformOrigin: "38px 105px" }}
        className="animate-tail-idle"
      >
        <path
          d="M38 105 Q10 95 6 75 Q2 55 20 48 Q30 44 35 52"
          stroke="#c87830"
          strokeWidth="8.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="35" cy="52" r="5.5" fill="#e09040" />
        <circle cx="35" cy="52" r="2.8" fill="#fdf4ec" />
      </g>
      <ellipse cx="60" cy="95" rx="31" ry="29" fill="#d08840" />
      <ellipse cx="60" cy="100" rx="17" ry="19" fill="#f5e0c0" />
      <ellipse cx="60" cy="55" rx="27" ry="25" fill="#d08840" />
      <polygon points="36,36 28,14 46,30" fill="#d08840" />
      <polygon points="84,36 92,14 74,30" fill="#d08840" />
      <polygon points="37,34 31,18 44,30" fill="#f0a8b8" />
      <polygon points="83,34 89,18 76,30" fill="#f0a8b8" />
      <ellipse cx="49" cy="53" rx="5.5" ry="5.5" fill="#c08820" />
      <ellipse cx="71" cy="53" rx="5.5" ry="5.5" fill="#c08820" />
      <ellipse cx="49" cy="53" rx="2.4" ry="3.8" fill="#0c0c0c" />
      <ellipse cx="71" cy="53" rx="2.4" ry="3.8" fill="#0c0c0c" />
      <circle cx="51" cy="50.5" r="1.4" fill="white" opacity="0.9" />
      <circle cx="73" cy="50.5" r="1.4" fill="white" opacity="0.9" />
      <path d="M57 63 L60 66 L63 63 Q60 60 57 63Z" fill="#e88898" />
      <ellipse cx="42" cy="122" rx="10.5" ry="7.5" fill="#b86c28" />
      <ellipse cx="78" cy="122" rx="10.5" ry="7.5" fill="#b86c28" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SPLASH SCREEN
───────────────────────────────────────────────────────────────────────────── */
function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 300);
    const t2 = setTimeout(() => setPhase("exit"), 2600);
    const t3 = setTimeout(() => onDone(), 3100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(145deg, #fdf8f2 0%, #f9f3ea 50%, #fdf6ee 100%)",
        transition: "opacity 0.5s ease",
        opacity: phase === "exit" ? 0 : 1,
        pointerEvents: phase === "exit" ? "none" : "auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,136,64,0.14) 0%, transparent 70%)",
            transition: "all 0.8s ease",
            transform: phase === "hold" ? "scale(1.1)" : "scale(0.7)",
            opacity: phase === "hold" ? 1 : 0,
          }}
        />
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        <div
          style={{
            transition: "all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
            opacity: phase === "enter" ? 0 : 1,
            transform:
              phase === "enter"
                ? "scale(0.45) translateY(60px)"
                : "scale(1) translateY(0)",
          }}
        >
          <GingerCat size={188} splash={true} />
        </div>
        <div
          style={{
            textAlign: "center",
            transition: "all 0.55s ease",
            transitionDelay: phase === "enter" ? "0ms" : "280ms",
            opacity: phase === "enter" ? 0 : 1,
            transform: phase === "enter" ? "translateY(20px)" : "translateY(0)",
          }}
        >
          <h1
            style={{
              fontSize: 56,
              fontWeight: 900,
              letterSpacing: "-2px",
              lineHeight: 1,
              color: "#2a1f14",
            }}
          >
            Commit{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #c87830 0%, #e09a40 50%, #c87830 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Story
            </span>
          </h1>
          <p
            className="font-mono"
            style={{
              color: "#a08060",
              fontSize: 12,
              marginTop: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            git log → narrative
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            transition: "opacity 0.5s ease",
            transitionDelay: "480ms",
            opacity: phase === "enter" ? 0 : 1,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-dot"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#c87830",
                animationDelay: `${i * 160}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED UI PRIMITIVES
───────────────────────────────────────────────────────────────────────────── */
function Skeleton({ style = {} }) {
  return (
    <div
      className="animate-shimmer"
      style={{
        borderRadius: 10,
        background:
          "linear-gradient(90deg, #ede8e0 0%, #e0d8cc 50%, #ede8e0 100%)",
        backgroundSize: "200% 100%",
        ...style,
      }}
    />
  );
}

function Badge({ children, color }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 10px",
        borderRadius: 99,
        background: color + "18",
        color,
        border: `1px solid ${color}30`,
        fontFamily: "inherit",
      }}
    >
      {children}
    </span>
  );
}

const ICON_PATHS = {
  features: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3l2.09 6.26L20 10.27l-4.91 4.79 1.16 6.76L12 18.5l-4.25 2.32 1.16-6.76L4 10.27l5.91-1.01L12 3z"
    />
  ),
  bugfixes: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
    />
  ),
  improvements: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
    />
  ),
  milestones: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
};

function Icon({ type, size = 18, color }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth={2}
      style={{ flexShrink: 0 }}
    >
      {ICON_PATHS[type]}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STORY CARD
───────────────────────────────────────────────────────────────────────────── */
function StoryCard({ item, index, accentColor }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 70 + 50);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className={visible ? "animate-cardIn" : ""}
      style={{
        opacity: visible ? 1 : 0,
        background: "#ffffff",
        border: "1px solid #ede8e0",
        borderRadius: 14,
        padding: "14px 16px",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accentColor + "55";
        e.currentTarget.style.boxShadow = `0 4px 18px ${accentColor}12`;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#ede8e0";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div
          style={{
            marginTop: 5,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: accentColor,
            opacity: 0.7,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              color: "#2a1f14",
              fontSize: 13.5,
              lineHeight: 1.55,
              fontWeight: 500,
            }}
          >
            {item.title}
          </p>
          {item.commits && (
            <p
              className="font-mono"
              style={{ color: "#a08878", fontSize: 11.5, marginTop: 6 }}
            >
              {item.commits} commit{item.commits > 1 ? "s" : ""} · {item.author}
            </p>
          )}
          {item.date && (
            <p style={{ color: "#c0a898", fontSize: 11, marginTop: 3 }}>
              {item.date}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION CARD
───────────────────────────────────────────────────────────────────────────── */
const SECTION_META = {
  features: { label: "Chapter One", title: "What Was Born", color: "#5b8dd9" },
  bugfixes: { label: "The Battles", title: "Wounds Healed", color: "#d96b6b" },
  improvements: { label: "The Polish", title: "Made Better", color: "#5aab78" },
  milestones: { label: "The Peaks", title: "Moments Forged", color: "#9b7dd4" },
};

function Section({ type, items }) {
  const m = SECTION_META[type];
  return (
    <div
      style={{
        borderRadius: 20,
        padding: "22px 20px",
        border: `1.5px solid ${m.color}28`,
        background: `linear-gradient(160deg, ${m.color}07 0%, #fff 60%)`,
        boxShadow: `0 4px 28px ${m.color}0d`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            padding: 9,
            borderRadius: 12,
            background: m.color + "14",
            color: m.color,
            display: "flex",
          }}
        >
          <Icon type={type} color={m.color} />
        </div>
        <div style={{ flex: 1 }}>
          <p
            className="font-mono"
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: m.color + "99",
              fontWeight: 500,
            }}
          >
            {m.label}
          </p>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#2a1f14",
              lineHeight: 1.2,
            }}
          >
            {m.title}
          </h3>
        </div>
        <Badge color={m.color}>{items.length}</Badge>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <StoryCard key={i} item={item} index={i} accentColor={m.color} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TIMELINE
───────────────────────────────────────────────────────────────────────────── */
function Timeline({ events }) {
  return (
    <div style={{ position: "relative", paddingLeft: 28 }}>
      <div
        style={{
          position: "absolute",
          left: 10,
          top: 6,
          bottom: 6,
          width: 2,
          background: "linear-gradient(to bottom, #c87830, #e0b060, #c87830)",
          borderRadius: 2,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {events.map((ev, i) => (
          <div key={i} style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: -22,
                top: 14,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: ev.color,
                border: "2.5px solid #fdf8f2",
                boxShadow: `0 0 0 3px ${ev.color}22`,
              }}
            />
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #ede8e0",
                padding: "13px 16px",
                transition: "border-color 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ev.color + "55";
                e.currentTarget.style.boxShadow = `0 3px 14px ${ev.color}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#ede8e0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <span
                  className="font-mono"
                  style={{ fontSize: 11, color: "#a08878" }}
                >
                  {ev.date}
                </span>
                <Badge color={ev.color}>{ev.type}</Badge>
              </div>
              <p style={{ color: "#2a1f14", fontSize: 13.5, fontWeight: 500 }}>
                {ev.title}
              </p>
              <p style={{ color: "#a08878", fontSize: 12, marginTop: 4 }}>
                {ev.author}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DEV STATS
───────────────────────────────────────────────────────────────────────────── */
function DevStats({ devs }) {
  const max = Math.max(...devs.map((d) => d.commits));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {devs.map((dev, i) => (
        <div key={i}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                  background: dev.color,
                  boxShadow: `0 2px 8px ${dev.color}44`,
                }}
              >
                {dev.name[0].toUpperCase()}
              </div>
              <span
                style={{ color: "#2a1f14", fontSize: 13.5, fontWeight: 500 }}
              >
                {dev.name}
              </span>
            </div>
            <span
              className="font-mono"
              style={{ color: "#a08878", fontSize: 12 }}
            >
              {dev.commits} commits
            </span>
          </div>
          <div
            style={{
              height: 7,
              borderRadius: 99,
              background: "#ede8e0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 99,
                background: dev.color,
                opacity: 0.75,
                width: `${(dev.commits / max) * 100}%`,
                transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TAB BAR
───────────────────────────────────────────────────────────────────────────── */
function TabBar({ active, onChange }) {
  const tabs = [
    { id: "story", label: "The Story" },
    { id: "timeline", label: "Chronicles" },
    { id: "devs", label: "The Authors" },
  ];
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        background: "#f3ede4",
        borderRadius: 16,
        padding: 5,
        border: "1px solid #e8e0d4",
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            flex: 1,
            padding: "9px 16px",
            borderRadius: 12,
            fontSize: 13.5,
            fontWeight: 500,
            border:
              active === t.id ? "1px solid #e8e0d4" : "1px solid transparent",
            cursor: "pointer",
            background: active === t.id ? "#fff" : "transparent",
            color: active === t.id ? "#2a1f14" : "#a08878",
            boxShadow: active === t.id ? "0 1px 6px rgba(0,0,0,0.07)" : "none",
            fontFamily: "inherit",
            transition: "all 0.18s",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LOADING STATE — "Analyzing repository..." spinner
───────────────────────────────────────────────────────────────────────────── */
function LoadingState() {
  const messages = [
    "Analyzing repository...",
    "Reading commit history...",
    "Grouping features & fixes...",
    "Crafting your narrative...",
  ];
  const [msgIdx, setMsgIdx] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setMsgIdx((p) => (p + 1) % messages.length);
      setFadeKey((p) => p + 1);
    }, 600);
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      className="animate-fadeUp"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
        padding: "52px 16px 36px",
      }}
    >
      {/* Spinner with cat inside */}
      <div style={{ position: "relative", width: 76, height: 76 }}>
        {/* Track ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3.5px solid #ede8e0",
          }}
        />
        {/* Spinning arc */}
        <div
          className="animate-spin"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3.5px solid transparent",
            borderTopColor: "#c87830",
            borderRightColor: "rgba(200,120,48,0.35)",
          }}
        />
        {/* Cat centered inside */}
        <div
          style={{
            position: "absolute",
            inset: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MiniCat size={40} />
        </div>
      </div>

      {/* Animated message */}
      <div style={{ textAlign: "center" }}>
        <p
          key={fadeKey}
          style={{
            color: "#2a1f14",
            fontSize: 15.5,
            fontWeight: 600,
            animation: "msgFade 0.6s ease-out both",
          }}
        >
          {messages[msgIdx]}
        </p>
        <p
          className="font-mono"
          style={{
            color: "#b09880",
            fontSize: 12,
            marginTop: 8,
            letterSpacing: "0.04em",
          }}
        >
          This only takes a moment
        </p>
      </div>

      {/* Skeleton cards */}
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 14,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              borderRadius: 18,
              border: "1px solid #ede8e0",
              background: "#fdf8f2",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Skeleton style={{ height: 11, width: "38%" }} />
            <Skeleton style={{ height: 17, width: "62%" }} />
            <Skeleton style={{ height: 11, width: "100%" }} />
            <Skeleton style={{ height: 11, width: "80%" }} />
            <Skeleton style={{ height: 11, width: "68%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────────────────────────────────────── */
function EmptyState({ onDemo }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "64px 24px",
        gap: 20,
        textAlign: "center",
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: -24,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,136,64,0.10) 0%, transparent 70%)",
          }}
        />
        <MiniCat size={76} />
      </div>
      <div>
        <h3
          style={{
            color: "#2a1f14",
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          No story yet
        </h3>
        <p
          style={{
            color: "#a08878",
            fontSize: 14,
            maxWidth: 300,
            lineHeight: 1.65,
          }}
        >
          Paste a GitHub repo URL above and let the cat weave your commit
          history into a tale worth telling.
        </p>
      </div>
      <button
        onClick={onDemo}
        style={{
          background: "transparent",
          border: "1.5px solid #c8783042",
          color: "#c87830",
          fontSize: 13.5,
          fontWeight: 500,
          padding: "9px 24px",
          borderRadius: 99,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#c8783010";
          e.currentTarget.style.borderColor = "#c87830aa";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "#c8783042";
        }}
      >
        ✨ Try a demo story
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOCK DATA GENERATOR
───────────────────────────────────────────────────────────────────────────── */
function generateMockStory(repo) {
  const name =
    repo
      .split("/")
      .pop()
      ?.replace(/\.git$/, "") || "project";
  return {
    repo,
    name,
    generatedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    features: [
      {
        title:
          "Implemented JWT-based authentication with refresh token rotation",
        commits: 7,
        author: "ada.lovelace",
        date: "Mar 14",
      },
      {
        title: "Introduced dark mode toggle with persistent localStorage state",
        commits: 3,
        author: "grace.hopper",
        date: "Mar 18",
      },
      {
        title: "Added WebSocket support for real-time collaboration",
        commits: 12,
        author: "alan.turing",
        date: "Mar 22",
      },
      {
        title: "Built modular plugin architecture for third-party integrations",
        commits: 9,
        author: "ada.lovelace",
        date: "Apr 1",
      },
    ],
    bugfixes: [
      {
        title:
          "Fixed race condition in concurrent request handler causing 500 errors",
        commits: 2,
        author: "grace.hopper",
        date: "Mar 16",
      },
      {
        title: "Resolved memory leak in event listener cleanup on unmount",
        commits: 1,
        author: "alan.turing",
        date: "Mar 20",
      },
      {
        title: "Patched SQL injection vulnerability in search endpoint",
        commits: 3,
        author: "ada.lovelace",
        date: "Mar 25",
      },
    ],
    improvements: [
      {
        title:
          "Reduced initial bundle size by 42% via code splitting and lazy imports",
        commits: 5,
        author: "alan.turing",
        date: "Mar 17",
      },
      {
        title: "Migrated database queries to use connection pooling",
        commits: 4,
        author: "grace.hopper",
        date: "Mar 21",
      },
      {
        title: "Refactored API response serialization for 3× throughput",
        commits: 6,
        author: "ada.lovelace",
        date: "Mar 28",
      },
    ],
    milestones: [
      {
        title: "🚀 v1.0.0 — First public release shipped",
        commits: 1,
        author: "ada.lovelace",
        date: "Mar 15",
      },
      {
        title: "🎯 10,000 API requests/day crossed",
        commits: 1,
        author: "grace.hopper",
        date: "Mar 24",
      },
      {
        title: "🌍 Deployed to production with zero-downtime migration",
        commits: 2,
        author: "alan.turing",
        date: "Apr 2",
      },
    ],
    timeline: [
      {
        date: "Mar 14",
        title: "Project genesis — initial commit",
        type: "Feature",
        author: "ada.lovelace",
        color: "#5b8dd9",
      },
      {
        date: "Mar 15",
        title: "v1.0.0 public release",
        type: "Milestone",
        author: "ada.lovelace",
        color: "#9b7dd4",
      },
      {
        date: "Mar 16",
        title: "Critical race condition patched",
        type: "Fix",
        author: "grace.hopper",
        color: "#d96b6b",
      },
      {
        date: "Mar 18",
        title: "Dark mode & theming system",
        type: "Feature",
        author: "grace.hopper",
        color: "#5b8dd9",
      },
      {
        date: "Mar 22",
        title: "WebSocket real-time layer",
        type: "Feature",
        author: "alan.turing",
        color: "#5b8dd9",
      },
      {
        date: "Mar 25",
        title: "Security patch deployed",
        type: "Fix",
        author: "ada.lovelace",
        color: "#d96b6b",
      },
      {
        date: "Mar 28",
        title: "API throughput 3× improvement",
        type: "Improvement",
        author: "ada.lovelace",
        color: "#5aab78",
      },
      {
        date: "Apr 2",
        title: "Production zero-downtime deploy",
        type: "Milestone",
        author: "alan.turing",
        color: "#9b7dd4",
      },
    ],
    devs: [
      { name: "ada.lovelace", commits: 28, color: "#c87830" },
      { name: "grace.hopper", commits: 19, color: "#5aab78" },
      { name: "alan.turing", commits: 24, color: "#9b7dd4" },
    ],
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [appVisible, setAppVisible] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState(null);
  const [tab, setTab] = useState("story");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleSplashDone = useCallback(() => {
    setShowSplash(false);
    setTimeout(() => setAppVisible(true), 50);
  }, []);

  const isValidGitHub = useCallback(
    (val) =>
      /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\.git)?/.test(
        val.trim(),
      ),
    [],
  );

  const handleGenerate = useCallback(
    async (repoUrl) => {
      const target = typeof repoUrl === "string" ? repoUrl : url;
      if (!target.trim()) {
        setError("Please enter a repository URL");
        return;
      }
      if (!isValidGitHub(target)) {
        setError(
          "Enter a valid GitHub URL, e.g. https://github.com/owner/repo",
        );
        return;
      }
      setError("");
      setLoading(true);
      setStory(null);
      await new Promise((r) => setTimeout(r, 2000));
      setStory(generateMockStory(target.trim()));
      setLoading(false);
      setTab("story");
    },
    [url, isValidGitHub],
  );

  const handleClear = useCallback(() => {
    setUrl("");
    setStory(null);
    setError("");
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 40);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const text = e.dataTransfer.getData("text/plain");
      if (text) {
        setUrl(text);
        handleGenerate(text);
      }
    },
    [handleGenerate],
  );

  return (
    <>
      <GlobalStyles />
      {showSplash && <SplashScreen onDone={handleSplashDone} />}

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(160deg, #fdf8f2 0%, #f9f3e8 45%, #fdf6ee 100%)",
          transition: "opacity 0.7s ease",
          opacity: appVisible ? 1 : 0,
          pointerEvents: showSplash ? "none" : "auto",
          position: "relative",
        }}
      >
        {/* Ambient background blobs */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            className="animate-blob"
            style={{
              position: "absolute",
              top: -100,
              left: "50%",
              transform: "translateX(-50%)",
              width: 600,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(200,136,64,0.07) 0%, transparent 65%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              right: -60,
              width: 340,
              height: 340,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(155,125,212,0.055) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 100,
              left: -50,
              width: 280,
              height: 280,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(90,171,120,0.055) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* ── CENTERED LAYOUT ── */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 780,
              padding: "32px 20px 64px",
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            {/* ── HEADER ── */}
            <header
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <MiniCat size={42} />
                <div>
                  <h1
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.6px",
                      color: "#2a1f14",
                      lineHeight: 1,
                    }}
                  >
                    Commit{" "}
                    <span
                      style={{
                        background: "linear-gradient(135deg, #c87830, #e09a48)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Story
                    </span>
                  </h1>
                  <p
                    className="font-mono"
                    style={{
                      color: "#a08878",
                      fontSize: 11,
                      marginTop: 3,
                      letterSpacing: "0.04em",
                    }}
                  >
                    git log → narrative
                  </p>
                </div>
              </div>
            </header>

            {/* ── HERO — centered ── */}
            <div style={{ textAlign: "center", padding: "4px 0 8px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: "#fdf0e0",
                  border: "1px solid #e8c89840",
                  color: "#c87830",
                  fontSize: 12,
                  fontWeight: 500,
                  padding: "5px 16px",
                  borderRadius: 99,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#c87830",
                  }}
                  className="animate-dot"
                />
                AI-Powered Narrative Engine
              </div>
              <h2
                style={{
                  fontSize: "clamp(26px, 5vw, 44px)",
                  fontWeight: 900,
                  letterSpacing: "-1.4px",
                  lineHeight: 1.15,
                  color: "#2a1f14",
                }}
              >
                Turn Git history into{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #c87830 0%, #e09a40 55%, #b86820 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  meaningful narratives
                </span>
              </h2>
              <p
                style={{
                  color: "#a08878",
                  marginTop: 14,
                  maxWidth: 440,
                  margin: "14px auto 0",
                  fontSize: 15,
                  lineHeight: 1.65,
                }}
              >
                Every commit tells a story. Let the cat read between the lines.
              </p>
            </div>

            {/* ── INPUT CARD ── */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                background: dragOver ? "#fdf4e6" : "#ffffff",
                border: dragOver ? "2px dashed #c87830" : "1.5px solid #e8e0d4",
                borderRadius: 22,
                padding: "24px 24px 16px",
                boxShadow: dragOver
                  ? "0 0 0 4px #c8783012"
                  : "0 2px 16px rgba(0,0,0,0.042)",
                transition:
                  "border-color 0.2s, background 0.2s, box-shadow 0.2s",
              }}
            >
              {/* Label */}
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#a08878",
                  marginBottom: 10,
                }}
              >
                Paste GitHub Repository Link
              </label>

              {/* Row: input + buttons */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  alignItems: "stretch",
                }}
              >
                {/* URL input */}
                <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 13,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#c0a888",
                      pointerEvents: "none",
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.828 14.828a4 4 0 015.656 0l4-4a4 4 0 10-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                  <input
                    ref={inputRef}
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    placeholder="https://github.com/owner/repository"
                    className="font-mono"
                    style={{
                      width: "100%",
                      paddingLeft: 38,
                      paddingRight: 14,
                      paddingTop: 11,
                      paddingBottom: 11,
                      background: "#faf6f0",
                      border: "1.5px solid #e8e0d4",
                      borderRadius: 12,
                      fontSize: 13,
                      color: "#2a1f14",
                      outline: "none",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#c87830";
                      e.target.style.boxShadow = "0 0 0 3px #c8783012";
                      e.target.style.background = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e8e0d4";
                      e.target.style.boxShadow = "none";
                      e.target.style.background = "#faf6f0";
                    }}
                  />
                </div>

                {/* Clear button */}
                <button
                  onClick={handleClear}
                  disabled={loading}
                  style={{
                    padding: "11px 18px",
                    borderRadius: 12,
                    border: "1.5px solid #e8e0d4",
                    background: "#faf6f0",
                    color: "#a08878",
                    fontSize: 13.5,
                    fontWeight: 500,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.45 : 1,
                    fontFamily: "inherit",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "#f5ede0";
                      e.currentTarget.style.borderColor = "#d4c8b8";
                      e.currentTarget.style.color = "#5a3a18";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#faf6f0";
                    e.currentTarget.style.borderColor = "#e8e0d4";
                    e.currentTarget.style.color = "#a08878";
                  }}
                >
                  Clear
                </button>

                {/* Generate Story button */}
                <button
                  onClick={() => handleGenerate()}
                  disabled={loading}
                  style={{
                    padding: "11px 22px",
                    borderRadius: 12,
                    border: "none",
                    background: loading
                      ? "#d4a87a"
                      : "linear-gradient(160deg, #d48a38 0%, #bf6e18 100%)",
                    color: "#fff",
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: loading
                      ? "none"
                      : "0 4px 16px rgba(200,120,48,0.30)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    whiteSpace: "nowrap",
                    fontFamily: "inherit",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background =
                        "linear-gradient(160deg, #e09840 0%, #cf7e28 100%)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 22px rgba(200,120,48,0.42)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background =
                        "linear-gradient(160deg, #d48a38 0%, #bf6e18 100%)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 16px rgba(200,120,48,0.30)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.97)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = loading
                      ? "scale(1)"
                      : "translateY(-1px)";
                  }}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="3.5"
                        />
                        <path
                          d="M12 2a10 10 0 0 1 10 10"
                          stroke="#fff"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      Weaving…
                    </>
                  ) : (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3l2.09 6.26L20 10.27l-4.91 4.79 1.16 6.76L12 18.5l-4.25 2.32 1.16-6.76L4 10.27l5.91-1.01L12 3z"
                        />
                      </svg>
                      Generate Story
                    </>
                  )}
                </button>
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginTop: 12,
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="#d96b6b"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <p
                    className="font-mono"
                    style={{ color: "#c05050", fontSize: 12 }}
                  >
                    {error}
                  </p>
                </div>
              )}

              <p
                style={{
                  color: "#c8b8a8",
                  fontSize: 11.5,
                  marginTop: 12,
                  textAlign: "center",
                }}
              >
                Drag & drop a URL here · Press Enter to generate
              </p>
            </div>

            {/* ── LOADING STATE ── */}
            {loading && <LoadingState />}

            {/* ── RESULTS ── */}
            {story && !loading && (
              <div
                className="animate-fadeUp"
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {/* Repo summary bar */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "14px 18px",
                    borderRadius: 18,
                    background: "#fff",
                    border: "1.5px solid #e8e0d4",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <MiniCat size={30} />
                    <div>
                      <p
                        style={{
                          color: "#2a1f14",
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {story.name}
                      </p>
                      <p
                        className="font-mono"
                        style={{ color: "#a08878", fontSize: 11.5 }}
                      >
                        {story.repo}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", gap: 14, alignItems: "center" }}
                  >
                    <span
                      className="font-mono"
                      style={{ color: "#b09888", fontSize: 12 }}
                    >
                      Generated {story.generatedAt}
                    </span>
                    <Badge color="#c87830">
                      {story.features.length +
                        story.bugfixes.length +
                        story.improvements.length +
                        story.milestones.length}{" "}
                      entries
                    </Badge>
                  </div>
                </div>

                <TabBar active={tab} onChange={setTab} />

                {tab === "story" && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: 16,
                    }}
                  >
                    <Section type="features" items={story.features} />
                    <Section type="bugfixes" items={story.bugfixes} />
                    <Section type="improvements" items={story.improvements} />
                    <Section type="milestones" items={story.milestones} />
                  </div>
                )}

                {tab === "timeline" && (
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 22,
                      border: "1.5px solid #e8e0d4",
                      padding: 28,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    }}
                  >
                    <p
                      className="font-mono"
                      style={{
                        fontSize: 10.5,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "#a08878",
                      }}
                    >
                      The Chronicles
                    </p>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#2a1f14",
                        marginTop: 4,
                        marginBottom: 24,
                      }}
                    >
                      Project Evolution
                    </h3>
                    <Timeline events={story.timeline} />
                  </div>
                )}

                {tab === "devs" && (
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 22,
                      border: "1.5px solid #e8e0d4",
                      padding: 28,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    }}
                  >
                    <p
                      className="font-mono"
                      style={{
                        fontSize: 10.5,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "#a08878",
                      }}
                    >
                      The Authors
                    </p>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#2a1f14",
                        marginTop: 4,
                        marginBottom: 24,
                      }}
                    >
                      Contribution Breakdown
                    </h3>
                    <DevStats devs={story.devs} />
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 12,
                        marginTop: 28,
                        paddingTop: 24,
                        borderTop: "1.5px solid #f0e8dc",
                      }}
                    >
                      {[
                        {
                          label: "Total Commits",
                          value: story.devs.reduce((a, d) => a + d.commits, 0),
                        },
                        { label: "Contributors", value: story.devs.length },
                        { label: "Story Chapters", value: 4 },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          style={{
                            textAlign: "center",
                            padding: "16px 8px",
                            borderRadius: 14,
                            background: "#faf6f0",
                          }}
                        >
                          <p
                            style={{
                              fontSize: 26,
                              fontWeight: 900,
                              color: "#c87830",
                            }}
                          >
                            {stat.value}
                          </p>
                          <p
                            style={{
                              color: "#a08878",
                              fontSize: 12,
                              marginTop: 4,
                              fontWeight: 500,
                            }}
                          >
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── EMPTY STATE ── */}
            {!story && !loading && (
              <EmptyState
                onDemo={() => {
                  setUrl("https://github.com/facebook/react");
                  handleGenerate("https://github.com/facebook/react");
                }}
              />
            )}

            {/* ── FOOTER ── */}
            <footer
              style={{
                textAlign: "center",
                color: "#c0b0a0",
                fontSize: 12,
                paddingTop: 24,
                borderTop: "1px solid #ede8e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <MiniCat size={18} />
              <span>
                Commit Story · Built for developers who appreciate good writing
              </span>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
