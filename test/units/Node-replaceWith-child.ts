import { DOMParser, Element } from "../../deno-dom-wasm.ts";
import {
  assertEquals,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Node.replaceWith(childNode) correctly sets new childNode's parent", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div id=parent>
        <div id=child>
          <div id=grandchild></div>
        </div>
      </div>
    `,
    "text/html",
  )!;

  const child = doc.querySelector("#child")!;
  const grandchild = doc.querySelector("#grandchild")!;

  child.replaceWith(grandchild);
  assertEquals((grandchild.parentNode as Element).id, "parent");
});

