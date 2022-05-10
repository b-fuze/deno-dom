import { DOMParser } from "../../deno-dom-wasm.ts";
import { assert } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Element.classList.value", () => {
  const doc = new DOMParser().parseFromString("<div class='foo bar'></div>", "text/html")!;
  const div = doc.querySelector("div")!;
  assert(div.classList.value === "foo bar");
  assert(div.classList.contains("foo"));
  assert(div.classList.contains("bar"));
  div.classList.value = "fiz  baz fiz";
  assert(div.classList.value === "fiz  baz fiz");
  assert(!div.classList.contains("foo"));
  assert(!div.classList.contains("bar"));
  assert(div.classList.contains("fiz"));
  assert(div.classList.contains("baz"));
  div.classList.add("qux");
  // @ts-ignore
  assert(div.classList.value === "fiz baz qux");
});

Deno.test("Element.classList.add", () => {
  const doc = new DOMParser().parseFromString("<div></div>", "text/html")!;
  const div = doc.querySelector("div")!;
  div.classList.add("a");
  div.classList.add("b", "c");
  assert(div.classList.contains("a"));
  assert(div.classList.contains("b"));
  assert(div.classList.contains("c"));
});
