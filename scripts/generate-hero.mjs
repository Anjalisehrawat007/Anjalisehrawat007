// Generates the static hero banner (dark + light). Run once: node scripts/generate-hero.mjs
import { writeFileSync } from "node:fs";

const themes = {
  dark: { bg: "#0d1117", grid: "rgba(255,255,255,0.045)", fg: "#e6edf3", muted: "#8b949e", surface: "#161b22", border: "#30363d", accent: "#8f8ff9", accent2: "#2fc4dc", glow1: "rgba(143,143,249,0.20)", glow2: "rgba(47,196,220,0.14)" },
  light: { bg: "#ffffff", grid: "rgba(31,35,40,0.06)", fg: "#1f2328", muted: "#656d76", surface: "#f6f8fa", border: "#d0d7de", accent: "#4f46e5", accent2: "#0e8fa8", glow1: "rgba(79,70,229,0.14)", glow2: "rgba(14,143,168,0.12)" },
};
const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
const MONO = `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace`;
const STAGES = ["Input", "Data", "AI / ML", "Backend", "Application", "Deployment"];

function hero(t) {
  const W = 1200, H = 330;
  const y = 250, x0 = 70, gap = (W - 2 * x0) / (STAGES.length - 1);
  const nodes = STAGES.map((s, i) => ({ s, x: x0 + i * gap }));
  const path = `M ${nodes[0].x} ${y} L ${nodes[nodes.length - 1].x} ${y}`;
  const edges = nodes.slice(0, -1).map((n, i) => `<line x1="${n.x + 22}" y1="${y}" x2="${nodes[i + 1].x - 22}" y2="${y}" stroke="${t.border}" stroke-width="1.5"/>`).join("");
  const packets = [0, 1, 2].map((i) => `<circle r="3.5" fill="${t.accent2}"><animateMotion dur="7s" begin="${i * 2.3}s" repeatCount="indefinite" path="${path}" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur="7s" begin="${i * 2.3}s" repeatCount="indefinite"/></circle>`).join("");
  const nodeEls = nodes.map((n, i) => `
<g transform="translate(${n.x}, ${y})">
  <circle r="22" fill="${t.surface}" stroke="${t.border}" stroke-width="1.5"/>
  <circle r="22" fill="none" stroke="${t.accent}" stroke-width="1.5" opacity="0">
    <animate attributeName="opacity" values="0;0.9;0" keyTimes="0;0.5;1" dur="7s" begin="${(i / (STAGES.length - 1)) * 7 - 0.35}s" repeatCount="indefinite"/>
  </circle>
  <circle r="5" fill="${t.accent}"/>
  <text y="44" text-anchor="middle" font-family="${MONO}" font-size="11" letter-spacing="1.5" fill="${t.muted}">${n.s.toUpperCase()}</text>
  <text y="-34" text-anchor="middle" font-family="${MONO}" font-size="10" fill="${t.border}">0${i + 1}</text>
</g>`).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Anjali Sehrawat — Software Engineer, AI/ML, Full-Stack. Systems pipeline: input, data, AI/ML, backend, application, deployment.">
<defs>
  <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="${t.grid}" stroke-width="1"/></pattern>
  <radialGradient id="g1" cx="0.15" cy="0.1" r="0.6"><stop offset="0" stop-color="${t.glow1}"/><stop offset="1" stop-color="${t.glow1}" stop-opacity="0"/></radialGradient>
  <radialGradient id="g2" cx="0.9" cy="0.9" r="0.6"><stop offset="0" stop-color="${t.glow2}"/><stop offset="1" stop-color="${t.glow2}" stop-opacity="0"/></radialGradient>
  <linearGradient id="word" x1="0" x2="1"><stop offset="0" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.accent2}"/></linearGradient>
  <clipPath id="clip"><rect width="${W}" height="${H}" rx="18"/></clipPath>
</defs>
<g clip-path="url(#clip)">
  <rect width="${W}" height="${H}" fill="${t.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>
</g>
<rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="18" fill="none" stroke="${t.border}"/>
<text x="70" y="64" font-family="${MONO}" font-size="12" letter-spacing="3" fill="${t.accent}">SOFTWARE ENGINEER · AI/ML · FULL-STACK</text>
<text x="70" y="126" font-family="${FONT}" font-size="58" font-weight="700" letter-spacing="-1.5" fill="${t.fg}">Anjali Sehrawat</text>
<text x="70" y="166" font-family="${FONT}" font-size="20" fill="${t.muted}">I build <tspan fill="url(#word)" font-weight="600">intelligent</tspan>, end-to-end software systems — from model to deployment.</text>
${edges}${packets}${nodeEls}
</svg>`;
}

for (const [name, t] of Object.entries(themes)) writeFileSync(`assets/hero-${name}.svg`, hero(t));
console.log("hero written");
