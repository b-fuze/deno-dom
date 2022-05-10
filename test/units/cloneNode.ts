import { DOMParser, Element, Node } from "../../deno-dom-wasm.ts";
import {
  assert,
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("cloneNode", () => {
  const doc = new DOMParser().parseFromString(
    `
    a
    <p>b</p>
    <ul><li>c</li></ul>
    <!-- d -->
    <a id="e">e</a>
  `,
    "text/html",
  )!;

  checkClone(doc, doc.cloneNode(true));
});

function checkClone(node: Node, clone: Node) {
  assert(clone instanceof Node);
  assert(node !== clone);
  if (node instanceof Element) {
    assertEquals((node as Element).outerHTML, (clone as Element).outerHTML);
  } else {
    assertEquals(node.nodeName, clone.nodeName);
    assertEquals(node.nodeValue, clone.nodeValue);
  }
  assertEquals(node.childNodes.length, clone.childNodes.length);
  for (let index = 0; index < node.childNodes.length; index++) {
    checkClone(node.childNodes[index], clone.childNodes[index]);
  }
}
