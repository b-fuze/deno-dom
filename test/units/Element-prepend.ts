import { Comment, DOMParser, Element, Node } from "../../deno-dom-wasm.ts";
import { assertStrictEquals as assertEquals } from "https://deno.land/std@0.139.0/testing/asserts.ts";

Deno.test("Element.prepend", () => {
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

  parent.prepend(new Comment(), doc.createElement("img"), "beef");

  assertEquals(parent.childNodes[2].nodeValue, "beef");
  assertEquals(parent.childNodes[2].nodeType, Node.TEXT_NODE);
  assertEquals((parent.childNodes[1] as Element).tagName, "IMG");
  assertEquals(parent.childNodes[0].nodeType, Node.COMMENT_NODE);
  assertEquals(parent.childNodes.length, 10);
  assertEquals(parent.children.length, 3);

  parent.prepend(childB);

  assertEquals(parent.childNodes.length, 10);
  assertEquals(parent.children.length, 3);
  assertEquals(childB.parentNode, parent);
  assertEquals(parent.childNodes[0], childB);

  parent.prepend();

  assertEquals(parent.childNodes.length, 10);
  assertEquals(parent.children.length, 3);

  const otherChildren = (["foo"] as (Node | string)[])
    .concat(Array.from(parent.childNodes))
    .filter((node) => node !== childB);

  childB.prepend(...otherChildren);

  assertEquals(parent.childNodes.length, 1);
  assertEquals(parent.children.length, 1);
  assertEquals(childB.childNodes.length, 13);
  assertEquals(childB.children.length, 5);
});
