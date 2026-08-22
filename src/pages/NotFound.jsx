import { motion } from "framer-motion";
export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f4f7ff]">
      {/* ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(800px 520px at 18% 12%, rgba(79,110,247,0.10), transparent 60%), radial-gradient(700px 500px at 88% 88%, rgba(255,140,180,0.10), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-12">
        <Illustration />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 text-center text-2xl font-bold tracking-tight text-slate-900 md:text-4xl"
        >
          Oops, looks like we <span className="text-[#3b5bff]">towed the page</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-md text-center text-sm text-slate-500 md:text-base"
        >
          The page you're looking for seems to have driven away. Let's help you get
          back on track.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-full bg-[#3b5bff] px-7 py-3 text-sm font-semibold text-white shadow-[0_15px_40px_-12px_rgba(59,91,255,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-12px_rgba(59,91,255,0.8)]"
          >
            Back to Dashboard
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300"
          >
            Go Home
          </a>
        </motion.div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   SVG scene
   ──────────────────────────────────────────────────────────── */

function Illustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-3xl"
    >
      <svg
        viewBox="0 0 900 480"
        className="h-auto w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bodyBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b7bff" />
            <stop offset="100%" stopColor="#2a44d9" />
          </linearGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dfe8ff" />
            <stop offset="100%" stopColor="#a9baff" />
          </linearGradient>
          <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4f6fb" />
            <stop offset="50%" stopColor="#c8cfdd" />
            <stop offset="100%" stopColor="#8a94a8" />
          </linearGradient>
          <linearGradient id="bed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e6ecfb" />
          </linearGradient>
          <radialGradient id="beam" cx="0" cy="0.5" r="1">
            <stop offset="0%" stopColor="#ffe57a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffe57a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ground shadow */}
        <ellipse cx="450" cy="430" rx="360" ry="10" fill="#0f172a" opacity="0.08" />

        {/* animated road */}
        <line x1="40" y1="418" x2="860" y2="418" stroke="#0f172a" strokeWidth="2" opacity="0.15" />
        <motion.line
          x1="40" y1="418" x2="860" y2="418"
          stroke="#0f172a" strokeWidth="2" strokeLinecap="round"
          strokeDasharray="14 18"
          animate={{ strokeDashoffset: [0, -64] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />

        {/* sparkles */}
        <Sparkle x={120} y={90} delay={0.2} />
        <Sparkle x={760} y={70} delay={0.6} />
        <Sparkle x={690} y={210} delay={1.0} />
        <Sparkle x={170} y={220} delay={0.8} />
        <Sparkle x={450} y={44} delay={0.4} />

        {/* ============ 404 SIGN ============ */}
        <motion.g
          style={{ transformOrigin: "580px 200px" }}
          animate={{ rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* cable */}
          <path
            d="M355 232 Q400 210 425 190"
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* browser window */}
          <rect x="425" y="90" width="330" height="230" rx="16" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
          <rect x="425" y="90" width="330" height="42" rx="16" fill="#f2f5ff" stroke="#0f172a" strokeWidth="3" />
          <circle cx="720" cy="112" r="7" fill="#fff" stroke="#0f172a" strokeWidth="2" />
          <circle cx="696" cy="112" r="7" fill="#fff" stroke="#0f172a" strokeWidth="2" />
          <circle cx="672" cy="112" r="7" fill="#fff" stroke="#0f172a" strokeWidth="2" />
          <path d="M716 108 l8 8 M724 108 l-8 8" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
          <text
            x="590" y="245"
            textAnchor="middle"
            fontFamily="'SF Pro Display', Inter, sans-serif"
            fontWeight="900" fontSize="104" fill="#3b5bff"
          >404</text>
          <line x1="470" y1="278" x2="710" y2="278" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="500" y1="293" x2="680" y2="293" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        </motion.g>

        {/* ============ TOW TRUCK ============ */}
        <motion.g
          animate={{ y: [0, -1.5, 0] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* --- flat bed (tilted) --- */}
          <path
            d="M170 370 L365 370 L365 300 L215 300 Z"
            fill="url(#bed)"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* bed diamond-plate texture */}
          <g opacity="0.25" stroke="#0f172a" strokeWidth="1">
            <line x1="225" y1="315" x2="355" y2="315" />
            <line x1="235" y1="330" x2="355" y2="330" />
            <line x1="245" y1="345" x2="355" y2="345" />
            <line x1="255" y1="360" x2="355" y2="360" />
          </g>
          {/* bed rear rail */}
          <rect x="360" y="292" width="10" height="82" rx="2" fill="#0f172a" />
          {/* bed side skirt */}
          <path d="M170 370 L365 370 L365 382 L170 382 Z" fill="#0f172a" />

          {/* --- hydraulic boom --- */}
          {/* base pivot */}
          <rect x="285" y="278" width="26" height="16" rx="3" fill="#3b5bff" stroke="#0f172a" strokeWidth="2" />
          <circle cx="298" cy="286" r="3" fill="#0f172a" />
          {/* inner cylinder */}
          <rect
            x="292" y="230" width="12" height="60" rx="3"
            fill="url(#chrome)" stroke="#0f172a" strokeWidth="2"
            transform="rotate(-38 298 260)"
          />
          {/* extended boom */}
          <rect
            x="288" y="210" width="20" height="80" rx="4"
            fill="#3b5bff" stroke="#0f172a" strokeWidth="2.5"
            transform="rotate(-38 298 250)"
          />
          {/* pulley */}
          <circle cx="355" cy="212" r="8" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="355" cy="212" r="2.5" fill="#0f172a" />
          {/* hook */}
          <path
            d="M355 220 L355 232 Q355 240 363 240 L363 234"
            stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round"
          />

          {/* --- chassis frame rails --- */}
          <rect x="40" y="370" width="325" height="8" fill="#0f172a" />
          <rect x="60" y="360" width="300" height="4" fill="#0f172a" opacity="0.5" />

          {/* --- fuel tank --- */}
          <rect x="180" y="352" width="34" height="18" rx="4" fill="url(#chrome)" stroke="#0f172a" strokeWidth="2" />
          <line x1="187" y1="355" x2="187" y2="367" stroke="#0f172a" strokeWidth="1" opacity="0.5" />
          <line x1="207" y1="355" x2="207" y2="367" stroke="#0f172a" strokeWidth="1" opacity="0.5" />

          {/* --- exhaust stack behind cab --- */}
          <rect x="152" y="200" width="8" height="90" rx="2" fill="url(#chrome)" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="156" cy="200" rx="6" ry="2.5" fill="#0f172a" />

          {/* --- cab body --- */}
          {/* hood */}
          <path
            d="M40 370 L40 320 Q40 306 54 306 L98 306 L98 240 Q98 226 112 226 L172 226 Q184 226 188 236 L210 306 L210 370 Z"
            fill="url(#bodyBlue)"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* hood highlight */}
          <path d="M45 316 L96 316 L96 310 L45 310 Z" fill="#ffffff" opacity="0.25" />

          {/* front fender arch */}
          <path
            d="M40 370 Q40 335 78 335 Q116 335 116 370"
            fill="none" stroke="#0f172a" strokeWidth="2.5"
          />

          {/* windshield (split with A-pillar) */}
          <path
            d="M108 236 L166 236 Q174 236 178 244 L200 300 L108 300 Z"
            fill="url(#glass)"
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line x1="140" y1="236" x2="152" y2="300" stroke="#0f172a" strokeWidth="2" />
          {/* glass reflection */}
          <path d="M114 244 L132 244 L124 296 L110 296 Z" fill="#ffffff" opacity="0.55" />
          <path d="M158 244 L172 244 L180 260 L164 296 L156 296 Z" fill="#ffffff" opacity="0.25" />

          {/* door seam + side panel */}
          <line x1="108" y1="306" x2="108" y2="370" stroke="#0f172a" strokeWidth="2" />
          {/* door handle */}
          <rect x="122" y="330" width="16" height="3" rx="1.5" fill="#0f172a" />
          {/* step */}
          <rect x="98" y="360" width="18" height="6" rx="1" fill="#0f172a" />

          {/* side mirror */}
          <line x1="108" y1="252" x2="94" y2="240" stroke="#0f172a" strokeWidth="2" />
          <rect x="82" y="234" width="14" height="18" rx="2" fill="url(#chrome)" stroke="#0f172a" strokeWidth="2" />

          {/* roof beacon */}
          <rect x="126" y="216" width="44" height="12" rx="3" fill="#ff5252" stroke="#0f172a" strokeWidth="2" />
          <motion.rect
            x="129" y="219" width="38" height="6" rx="2" fill="#ffd0d0"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* "TOW" badge on door */}
          <rect x="118" y="320" width="46" height="20" rx="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
          <text
            x="141" y="335" textAnchor="middle"
            fontFamily="'SF Pro Display', Inter, sans-serif"
            fontWeight="900" fontSize="12" fill="#3b5bff"
          >TOW</text>

          {/* grille */}
          <rect x="42" y="322" width="12" height="34" rx="2" fill="#0f172a" />
          <line x1="42" y1="330" x2="54" y2="330" stroke="#c8cfdd" strokeWidth="1.5" />
          <line x1="42" y1="338" x2="54" y2="338" stroke="#c8cfdd" strokeWidth="1.5" />
          <line x1="42" y1="346" x2="54" y2="346" stroke="#c8cfdd" strokeWidth="1.5" />

          {/* front bumper (chrome) */}
          <rect x="34" y="356" width="80" height="12" rx="3" fill="url(#chrome)" stroke="#0f172a" strokeWidth="2.5" />
          {/* tow hook on bumper */}
          <path d="M36 368 L36 374 L44 374" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* headlight */}
          <ellipse cx="52" cy="316" rx="9" ry="6" fill="#ffe57a" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="49" cy="314" rx="3" ry="2" fill="#ffffff" opacity="0.9" />

          {/* headlight beam */}
          <motion.path
            d="M42 316 L4 300 L4 332 Z"
            fill="url(#beam)"
            animate={{ opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* small fog lamp */}
          <circle cx="60" cy="345" r="3" fill="#ffd84a" stroke="#0f172a" strokeWidth="1.5" />

          {/* --- wheels: front + dual rear --- */}
          <Wheel cx={78} cy={382} r={26} />
          <Wheel cx={252} cy={382} r={26} />
          <Wheel cx={310} cy={382} r={26} />
        </motion.g>

        {/* exhaust puffs (rising from stack) */}
        <ExhaustPuff x={156} y={195} delay={0} />
        <ExhaustPuff x={148} y={182} delay={0.7} />
        <ExhaustPuff x={160} y={170} delay={1.3} />

        {/* faint pin */}
        <motion.g
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          opacity="0.5"
        >
          <path
            d="M820 210 c0 -14 -11 -25 -25 -25 s-25 11 -25 25 c0 18 25 45 25 45 s25 -27 25 -45 z"
            fill="#fff" stroke="#0f172a" strokeWidth="2.5"
          />
          <circle cx="795" cy="210" r="7" fill="#3b5bff" />
        </motion.g>
      </svg>
    </motion.div>
  );
}

