// Static, hand-designed visuals for the profile (dark + light).
// Run once: node scripts/generate-visuals.mjs → assets/{boot,engineering-map,constellation}-{dark,light}.svg
import { writeFileSync } from "node:fs";

const themes = {
  dark:  { bg: "#0d1117", panel: "#161b22", border: "#30363d", grid: "rgba(255,255,255,0.04)", fg: "#e6edf3", muted: "#8b949e", dim: "#484f58", accent: "#8f8ff9", accent2: "#2fc4dc", ok: "#3fb950", warn: "#d29922", glow1: "rgba(143,143,249,0.18)", glow2: "rgba(47,196,220,0.12)" },
  light: { bg: "#ffffff", panel: "#f6f8fa", border: "#d0d7de", grid: "rgba(31,35,40,0.05)", fg: "#1f2328", muted: "#656d76", dim: "#8c959f", accent: "#4f46e5", accent2: "#0e8fa8", ok: "#1a7f37", warn: "#9a6700", glow1: "rgba(79,70,229,0.12)", glow2: "rgba(14,143,168,0.10)" },
};
const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
const MONO = `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace`;

const frame = (t, W, H, id) => `<defs>
  <pattern id="grid-${id}" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="${t.grid}" stroke-width="1"/></pattern>
  <radialGradient id="g1-${id}" cx="0.1" cy="0" r="0.7"><stop offset="0" stop-color="${t.glow1}"/><stop offset="1" stop-color="${t.glow1}" stop-opacity="0"/></radialGradient>
  <radialGradient id="g2-${id}" cx="0.95" cy="1" r="0.7"><stop offset="0" stop-color="${t.glow2}"/><stop offset="1" stop-color="${t.glow2}" stop-opacity="0"/></radialGradient>
  <clipPath id="clip-${id}"><rect width="${W}" height="${H}" rx="18"/></clipPath>
  <filter id="soft-${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
<g clip-path="url(#clip-${id})"><rect width="${W}" height="${H}" fill="${t.bg}"/><rect width="${W}" height="${H}" fill="url(#grid-${id})"/><rect width="${W}" height="${H}" fill="url(#g1-${id})"/><rect width="${W}" height="${H}" fill="url(#g2-${id})"/></g>
<rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="18" fill="none" stroke="${t.border}"/>`;

