import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { marked } from "marked";
import { compile, compileModule } from "svelte/compiler";
import { get } from "svelte/store";

const lessons = new Map();
let checked = 0;

for (const filename of await readdir("content")) {
  const markdown = await readFile(`content/${filename}`, "utf8");
  const blocks = marked
    .lexer(markdown)
    .filter((token) => token.type === "code");
  const title = filename.split(". ")[1].replace(".md", "");
  lessons.set(title, blocks);
  assert(blocks.length, `${filename}: missing examples`);

  for (const [index, block] of blocks.entries()) {
    const name = `${filename}, example ${index + 1}`;
    let result;
    if (block.lang === "svelte") {
      result = compile(block.text, { filename: name, runes: true });
    } else if (block.lang === "js") {
      result = compileModule(block.text, { filename: name });
    } else if (block.lang === "ts") {
      result = compile(`<script lang="ts">${block.text}</script>`, {
        filename: name,
        runes: true,
      });
    } else if (block.lang === "json") {
      JSON.parse(block.text);
    }
    // This lesson deliberately shows a scoped selector that cannot reach a child.
    const warnings =
      result?.warnings.filter(
        (warning) =>
          !(title === "Styles & CSS" && warning.code === "css_unused_selector"),
      ) ?? [];
    assert.equal(
      warnings.length,
      0,
      `${name}: ${warnings.map((w) => w.message).join("\n")}`,
    );
    checked++;
  }

  for (const section of markdown.split(/^---$/m)) {
    const code = marked
      .lexer(section)
      .filter((token) => token.type === "code")
      .flatMap((token) =>
        token.text.replace(/^(?:<!-- .* -->|\/\/ .*)\n/, "").split("\n"),
      );
    for (const [, line] of section.matchAll(/^\{(\d+)\} /gm)) {
      assert(
        Number(line) >= 1 && Number(line) <= code.length,
        `${filename}: annotation ${line} outside example`,
      );
      assert(
        code[Number(line) - 1].trim(),
        `${filename}: annotation ${line} points at a blank line`,
      );
    }
  }
}

