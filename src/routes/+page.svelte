<script>
  import Header from "#lib/components/Header.svelte";

  let { data } = $props();

  const sections = {
    "Styles & CSS": "Styling",
    "Writable Stores": "Stores",
    "Lifecycle Functions": "Advanced",
    Motion: "Animation",
    "Filesystem & Routing": "SvelteKit",
  };
</script>

<svelte:head>
  <title>Svelte by Example</title>
</svelte:head>

<Header>
  <h1>Svelte by Example</h1>
  <p>
    <a href="https://svelte.dev/">Svelte</a> is a frontend framework & compiler
    to generate minimal, optimized JavaScript code for web applications. <br />
    <a href="https://kit.svelte.dev/">SvelteKit</a> is a meta-framework to build full-stack
    web applications with Svelte.
  </p>
  <p>
    <em>Svelte by Example</em> is a succinct, gentle introduction to Svelte &
    SvelteKit to pique your curiosity. If you want to dive deeper, we recommend
    reading through the Svelte
    <a href="https://svelte.dev/tutorial/svelte/welcome-to-svelte">tutorial</a>
    & <a href="https://svelte.dev/docs/svelte/overview">docs</a>.
  </p>
</Header>
<ul>
  {#each data.pages as page}
    {#if page.title in sections}
      <li><strong>{sections[page.title]}</strong></li>
    {/if}
    <li><a href={page.url}>{page.title}</a></li>
  {/each}
</ul>

<style>
  ul {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--gray-border);
  }

  li a:visited {
    color: var(--gray-text);
  }

  li:has(strong) {
    margin-top: 1rem;
  }
</style>
