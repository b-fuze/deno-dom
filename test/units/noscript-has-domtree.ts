import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertEquals } from "https://deno.land/std@0.139.0/testing/asserts.ts";

Deno.test("Noscript has a DOM tree", () => {
  const doc = new DOMParser().parseFromString(
    // `<body>` required otherwise `<noscript>`
    // is assumed in `<head>` by the parser
    `<body><noscript><div></div></noscript></body>`,
    "text/html",
  )!;
  const noscript = doc.querySelector("noscript")!;
  assertEquals(noscript.children[0]?.tagName, "DIV");
});
