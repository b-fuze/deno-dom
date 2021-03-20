import { DOMParser, NodeList } from "../../deno-dom-wasm.ts";
import { assert } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Comments show in outerHTML", () => {
  const doc = new DOMParser().parseFromString("<div><!-- foo --></div>", "text/html")!;
  const div = doc.querySelector("div")!;

  assert(div.outerHTML === "<div><!-- foo --></div>");
});

Deno.test("Comments show in innerHTML", () => {
  const doc = new DOMParser().parseFromString("<div><!-- foo --></div>", "text/html")!;
  const div = doc.querySelector("div")!;

  assert(div.innerHTML === "<!-- foo -->");
});

Deno.test("Dynamically inserted comments show in outerHTML", () => {
  const doc = new DOMParser().parseFromString("<div></div>", "text/html")!;
  const div = doc.querySelector("div")!;

  assert(div.outerHTML === "<div></div>");
  div.innerHTML = "foo <!-- bar -->"
  // @ts-ignore
  assert(div.outerHTML === "<div>foo <!-- bar --></div>");
});

