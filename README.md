# Svelte by Example

[Svelte by Example](https://sveltebyexample.com) is a succinct, gentle introduction to Svelte & SvelteKit to pique your curiosity. If you want to dive deeper, we recommend reading through the Svelte tutorial & docs.

Svelte by Example is built with Svelte 5 and [SvelteKit 3](https://svelte.dev/docs/kit). Content is stored in `content`, and uses a superset of markdown that gets parsed in the `build-content` script. Paragraphs prefixed with `{N}` align with line N of the example on wide screens. Filename comments are displayed as captions rather than code.

To run Svelte by Example locally, use Node.js 22.17 or newer:

```
npm ci
npm run dev
```

Run `npm run check:content` to compile the lesson examples, check annotation targets, and exercise the store, endpoint, hook, and session examples with mocked application helpers. Run `npm run build` to check that every lesson prerenders successfully.

## Cloudflare Pages

Use `npm run build` as the build command and `public` as the output directory. Set `NODE_VERSION` to `22.17.0` or a newer supported version in the Pages build environment.

Every page is prerendered to HTML with `adapter-static`. Cloudflare serves the generated files; no Node server, Pages Function, or Worker is needed at runtime. SvelteKit still handles client-side navigation, including the previous/next links and keyboard shortcuts. Direct links also work without JavaScript.

Content updates require a new build. Request-time features such as authentication, database writes, or form actions would require a backend, such as a Cloudflare Worker with `adapter-cloudflare`. The server examples in the lessons are code samples, not endpoints used by this site.

`static/_redirects` preserves links to renamed lessons. `static/404.html` gives unknown paths a real 404 instead of Cloudflare Pages' default SPA fallback.
