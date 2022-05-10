import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("collections-toString", () => {
  const doc = new DOMParser().parseFromString(`<div></div>`, "text/html")!;
  const div = doc.querySelector("div")!;
  assertEquals(div.childNodes.toString(), "[object NodeList]");
  assertEquals(div.children.toString(), "[object HTMLCollection]");
});
