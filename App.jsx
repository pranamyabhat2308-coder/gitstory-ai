import { useState, useEffect, useRef } from "react";

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK_STORY = {
  repo: "acme-org/platform",
  period: "Jan 2024 – Apr 2024",
  totalCommits: 247,
  features: [
    { id: 1, title: "OAuth 2.0 SSO Integration", commits: 14, date: "Mar 18", description: "Full Google & GitHub login flow with JWT refresh token rotation.", authors: ["@priya", "@dev_marco"] },
    { id: 2, title: "Real-time Collaboration Engine", commits: 31, date: "Feb 28", description: "WebSocket-based presence system supporting up to 50 concurrent editors per document.", authors: ["@elara"] },
    { id: 3, title: "Advanced Search with Filters", commits: 9, date: "Apr 02", description: "Full-text Elasticsearch pipeline with faceted filtering across all entity types.", authors: ["@dev_marco", "@kai"] },
  ],
  bugFixes: [
    { id: 1, title: "Race condition in queue processor", commits: 3, date: "Mar 05", severity: "critical" },
    { id: 2, title: "Memory leak in WebSocket listeners", commits: 2, date: "Mar 12", severity: "high" },
    { id: 3, title: "Incorrect pagination on filtered results", commits: 1, date: "Apr 01", severity: "medium" },
    { id: 4, title: "Date timezone offset in exports", commits: 1, date: "Feb 14", severity: "low" },
  ],
  improvements: [
    { id: 1, title: "Build pipeline 3× faster", detail: "Migrated to Turbopack; cold builds down from 42s → 14s." },
    { id: 2, title: "API response caching", detail: "Redis layer reduced p95 latency from 480ms to 62ms." },
    { id: 3, title: "Lighthouse score +28 pts", detail: "Image lazy-loading, font subsetting, and critical-CSS extraction." },
  ],
  milestones: [
    { id: 1, title: "v2.0 Public Beta", date: "Feb 01", commits: 58, description: "First public release with core collaboration features." },
    { id: 2, title: "SOC 2 Audit Pass", date: "Mar 22", commits: 0, description: "All 117 security controls verified. Zero critical findings." },
    { id: 3, title: "v2.3 Stable Release", date: "Apr 10", commits: 189, description: "Performance hardening, SSO, and advanced search shipped." },
  ],
  timeline: [
    { date: "Jan 08", type: "feature", label: "Kickoff: auth refactor" },
    { date: "Jan 24", type: "fix", label: "Critical: session expiry bug" },
    { date: "Feb 01", type: "milestone", label: "v2.0 Beta launch" },
    { date: "Feb 28", type: "feature", label: "Collab engine merged" },
    { date: "Mar 05", type: "fix", label: "Queue race condition patch" },
    { date: "Mar 18", type: "feature", label: "SSO shipped" },
    { date: "Mar 22", type: "milestone", label: "SOC 2 passed" },
    { date: "Apr 02", type: "feature", label: "Search with filters live" },
    { date: "Apr 10", type: "milestone", label: "v2.3 Stable" },
  ],
  contributors: [
    { name: "priya", commits: 89, additions: 12400, deletions: 3200, avatar: "P", color: "#a78bfa" },
    { name: "elara", commits: 74, additions: 9800, deletions: 1900, avatar: "E", color: "#34d399" },
    { name: "dev_marco", commits: 51, additions: 7100, deletions: 4400, avatar: "M", color: "#f472b6" },
    { name: "kai", commits: 33, additions: 3200, deletions: 800, avatar: "K", color: "#fbbf24" },
  ],
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const severityColor = { critical: "#ef4444", high: "#f97316", medium: "#eab308", low: "#6b7280" };
const typeColor = { feature: "#a78bfa", fix: "#f87171", milestone: "#fbbf24", improvement: "#34d399" };

// ── Sub-components ────────────────────────────────────────────────────────────

function Noise() {
  return (
    <svg className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.035]" style={{ zIndex: 100 }}>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

function Badge({ children, color = "#a78bfa" }) {
  return (
    <span
      style={{ backgroundColor: color + "22", color, border: `1px solid ${color}44` }}
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase"
    >
      {children}
    </span>
  );
}

function StatCard({ label, value, sub, accent = "#a78bfa" }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-1 transition-all duration-300 hover:-translate-y-1"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <span className="text-xs text-gray-500 uppercase tracking-widest">{label}</span>
      <span className="text-3xl font-black" style={{ color: accent }}>{value}</span>
      {sub && <span className="text-xs text-gray-500">{sub}</span>}
    </div>
  );
}

function SkeletonBlock({ h = "h-5", w = "w-full", rounded = "rounded-lg" }) {
  return <div className={`${h} ${w} ${rounded} animate-pulse`} style={{ background: "rgba(255,255,255,0.06)" }} />;
}

function LoadingState() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-10 flex flex-col gap-8 px-4">
      <div className="flex items-center gap-3">
        <div className="h-2.5 w-2.5 rounded-full bg-violet-400 animate-ping" />
        <span className="text-sm text-gray-400 font-mono tracking-wide">Parsing commit history…</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonBlock key={i} h="h-24" rounded="rounded-2xl" />)}
      </div>
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => <SkeletonBlock key={i} h="h-16" rounded="rounded-2xl" />)}
      </div>
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => <SkeletonBlock key={i} h="h-12" rounded="rounded-xl" />)}
      </div>
    </div>
  );
}

