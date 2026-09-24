import React from "react";
import { createRoot } from "react-dom/client";
import { Infographic, validateIR, type BlockRendererRegistry } from "@min-infograph/core";
import example from "../examples/ai-agent.json";
import "@min-infograph/core/styles.css";
import "./style.css";

const infographicIR = validateIR(example);

// Replace one built-in widget while letting the package render every other
// block, including Mermaid diagrams, with its standard implementation.
const renderers: BlockRendererRegistry = {
  metric: ({ block }) => {
    if (block.type !== "metric") return null;
    return <section className="metric-widget" aria-label={block.label}>
      <div className="metric-topline"><span className="metric-dot" /> FIELD NOTE / 01</div>
      <p className="metric-value">{block.value}</p>
      <h2>{block.label}</h2>
      {block.detail && <p className="metric-detail">{block.detail}</p>}
      <div className="metric-bottom"><span>RECEIVE</span><span>DECIDE</span><span>ACT</span><span>RESPOND</span></div>
    </section>;
  },
};

createRoot(window.document.getElementById("root")!).render(
  <React.StrictMode>
    <main className="example-shell">
      <p className="eyebrow">MIN INFOGRAPH / CUSTOM METRIC RENDERER</p>
      <Infographic ir={infographicIR} renderers={renderers} assetBase="/" />
      <p className="example-note">The document is validated by <code>validateIR</code>; the package renders all standard blocks and Mermaid diagrams.</p>
    </main>
  </React.StrictMode>,
);