/* ============================ 1. BOOT HERO ============================ */
function boot(t) {
  const W = 1000, H = 440;
  const lines = [
    ["IDENTITY", "Anjali Sehrawat", 0.2],
    ["ROLE", "Software Engineer", 0.6],
    ["FOCUS", "AI / ML  ·  Full-Stack  ·  Backend", 1.0],
    ["CURRENT BUILD", "RareCare · AI diagnostic assistant", 1.4],
  ];
  const bootLines = lines.map(([k, v, d], i) => `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${d}s" dur="0.35s" fill="freeze"/>
<text x="64" y="${168 + i * 40}" font-family="${MONO}" font-size="12" letter-spacing="2" fill="${t.muted}">${k}</text>
<text x="230" y="${168 + i * 40}" font-family="${FONT}" font-size="${i === 0 ? 24 : 18}" font-weight="${i === 0 ? 700 : 500}" fill="${t.fg}">${v}</text></g>`).join("");
  // pipeline (right column)
  const stages = ["DATA", "AI / ML", "BACKEND", "APP", "DEPLOY"];
  const px = 700, py0 = 150, gap = 58;
  const pipe = stages.map((s, i) => `<g transform="translate(${px}, ${py0 + i * gap})">
<circle r="7" fill="${t.panel}" stroke="${t.border}" stroke-width="1.5"/><circle r="3" fill="${t.accent}"/>
<text x="22" y="4" font-family="${MONO}" font-size="12" letter-spacing="2" fill="${t.muted}">${s}</text></g>`).join("");
  const pipePath = `M ${px} ${py0} L ${px} ${py0 + (stages.length - 1) * gap}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="ANJALI.SYS boot screen — Identity: Anjali Sehrawat. Role: Software Engineer. Focus: AI/ML, Full-Stack, Backend. Current build: RareCare. System status: online.">
${frame(t, W, H, "b")}
<!-- title bar -->
<text x="64" y="70" font-family="${MONO}" font-size="13" letter-spacing="4" fill="${t.accent}">ANJALI.SYS</text>
<text x="200" y="70" font-family="${MONO}" font-size="13" letter-spacing="2" fill="${t.dim}">// ENGINEERING PROFILE</text>
<line x1="64" y1="92" x2="${W - 64}" y2="92" stroke="${t.border}"/>
<!-- boot line with cursor -->
<text x="64" y="122" font-family="${MONO}" font-size="13" fill="${t.muted}">&gt; booting engineering profile</text>
<rect x="290" y="111" width="8" height="14" fill="${t.accent}"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect>
<!-- boot lines -->
${bootLines}
<!-- status -->
<g transform="translate(64, 346)">
  <text font-family="${MONO}" font-size="12" letter-spacing="2" fill="${t.muted}">SYSTEM STATUS</text>
  <g transform="translate(166, -5)">
    <circle r="5" fill="${t.warn}"><animate attributeName="fill" to="${t.ok}" begin="1.9s" dur="0.3s" fill="freeze"/></circle>
    <circle r="5" fill="none" stroke="${t.ok}" stroke-width="1.5" opacity="0"><animate attributeName="opacity" values="0;0.8;0" begin="1.9s" dur="2.4s" repeatCount="indefinite"/><animate attributeName="r" values="5;12" begin="1.9s" dur="2.4s" repeatCount="indefinite"/></circle>
    <text x="14" y="4" font-family="${MONO}" font-size="13" letter-spacing="2" fill="${t.warn}">INITIALIZING<animate attributeName="opacity" from="1" to="0" begin="1.7s" dur="0.2s" fill="freeze"/></text>
    <text x="14" y="4" font-family="${MONO}" font-size="13" letter-spacing="2" fill="${t.ok}" opacity="0">ONLINE<animate attributeName="opacity" from="0" to="1" begin="1.9s" dur="0.3s" fill="freeze"/></text>
  </g>
</g>
<text x="64" y="392" font-family="${MONO}" font-size="12" letter-spacing="2" fill="${t.dim}" opacity="0">ENGINEERING PROFILE INITIALIZED<animate attributeName="opacity" from="0" to="1" begin="2.3s" dur="0.4s" fill="freeze"/></text>
<!-- pipeline -->
<text x="${px - 8}" y="120" font-family="${MONO}" font-size="11" letter-spacing="2" fill="${t.dim}">SYSTEM PIPELINE</text>
<path d="${pipePath}" fill="none" stroke="${t.border}" stroke-width="1.5"/>
${pipe}
<circle r="3.5" fill="${t.accent2}"><animateMotion dur="4.5s" repeatCount="indefinite" path="${pipePath}" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="4.5s" repeatCount="indefinite"/></circle>
<circle r="3.5" fill="${t.accent2}"><animateMotion dur="4.5s" begin="2.2s" repeatCount="indefinite" path="${pipePath}" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="4.5s" begin="2.2s" repeatCount="indefinite"/></circle>
<!-- scan line -->
<rect x="1" y="0" width="${W - 2}" height="2" fill="${t.accent}" opacity="0.25"><animate attributeName="y" from="0" to="${H}" dur="6s" repeatCount="indefinite"/></rect>
</svg>`;
}

