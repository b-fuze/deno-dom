import { DOMParser } from "../../deno-dom-wasm.ts";
import {
  assertEquals as assertDeepEquals,
  assertNotStrictEquals as assertNotEquals,
  assertStrictEquals as assertEquals,
  assertThrows,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("NamedNodeMap", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div class=foo id=fizz data-foo="alpha beta gamma"></div>
      <article></article>
      <aside class=bar></article>
    `,
    "text/html",
  );

  const div = doc.querySelector("div")!;
  const article = doc.querySelector("article")!;
  const aside = doc.querySelector("aside")!;

  assertEquals(doc.querySelector(".foo"), div);
  assertEquals(doc.querySelector(".bar"), aside);
  assertEquals(div.attributes.length, 3);
  assertEquals(div.className, "foo");
  assertEquals(div.id, "fizz");

  assertNotEquals((div.attributes as any)["class"], "foo");
  assertNotEquals((div.attributes as any)["id"], "fizz");
  assertEquals(div.getAttribute("class"), "foo");
  assertEquals(div.getAttribute("id"), "fizz");
  assertEquals(div.getAttribute("data-foo"), "alpha beta gamma");

  // Check the value of an attr node by index
  // before it's created
  assertEquals(div.attributes[1]?.value, "fizz");

  assertEquals(div.attributes.getNamedItem("class")?.value, "foo");
  assertEquals(div.attributes.getNamedItem("id")?.value, "fizz");
  assertEquals(
    div.attributes.getNamedItem("data-foo")?.value,
    "alpha beta gamma",
  );

  assertEquals(div.attributes[0]?.value, "foo");
  assertEquals(div.attributes[1]?.value, "fizz");
  assertEquals(div.attributes[2]?.value, "alpha beta gamma");

  assertEquals(div.getAttribute("class"), "foo");
  assertEquals(div.getAttribute("id"), "fizz");
  assertEquals(div.getAttribute("data-foo"), "alpha beta gamma");

  assertEquals(div.attributes.item(0)?.name, "class");
  assertEquals(div.attributes.item(1)?.name, "id");
  assertEquals(div.attributes.item(2)?.name, "data-foo");

  assertEquals(div.attributes[0]?.ownerElement, div);
  assertEquals(div.attributes[1]?.ownerElement, div);
  assertEquals(div.attributes[2]?.ownerElement, div);

  assertDeepEquals(
    [...div.attributes].map((attr) => attr.value),
    ["foo", "fizz", "alpha beta gamma"],
  );

  assertDeepEquals(
    [...div.attributes].map((attr) => attr.name),
    ["class", "id", "data-foo"],
  );

  assertEquals(div.classList.contains("foo"), true);

  assertEquals(article.attributes.length, 0);
  assertEquals(article.className, "");
  assertEquals(article.id, "");

  assertEquals(article.getAttribute("class"), null);
  assertEquals(article.getAttribute("id"), null);

  // Remove classname attr node
  const classNameAttr = div.attributes.removeNamedItem("class");
  assertEquals(classNameAttr.ownerElement, null);
  assertEquals(div.attributes.getNamedItem("class"), null);

  assertThrows(() => {
    // removeNamedItem() should throw when there's no
    // attribute node with a matching name
    div.attributes.removeNamedItem("class");
  });

  assertEquals(div.className, "");
  assertEquals(div.classList.contains("foo"), false);
  assertEquals(div.getAttribute("class"), null);
  assertEquals(div.attributes.length, 2);
  assertEquals(div.attributes.item(0)?.name, "id");
  assertEquals(div.attributes.item(1)?.name, "data-foo");
  assertEquals(doc.querySelector(".foo"), null);

  assertDeepEquals(
    [...div.attributes].map((attr) => attr.value),
    ["fizz", "alpha beta gamma"],
  );

  assertDeepEquals(
    [...div.attributes].map((attr) => attr.name),
    ["id", "data-foo"],
  );

  // Check that we can querySelect the div through its id
  // before removing it
  assertEquals(doc.querySelector("#fizz"), div);

  const idAttrNode = div.attributes.getNamedItem("id")!;
  assertEquals(idAttrNode.ownerElement, div);

  // Remove id attribute node through `Element.removeAttribute`
  div.removeAttribute("id");

  assertEquals(div.attributes.length, 1);
  assertEquals(div.attributes[0]?.name, "data-foo");
  assertEquals(div.attributes[0]?.value, "alpha beta gamma");
  assertEquals(div.attributes[1], undefined);
  assertEquals(div.getAttribute("id"), null);
  assertEquals(div.id, "");
  assertEquals(doc.querySelector("#fizz"), null);
  assertEquals(idAttrNode.ownerElement, null);

  // Make sure attribute is in sync when changing its value
  div.attributes[0].value = "charlie delta";

  assertEquals(div.attributes[0]?.value, "charlie delta");
  assertEquals(div.getAttribute("data-foo"), "charlie delta");
  assertEquals(div.outerHTML, '<div data-foo="charlie delta"></div>');

  div.setAttribute("data-foo", "echo foxtrot");

  assertEquals(div.attributes[0]?.value, "echo foxtrot");
  assertEquals(div.getAttribute("data-foo"), "echo foxtrot");
  assertEquals(div.outerHTML, '<div data-foo="echo foxtrot"></div>');

  // Make sure the 0 slot is undefined before setting
  // the article's new className via the attr node
  assertEquals(article.attributes[0], undefined);
  assertEquals(article.outerHTML, "<article></article>");

  // Add classname attr node to other element
  article.attributes.setNamedItem(classNameAttr);

  assertEquals(article.attributes.length, 1);
  assertEquals(doc.querySelector(".foo"), article);
  assertEquals(classNameAttr.ownerElement, article);
  assertEquals(article.attributes[0], classNameAttr);
  assertEquals(article.attributes[0]?.value, "foo");
  assertEquals(article.outerHTML, '<article class="foo"></article>');

  article.classList.add("qux");

  assertEquals(doc.querySelector(".foo"), article);
  assertEquals(doc.querySelector(".qux"), article);
  assertEquals(article.className, "foo qux");
  assertEquals(article.getAttribute("class"), "foo qux");
  assertEquals(article.attributes[0]?.value, "foo qux");

  article.setAttribute("class", "");

  assertEquals(doc.querySelector(".foo"), null);
  assertEquals(doc.querySelector(".qux"), null);
  assertEquals(article.className, "");
  assertEquals(article.getAttribute("class"), "");
  assertEquals(article.attributes[0]?.value, "");

  article.attributes[0].value = "fib qux";

  assertEquals(article.getAttribute("class"), "fib qux");
  assertEquals(doc.querySelectorAll(".fib").length, 1);
  assertEquals(doc.querySelector(".fib"), article);
  assertEquals(doc.querySelector(".foo"), null);
  assertEquals(doc.querySelector(".bar"), aside);
  assertEquals(doc.querySelector(".qux"), article);
  assertEquals(article.className, "fib qux");
  assertEquals(article.getAttribute("class"), "fib qux");
  assertEquals(article.attributes[0].value, "fib qux");

  // Move class name attribute to other element
  aside.attributes.setNamedItem(article.attributes.removeNamedItem("class"));

  assertEquals(article.className, "");
  assertEquals(article.attributes.length, 0);
  assertEquals(article.getAttribute("class"), null);

  assertEquals(aside.getAttribute("class"), "fib qux");
  assertEquals(doc.querySelectorAll(".fib").length, 1);
  assertEquals(doc.querySelector(".fib"), aside);
  assertEquals(doc.querySelector(".foo"), null);
  assertEquals(doc.querySelector(".bar"), null);
  assertEquals(doc.querySelector(".qux"), aside);
  assertEquals(aside.className, "fib qux");
  assertEquals(aside.getAttribute("class"), "fib qux");
  assertEquals(aside.attributes[0].value, "fib qux");
  assertEquals(aside.attributes.length, 1);

  // Clone attribute node
  const classNameAttrClone = aside.attributes[0].cloneNode();
  assertEquals(classNameAttrClone.ownerElement, null);

  article.attributes.setNamedItem(classNameAttrClone);

  assertEquals(classNameAttrClone.ownerElement, article);
  assertEquals(doc.querySelectorAll(".fib").length, 2);
  assertDeepEquals(
    [...doc.querySelectorAll(".fib")].map((node) => node.nodeName),
    ["ARTICLE", "ASIDE"],
  );

  assertEquals(article.classList.contains("fib"), true);
  assertEquals(article.classList.contains("qux"), true);
  assertEquals(article.className, "fib qux");
  assertEquals(article.getAttribute("class"), "fib qux");
  assertEquals(article.attributes[0].value, "fib qux");
  assertEquals(article.attributes.length, 1);

  classNameAttrClone.value = "other";

  assertEquals(article.classList.contains("fib"), false);
  assertEquals(article.classList.contains("qux"), false);
  assertEquals(article.getAttribute("class"), "other");
  assertEquals(article.className, "other");
  assertEquals(doc.querySelectorAll(".fib").length, 1);
  assertEquals(doc.querySelector(".other"), article);
});

Deno.test("NamedNodeMap stores unsafe Javascript property names", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div Constructor=fizz __pRoTo__=qux constructor=foo __proto__=bar></div>
    `,
    "text/html",
  );

  const div = doc.querySelector("div")!;

  assertEquals(div.getAttribute("constructor"), "fizz");
  assertEquals(div.getAttribute("__proto__"), "qux");
});

