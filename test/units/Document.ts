import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertStrictEquals as assertEquals } from "assert";

Deno.test("Document.title sets title element value", () => {
  const doc = new DOMParser().parseFromString(
    `<!DOCTYPE html><html><head><title>foo</title></head><body></body></html>`,
    "text/html",
  );
  assertEquals(doc.title, "foo");
  doc.title = "bar";
  assertEquals(doc.title, "bar");
  assertEquals(doc.querySelector("title")?.textContent, "bar");
});

Deno.test("Document.title adds missing title element", () => {
  const doc = new DOMParser().parseFromString(
    `<!DOCTYPE html><html><head></head><body></body></html>`,
    "text/html",
  );
  assertEquals(doc.title, "");
  doc.title = "foo";
  assertEquals(doc.title, "foo");
  assertEquals(doc.querySelector("title")?.textContent, "foo");
});

Deno.test("Document.title does not add title missing head element", () => {
  const doc = new DOMParser().parseFromString(
    `<!DOCTYPE html><html><head></head><body></body></html>`,
    "text/html",
  );
  doc.head.remove();
  assertEquals(doc.title, "");
  doc.title = "foo";
  assertEquals(doc.title, "");
  assertEquals(doc.querySelector("title"), null);
});