/* ============================ 2. ENGINEERING MAP ============================ */
function map(t) {
  const W = 1200, H = 560;
  const node = (x, y, label, sub, kind) => {
    const w = Math.max(96, label.length * 9 + 28), h = sub ? 48 : 36;
    const stroke = kind === "root" ? t.accent : kind === "project" ? t.accent2 : t.border;
    return `<g transform="translate(${x - w / 2}, ${y - h / 2})"><rect width="${w}" height="${h}" rx="9" fill="${t.panel}" stroke="${stroke}" stroke-width="${kind === "root" ? 2 : 1.25}"/>
<text x="${w / 2}" y="${sub ? 20 : 23}" text-anchor="middle" font-family="${kind === "project" ? FONT : MONO}" font-size="${kind === "root" ? 14 : 13}" font-weight="${kind === "project" || kind === "root" ? 700 : 500}" letter-spacing="${kind === "project" ? 0 : 1}" fill="${t.fg}">${label}</text>
${sub ? `<text x="${w / 2}" y="37" text-anchor="middle" font-family="${MONO}" font-size="10" fill="${t.muted}">${sub}</text>` : ""}</g>`;
  };
  const N = {
    root: [600, 56], ai: [300, 160], sw: [640, 160], cloud: [980, 160],
    nlp: [160, 268], cv: [300, 268], dl: [440, 268], be: [560, 268], web3: [720, 268], docker: [900, 268], gcp: [1060, 268],
    rare: [150, 400], shoulder: [380, 400], grid: [630, 400], sigil: [860, 400],
  };
  const edges = [["root","ai"],["root","sw"],["root","cloud"],["ai","nlp"],["ai","cv"],["ai","dl"],["sw","be"],["sw","web3"],["cloud","docker"],["cloud","gcp"],["nlp","rare"],["cv","shoulder"],["dl","grid"],["dl","rare"],["be","shoulder"],["web3","sigil"],["be","rare"]];
  const pathOf = ([a, b]) => { const [x1, y1] = N[a], [x2, y2] = N[b]; const my = (y1 + y2) / 2; return `M ${x1} ${y1 + 18} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2 - 18}`; };
  const flow = new Set(["nlp-rare", "cv-shoulder", "dl-grid", "web3-sigil"]);
  const edgeEls = edges.map((e) => {
    const d = pathOf(e), k = e.join("-"), animated = flow.has(k);
    return `<path d="${d}" fill="none" stroke="${animated ? t.accent2 : t.border}" stroke-width="${animated ? 1.5 : 1.25}" ${animated ? `stroke-dasharray="4 6"` : ""}>${animated ? `<animate attributeName="stroke-dashoffset" from="0" to="-40" dur="2.4s" repeatCount="indefinite"/>` : ""}</path>` +
      (animated ? `<circle r="3" fill="${t.accent2}"><animateMotion dur="3.2s" begin="${(Object.keys(N).indexOf(e[1]) % 4) * 0.8}s" repeatCount="indefinite" path="${d}"/></circle>` : "");
  }).join("");
  const lane = (y, label) => `<text x="40" y="${y + 4}" font-family="${MONO}" font-size="10" letter-spacing="2" fill="${t.dim}">${label}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Engineering map: Anjali → AI/ML (NLP, computer vision, deep learning), Software engineering (backend, Web3 and security), Cloud (Docker, AWS/GCP) → projects RareCare, ShoulderMotion AI, Power Grid Prediction, Sigil.">
${frame(t, W, H, "m")}
${lane(56, "IDENTITY")}${lane(160, "ENGINEERING")}${lane(268, "TECHNOLOGY")}${lane(400, "PROJECTS")}
${edgeEls}
${node(...N.root, "ANJALI · ENGINEERING", null, "root")}
${node(...N.ai, "AI / ML", "PyTorch · Transformers · Scikit-learn")}
${node(...N.sw, "SOFTWARE ENGINEERING", "APIs · full-stack · auth")}
${node(...N.cloud, "CLOUD", "containers · deployment")}
${node(...N.nlp, "NLP", "BioBERT")}${node(...N.cv, "COMPUTER VISION", "MediaPipe · CNN")}${node(...N.dl, "DEEP LEARNING", "LSTM · CNN")}
${node(...N.be, "BACKEND", "FastAPI · Flask")}${node(...N.web3, "WEB3 / SECURITY", "Ethereum · IPFS · WebAuthn · ZK")}
${node(...N.docker, "DOCKER", null)}${node(...N.gcp, "AWS / GCP", null)}
${node(...N.rare, "RareCare", "in development", "project")}${node(...N.shoulder, "ShoulderMotion AI", "live · open source", "project")}${node(...N.grid, "Power Grid Prediction", "repository", "project")}${node(...N.sigil, "Sigil", "live demo · Sepolia", "project")}
<text x="${W - 40}" y="${H - 28}" text-anchor="end" font-family="${MONO}" font-size="11" letter-spacing="1" fill="${t.dim}">TECHNOLOGY → ENGINEERING → PROJECT · animated edges = shipped systems</text>
</svg>`;
}

