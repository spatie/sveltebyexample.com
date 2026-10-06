<script>
  import Header from "../../lib/components/Header.svelte";
  import Example from "../../lib/components/Example.svelte";
  import Resources from "../../lib/components/Resources.svelte";
  import Pagination from "../../lib/components/Pagination.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>
    {data.page.section} by Example:
    {data.page.title}
  </title>
</svelte:head>

<Header>
  <h1>
    <a href="/">{data.page.section} by Example</a>: {data.page.title}
  </h1>
  {#if data.page.intro}
    {@html data.page.intro}
  {/if}
</Header>

<div class="examples">
  {#each data.page.examples as example}
    <Example {example} />
  {/each}
</div>

<Pagination nextPage={data.nextPage} previousPage={data.previousPage} />

{#if data.page.resources}
  <Resources resources={data.page.resources} />
{/if}

<style>
  @media (min-width: 640px) {
    .examples {
      display: grid;
      grid-template-columns: calc((var(--content-width) - 1rem) / 2) minmax(
          0,
          max-content
        );
      column-gap: 1rem;
      width: max-content;
      min-width: 100%;
      max-width: calc(50% + 50cqw - var(--spacing));
    }
  }
</style>
