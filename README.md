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

The `sveltebyexample-com` project in the Spatie account is hosted at [sveltebyexample-com.pages.dev](https://sveltebyexample-com.pages.dev). It uses Direct Upload, so pushing to GitHub does not automatically deploy.

Authenticate Wrangler for the Spatie account, or set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in your environment, then deploy:

```sh
npm ci
npm run build
npx wrangler@4.148.0 pages deploy public --project-name sveltebyexample-com --branch main --force
```

The `--force` flag keeps this Wrangler version on Pages instead of automatically converting the project to Workers. Cloudflare's built-in Git integration would require a new Pages project; Direct Upload can also be automated through your own CI.

Every page is prerendered to HTML with `adapter-static`. Cloudflare serves the generated files; no Node server, Pages Function, or Worker is needed at runtime. SvelteKit still handles client-side navigation, including the previous/next links and keyboard shortcuts. Direct links also work without JavaScript.

Content updates require a new build. Request-time features such as authentication, database writes, or form actions would require a backend, such as a Cloudflare Worker with `adapter-cloudflare`. The server examples in the lessons are code samples, not endpoints used by this site.

`static/_redirects` preserves links to renamed lessons. `static/404.html` gives unknown paths a real 404 instead of Cloudflare Pages' default SPA fallback.
