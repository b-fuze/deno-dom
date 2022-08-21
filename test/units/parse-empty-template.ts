import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertStrictEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("parse empty template", () => {
  const doc = new DOMParser().parseFromString(
    "<body><template></template></body>",
    "text/html",
  )!;
  const template = doc.body.children[0];
  assertStrictEquals(template?.tagName, "TEMPLATE");
});
