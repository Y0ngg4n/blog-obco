// scripts/migrate-ghost.mjs
//
// Reads ghost.sql directly and writes Astro content files.
// Images are copied from a local Ghost content folder.
//
// Usage:
//   node scripts/migrate-ghost.mjs <ghost.sql> <ghost-content-dir>
//
// Example:
//   node scripts/migrate-ghost.mjs \
//     ~/Nextcloud/Yggdrasil/NewKubernetes/nixos-k3s/ghost.sql \
//     ~/Documents/Downloads/93d053d8-9311-4b1b-9e1c-d8505af89ecb
//
// Requires: turndown, turndown-plugin-gfm
//   pnpm add -D turndown turndown-plugin-gfm

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "src", "content", "blog");
const LEGAL_DIR = path.join(ROOT, "src", "pages", "legal");
const PUBLIC_DIR = path.join(ROOT, "public");

const GHOST_URL = "https://blog.obco.pro";

// ---------------------------------------------------------------------------
// SQL dump parsing
// ---------------------------------------------------------------------------

// Walks the VALUES block of an INSERT and returns an array of rows, where
// each row is an array of raw SQL literals (still quoted) to be decoded.
function parseInsertRows(valuesBlock) {
  const rows = [];
  let i = 0;
  const len = valuesBlock.length;

  while (i < len) {
    while (i < len && valuesBlock[i] !== "(") i++;
    if (i >= len) break;
    i++; // skip '('

    const values = [];
    let current = "";
    let inString = false;

    while (i < len) {
      const ch = valuesBlock[i];

      if (inString) {
        if (ch === "\\") {
          current += ch + valuesBlock[i + 1];
          i += 2;
          continue;
        }
        if (ch === "'") {
          if (valuesBlock[i + 1] === "'") {
            current += "''";
            i += 2;
            continue;
          }
          inString = false;
          i++;
          continue;
        }
        current += ch;
        i++;
        continue;
      }

      if (ch === "'") {
        inString = true;
        i++;
        continue;
      }
      if (ch === ",") {
        values.push(current.trim());
        current = "";
        i++;
        continue;
      }
      if (ch === ")") {
        values.push(current.trim());
        i++;
        break;
      }

      current += ch;
      i++;
    }

    rows.push(values);
  }

  return rows;
}

function decodeSqlLiteral(raw) {
  if (raw === "NULL") return null;
  if (!raw.startsWith("'")) {
    const n = Number(raw);
    return Number.isNaN(n) ? raw : n;
  }
  let s = raw.slice(1, -1);
  // Order matters: handle doubled quotes first, then backslash escapes.
  s = s.replace(/''/g, "'");
  s = s.replace(/\\n/g, "\n");
  s = s.replace(/\\r/g, "\r");
  s = s.replace(/\\t/g, "\t");
  s = s.replace(/\\0/g, "\0");
  s = s.replace(/\\Z/g, "\x1a");
  s = s.replace(/\\b/g, "\b");
  s = s.replace(/\\\\/g, "\\");
  s = s.replace(/\\'/g, "'");
  s = s.replace(/\\"/g, '"');
  return s;
}

// Reads column order from the CREATE TABLE so we never hardcode positions.
function readColumnOrder(sql, tableName) {
  const re = new RegExp(`CREATE TABLE \`${tableName}\` \\(([\\s\\S]*?)\\n\\) ENGINE`, "i");
  const match = sql.match(re);
  if (!match) throw new Error(`CREATE TABLE for \`${tableName}\` not found`);

  const columns = [];
  const lineRe = /^\s*`([^`]+)`\s+/gm;
  let m;
  while ((m = lineRe.exec(match[1])) !== null) columns.push(m[1]);
  return columns;
}

// Returns the text between "INSERT INTO `table` VALUES" and the terminating
// semicolon, ignoring semicolons inside quoted strings.
function readInsertValues(sql, tableName) {
  const marker = `INSERT INTO \`${tableName}\` VALUES`;
  const start = sql.indexOf(marker);
  if (start === -1) throw new Error(`INSERT INTO \`${tableName}\` not found`);

  let i = start + marker.length;
  let inString = false;

  while (i < sql.length) {
    const ch = sql[i];

    if (inString) {
      if (ch === "\\") {
        i += 2;
        continue;
      }
      if (ch === "'") {
        if (sql[i + 1] === "'") {
          i += 2;
          continue;
        }
        inString = false;
      }
      i++;
      continue;
    }

    if (ch === "'") {
      inString = true;
      i++;
      continue;
    }
    if (ch === ";") break;
    i++;
  }

  return sql.slice(start + marker.length, i);
}