function Wheel({ cx, cy, r = 24 }) {
  return (
    <g>
      {/* tire */}
      <circle cx={cx} cy={cy} r={r} fill="#141b2d" />
      <circle
        cx={cx}
        cy={cy}
        r={r - 1}
        fill="none"
        stroke="#3b4a68"
        strokeWidth="1.5"
        strokeDasharray="3 4"
      />
      {/* rim */}
      <circle
        cx={cx}
        cy={cy}
        r={r * 0.55}
        fill="#e5ecff"
        stroke="#0f172a"
        strokeWidth="2"
      />

      {/* spinning spokes */}
      <motion.g
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      >
        {[0, 45, 90, 135].map((deg) => (
          <line
            key={deg}
            x1={cx - r * 0.5}
            y1={cy}
            x2={cx + r * 0.5}
            y2={cy}
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${deg} ${cx} ${cy})`}
          />
        ))}
        <circle cx={cx} cy={cy} r={r * 0.18} fill="#0f172a" />
        <circle cx={cx} cy={cy} r={r * 0.08} fill="#e5ecff" />
      </motion.g>
    </g>
  );
}

/* ────────────────────────────────────────────────────────────
   Sparkle
   ──────────────────────────────────────────────────────────── */
function Sparkle({ x, y, delay }) {
  return (
    <motion.g
      style={{ transformOrigin: `${x}px ${y}px` }}
      animate={{
        scale: [0.5, 1.15, 0.5],
        opacity: [0.3, 1, 0.3],
        rotate: [0, 60, 0],
      }}
      transition={{
        duration: 2.6,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <path
        d={`M${x} ${y - 11} L${x + 3} ${y - 3} L${x + 11} ${y} L${x + 3} ${y + 3} L${x} ${y + 11} L${x - 3} ${y + 3} L${x - 11} ${y} L${x - 3} ${y - 3} Z`}
        fill="#3b5bff"
      />
    </motion.g>
  );
}

/* ────────────────────────────────────────────────────────────
   Exhaust puff
   ──────────────────────────────────────────────────────────── */
function ExhaustPuff({ x, y, delay }) {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r="7"
      fill="#cbd5f5"
      animate={{
        opacity: [0, 0.75, 0],
        scale: [0.4, 1.4, 2],
        y: [0, -18, -36],
      }}
      transition={{
        duration: 2.4,
        repeat: Infinity,
        ease: "easeOut",
        delay,
      }}
    />
  );
}