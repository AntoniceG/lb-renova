// Audit SEO des pages construites. À lancer APRÈS `npm run build` : `npm run audit:seo`.
// Lit le HTML prérendu (.next/server/app) et signale : titre ou description hors limites, titres en
// double, adresse canonique absente, plusieurs <h1>, JSON-LD illisible. Les pages fermées aux
// moteurs (`noindex` voulu : /merci, /eau) sont ignorées.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = ".next/server/app";
const NOINDEX_PAGES = new Set(["merci", "eau", "_not-found", "_global-error"]);
const TITLE_MAX = 60;
const DESC_MIN = 70;
const DESC_MAX = 155;

if (!existsSync(ROOT)) {
  console.error("Aucun build trouvé : lancez d'abord `npm run build`.");
  process.exit(1);
}

const htmlFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (path.endsWith(".html")) htmlFiles.push(path);
  }
})(ROOT);

const decode = (text) =>
  text
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");

const problems = [];
const titles = new Map();

for (const file of htmlFiles) {
  const page = relative(ROOT, file)
    .split(sep)
    .join("/")
    .replace(/\.html$/, "");
  if (NOINDEX_PAGES.has(page)) continue;
  const html = readFileSync(file, "utf8");
  const pick = (re) => {
    const match = html.match(re);
    return match ? decode(match[1]) : undefined;
  };
  const report = (message) => problems.push(`/${page === "index" ? "" : page} : ${message}`);

  const title = pick(/<title>([^<]*)<\/title>/);
  const description = pick(/<meta name="description" content="([^"]*)"/);
  const canonical = pick(/<link rel="canonical" href="([^"]*)"/);

  if (!title) report("titre absent");
  else {
    if (title.length > TITLE_MAX)
      report(`titre trop long (${title.length} > ${TITLE_MAX}) : ${title}`);
    titles.set(title, [...(titles.get(title) ?? []), page]);
  }
  if (!description) report("description absente");
  else if (description.length > DESC_MAX) report(`description trop longue (${description.length})`);
  else if (description.length < DESC_MIN) report(`description trop courte (${description.length})`);
  if (!canonical) report("adresse canonique absente");
  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) report("il doit y avoir exactement un <h1>");

  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch {
      report("JSON-LD illisible");
    }
  }
}

for (const [title, pages] of titles) {
  if (pages.length > 1) problems.push(`titre en double « ${title} » : ${pages.join(", ")}`);
}

if (problems.length === 0) {
  console.log(`Audit SEO : ${htmlFiles.length} pages lues, aucun problème.`);
} else {
  console.error(`Audit SEO : ${problems.length} problème(s)\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
