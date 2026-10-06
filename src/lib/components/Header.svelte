<script>
  let { children } = $props();
</script>

<header>
  <a href="/">
    <img src="/svelte.svg" alt="Svelte logo" />
  </a>
  {@render children()}
</header>

<style>
  @media (min-width: 640px) {
    header {
      padding-right: 30%;
    }
  }

  img {
    height: 1.75rem;
    margin-bottom: calc(var(--spacing) * 1.5);
  }

  @media (min-width: 640px) {
    img {
      height: 2rem;
      margin-bottom: calc(var(--spacing) * 2);
    }
  }

  header :global(p) {
    margin-top: var(--spacing);
  }
</style>
