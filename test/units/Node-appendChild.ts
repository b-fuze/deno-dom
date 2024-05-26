import { DOMParser, Node } from "../../deno-dom-wasm.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Node.appendChild", () => {
  const doc = new DOMParser().parseFromString(
    `<div class=parent></div>`,
    "text/html",
  );
  const parent = doc.querySelector(".parent")!;
  const child = doc.createElement("div");

  parent.appendChild(child);

  assertEquals(child.parentNode, parent, "parentNode has changed");
  assertEquals(
    parent.outerHTML,
    `<div class="parent"><div></div></div>`,
    "parent HTML reflects the new child",
  );
});

Deno.test("Node.appendChild throws", () => {
  const doc = new DOMParser().parseFromString(
    `<div class=parent><div class=child></div></div>`,
    "text/html",
  );
  const parent = doc.querySelector(".parent")!;
  const child = doc.querySelector(".child")!;

  assertThrows(
    () => {
      child.appendChild(parent);
    },
    DOMException,
    "The new child is an ancestor of the parent",
  );
});

Deno.test("Node.appendChild throws with new parent & grandchild", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div class=parent>
        <div class=child>
          <div class=grandchild></div>
        </div>
      </div>
      <div class=newparent></div>
    `,
    "text/html",
  );
  const newParent = doc.querySelector(".newparent")!;
  const child = doc.querySelector(".child")!;
  const grandChild = doc.querySelector(".grandchild")!;

  // Change parents
  newParent.appendChild(child);

  assertThrows(
    () => {
      child.appendChild(newParent);
    },
    DOMException,
    "The new child is an ancestor of the parent",
    "throw on new direct child",
  );

  assertThrows(
    () => {
      grandChild.appendChild(newParent);
    },
    DOMException,
    "The new child is an ancestor of the parent",
    "throw on new grandchild",
  );
});
