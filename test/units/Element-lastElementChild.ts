import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertEquals } from "https://deno.land/std@0.139.0/testing/asserts.ts";

Deno.test("Element.lastElementChild", () => {
  const doc = new DOMParser().parseFromString(
    `<div>Hello<p>Wonderful</p>and<h1>Amazing</h1>World</div>`,
    "text/html",
  )!;

  const parent = doc.querySelector("div")!;

  assertEquals(parent.lastElementChild!.tagName, "H1");
  assertEquals(parent.lastElementChild!.textContent, "Amazing");
});