function EmptyState({ onDemo }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-6 text-center">
      <div className="relative">
        <div className="h-20 w-20 rounded-3xl flex items-center justify-center text-4xl"
          style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
          📖
        </div>
        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-violet-400 animate-pulse" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Your story starts here</h3>
        <p className="text-gray-500 text-sm max-w-xs">Paste a GitHub repo URL above and click Generate Story to transform commits into a readable narrative.</p>
      </div>
      <button
        onClick={onDemo}
        className="text-xs text-violet-400 underline underline-offset-4 hover:text-violet-300 transition-colors"
      >
        Or try a demo →
      </button>
    </div>
  );
}

function FeatureCard({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className="rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 group"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">✦</span>
          <div>
            <p className="font-semibold text-white group-hover:text-violet-300 transition-colors">{item.title}</p>
            {open && <p className="mt-2 text-sm text-gray-400 leading-relaxed">{item.description}</p>}
            {open && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {item.authors.map((a) => (
                  <span key={a} className="text-xs text-gray-500 font-mono">{a}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge color="#a78bfa">{item.commits} commits</Badge>
          <span className="text-xs text-gray-600">{item.date}</span>
          <span className="text-gray-600 text-xs transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
        </div>
      </div>
    </div>
  );
}

function TimelineDot({ type }) {
  const c = typeColor[type] || "#6b7280";
  return (
    <div className="relative flex items-center justify-center">
      <div className="h-3 w-3 rounded-full z-10" style={{ backgroundColor: c, boxShadow: `0 0 8px ${c}88` }} />
    </div>
  );
}

function ContributorBar({ name, commits, total, additions, color, avatar }) {
  const pct = Math.round((commits / total) * 100);
  return (
    <div className="flex items-center gap-4">
      <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
        style={{ backgroundColor: color + "22", color, border: `1.5px solid ${color}55` }}>
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-300 font-mono">@{name}</span>
          <span className="text-gray-500">{commits} commits · +{(additions / 1000).toFixed(1)}k</span>
        </div>
        <div className="h-1.5 rounded-full w-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}66` }}
          />
        </div>
      </div>
      <span className="text-xs text-gray-600 w-8 text-right">{pct}%</span>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [story, setStory] = useState(null);
  const [activeTab, setActiveTab] = useState("features");
  const inputRef = useRef();

  const generate = async (demo = false) => {
    if (!demo && !url.trim()) { inputRef.current?.focus(); return; }
    setStatus("loading");
    setStory(null);
    await sleep(2400);
    setStory(MOCK_STORY);
    setStatus("done");
  };

  const tabs = [
    { id: "features", label: "Features", icon: "✦", count: story?.features.length },
    { id: "fixes", label: "Bug Fixes", icon: "⚑", count: story?.bugFixes.length },
    { id: "improvements", label: "Improvements", icon: "↑", count: story?.improvements.length },
    { id: "milestones", label: "Milestones", icon: "◈", count: story?.milestones.length },
  ];

  return (
    <div className="min-h-screen text-gray-100" style={{ background: "#0a0a0f", fontFamily: "'DM Sans', 'Sora', sans-serif" }}>
      <Noise />

      {/* BG glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, #7c3aed 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10">
        {/* ── Header ── */}
        <header className="border-b px-6 py-4 flex items-center justify-between sticky top-0 backdrop-blur-md"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(10,10,15,0.8)" }}>
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 16px #7c3aed55" }}>
              ◈
            </div>
            <span className="font-black text-white tracking-tight text-lg">Commit Story</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-xs text-gray-500 font-medium tracking-wide uppercase">
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="px-3 py-1.5 rounded-lg text-violet-300 transition-all hover:bg-violet-400/10"
              style={{ border: "1px solid rgba(167,139,250,0.3)" }}>Sign in</a>
          </nav>
        </header>

        {/* ── Hero / Input ── */}
        <section className="max-w-3xl mx-auto px-4 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-6 text-xs text-violet-300"
            style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.18)" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            AI-powered narrative engine
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
            Turn Git history into<br />
            <span style={{ background: "linear-gradient(90deg,#a78bfa,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              meaningful narratives
            </span>
          </h1>
          <p className="text-gray-500 text-base mb-10 max-w-md mx-auto leading-relaxed">
            Paste a repository URL. We'll parse every commit and produce a structured story — ready for release notes, standups, or portfolios.
          </p>

          {/* Input row */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm select-none">github.com/</span>
              <input
                ref={inputRef}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generate()}
                placeholder="owner/repository"
                className="w-full rounded-xl pl-[92px] pr-4 py-3 text-sm text-white outline-none placeholder-gray-600 transition-all duration-200 focus:ring-2 focus:ring-violet-500/40"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
            <button
              onClick={() => generate()}
              disabled={status === "loading"}
              className="shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:scale-100"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 20px #7c3aed44" }}
            >
              {status === "loading" ? "Generating…" : "Generate Story"}
            </button>
          </div>

          {/* Drag-drop hint */}
          <p className="mt-4 text-xs text-gray-600">
            or{" "}
            <span
              className="underline underline-offset-2 cursor-pointer hover:text-gray-400 transition-colors"
              onClick={() => {
                const el = document.getElementById("dropzone");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              drag & drop a git log file
            </span>
          </p>

          {/* Drag-drop zone */}
          <div
            id="dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); generate(); }}
            className="mt-6 rounded-2xl border-dashed border py-8 text-sm text-gray-600 cursor-pointer hover:border-violet-500/40 hover:text-gray-400 transition-all duration-200"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            ↓ Drop <code className="font-mono text-gray-500">git log --oneline</code> output here
          </div>
        </section>

        {/* ── Content ── */}
        <main className="max-w-5xl mx-auto px-4 pb-24">
          {status === "idle" && <EmptyState onDemo={() => generate(true)} />}
          {status === "loading" && <LoadingState />}

          {status === "done" && story && (
            <div className="flex flex-col gap-10 animate-[fadeIn_0.5s_ease]">

              {/* Repo header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-violet-400 font-mono text-sm">◈</span>
                    <h2 className="text-xl font-black text-white">{story.repo}</h2>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{story.period}</p>
                </div>
                <button
                  className="text-xs rounded-xl px-4 py-2 font-semibold text-gray-300 hover:text-white transition-all hover:scale-105"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  ↓ Export Release Notes
                </button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Total Commits" value={story.totalCommits} accent="#a78bfa" />
                <StatCard label="Features" value={story.features.length} accent="#818cf8" />
                <StatCard label="Bug Fixes" value={story.bugFixes.length} accent="#f87171" />
                <StatCard label="Contributors" value={story.contributors.length} accent="#34d399" />
              </div>

              {/* Tabs */}
              <div>
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                        activeTab === t.id ? "text-white" : "text-gray-500 hover:text-gray-300"
                      }`}
                      style={activeTab === t.id
                        ? { background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)" }
                        : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <span>{t.icon}</span> {t.label}
                      {t.count != null && (
                        <span className="text-xs rounded-full px-1.5 py-0.5"
                          style={{ background: "rgba(255,255,255,0.08)", color: "#888" }}>
                          {t.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {/* Features */}
                  {activeTab === "features" && story.features.map((f) => <FeatureCard key={f.id} item={f} />)}

                  {/* Bug Fixes */}
                  {activeTab === "fixes" && story.bugFixes.map((b) => (
                    <div key={b.id}
                      className="rounded-2xl p-5 flex items-center justify-between gap-4 transition-all hover:-translate-y-0.5 duration-200"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex items-center gap-3">
                        <span className="text-red-400">⚑</span>
                        <span className="font-semibold text-white text-sm">{b.title}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge color={severityColor[b.severity]}>{b.severity}</Badge>
                        <span className="text-xs text-gray-600">{b.date}</span>
                      </div>
                    </div>
                  ))}

                  {/* Improvements */}
                  {activeTab === "improvements" && story.improvements.map((im) => (
                    <div key={im.id}
                      className="rounded-2xl p-5 transition-all hover:-translate-y-0.5 duration-200"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-400 mt-0.5">↑</span>
                        <div>
                          <p className="font-semibold text-white text-sm">{im.title}</p>
                          <p className="text-gray-500 text-xs mt-1">{im.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Milestones */}
                  {activeTab === "milestones" && story.milestones.map((m) => (
                    <div key={m.id}
                      className="rounded-2xl p-5 transition-all hover:-translate-y-0.5 duration-200"
                      style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.15)" }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span className="text-yellow-400 mt-0.5">◈</span>
                          <div>
                            <p className="font-semibold text-white text-sm">{m.title}</p>
                            <p className="text-gray-500 text-xs mt-1">{m.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {m.commits > 0 && <Badge color="#fbbf24">{m.commits} commits</Badge>}
                          <span className="text-xs text-gray-600">{m.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Timeline ── */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-5">Project Timeline</h3>
                <div className="relative pl-6">
                  {/* Vertical line */}
                  <div className="absolute left-[9px] top-0 bottom-0 w-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <div className="flex flex-col gap-5">
                    {story.timeline.map((t, i) => (
                      <div key={i} className="relative flex items-start gap-4 group">
                        <div className="absolute -left-[15px]">
                          <TimelineDot type={t.type} />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-gray-600 w-14 shrink-0">{t.date}</span>
                          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{t.label}</span>
                          <Badge color={typeColor[t.type]}>{t.type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Contributors ── */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-5">Developer Contributions</h3>
                <div className="rounded-2xl p-6 flex flex-col gap-5"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {story.contributors.map((c) => (
                    <ContributorBar
                      key={c.name}
                      {...c}
                      total={story.totalCommits}
                    />
                  ))}
                </div>
              </div>

            </div>
          )}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;800;900&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        ::selection { background: rgba(124,58,237,0.35); }
      `}</style>
    </div>
  );
}
