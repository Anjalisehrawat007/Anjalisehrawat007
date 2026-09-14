// Generates profile dashboard assets from REAL GitHub data.
// Runs in GitHub Actions (see .github/workflows/profile.yml) and locally:
//   GITHUB_TOKEN=... node scripts/generate-profile.mjs
// Outputs: assets/stats-{dark,light}.svg, assets/activity-{dark,light}.svg
// and rewrites the README block between <!-- ACTIVITY:START --> … <!-- ACTIVITY:END -->.
import { readFileSync, writeFileSync } from "node:fs";

const USER = "Anjalisehrawat007";
const API = "https://api.github.com";
const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "profile-generator",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function get(path) {
  const r = await fetch(`${API}${path}`, { headers });
  if (!r.ok) throw new Error(`${path} → ${r.status}`);
  return r.json();
}

/* ---------------- data ---------------- */
const user = await get(`/users/${USER}`);
const repos = (await get(`/users/${USER}/repos?per_page=100&type=owner&sort=pushed`)).filter((r) => !r.fork);
const stars = repos.reduce((a, r) => a + r.stargazers_count, 0);

// Commits authored in the last 30 days, counted per repository via the commits
// API (the public Events API lags and is capped, so it is not used).
const sinceIso = new Date(Date.now() - 30 * 86_400_000).toISOString();
let commits30d = 0, activeRepos30d = 0;
for (const r of repos) {
  if (new Date(r.pushed_at) < new Date(sinceIso)) continue;
  try {
    const cs = await get(`/repos/${USER}/${r.name}/commits?since=${sinceIso}&per_page=100`);
    const mine = cs.filter((c) => c.author?.login === USER || c.commit?.author?.name?.toLowerCase().includes("anjali"));
    if (mine.length) { commits30d += mine.length; activeRepos30d += 1; }
  } catch { /* empty repo → 409; skip */ }
}