function parseTable(sql, tableName) {
  const columns = readColumnOrder(sql, tableName);
  const valuesBlock = readInsertValues(sql, tableName);
  const rawRows = parseInsertRows(valuesBlock);

  return rawRows.map((raw) => {
    const row = {};
    columns.forEach((col, idx) => {
      row[col] = decodeSqlLiteral(raw[idx]);
    });
    return row;
  });
}

// ---------------------------------------------------------------------------
// Ghost HTML cleanup
// ---------------------------------------------------------------------------

function cleanGhostHtml(html) {
  if (!html) return "";

  return (
    html
      .replaceAll("__GHOST_URL__", GHOST_URL)
      // Ghost bookmark cards: collapse to a plain paragraph link.
      .replace(
        /<figure class="kg-card kg-bookmark-card[^"]*">[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>[\s\S]*?<\/figure>/g,
        (_, href) => `<p><a href="${href}">${href}</a></p>`,
      )
      // Callout cards: convert to blockquote so the text survives.
      .replace(
        /<div class="kg-card kg-callout-card[^"]*">[\s\S]*?<div class="kg-callout-text">([\s\S]*?)<\/div>\s*<\/div>/g,
        "<blockquote>$1</blockquote>",
      )
      // Image figures: keep the inner <img>, drop the figure wrapper.
      .replace(
        /<figure class="kg-card kg-image-card[^"]*">([\s\S]*?)<\/figure>/g,
        (_, inner) => inner,
      )
  );
}

// ---------------------------------------------------------------------------
// HTML -> Markdown
// ---------------------------------------------------------------------------

function createTurndown() {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    hr: "---",
  });

  td.use(gfm);

  // Preserve the language hint on fenced code blocks so Shiki can highlight
  // them at build time.
  td.addRule("fencedCode", {
    filter: (node) =>
      node.nodeName === "PRE" && node.firstChild && node.firstChild.nodeName === "CODE",
    replacement: (_content, node) => {
      const codeEl = node.firstChild;
      const code = codeEl.textContent.replace(/\n$/, "");
      const cls = codeEl.getAttribute("class") || "";
      const langMatch = cls.match(/language-([\w+-]+)/);
      const lang = langMatch ? langMatch[1] : "";
      return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
    },
  });

  return td;
}

// ---------------------------------------------------------------------------
// Local asset copying
// ---------------------------------------------------------------------------

