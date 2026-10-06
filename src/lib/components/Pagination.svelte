<script>
  let { nextPage, previousPage } = $props();

  import { shortcut } from "#lib/shortcut.js";
</script>

<nav>
  <ul>
    {#if previousPage}
      <li>
        Previous: <a
          href={previousPage.url}
          use:shortcut={{ code: "ArrowLeft" }}>{previousPage.title}</a
        >
      </li>
    {/if}
    {#if nextPage}
      <li class="next">
        Next: <a href={nextPage.url} use:shortcut={{ code: "ArrowRight" }}
          >{nextPage.title}</a
        >
      </li>
    {/if}
  </ul>
</nav>

<style>
  nav {
    border-top: 1px solid #eee;
    margin-top: calc(var(--spacing) * 2);
    padding-top: calc(var(--spacing) * 2);
  }

  nav ul {
    list-style: none;
    margin-top: 0;
    display: flex;
    flex-direction: column-reverse;
    gap: calc(var(--spacing) * 0.5);
  }

  @media (min-width: 640px) {
    nav {
      padding-top: calc(var(--spacing) * 0.5);
    }

    nav ul {
      flex-direction: row;
    }

    .next {
      margin-left: auto;
    }
  }
</style>
