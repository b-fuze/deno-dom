import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("querySelectorAll-selector-list", () => {
  const doc = new DOMParser().parseFromString(
    `
    <a></a>
    <link>
  `,
    "text/html",
  );

  const docReverse = new DOMParser().parseFromString(
    `
    <link>
    <a></a>
  `,
    "text/html",
  );

  assertEquals(
    Array.from(doc.querySelectorAll("a, link"), (n) => n.nodeName),
    ["A", "LINK"],
  );

  assertEquals(
    Array.from(docReverse.querySelectorAll("a, link"), (n) => n.nodeName),
    ["LINK", "A"],
  );
});
