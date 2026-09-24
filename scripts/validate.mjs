import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const examplesDir = path.join(root, "examples");
const files = (await readdir(examplesDir)).filter((name) => name.endsWith(".json")).sort();
const errors = [];

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
