import { DOMParser, NodeList } from "../../deno-dom-wasm.ts";
import { assert } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Invalid querySelector query throws DOMException", () => {
  const doc = new DOMParser().parseFromString("<div></div>", "text/html")!;
  try {
    doc.querySelector("div]")!;
  } catch (e) {
    assert(e instanceof DOMException);
  }
});