async function copyFromGhost(originalUrl, destAbs, ghostContentDir) {
  let urlPath;
  try {
    urlPath = new URL(originalUrl).pathname;
  } catch {
    throw new Error(`invalid url: ${originalUrl}`);
  }

  // /content/images/2023/05/foo.png -> images/2023/05/foo.png
  const relative = urlPath.replace(/^\/content\//, "");
  const source = path.join(ghostContentDir, relative);

  await fs.mkdir(path.dirname(destAbs), { recursive: true });
  await fs.copyFile(source, destAbs);
}

async function localizeImages(markdown, ghostContentDir) {
  const re = /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
  const found = [];
  let m;
  while ((m = re.exec(markdown)) !== null) {
    found.push({ full: m[0], alt: m[1], url: m[2] });
  }

  // Deduplicate by URL so we copy each file once.
  const seen = new Map();
  for (const item of found) {
    let urlPath;
    try {
      urlPath = new URL(item.url).pathname;
    } catch {
      continue;
    }
    if (!urlPath.startsWith("/content/images/")) continue;
    const localRel = urlPath.replace(/^\/content\/images\//, "/images/ghost/");
    if (!seen.has(item.url)) seen.set(item.url, localRel);
  }

  for (const [url, localRel] of seen) {
    const localAbs = path.join(PUBLIC_DIR, localRel);
    try {
      await fs.access(localAbs);
      continue; // already copied on a previous run
    } catch {}
    try {
      await copyFromGhost(url, localAbs, ghostContentDir);
      console.log(`  copy ${localRel}`);
    } catch (e) {
      console.warn(`  missing ${url}: ${e.message}`);
      seen.delete(url);
    }
  }

  let out = markdown;
  for (const [url, localRel] of seen) {
    out = out.split(`](${url})`).join(`](${localRel})`);
  }
  return out;
}

async function localizeHeroImage(featureImage, ghostContentDir) {
  if (!featureImage) return null;

  const url = featureImage.replaceAll("__GHOST_URL__", GHOST_URL);
  let urlPath;
  try {
    urlPath = new URL(url).pathname;
  } catch {
    return null;
  }
  if (!urlPath.startsWith("/content/images/")) return null;

  const localRel = urlPath.replace(/^\/content\/images\//, "/images/ghost/");
  const localAbs = path.join(PUBLIC_DIR, localRel);

  try {
    await fs.access(localAbs);
    return localRel;
  } catch {}

  try {
    await copyFromGhost(url, localAbs, ghostContentDir);
    console.log(`  hero ${localRel}`);
    return localRel;
  } catch (e) {
    console.warn(`  missing hero ${url}: ${e.message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Frontmatter
// ---------------------------------------------------------------------------

function yamlString(value) {
  return JSON.stringify(value ?? "");
}

function buildPostFrontmatter({ title, description, date, heroImage, slug }) {
  const lines = ["---"];
  lines.push(`title: ${yamlString(title)}`);
  lines.push(`description: ${yamlString(description)}`);
  lines.push(`translationKey: ${yamlString(slug)}`); // use slug as unique identifier
  lines.push(`language: "en-US"`); // English site fixed value
  lines.push(`date: ${date}`); // must be date type
  if (heroImage) lines.push(`heroImage: ${yamlString(heroImage)}`);
  lines.push("---", "");
  return lines.join("\n");
}

function sqlDateToIso(sqlDate) {
  // Ghost stores "YYYY-MM-DD HH:MM:SS"; Astro wants YYYY-MM-DD.
  return sqlDate.slice(0, 10);
}

// ---------------------------------------------------------------------------
// Page handling
// ---------------------------------------------------------------------------

async function writeLegalPage(page, td, ghostContentDir) {
  const body = td.turndown(cleanGhostHtml(page.html || ""));
  const localized = await localizeImages(body, ghostContentDir);

  const frontmatter = ["---", `title: ${yamlString(page.title)}`, "---", ""].join("\n");

  const file = path.join(LEGAL_DIR, `${page.slug}.md`);
  await fs.mkdir(LEGAL_DIR, { recursive: true });
  await fs.writeFile(file, frontmatter + localized + "\n");
  console.log(`page /legal/${page.slug}`);
}

async function writePlainPage(page, td, ghostContentDir) {
  const body = td.turndown(cleanGhostHtml(page.html || ""));
  const localized = await localizeImages(body, ghostContentDir);

  const frontmatter = ["---", `title: ${yamlString(page.title)}`, "---", ""].join("\n");

  const file = path.join(ROOT, "src", "pages", `${page.slug}.md`);
  await fs.writeFile(file, frontmatter + localized + "\n");
  console.log(`page /${page.slug}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const [sqlArg, ghostDirArg] = process.argv.slice(2);

  if (!sqlArg || !ghostDirArg) {
    console.error("Usage: node scripts/migrate-ghost.mjs <ghost.sql> <ghost-content-dir>");
    process.exit(1);
  }

  const sqlPath = path.resolve(sqlArg);
  const ghostContentDir = path.resolve(ghostDirArg);

  await fs.access(ghostContentDir).catch(() => {
    throw new Error(`ghost content dir not found: ${ghostContentDir}`);
  });

  const raw = await fs.readFile(sqlPath, "utf8");
  const sql = raw.replace(/\r\n/g, "\n");

  console.log("Parsing posts table...");
  const posts = parseTable(sql, "posts");
  console.log(`Found ${posts.length} rows.`);

  const td = createTurndown();
  await fs.mkdir(CONTENT_DIR, { recursive: true });

  let written = 0;

  for (const post of posts) {
    if (post.status !== "published") continue;

    if (post.type === "page") {
      if (post.slug === "impressum" || post.slug === "imprint") {
        await writeLegalPage(post, td, ghostContentDir);
      } else {
        await writePlainPage(post, td, ghostContentDir);
      }
      continue;
    }

    if (post.type !== "post") continue;

    const body = td.turndown(cleanGhostHtml(post.html || ""));
    const withImages = await localizeImages(body, ghostContentDir);
    const hero = await localizeHeroImage(post.feature_image, ghostContentDir);

    const description =
      post.custom_excerpt || (post.plaintext ? post.plaintext.slice(0, 160) : "") || "";

    const frontmatter = buildPostFrontmatter({
      title: post.title,
      description,
      date: sqlDateToIso(post.published_at),
      heroImage: hero,
      slug: post.slug,
    });

    const file = path.join(CONTENT_DIR, `${post.slug}.md`);
    await fs.writeFile(file, frontmatter + withImages + "\n");
    console.log(`post ${post.slug}`);
    written++;
  }

  console.log(`\nDone. ${written} posts written to ${path.relative(ROOT, CONTENT_DIR)}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
