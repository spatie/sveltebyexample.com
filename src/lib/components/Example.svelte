<script>
  import { MediaQuery } from "svelte/reactivity";

  let { example } = $props();
  const small = new MediaQuery("(max-width: 639px)", false);

  let code = $derived(
    small.current
      ? example.code.map((block) => ({
          ...block,
          code: block.code.replace(
            /(\n<span class="line"><\/span>){2,}/g,
            "$1",
          ),
        }))
      : example.code,
  );
</script>

<article>
  {#if example.title}
    <h2>{example.title}</h2>
  {/if}
  <div
    class:captioned={!!code[0]?.filename}
    class:annotated={!!example.lastLine}
    style:grid-template-rows={example.lastLine > 1
      ? `repeat(${example.lastLine - 1}, 1rem) auto`
      : "auto"}
  >
    {@html example.text}
  </div>
  <figure>
    {#each code as block}
      {#if block.filename}
        <figcaption>{block.filename}</figcaption>
      {/if}
      {@html block.code}
    {/each}
  </figure>
</article>

<style>
  article {
    margin-top: calc(var(--spacing) * 2);
    border-top: 1px solid #eee;
    padding-top: calc(var(--spacing) * 1.5);
  }

  @media (min-width: 640px) {
    article {
      display: grid;
      grid-column: 1 / -1;
      grid-template-columns: subgrid;
      gap: 0 1rem;
      border-top: 0;
      background: linear-gradient(#eee, #eee) top left / var(--content-width)
        1px no-repeat;
    }
  }

  article h2 {
    grid-column: 1 / -1;
    font-size: 0.85rem;
    padding-top: calc(var(--spacing) * 0.5);
  }

  div {
    margin-top: 0.46rem;
  }

  figure {
    margin-top: var(--spacing);
  }

  @media (min-width: 640px) {
    figure {
      margin-top: 0;
      min-width: 0;
    }

    div.annotated {
      display: grid;
      align-self: start;
    }

    div.annotated.captioned {
      margin-top: 1.46rem;
    }

    div.annotated :global(p) {
      grid-row: var(--line);
      align-self: start;
      margin-top: 0;
    }
  }

  div :global(p + p),
  figure :global(pre + pre),
  figure :global(pre + figcaption) {
    margin-top: var(--spacing);
  }

  figcaption {
    font-family: "input-mono", monospace;
    text-align: right;
    color: #888;
    font-size: 0.6em;
  }
</style>
