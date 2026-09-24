import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import packageJson from "../package.json" with { type: "json" };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const examplesDir = path.join(root, "examples");
const files = (await readdir(examplesDir)).filter((name) => name.endsWith(".json")).sort();
const errors = [];

const releaseTarball = "https://github.com/min-infograph/min-infograph/releases/download/v0.2.1/min-infograph-core-0.2.1.tgz?download=1";
if (packageJson.dependencies?.["@min-infograph/core"] !== releaseTarball) {
  errors.push("package.json: @min-infograph/core must install from the documented v0.2.1 release tarball");
}

const staticPage = await readFile(path.join(root, "static/index.html"), "utf8");
for (const expected of [
  "https://min-infograph.github.io/min-infograph/core/v0.2.1/min-infograph-core-0.2.1.browser.js",
  "https://min-infograph.github.io/min-infograph/core/v0.2.1/min-infograph-core-0.2.1.styles.css",
  "window.MinInfograph",
  "fetch(\"../examples/ai-agent.json\")",
  "validateIR(documentJson)",
  "render(mount, ir",
]) {
  if (!staticPage.includes(expected)) errors.push(`static/index.html: missing integration reference ${expected}`);
}
if (/type=["']module["']/.test(staticPage)) errors.push("static/index.html: static integration should use classic scripts without a module build step");

if (files.length === 0) errors.push("No JSON examples found.");

for (const file of files) {
  const source = await readFile(path.join(examplesDir, file), "utf8");
  let doc;
  try {
    doc = JSON.parse(source);
  } catch (error) {
    errors.push(`${file}: invalid JSON (${error.message})`);
    continue;
  }
  if (doc.version !== "0.1") errors.push(`${file}: expected version 0.1`);
  if (typeof doc.title !== "string" || !doc.title.trim()) errors.push(`${file}: missing title`);
  if (!Array.isArray(doc.blocks) || doc.blocks.length === 0) {
    errors.push(`${file}: blocks must be a non-empty array`);
    continue;
  }
  const ids = new Set();
  for (const [index, block] of doc.blocks.entries()) {
    const where = `${file}: blocks[${index}]`;
    if (!block || typeof block !== "object") { errors.push(`${where}: expected object`); continue; }
    if (typeof block.id !== "string" || !block.id) errors.push(`${where}: missing id`);
    else if (ids.has(block.id)) errors.push(`${where}: duplicate id ${block.id}`);
    else ids.add(block.id);
    if (block.type === "mermaid" && !/^\s*(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|mindmap|timeline|gitGraph|quadrantChart|xychart|sankey|packet|block|architecture)\b/i.test(block.diagram ?? "")) {
      errors.push(`${where}: Mermaid diagram should begin with a declaration`);
    }
    const checkImages = async (value) => {
      if (!value || typeof value !== "object") return;
      if (typeof value.src === "string" && Object.hasOwn(value, "alt")) {
        if (!value.src.startsWith("/assets/") || value.src.includes("..")) errors.push(`${where}: image source must be a local /assets/ path`);
        else {
          try { await access(path.join(root, value.src.slice(1))); }
          catch { errors.push(`${where}: image not found: ${value.src}`); }
        }
      }
      for (const child of Object.values(value)) await checkImages(child);
    };
    await checkImages(block);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `✗ ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${files.length} example documents.`);
}
