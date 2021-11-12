import { DOMParser } from "../../deno-dom-wasm.ts";
import {
  assertEquals,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Element.children stays in sync with Node.childNodes", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div id=parent>
        <div id=childA></div>
        <!-- some comment -->
        <div id=childB><img><span></span><b></b></div>
      </div>
    `,
    "text/html",
  )!;

  const parent = doc.querySelector("#parent")!;
  const childA = doc.querySelector("#childA")!;
  const childB = doc.querySelector("#childB")!;
  const childBSpan = childB.querySelector("span")!;
  const childComment = parent.childNodes[2];

  const children = parent.children;
  const childBChildren = childB.children;

  // Removing comment node shouldn't affect
  // .children
  childComment.remove();

  assertEquals(children.length, 2);

  childA.remove();
  assertEquals(children.length, 1);

  assertEquals(childBChildren[1].tagName, "SPAN");

  childBSpan.remove();
  assertEquals(childBChildren[1].tagName, "B");

  parent.innerHTML = "";
  assertEquals(children.length, 0);

  parent.appendChild(doc.createComment());
  assertEquals(children.length, 0);

  parent.appendChild(doc.createElement("p"));
  assertEquals(children[0].tagName, "P");
});

