import { Document } from "../../deno-dom-wasm.ts";
import { Attr } from "../../src/dom/element.ts";
import { assertInstanceOf, assertStrictEquals as assertEquals } from "assert";

Deno.test("Document.createAttribute creates a new Attr instance", () => {
  const doc = new Document();

  const attr = doc.createAttribute("foo");
  assertInstanceOf(attr, Attr);
  assertEquals(attr.name, "foo");
});