Deno.test("Uninitialized NamedNodeMap preserves ID and className attribute ordering", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div id=foo class=bar></div>
      <div class=baz id=fizz></div>
      <div id=only></div>
      <div class=only></div>
      <div data-others class=some-class id=some-id></div>
      <div id=some-other-id data-more-others class=some-other-class></div>
    `,
    "text/html",
  );

  const div1 = doc.querySelector("#foo")!;
  const div2 = doc.querySelector("#fizz")!;
  const div3 = doc.querySelector("#only")!;
  const div4 = doc.querySelector(".only")!;
  const div5 = doc.querySelector("[data-others]")!;
  const div6 = doc.querySelector("[data-more-others]")!;

  assertDeepEquals(div1.getAttributeNames(), ["id", "class"]);
  assertDeepEquals(div2.getAttributeNames(), ["class", "id"]);
  assertDeepEquals(div3.getAttributeNames(), ["id"]);
  assertDeepEquals(div4.getAttributeNames(), ["class"]);
  assertDeepEquals(div5.getAttributeNames(), ["data-others", "class", "id"]);
  assertDeepEquals(div6.getAttributeNames(), [
    "id",
    "data-more-others",
    "class",
  ]);

  // Test that ordering is undisturbed when setting id/class a second time
  div1.setAttribute("id", "div1-id");
  div2.setAttribute("class", "div2-class");

  assertDeepEquals(div1.getAttributeNames(), ["id", "class"]);
  assertDeepEquals(div2.getAttributeNames(), ["class", "id"]);

  // Test that ordering is altered when removing and re-adding
  div1.removeAttribute("id");
  div2.removeAttribute("class");

  assertDeepEquals(div1.getAttributeNames(), ["class"]);
  assertDeepEquals(div2.getAttributeNames(), ["id"]);

  div1.setAttribute("id", "foo");
  div2.setAttribute("class", "baz");

  assertDeepEquals(div1.getAttributeNames(), ["class", "id"]);
  assertDeepEquals(div2.getAttributeNames(), ["id", "class"]);

  // Test attribute ordering is preserved after NamedNodeMap initialization
  div1.setAttribute("data-fizz", "");
  div2.removeAttribute("id");
  div2.setAttribute("data-foo", "");
  div2.setAttribute("id", "new-id");

  assertDeepEquals(div1.getAttributeNames(), ["class", "id", "data-fizz"]);
  assertDeepEquals(div2.getAttributeNames(), ["class", "data-foo", "id"]);
});
