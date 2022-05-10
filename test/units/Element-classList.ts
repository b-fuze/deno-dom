import { DOMParser } from "../../deno-dom-wasm.ts";
import { assert } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Element.classList.add", () => {
  const doc = new DOMParser().parseFromString("<div></div>", "text/html")!;
  const div = doc.querySelector("div")!;
  div.classList.add("a");
  div.classList.add("b", "c");
  assert(div.classList.contains("a"));
  assert(div.classList.contains("b"));
  assert(div.classList.contains("c"));
});
