import { DOMParser, Node } from "../../deno-dom-wasm.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Node.removeChild", () => {
  const doc = new DOMParser().parseFromString(
    `<div class=parent><div class=child></div></div>`,
    "text/html",
  );
  const parent = doc.querySelector(".parent")!;
  const child = doc.querySelector(".child")!;

  const removedChild = parent.removeChild(child);
  assertEquals(child.parentNode, null, "parentNode is null");
  assertEquals(removedChild, child);
  assertEquals(
    parent.outerHTML,
    `<div class="parent"></div>`,
    "parent HTML reflects the removed child",
  );
});

Deno.test("Node.removeChild throws", () => {
  const doc = new DOMParser().parseFromString(
    `<div class=parent><div class=child></div></div>`,
    "text/html",
  );
  const parent = doc.querySelector(".parent")!;
  const child = doc.querySelector(".child")!;
  parent.removeChild(child);

  assertThrows(
    () => {
      parent.removeChild(child);
    },
    DOMException,
    "The node to be removed is not a child",
  );
  assertThrows(
    () => {
      parent.removeChild(null as any as Node);
    },
    TypeError,
    "Argument 1 is not an object",
  );
});
