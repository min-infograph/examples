# Customize a built-in widget

The core React renderer accepts a `renderers` registry for existing grid block types. A callback receives `{ block, style, shape, columns, index, assetBase }` and returns a React node. Return `null` to use the built-in widget. The [runnable example](../src/main.tsx) gives `metric` blocks a field-note design while keeping a valid `0.1` JSON document.

In an application that consumes the core workspace packages:

```tsx
import { Infographic, type BlockRendererRegistry } from '@min-infograph/renderer';
import { validateIR } from '@min-infograph/ir';

const renderers: BlockRendererRegistry = {
  metric: ({ block }) => block.type === 'metric'
    ? <section className="my-metric"><strong>{block.value}</strong><span>{block.label}</span></section>
    : null,
};

const ir = validateIR(documentJson);
<Infographic ir={ir} renderers={renderers} />;
```

This changes presentation without changing the document schema. The example repository uses a local React host and local types so it runs independently before the workspace packages are published to npm. Its Mermaid fallback displays source text; use the core workbench for full Mermaid rendering.

A new `type: "widget"` block is currently rejected by the strict `0.1` validator. To introduce a new portable widget, update the IR type, validation, renderer, example, and documentation in the core project together. A versioned registry for arbitrary third-party block types is planned.
