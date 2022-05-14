import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.139.0/testing/asserts.ts";
import {
  Comment,
  Document,
  DocumentType,
  DOMParser,
  Element,
} from "../../deno-dom-wasm.ts";

Deno.test("Comment before <html>", async () => {
  const src = await Deno.readTextFile(
    new URL("./comments-outside-html.html", import.meta.url),
  );
  const document = new DOMParser().parseFromString(src, "text/html");

  assert(document instanceof Document);
  assertEquals(document.childNodes.length, 5);
  assert(document.childNodes[0] instanceof Comment);
  assertEquals(
    (document.childNodes[0] as Comment).data,
    " A popular English-language nursery rhyme. ",
  );
  assert(document.childNodes[1] instanceof DocumentType);
  assert(document.childNodes[2] instanceof Comment);
  assertEquals(
    (document.childNodes[2] as Comment).data,
    " TODO: Bells and whistles ",
  );
  assert(document.childNodes[3] instanceof Element);
  assertEquals(document.documentElement, document.childNodes[3]);
  assert(document.childNodes[4] instanceof Comment);
  assertEquals(
    (document.childNodes[4] as Comment).data,
    " Copyright: public domain ",
  );
});