// Execute published examples, substituting only their external application helpers.
async function moduleFrom(source, imports = {}) {
  const resolved = source.replace(
    /\bfrom\s+(['"])([^'"]+)\1/g,
    (_, quote, name) =>
      `from ${JSON.stringify(imports[name] ?? import.meta.resolve(name))}`,
  );
  return import(
    `data:text/javascript;base64,${Buffer.from(resolved).toString("base64")}`
  );
}

const { createTodos } = await moduleFrom(lessons.get("Custom Stores")[0].text);
const first = createTodos();
const second = createTodos();
const values = [];
const unsubscribe = first.subscribe((value) => values.push(value));
assert.deepEqual(
  values,
  [[]],
  "subscribe must immediately supply the current value",
);
first.addTodo({ task: "Walk dog", completed: false });
first.addTodo({ task: "Read newspaper", completed: false });
first.checkTodo(1, true);
assert.deepEqual(get(first), [
  { task: "Walk dog", completed: false },
  { task: "Read newspaper", completed: true },
]);
assert.deepEqual(get(second), [], "factory instances must not share state");
unsubscribe();
const count = values.length;
first.addTodo({ task: "Mow lawn", completed: false });
assert.equal(values.length, count, "unsubscribed listeners must not be called");

const { todos, completedTodos } = await moduleFrom(
  lessons.get("Derived Stores")[0].text,
);
todos.set([
  { task: "Walk dog", completed: false },
  { task: "Read newspaper", completed: true },
]);
assert.deepEqual(get(completedTodos), [
  { task: "Read newspaper", completed: true },
]);
todos.set([]);
assert.deepEqual(get(completedTodos), []);

const { theme } = await moduleFrom(lessons.get("Readable Stores")[0].text);
assert.equal(get(theme), "light", "readable store must be safe on the server");

const helpersURL = `data:text/javascript,${encodeURIComponent(`
  export const calls = [];
  export const user = { id: 'user-1', name: 'Reader' };
  export async function verifyCredentials(email, password) {
    return email === 'reader@example.test' && password === 'valid' ? user : null;
  }
  export async function createSession(id) {
    calls.push(['createSession', id]);
    return { token: 'example-session', expiresAt: new Date('2030-01-01') };
  }
  export async function revokeSession(token) { calls.push(['revoke', token]); }
  export async function getUserFromSession(token) {
    return token === 'example-session' ? user : null;
  }
  export async function getTodosForUser(id) { calls.push(['read', id]); return []; }
  export async function deleteTodoForUser(id, owner) {
    calls.push(['delete', id, owner]);
    return id === 'owned' && owner === user.id;
  }
  export async function getTodos() { return [{ id: '1', task: 'Walk dog', completed: false }]; }
  export async function createTodo(task) { return { id: '2', task, completed: false }; }
  export async function deleteTodo(id) { return id === '1'; }
`)}`;
const helpers = await import(helpersURL);
const imports = {
  "#lib/server/auth.js": helpersURL,
  "#lib/server/db.js": helpersURL,
  "$app/env": "data:text/javascript,export const dev = false;",
};
const request = (fields) =>
  new Request("https://example.test/", {
    method: "POST",
    body: new URLSearchParams(fields),
  });
const redirected = (location) => (result) =>
  result.status === 303 && result.location === location;

const auth = lessons.get("Cookies & Sessions");
const login = (await moduleFrom(auth[0].text, imports)).actions.default;
const locals = { user: null };
let cookie;
const cookies = {
  set: (name, value, options) => {
    cookie = { name, value, options };
  },
  get: () => cookie?.value,
  delete: (name, options) => {
    helpers.calls.push(["clearCookie", name, options]);
  },
};
for (const fields of [
  {},
  { email: "reader@example.test", password: "wrong" },
]) {
  const result = await login({ request: request(fields), cookies, locals });
  assert.equal(result.status, 400);
  assert.equal(cookie, undefined);
  assert.equal(
    helpers.calls.length,
    0,
    "invalid login must not create a session",
  );
  assert.equal("password" in result.data, false);
}
await assert.rejects(
  login({
    request: request({ email: "reader@example.test", password: "valid" }),
    cookies,
    locals,
  }),
  redirected("/todos"),
);
assert.deepEqual(helpers.calls, [["createSession", "user-1"]]);
assert.deepEqual(cookie, {
  name: "session",
  value: "example-session",
  options: {
    path: "/",
    expires: new Date("2030-01-01"),
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  },
});
assert.equal(locals.user.id, "user-1");

const protectedPage = await moduleFrom(auth[2].text, imports);
helpers.calls.length = 0;
await assert.rejects(
  protectedPage.load({ locals: { user: null } }),
  redirected("/login"),
);
await assert.rejects(
  protectedPage.actions.delete({
    locals: { user: null },
    request: request({ id: "owned" }),
  }),
  redirected("/login"),
);
assert.deepEqual(
  helpers.calls,
  [],
  "signed-out requests must not reach the database",
);
await protectedPage.load({ locals });
assert.deepEqual(helpers.calls, [["read", "user-1"]]);
const foreign = await protectedPage.actions.delete({
  locals,
  request: request({ id: "foreign", userId: "user-2" }),
});
assert.equal(foreign.status, 404);
assert.deepEqual(helpers.calls.at(-1), ["delete", "foreign", "user-1"]);
assert.deepEqual(
  await protectedPage.actions.delete({
    locals,
    request: request({ id: "owned" }),
  }),
  { message: "Todo deleted!" },
);

const { handle } = await moduleFrom(
  lessons.get("Hooks & Locals")[0].text,
  imports,
);
for (const token of ["example-session", "invalid", undefined]) {
  const event = { cookies: { get: () => token }, locals: {} };
  const response = new Response("ok");
  assert.equal(
    await handle({
      event,
      resolve: (received) => {
        assert.equal(received, event);
        assert.deepEqual(
          received.locals.user,
          token === "example-session" ? helpers.user : null,
        );
        return response;
      },
    }),
    response,
  );
}

helpers.calls.length = 0;
const logout = (await moduleFrom(auth[4].text, imports)).actions.default;
await assert.rejects(logout({ cookies, locals }), redirected("/login"));
assert.deepEqual(helpers.calls, [
  ["revoke", "example-session"],
  ["clearCookie", "session", { path: "/" }],
]);
assert.equal(locals.user, null);

const api = lessons.get("API Endpoints");
const { GET } = await moduleFrom(api[0].text, imports);
assert.deepEqual(await (await GET()).json(), [
  { id: "1", task: "Walk dog", completed: false },
]);
const { POST } = await moduleFrom(api[1].text, imports);
const jsonRequest = (body, type = "application/json") =>
  new Request("https://example.test/api/todos", {
    method: "POST",
    headers: { "content-type": type },
    body,
  });
for (const [body, type, status] of [
  ["{}", "text/plain", 415],
  ["{", "application/json", 400],
  ['{"task":"  "}', "application/json", 400],
  [JSON.stringify({ task: "x".repeat(201) }), "application/json", 400],
]) {
  await assert.rejects(
    POST({ request: jsonRequest(body, type) }),
    (error) => error.status === status,
  );
}
const longest = await POST({
  request: jsonRequest(JSON.stringify({ task: "x".repeat(200) })),
});
assert.equal(longest.status, 201);
assert.equal((await longest.json()).task, "x".repeat(200));
const created = await POST({
  request: jsonRequest('{"task":" Read newspaper "}'),
});
assert.equal(created.status, 201);
assert.deepEqual(await created.json(), {
  id: "2",
  task: "Read newspaper",
  completed: false,
});
const { DELETE } = await moduleFrom(api[2].text, imports);
assert.equal((await DELETE({ params: { id: "1" } })).status, 204);
await assert.rejects(
  DELETE({ params: { id: "missing" } }),
  (error) => error.status === 404,
);

console.log(
  `Checked ${lessons.size} lessons and ${checked} code blocks; store, endpoint, hook, and session checks passed.`,
);
