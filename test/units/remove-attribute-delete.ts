import { DOMParser } from "../../deno-dom-wasm.ts";
import { assert } from "assert";

Deno.test("removeAttribute attributes don't show in HTML", () => {
  const doc = new DOMParser().parseFromString(
    "<div><br foo></div>",
    "text/html",
  );
  const br = doc.querySelector("br")!;
  br.removeAttribute("foo");

  assert(br.parentElement!.outerHTML === "<div><br></div>");
});

Deno.test("removeAttribute attributes are null", () => {
  const doc = new DOMParser().parseFromString(
    "<div><br foo></div>",
    "text/html",
  );
  const br = doc.querySelector("br")!;
  br.removeAttribute("foo");

  assert(br.attributes.length === 0);
  assert(br.attributes.getNamedItem("foo") === null);
});
