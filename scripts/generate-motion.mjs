// Generates the animated typing banner and tech-stack ticker in /assets.
// Pure SVG (SMIL) — renders inside GitHub's <img> sandbox, no third-party services.
// Usage: node scripts/generate-motion.mjs
import { writeFileSync } from "node:fs";

const FONT = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";
const themes = {
  dark: { bg: "#0d1117", border: "#30363d", fg: "#e6edf3", muted: "#7d8590", accent: "#8f8ff9", accent2: "#2fc4dc", pill: "#161b22" },
  light: { bg: "#ffffff", border: "#d0d7de", fg: "#1f2328", muted: "#656d76", accent: "#5b5bd6", accent2: "#0e8aa0", pill: "#f6f8fa" },
};
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// ── Typing banner ──────────────────────────────────────────────
const phrases = [
  "Building AI that ships — from model to production.",
  "BioBERT + CNNs for rare-disease screening.",
  "Zero-knowledge identity on Ethereum.",
  "LSTMs that predict grid failures before blackouts.",
  "Open to Software Engineering & AI/ML roles.",
];
function typing(t) {
  const W = 1000, H = 64, CH = 13.2, per = 4, total = phrases.length * per;
  const groups = phrases.map((p, i) => {
    const w = Math.ceil(p.length * CH) + 4;
    const s = i / phrases.length, e = (i + 1) / phrases.length, d = per / total;
    // key times: hidden → visible (start) → typed (35%) → hold → erase (90%) → hidden
    const kt = [0, s, s + d * 0.35, s + d * 0.85, s + d * 0.97, e, 1].map((x) => Math.min(1, x).toFixed(4));
    const fix = (arr) => arr.join(";");
    return `<clipPath id="c${i}"><rect x="72" y="0" height="${H}" width="0">
  <animate attributeName="width" dur="${total}s" repeatCount="indefinite" calcMode="linear" keyTimes="${fix(kt)}" values="0;0;${w};${w};0;0;0"/></rect></clipPath>
<g clip-path="url(#c${i})"><text x="72" y="40" font-family="${FONT}" font-size="22" fill="${t.fg}">${esc(p)}</text></g>
<rect y="20" width="11" height="26" fill="${t.accent}" opacity="0">
  <animate attributeName="x" dur="${total}s" repeatCount="indefinite" keyTimes="${fix(kt)}" values="72;72;${72 + w};${72 + w};72;72;72"/>
  <animate attributeName="opacity" dur="${total}s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;${kt[1]};${kt[5]}" values="0;1;0"/>
</rect>`;
  }).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(phrases.join(" · "))}">
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="${t.bg}" stroke="${t.border}"/>
<text x="32" y="40" font-family="${FONT}" font-size="22" fill="${t.accent2}">❯</text>
${groups}
</svg>`;
}

// ── Tech ticker ────────────────────────────────────────────────
const stack = ["Python", "PyTorch", "Hugging Face", "BioBERT", "LSTM", "MediaPipe", "FastAPI", "Flask", "Next.js", "React", "TypeScript", "Node.js", "MongoDB", "Solidity", "Ethereum", "IPFS", "WebAuthn", "Docker", "AWS", "GCP", "MLflow", "FAISS", "SQL", "Tableau"];
function ticker(t) {
  const W = 1000, H = 56;
  let x = 0;
  const pills = stack.map((s, i) => {
    const w = Math.ceil(s.length * 8.4) + 34, c = i % 2 ? t.accent2 : t.accent;
    const g = `<g transform="translate(${x},12)"><rect width="${w}" height="32" rx="16" fill="${t.pill}" stroke="${t.border}"/><circle cx="16" cy="16" r="4" fill="${c}"/><text x="27" y="21" font-family="${FONT}" font-size="13" fill="${t.fg}">${esc(s)}</text></g>`;
    x += w + 12;
    return g;
  }).join("");
  const span = x;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tech stack: ${esc(stack.join(", "))}">
<defs>
  <linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="${t.bg}"/><stop offset="0.06" stop-color="${t.bg}" stop-opacity="0"/><stop offset="0.94" stop-color="${t.bg}" stop-opacity="0"/><stop offset="1" stop-color="${t.bg}"/></linearGradient>
  <clipPath id="cl"><rect width="${W}" height="${H}" rx="12"/></clipPath>
</defs>
<g clip-path="url(#cl)"><rect width="${W}" height="${H}" fill="${t.bg}"/>
<g><animateTransform attributeName="transform" type="translate" from="0 0" to="${-span} 0" dur="${Math.round(span / 40)}s" repeatCount="indefinite"/>
<g>${pills}</g><g transform="translate(${span},0)">${pills}</g></g>
<rect width="${W}" height="${H}" fill="url(#fade)"/></g>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="none" stroke="${t.border}"/>
</svg>`;
}

for (const [name, t] of Object.entries(themes)) {
  writeFileSync(`assets/typing-${name}.svg`, typing(t));
  writeFileSync(`assets/ticker-${name}.svg`, ticker(t));
}
console.log("motion assets written");