// Language distribution by bytes across own repos (real per-repo language data).
const langBytes = new Map();
for (const r of repos) {
  const langs = await get(`/repos/${USER}/${r.name}/languages`);
  for (const [k, v] of Object.entries(langs)) langBytes.set(k, (langBytes.get(k) ?? 0) + v);
}
const langTotal = [...langBytes.values()].reduce((a, b) => a + b, 0);
const languages = [...langBytes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  .map(([name, bytes]) => ({ name, pct: langTotal ? (bytes / langTotal) * 100 : 0 }));

const recent = repos.filter((r) => r.name !== USER).slice(0, 5);
const updated = new Date().toISOString().slice(0, 10);

const LANG_COLORS = { Python: "#3572A5", TypeScript: "#3178c6", JavaScript: "#f1e05a", HTML: "#e34c26", CSS: "#563d7c", Java: "#b07219", "C++": "#f34b7d", C: "#555555", Dart: "#00B4AB", Solidity: "#AA6746", "Jupyter Notebook": "#DA5B0B", Shell: "#89e051", Makefile: "#427819", Dockerfile: "#384d54" };

/* ---------------- themes ---------------- */
const themes = {
  dark: { bg: "#0d1117", surface: "#161b22", border: "#30363d", fg: "#e6edf3", muted: "#8b949e", accent: "#8f8ff9", accent2: "#2fc4dc" },
  light: { bg: "#ffffff", surface: "#f6f8fa", border: "#d0d7de", fg: "#1f2328", muted: "#656d76", accent: "#4f46e5", accent2: "#0e8fa8" },
};
const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
const MONO = `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rel = (iso) => { const d = Math.floor((Date.now() - new Date(iso)) / 86_400_000); return d === 0 ? "today" : d < 30 ? `${d}d ago` : d < 365 ? `${Math.floor(d / 30)}mo ago` : `${Math.floor(d / 365)}y ago`; };

/* ---------------- stats card ---------------- */
function statsSvg(t) {
  const W = 800, H = 210;
  const metrics = [
    { v: user.public_repos, l: "Public repos" },
    { v: stars, l: "Stars" },
    { v: user.followers, l: "Followers" },
    { v: commits30d, l: "Commits · 30d", hint: `${activeRepos30d} repo${activeRepos30d === 1 ? "" : "s"}` },
  ];
  const barX = 40, barW = 720, barY = 150;
  let x = barX;
  const bars = languages.map((l) => { const w = (l.pct / 100) * barW; const r = `<rect x="${x.toFixed(1)}" y="${barY}" width="${Math.max(w, 1).toFixed(1)}" height="8" fill="${LANG_COLORS[l.name] ?? t.muted}"/>`; x += w; return r; }).join("");
  const legend = languages.map((l, i) => `<g transform="translate(${barX + i * 120}, ${barY + 30})"><circle cx="5" cy="-4" r="4" fill="${LANG_COLORS[l.name] ?? t.muted}"/><text x="14" y="0" font-family="${FONT}" font-size="12" fill="${t.fg}">${esc(l.name)}</text><text x="14" y="16" font-family="${MONO}" font-size="11" fill="${t.muted}">${l.pct.toFixed(0)}%</text></g>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="GitHub statistics for ${USER}">
<rect width="${W}" height="${H}" rx="14" fill="${t.bg}" stroke="${t.border}"/>
<text x="40" y="38" font-family="${MONO}" font-size="11" letter-spacing="2" fill="${t.accent}">ENGINEERING ACTIVITY</text>
<text x="760" y="38" text-anchor="end" font-family="${MONO}" font-size="11" fill="${t.muted}">live from GitHub API · ${updated}</text>
${metrics.map((m, i) => `<g transform="translate(${40 + i * 180}, 62)"><rect width="164" height="60" rx="10" fill="${t.surface}" stroke="${t.border}"/><text x="14" y="34" font-family="${FONT}" font-size="26" font-weight="700" fill="${t.fg}">${m.v}</text><text x="14" y="50" font-family="${FONT}" font-size="11" fill="${t.muted}">${m.l}${m.hint ? ` · ${m.hint}` : ""}</text></g>`).join("")}
<text x="40" y="142" font-family="${MONO}" font-size="10" letter-spacing="1.5" fill="${t.muted}">LANGUAGES · BY BYTES ACROSS OWN REPOSITORIES</text>
<rect x="${barX}" y="${barY}" width="${barW}" height="8" rx="4" fill="${t.surface}"/>
<g clip-path="inset(0 round 4px)">${bars}</g>
${legend}
</svg>`;
}

/* ---------------- recent activity card ---------------- */
function activitySvg(t) {
  const W = 800, rowH = 34, H = 70 + recent.length * rowH;
  const rows = recent.map((r, i) => {
    const y = 66 + i * rowH;
    const color = LANG_COLORS[r.language] ?? t.muted;
    return `<g transform="translate(40, ${y})">
<circle cx="6" cy="0" r="4" fill="${color}"/>
<text x="20" y="4" font-family="${FONT}" font-size="14" font-weight="600" fill="${t.fg}">${esc(r.name)}</text>
<text x="500" y="4" font-family="${MONO}" font-size="11" fill="${t.muted}">${esc(r.language ?? "—")}</text>
<text x="640" y="4" font-family="${MONO}" font-size="11" fill="${t.muted}">★ ${r.stargazers_count}</text>
<text x="760" y="4" text-anchor="end" font-family="${MONO}" font-size="11" fill="${t.accent2}">pushed ${rel(r.pushed_at)}</text>
</g>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Recently active repositories">
<rect width="${W}" height="${H}" rx="14" fill="${t.bg}" stroke="${t.border}"/>
<text x="40" y="38" font-family="${MONO}" font-size="11" letter-spacing="2" fill="${t.accent}">RECENTLY ACTIVE REPOSITORIES</text>
<text x="760" y="38" text-anchor="end" font-family="${MONO}" font-size="11" fill="${t.muted}">most recent push first</text>
${rows}
</svg>`;
}

for (const [name, t] of Object.entries(themes)) {
  writeFileSync(`assets/stats-${name}.svg`, statsSvg(t));
  writeFileSync(`assets/activity-${name}.svg`, activitySvg(t));
}

/* ---------------- README text block (accessible, indexable) ---------------- */
const block = [
  `<!-- ACTIVITY:START -->`,
  `| Repository | Language | Last push |`,
  `|---|---|---|`,
  ...recent.map((r) => `| [${r.name}](${r.html_url}) | ${r.language ?? "—"} | ${rel(r.pushed_at)} |`),
  ``,
  `<sub>Auto-updated ${updated} from the GitHub API · ${user.public_repos} public repos · ${commits30d} commits pushed in the last 30 days</sub>`,
  `<!-- ACTIVITY:END -->`,
].join("\n");
const readme = readFileSync("README.md", "utf8");
if (readme.includes("<!-- ACTIVITY:START -->")) {
  writeFileSync("README.md", readme.replace(/<!-- ACTIVITY:START -->[\s\S]*?<!-- ACTIVITY:END -->/, block));
}
console.log(`ok · ${user.public_repos} repos · ${stars} stars · ${commits30d} commits/30d · ${languages.map((l) => l.name).join(", ")}`);
