# Static site example

`index.html` demonstrates a framework-free integration. It loads `min-infograph-core-0.2.1.browser.js` and `min-infograph-core-0.2.1.styles.css` from versioned GitHub Pages URLs, fetches an example JSON document, validates it, and mounts the renderer. The page uses plain HTML and classic scripts. The bundle includes its React runtime and exposes `window.MinInfograph` with `validateIR` and `render` methods.

Run the example locally with any static file server from the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/static/`. Serve the repository over HTTP so the page can fetch the JSON document. For deployment, keep the versioned bundle and CSS URLs in `index.html`, or download the browser bundle and stylesheet from the matching GitHub Release and host them with your own assets. Update the version and URLs together when upgrading.

The document references no images. For a document containing local image blocks, make its `/assets/...` paths available under the supplied `assetBase` or change `assetBase` to the directory where those files are hosted.
