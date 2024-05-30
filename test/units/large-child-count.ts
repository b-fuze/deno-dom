import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertStrictEquals as assertEquals } from "assert";

Deno.test("Deserialize and query large child count", () => {
  const doc = new DOMParser().parseFromString(
    `<div id="parent"></div>`,
    "text/html",
  );

  // Arbitrarily large number that causes a stack overflow on
  // my machine. Probably not a good test, but it works for now.
  const childCount = 0x22222;
  const childHtml = `<div class="foo">bar</div>`;
  const parent = doc.querySelector("#parent")!;
  parent.innerHTML = new Array(childCount).fill(childHtml).join("");
  const childrenDoc = doc.querySelectorAll(".foo");
  const childrenParent = parent.querySelectorAll(".foo");
  assertEquals(childrenDoc.length, childCount);
  assertEquals(childrenParent.length, childCount);
});
