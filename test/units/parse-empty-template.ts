import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertStrictEquals } from "assert";

Deno.test("parse empty template", () => {
  const doc = new DOMParser().parseFromString(
    "<body><template></template></body>",
    "text/html",
  );
  const template = doc.body.children[0];
  assertStrictEquals(template?.tagName, "TEMPLATE");
});
