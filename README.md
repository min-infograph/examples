# Min Infograph examples

Curated documents and renderer experiments for [Min Infograph](https://github.com/min-infograph/min-infograph). The JSON files demonstrate the current `0.1` document format: layouts, reusable content widgets, Mermaid diagrams, local images, and diagram appearance controls.

## Examples

| File | What it demonstrates |
| --- | --- |
| [ai-agent.json](examples/ai-agent.json) | Grid layout, flowchart and sequence diagram, callout, metric, and text widgets |
| [temporal.json](examples/temporal.json) | Multiple diagrams composed with explanatory widgets |
| [style-study.json](examples/style-study.json) | Theme and document shape choices |
| [mermaid-appearance.json](examples/mermaid-appearance.json) | Per-diagram font size, Mermaid node shapes, and static node effects |
| [emotion-decisions.json](examples/emotion-decisions.json) | Poster layout with cards, flow lanes, steps, takeaways, and other widgets |
| [opportunity-ai.json](examples/opportunity-ai.json) | Image-backed poster widgets and local raster assets |

The JSON files are copied from the current source project and retain its `/assets/...` URLs. A compatible host should serve this repository's `assets/` directory at `/assets/`, or rewrite those paths when loading the documents.

## Run the renderer example

The React example loads the valid `ai-agent.json` document and overrides its `metric` block with a custom field-note card. Other block types fall through to simple host renderers. The Mermaid source is shown as text in this focused demo; the core workbench renders the diagram itself.

```sh
pnpm install
pnpm dev:renderer
pnpm build:renderer
```

The callback registry in `src/main.tsx` follows the core renderer's `renderers` prop: block type keys, a callback receiving the block and render context, and `null` to use the built-in widget. This demo keeps a small local type definition so it can build independently before npm publication; when using the core workspace, import its `BlockRendererRegistry` and `Infographic` exports.

## Use documents with the core project

Install the [Min Infograph monorepo](https://github.com/min-infograph/min-infograph) and use its workbench/CLI to open or render a JSON file from this repository. For documents with local image references, make the repository's `assets/` directory available at `/assets/` in the selected host, or rewrite `/assets/...` URLs to your asset base. The original `infographics-map` proof of concept was the source for this collection; these files preserve its `0.1` format and examples as a migration baseline.

## Extending the renderer

The core renderer accepts overrides for existing grid block types while keeping documents valid for every host. [The renderer example](renderers/custom-renderer.md) shows the contract. Registering new document block types remains future work.

## Validate documents

Requires Node.js 22.14 or newer and pnpm 12.6.0.

```sh
pnpm validate
```

This checks JSON syntax, core document structure, Mermaid block declarations, and referenced local images. It is a repository sanity check, not a replacement for the core renderer's full schema validator.

## License

Examples and documentation are available under the MIT License. Image assets retain the attribution and use notes in [assets/README.md](assets/README.md).
