<script>
  import "../app.css";

  let { children } = $props();
</script>

<div class="layout">
  <main>
    {@render children()}
  </main>
  <footer>
    <p>
      By <a href="https://sebastiandedeyne.com">Sebastian De Deyne</a> at
      <a
        href="https://spatie.be/?utm_campaign=footer-link&utm_source=svelte-by-example"
        >SPATIE</a
      >
      <br class="sm-only" />
      <span class="lg-only">|</span>
      Built with <a href="https://kit.svelte.dev/">SvelteKit</a> |
      <a href="https://github.com/sebastiandedeyne/sveltebyexample.com"
        >Source</a
      >
    </p>
  </footer>
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    container-type: inline-size;
  }

  main {
    --content-width: min(800px, 100cqw - 2 * var(--spacing));
    flex: 1;
    width: 100%;
    max-width: calc(var(--content-width) + 2 * var(--spacing));
    padding: 0 var(--spacing);
    margin: calc(var(--spacing) * 2) auto 0;
  }

  footer {
    margin-top: calc(var(--spacing) * 4);
    margin-bottom: var(--spacing);
    font-size: 0.75em;
    text-align: center;
    color: var(--gray-text);
  }

  footer a {
    color: var(--gray-text);
  }
</style>
