import React from "react";
import { createRoot } from "react-dom/client";
import example from "../examples/ai-agent.json";
import "./style.css";

type BlockBase = { id: string; type: string; span?: number; emphasis?: "high" | "normal" };
type MetricBlock = BlockBase & { type: "metric"; label: string; value: string; detail?: string };
type MermaidBlock = BlockBase & { type: "mermaid"; title: string; diagram: string };
type TextBlock = BlockBase & { type: "text"; title?: string; text: string };
type CalloutBlock = BlockBase & { type: "callout"; title: string; text: string; tone?: string };
type ExampleBlock = MetricBlock | MermaidBlock | TextBlock | CalloutBlock;
type Document = { version: "0.1"; title: string; subtitle?: string; style: string; shape?: string; layout: { type: "grid"; columns: number }; blocks: ExampleBlock[] };

type RenderArguments<T extends BlockBase = BlockBase> = { block: T; style: string; shape: string; columns: number; index: number };
type CustomBlockRenderer<T extends BlockBase = BlockBase> = (args: RenderArguments<T>) => React.ReactNode | null;
type RendererRegistry = Partial<Record<ExampleBlock["type"], CustomBlockRenderer<any>>>;

const infographicDocument = example as Document;

// A custom renderer can replace one supported block type and let the host keep
// rendering every other block with its existing implementation.
const renderers: RendererRegistry = {
  metric: ({ block }: RenderArguments<MetricBlock>) => (
    <section className="metric-widget" aria-label={block.label}>
      <div className="metric-topline"><span className="metric-dot" /> FIELD NOTE / 01</div>
      <p className="metric-value">{block.value}</p>
      <h2>{block.label}</h2>
      {block.detail && <p className="metric-detail">{block.detail}</p>}
      <div className="metric-bottom"><span>RECEIVE</span><span>DECIDE</span><span>ACT</span><span>RESPOND</span></div>
    </section>
  ),
};

function builtIn(block: ExampleBlock) {
  switch (block.type) {
    case "mermaid": return <section className="card diagram"><h2>{block.title}</h2><pre>{block.diagram}</pre><small>Diagram source · Mermaid renders this block in the full workbench</small></section>;
    case "text": return <section className="card"><p className="eyebrow">EXPLANATION</p>{block.title && <h2>{block.title}</h2>}<p>{block.text}</p></section>;
    case "callout": return <section className={`card callout callout--${block.tone ?? "info"}`}><p className="eyebrow">A USEFUL BOUNDARY</p><h2>{block.title}</h2><p>{block.text}</p></section>;
    case "metric": return <section className="card"><p className="eyebrow">{block.label}</p><strong>{block.value}</strong><p>{block.detail}</p></section>;
  }
}

function InfographicPreview({ doc, customRenderers }: { doc: Document; customRenderers: RendererRegistry }) {
  return <main className="sheet">
    <header><p className="eyebrow">MIN INFOGRAPH / CUSTOM BLOCK RENDERER</p><h1>{doc.title}</h1><p className="subtitle">{doc.subtitle}</p></header>
    <div className="grid" style={{ "--columns": doc.layout.columns } as React.CSSProperties}>
      {doc.blocks.map((block, index) => {
        const args = { block, style: doc.style, shape: doc.shape ?? "rounded", columns: doc.layout.columns, index } as RenderArguments;
        const override = customRenderers[block.type]?.(args);
        return <div key={block.id} className="block" style={{ gridColumn: `span ${block.span ?? 1}` }}>{override ?? builtIn(block)}</div>;
      })}
    </div>
    <footer><span>VALID 0.1 DOCUMENT</span><span>Metric blocks use a host supplied renderer</span></footer>
  </main>;
}

createRoot(window.document.getElementById("root")!).render(<React.StrictMode><InfographicPreview doc={infographicDocument} customRenderers={renderers} /></React.StrictMode>);
