import { DOMParser } from "../../deno-dom-wasm.ts";
import {
  assertStrictEquals as assertEquals,
  assertThrows,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Element.getAttributeNode", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div class=foo data-test=value>some content</div>
    `,
    "text/html",
  );

  const div = doc.querySelector("div")!;
  const classAttrElementGetter = div.getAttributeNode("class");
  const classAttrNamedNodeMap = div.attributes.getNamedItem("class");
  const classAttrNamedNodeMapIndex = div.attributes[0];

  assertEquals(classAttrElementGetter?.name, "class");
  assertEquals(classAttrElementGetter?.value, "foo");

  assertEquals(
    classAttrElementGetter,
    classAttrNamedNodeMap,
  );

  assertEquals(
    classAttrElementGetter,
    classAttrNamedNodeMapIndex,
  );

  div.removeAttribute("class");
  const classAttrNull = div.getAttributeNode("class");

  assertEquals(classAttrNull, null);

  const dataClassAttrElementGetter = div.getAttributeNode("data-test");
  const dataClassAttrNamedNodeMap = div.attributes.getNamedItem("data-test");

  assertEquals(dataClassAttrElementGetter?.name, "data-test");
  assertEquals(dataClassAttrElementGetter?.value, "value");

  assertEquals(
    dataClassAttrElementGetter,
    dataClassAttrNamedNodeMap,
  );

  const dataClassAttrNamedNodeMapIndex = div.attributes[0];

  assertEquals(
    dataClassAttrElementGetter,
    dataClassAttrNamedNodeMapIndex,
  );
});

Deno.test("Element.setAttributeNode", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div class=foo data-test=foo-value>some content</div>
      <div class=bar data-test=bar-value>other content</div>
    `,
    "text/html",
  );

  const divFoo = doc.querySelector(".foo")!;
  const divBar = doc.querySelector(".bar")!;
  const barAttr = divBar.getAttributeNode("class");

  const existingFooClassAttr = divFoo.getAttributeNode("class")!;
  const clonedFooClassAttr = existingFooClassAttr.cloneNode();
  const oldClassAttr = divBar.setAttributeNode(clonedFooClassAttr);

  assertEquals(barAttr, oldClassAttr);
  assertEquals(divBar.className, "foo");

  divBar.removeAttribute("data-test");

  const clonedFooDataAttr = divFoo.getAttributeNode("data-test")!.cloneNode();
  const oldDataAttr = divBar.setAttributeNode(clonedFooDataAttr);

  assertEquals(oldDataAttr, null);

  assertThrows(() => {
    divBar.setAttributeNode(existingFooClassAttr);
  });
});
