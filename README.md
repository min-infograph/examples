# Min Infograph examples

Curated IR documents, package installation examples, and host integrations for [Min Infograph](https://github.com/min-infograph/min-infograph). The documents demonstrate grid and poster layouts, Mermaid diagrams, local images, and built-in widgets.

## Examples

| File | What it demonstrates |
| --- | --- |
| [ai-agent.json](examples/ai-agent.json) | Grid layout, flowchart and sequence diagram, callout, metric, and text widgets |
| [temporal.json](examples/temporal.json) | Multiple diagrams composed with explanatory widgets |
| [style-study.json](examples/style-study.json) | Theme and document shape choices |
| [mermaid-appearance.json](examples/mermaid-appearance.json) | Per-diagram font size, Mermaid node shapes, and static node effects |
| [emotion-decisions.json](examples/emotion-decisions.json) | Poster layout with cards, flow lanes, steps, and takeaways |
| [opportunity-ai.json](examples/opportunity-ai.json) | Image-backed poster widgets and local raster assets |

The JSON documents are portable. Documents that refer to local images use `/assets/...`; serve this repository's `assets/` directory at `/assets/`, or set the renderer's `assetBase` to the host path that contains those files.

## React app with npm or pnpm

The Vite example imports the published package, validates the JSON as IR, and renders it with the package's built-in widgets. It also replaces the metric widget with an app-specific React component. See [src/main.tsx](src/main.tsx).

Install the GitHub Release tarball in your application (use the release asset URL for the version you want):

```sh
npm install 'https://github.com/min-infograph/min-infograph/releases/download/v0.2.1/min-infograph-core-0.2.1.tgz?download=1'
# or
pnpm add 'https://github.com/min-infograph/min-infograph/releases/download/v0.2.1/min-infograph-core-0.2.1.tgz?download=1'
```

Then import the renderer, validator, and stylesheet:

```tsx
import { Infographic, validateIR } from "@min-infograph/core";
import "@min-infograph/core/styles.css";

const ir = validateIR(documentJson);

export function Report() {
  return <Infographic ir={ir} assetBase="/" />;
}
```

The full React example adds a custom metric renderer and leaves all other blocks to the package. This repository already pins the release tarball in `package.json`; install dependencies and start Vite:

```sh
pnpm install --frozen-lockfile
pnpm dev:renderer
```

The app serves this repository's `/assets/` directory, so local image references work in the preview.

## Static site without a build step

The [static example](static/index.html) loads the self-contained browser script and stylesheet from the versioned GitHub Pages CDN. It uses plain HTML and JavaScript with no framework or bundler. Serve this repository over HTTP:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/static/`. The release publishes the same bundle and `min-infograph-core-0.2.1.styles.css` as GitHub Release downloads for self-hosting. See [static/README.md](static/README.md) for the integration details and upgrade steps.

## Validate and build

Requires Node.js 22.14 or newer and pnpm 12.6.0.

```sh
pnpm install --frozen-lockfile
pnpm validate
pnpm build:renderer
```

`pnpm validate` checks JSON syntax, document structure, Mermaid declarations, referenced local images, and the static example's expected release asset references. The package build check type-checks the React host example and builds the Vite preview.

## License

Examples and documentation are available under the MIT License. Image assets retain the attribution and use notes in [assets/README.md](assets/README.md).
