import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--ink)" }}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.15,
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{
              backgroundColor: "var(--amber-signal)",
              color: "var(--ink)",
              fontFamily: "var(--font-heading)",
            }}
          >
            AF
          </div>
          <span
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ArchFlow
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium transition-colors hover:text-white"
            style={{ color: "var(--grid-line)" }}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200 hover:brightness-110"
            style={{
              backgroundColor: "var(--amber-signal)",
              color: "var(--ink)",
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="animate-fade-in max-w-3xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-8"
            style={{
              backgroundColor: "rgba(69, 184, 164, 0.15)",
              color: "var(--teal-circuit)",
              border: "1px solid rgba(69, 184, 164, 0.3)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--teal-circuit)" }}
            />
            Real-time collaboration
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Design systems
            <br />
            <span style={{ color: "var(--amber-signal)" }}>together.</span>
          </h1>

          <p
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--grid-line)" }}
          >
            The blueprint-grade canvas for architecture diagrams.
            <br />
            Drag, connect, collaborate — in real time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 hover:shadow-lg active:scale-[0.98]"
              style={{
                backgroundColor: "var(--amber-signal)",
                color: "var(--ink)",
              }}
            >
              Start Designing
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href="/dev/theme"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg font-semibold text-base transition-all duration-200 hover:bg-[var(--grid-line)]/10"
              style={{
                color: "var(--grid-line)",
                border: "1px solid var(--grid-line)",
              }}
            >
              View Design System
            </Link>
          </div>
        </div>

        {/* Feature pills */}
        <div className="mt-20 flex flex-wrap gap-3 justify-center max-w-2xl animate-fade-in">
          {[
            "React Flow Canvas",
            "10+ Component Types",
            "Live Cursors",
            "AI Generation",
            "Export PNG/PDF",
            "Share Links",
          ].map((feature) => (
            <span
              key={feature}
              className="px-3 py-1.5 rounded-md text-xs font-medium"
              style={{
                backgroundColor: "var(--slate)",
                color: "var(--grid-line)",
                border: "1px solid var(--grid-line)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {feature}
            </span>
          ))}
        </div>
      </main>

      {/* Corner marks */}
      {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map(
        (pos) => (
          <span
            key={pos}
            className={`fixed ${pos} pointer-events-none select-none`}
            style={{
              color: "var(--grid-line)",
              opacity: 0.3,
              fontSize: "16px",
              fontFamily: "var(--font-mono)",
            }}
            aria-hidden="true"
          >
            ┼
          </span>
        )
      )}
    </div>
  );
}
