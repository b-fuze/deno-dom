import { DOMParser } from "../../deno-dom-wasm.ts";
import { assert } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Element-matches", () => {
  const doc = new DOMParser().parseFromString(`<html/>`, "text/html")!;
  const a = doc.createElement("a");

  assert(a.matches("a"));
  assert(!a.matches("b"));
});
