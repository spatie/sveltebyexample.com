import content from "#lib/content.json";

export function load() {
  return {
    pages: content.map((page) => ({ title: page.title, url: page.url })),
  };
}
