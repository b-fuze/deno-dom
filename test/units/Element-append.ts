import { DOMParser, Comment, Node } from "../../deno-dom-wasm.ts";
import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Element.append", () => {
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
  const childB = doc.querySelector("#childB")!;

  assertEquals(parent.childNodes.length, 7);
  assertEquals(parent.children.length, 2);

  parent.append(new Comment(), doc.createElement("img"), "beef");

  assertEquals(parent.lastChild.nodeValue, "beef");
  assertEquals(parent.lastChild.nodeType, Node.TEXT_NODE);
  assertEquals(parent.childNodes.length, 10);
  assertEquals(parent.children.length, 3);

  parent.append(childB);

  assertEquals(parent.childNodes.length, 10);
  assertEquals(parent.children.length, 3);
  assertEquals(childB.parentNode, parent);

  parent.append();

  assertEquals(parent.childNodes.length, 10);
  assertEquals(parent.children.length, 3);

  const otherChildren = (["foo"] as (Node | string)[])
    .concat(Array.from(parent.childNodes))
    .filter((node) => node !== childB);

  childB.append(...otherChildren);

  assertEquals(parent.childNodes.length, 1);
  assertEquals(parent.children.length, 1);
  assertEquals(childB.childNodes.length, 13);
  assertEquals(childB.children.length, 5);
});

