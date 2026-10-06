<script>
  let { resources } = $props();
</script>

<article>
  <div>
    <h2>resources://</h2>
    <p>Further reading on this topic.</p>
  </div>
  {@html resources}
</article>

<style>
  article {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-top: calc(var(--spacing) * 2);
    margin-bottom: calc(var(--spacing) * -2);
    padding: calc(var(--spacing) * 2) 0;
    font-family: var(--font-code);
    font-size: var(--text-code);
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    gap: var(--spacing);
  }

  @media (min-width: 640px) {
    article {
      border-top: none;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }

  h2 {
    font-size: 1em;
  }

  p,
  article :global(a) {
    color: var(--gray-text);
  }
</style>
