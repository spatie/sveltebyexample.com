# Svelte by Example

[Svelte by Example](https://sveltebyexample.com) is a succinct, gentle introduction to Svelte & SvelteKit to pique your curiosity. If you want to dive deeper, we recommend reading through the Svelte tutorial & docs.

Svelte by Example is built with Svelte 5 and [SvelteKit 3](https://svelte.dev/docs/kit). Content is stored in `content`, and uses a superset of markdown that gets parsed in the `build-content` script. Paragraphs prefixed with `{N}` align with line N of the example on wide screens. Filename comments are displayed as captions rather than code.

To run Svelte by Example locally, use Node.js 22.17 or newer:

```
npm ci
npm run dev
```

Run `npm run check:content` to compile the lesson examples, check annotation targets, and exercise the store, endpoint, hook, and session examples with mocked application helpers. Run `npm run build` to check that every lesson prerenders successfully.

## Cloudflare Workers Static Assets

The `sveltebyexample-com` Worker in the Spatie account serves the static site at [sveltebyexample-com.flareapp-io.workers.dev](https://sveltebyexample-com.flareapp-io.workers.dev). `wrangler.jsonc` points to the `public` build output. It has no Worker script or runtime bindings.

Authenticate Wrangler for the Spatie account, or set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in your environment, then deploy:

```sh
npm ci
npm run deploy
```

For automatic deployments, connect `spatie/sveltebyexample.com` in the Worker's **Settings → Builds** with these settings:

- Production branch: `main`
- Root directory: `/`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Node version: `22.17.0` (also specified in `.node-version`)

Keep `adapter-static`; do not let framework auto-configuration replace it with `adapter-cloudflare`. Every page is prerendered to HTML, and Cloudflare serves the generated files without running server-side application code. SvelteKit still handles client-side navigation, including the previous/next links and keyboard shortcuts. Direct links also work without JavaScript.

Content updates require a new build. Request-time features such as authentication, database writes, or form actions would require a backend, such as a Cloudflare Worker with `adapter-cloudflare`. The server examples in the lessons are code samples, not endpoints used by this site.

`static/_redirects` preserves links to renamed lessons. Wrangler's `404-page` handling serves `static/404.html` with a real 404 for unknown paths; this prerendered site does not need an SPA fallback.
