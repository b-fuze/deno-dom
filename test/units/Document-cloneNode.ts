import { DOMParser, Document } from "../../deno-dom-wasm.ts";
import { assertStrictEquals as assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Document.cloneNode has non-null .body & .head when they exist", () => {
  const doc = new DOMParser().parseFromString(
    `<div></div>`,
    "text/html",
  )!;
  const docClone = doc.cloneNode(true);

  assertEquals(docClone.body?.localName, "body");
  assertEquals(docClone.head?.localName, "head");

  const emptyDoc = new Document();
  const emptyDocClone = emptyDoc.cloneNode(true);

  assertEquals(emptyDocClone.body, null);
  assertEquals(emptyDocClone.head, null);
});