/* ============================ 3. PROJECT CONSTELLATION ============================ */
function constellation(t) {
  const W = 1200, H = 480, cx = 600, cy = 240;
  const P = [
    { n: "SIGIL", s: "Self-sovereign identity", tech: "Ethereum · IPFS · WebAuthn", st: "LIVE DEMO", c: t.ok, x: 600, y: 84 },
    { n: "SHOULDERMOTION AI", s: "Clinical motion analysis", tech: "MediaPipe · FastAPI · Flutter", st: "LIVE · OPEN SOURCE", c: t.ok, x: 930, y: 240 },
    { n: "POWER GRID", s: "Failure prediction", tech: "LSTM · multivariate streams", st: "REPOSITORY", c: t.accent2, x: 600, y: 396 },
    { n: "RARECARE", s: "AI diagnostic assistant", tech: "BioBERT · CNN · MedMNIST", st: "IN DEVELOPMENT", c: t.warn, x: 270, y: 240 },
  ];
  const orbit = `<circle cx="${cx}" cy="${cy}" r="156" fill="none" stroke="${t.border}" stroke-dasharray="3 7"><animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="90s" repeatCount="indefinite"/></circle>
<circle cx="${cx}" cy="${cy}" r="340" fill="none" stroke="${t.border}" opacity="0.5" stroke-dasharray="2 10"><animateTransform attributeName="transform" type="rotate" from="360 ${cx} ${cy}" to="0 ${cx} ${cy}" dur="140s" repeatCount="indefinite"/></circle>`;
  const links = P.map((p, i) => { const d = `M ${cx} ${cy} L ${p.x} ${p.y}`; return `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="${t.border}" stroke-width="1.25"/><circle r="3" fill="${p.c}"><animateMotion dur="3s" begin="${i * 0.75}s" repeatCount="indefinite" path="${d}"/><animate attributeName="opacity" values="0;1;0" dur="3s" begin="${i * 0.75}s" repeatCount="indefinite"/></circle>`; }).join("");
  const nodes = P.map((p) => { const w = 280, h = 92, x = p.x - w / 2, y = p.y - h / 2; return `<g transform="translate(${x}, ${y})">
<rect width="${w}" height="${h}" rx="12" fill="${t.panel}" stroke="${t.border}"/>
<rect width="${w}" height="${h}" rx="12" fill="none" stroke="${p.c}" opacity="0.35"/>
<circle cx="18" cy="20" r="4" fill="${p.c}"><animate attributeName="opacity" values="1;0.35;1" dur="2.6s" repeatCount="indefinite"/></circle>
<text x="30" y="24" font-family="${MONO}" font-size="12" font-weight="700" letter-spacing="2" fill="${t.fg}">${p.n}</text>
<text x="18" y="44" font-family="${FONT}" font-size="12" fill="${t.muted}">${p.s}</text>
<text x="18" y="64" font-family="${MONO}" font-size="10" fill="${t.dim}">${p.tech}</text>
<text x="${w - 14}" y="80" text-anchor="end" font-family="${MONO}" font-size="9" letter-spacing="1.5" fill="${p.c}">${p.st}</text>
</g>`; }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Project constellation: Sigil (live demo), ShoulderMotion AI (live, open source), Power Grid Prediction (repository), RareCare (in development), connected to Anjali's engineering.">
${frame(t, W, H, "c")}
${orbit}${links}
<g transform="translate(${cx}, ${cy})">
  <circle r="58" fill="${t.accent}" opacity="0.18" filter="url(#soft-c)"/>
  <circle r="46" fill="${t.panel}" stroke="${t.accent}" stroke-width="2"/>
  <text y="-2" text-anchor="middle" font-family="${MONO}" font-size="10" letter-spacing="2" fill="${t.muted}">ANJALI</text>
  <text y="12" text-anchor="middle" font-family="${MONO}" font-size="9" letter-spacing="1.5" fill="${t.accent}">ENGINEERING</text>
</g>
${nodes}
</svg>`;
}

for (const [name, t] of Object.entries(themes)) {
  writeFileSync(`assets/boot-${name}.svg`, boot(t));
  writeFileSync(`assets/engineering-map-${name}.svg`, map(t));
  writeFileSync(`assets/constellation-${name}.svg`, constellation(t));
}
console.log("visuals written");
