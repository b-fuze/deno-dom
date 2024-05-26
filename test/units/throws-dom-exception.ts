import { DOMParser, HTMLDocument, NodeList } from "../../deno-dom-wasm.ts";
import {
  assert,
  assertThrows,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Invalid querySelector query throws DOMException", () => {
  const doc = new DOMParser().parseFromString("<div></div>", "text/html");
  try {
    doc.querySelector("div]")!;
  } catch (e) {
    assert(e instanceof DOMException);
  }
});

Deno.test("Throws on invalid constructor key", () => {
  assertThrows(
    () => {
      new (HTMLDocument as any)(undefined);
    },
    TypeError,
    "Illegal constructor.",
  );
  assertThrows(
    () => {
      new (HTMLDocument as any)({});
    },
    TypeError,
    "Illegal constructor.",
  );
});
