import {
  Document,
  Element,
  HTMLDocument,
  NodeList,
} from "../../deno-dom-wasm.ts";

Deno.test("Using the public API types for NodeList works", () => {
  interface Queryable {
    querySelector(selectors: string): Element | null;
    querySelectorAll(selectors: string): NodeList;
  }

  // Note this test is a type assertion, so there are no actual assertions.
  // Type assertions
  ((d: HTMLDocument): Queryable => d);
  ((e: Document): Queryable => e);
  ((e: Element): Queryable => e);
});
