import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";

// FIXME: should be HTMLElement but it's not implemented yet
Deno.test("Element#innerText", () => {
  const doc = new DOMParser().parseFromString(
    `<div>foo <strong>bar</strong></div>`,
    "text/html",
  )!;
  const div = doc.querySelector("div")!;

  assertEquals(div.innerText, div.textContent, "innerText equals textContent");
  div.innerHTML = "<em>qux</em> fizz";
  assertEquals(div.innerText, "qux fizz", "innerText reflects innerHTML changes");
  div.innerText = "42 divs";
  assertEquals(div.textContent, "42 divs", "setting innerText");
});

