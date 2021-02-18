import { DOMParser, NodeList } from "../../deno-dom-wasm.ts";
import { assert } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("removeAttribute attributes don't show in HTML", () => {
  const doc = new DOMParser().parseFromString("<div><br foo></div>", "text/html")!;
  const br = doc.querySelector("br")!;
  br.removeAttribute("foo");

  assert(br.parentElement!.outerHTML === "<div><br></div>");
});

Deno.test("removeAttribute attributes are undefined", () => {
  const doc = new DOMParser().parseFromString("<div><br foo></div>", "text/html")!;
  const br = doc.querySelector("br")!;
  br.removeAttribute("foo");

  assert(br.attributes.foo === undefined);
});

