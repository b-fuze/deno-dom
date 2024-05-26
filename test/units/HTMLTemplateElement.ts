import {
  DocumentFragment,
  DOMParser,
  HTMLTemplateElement,
  NodeType,
} from "../../deno-dom-wasm.ts";
import {
  assertNotStrictEquals as assertNotEquals,
  assertStrictEquals as assertEquals,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("HTMLTemplateElement", () => {
  const doc = new DOMParser().parseFromString(
    `
      <!DOCTYPE html>
      <html>
        <head>
          <title>testing <template></title>
        </head>
        <body>
          <h1>hello, world!</h1>
          <template class=templ-a>
            <button>click me!</button>
            <p>some things here</p>
            <article>stuff</article>
          </template>
          <template class=templ-b><b>foo <i>bar</i></b></template>
          <article>other stuff</article>
        </body>
      </html>
    `,
    "text/html",
  );

  const templA = doc.querySelector(".templ-a")! as HTMLTemplateElement;
  const templB = doc.querySelector(".templ-b")! as HTMLTemplateElement;
  const articles = doc.querySelectorAll("article")!;
  const paragraph = doc.querySelector("p");

  assertEquals(articles.length, 1);
  assertEquals(templA.childNodes.length + templB.childNodes.length, 0);
  assertEquals(templA.constructor, HTMLTemplateElement);
  assertEquals(templB.constructor, HTMLTemplateElement);
  assertEquals(templA.content.constructor, DocumentFragment);
  assertEquals(templB.content.constructor, DocumentFragment);
  assertEquals(paragraph, null);
  assertEquals(
    templB.outerHTML,
    `<template class="templ-b"><b>foo <i>bar</i></b></template>`,
  );

  templB.append(doc.createElement("div"), "Hello!");
  assertEquals(templB.childNodes.length, 2);

  // Make sure <template>'s outerHTML is unchanged
  assertEquals(
    templB.outerHTML,
    `<template class="templ-b"><b>foo <i>bar</i></b></template>`,
  );

  const innerContentA = templA.content;
  const innerContentB = templB.content;

  assertEquals(innerContentA.children.length, 3);
  assertEquals(innerContentB.children.length, 1);

  const innerParagraph = innerContentA.querySelector("p");

  assertEquals(innerParagraph?.textContent, "some things here");
  assertEquals(templB.content.querySelector("b")?.tagName, "B");

  // Clear contents, not template.childNodes
  templB.innerHTML = "";

  // Make sure .contents was emptied
  assertEquals(templB.outerHTML, `<template class="templ-b"></template>`);
  assertEquals(templB.content.querySelector("b"), null);

  // Make sure the actual (not .contents) child nodes are still there
  assertEquals(templB.childNodes.length, 2);

  templB.innerHTML = `<aside>Some foo things</aside>`;

  // Make sure the actual (not .contents) child nodes haven't changed
  assertEquals(templB.childNodes.length, 2);

  // Check that our new <aside> is there by checking for its chlld text node
  assertEquals(
    templB.content.querySelector("aside")?.childNodes[0].nodeType,
    NodeType.TEXT_NODE,
  );

  // Remove all children
  for (const node of [...templB.childNodes]) {
    templB.removeChild(node);
  }

  assertEquals(templB.childNodes.length, 0);
  assertEquals(
    templB.outerHTML,
    `<template class="templ-b"><aside>Some foo things</aside></template>`,
  );
});

Deno.test('document.createElement("template")', () => {
  const doc = new DOMParser().parseFromString("", "text/html");
  const templ = doc.createElement("template") as HTMLTemplateElement;

  assertEquals(templ.constructor, HTMLTemplateElement);
  assertEquals(templ.content?.constructor, DocumentFragment);
  assertEquals(templ.content.childNodes.length, 0);
});

Deno.test("HTMLTemplateElement.cloneNode", () => {
  const doc = new DOMParser().parseFromString(
    `
      <template id=first data-thing=something>
        <h1>foo</h1>
        <div>bar</div>
      </template>

      <template id=outer>
        <article>fizz</article>
        <p>important</p>
        <template id=inner>
          <aside>qux</aside>
        </template>
      </template>
    `,
    "text/html",
  );

  const templ = doc.querySelector("template#first") as HTMLTemplateElement;
  const templShallowClone = templ.cloneNode();
  const templDeepClone = templ.cloneNode(true);

  assertEquals(templShallowClone.constructor, HTMLTemplateElement);
  assertEquals(templDeepClone.constructor, HTMLTemplateElement);
  assertEquals(templShallowClone.content?.constructor, DocumentFragment);
  assertEquals(templDeepClone.content?.constructor, DocumentFragment);

  assertEquals(templ.getAttribute("data-thing"), "something");
  assertEquals(templShallowClone.getAttribute("data-thing"), "something");
  assertEquals(templDeepClone.getAttribute("data-thing"), "something");

  assertEquals(templShallowClone.content.childNodes.length, 0);
  assertEquals(templDeepClone.content.childNodes.length, 5);
  assertNotEquals(templShallowClone.content, templ.content);
  assertNotEquals(templDeepClone.content, templ.content);

  assertNotEquals(
    templDeepClone.content.childNodes[0],
    templ.content.childNodes[0],
  );
  assertNotEquals(
    templDeepClone.content.childNodes[1],
    templ.content.childNodes[1],
  );
  assertEquals(templDeepClone.content.childNodes[0].nodeName, "#text");
  assertEquals(templDeepClone.content.childNodes[1].nodeName, "H1");
  assertEquals(
    templDeepClone.content.childNodes[0].nodeName,
    templ.content.childNodes[0].nodeName,
  );
  assertEquals(
    templDeepClone.content.childNodes[1].nodeName,
    templ.content.childNodes[1].nodeName,
  );
  assertEquals(
    templDeepClone.content.childNodes[0].textContent,
    templ.content.childNodes[0].textContent,
  );
  assertEquals(
    templDeepClone.content.childNodes[1].textContent,
    templ.content.childNodes[1].textContent,
  );

  assertEquals(templ.querySelector("h1"), null);
  assertEquals(templDeepClone.querySelector("h1"), null);
  assertEquals(templ.content.querySelector("h1")?.textContent, "foo");
  assertEquals(templDeepClone.content.querySelector("h1")?.textContent, "foo");
  assertNotEquals(
    templDeepClone.content.querySelector("h1"),
    templ.content.querySelector("h1"),
  );

  const outer = doc.querySelector("#outer") as HTMLTemplateElement;
  const wrongInner = doc.querySelector("#inner") as HTMLTemplateElement | null;
  const inner = outer.content.querySelector("#inner") as HTMLTemplateElement;

  assertEquals(wrongInner, null);
  assertEquals(outer.constructor, HTMLTemplateElement);
  assertEquals(inner.constructor, HTMLTemplateElement);

  assertEquals(outer.content.querySelector("article")?.textContent, "fizz");
  assertEquals(outer.content.querySelector("aside")?.textContent, undefined);
  assertEquals(inner.content.querySelector("aside")?.textContent, "qux");

  const outerShallowClone = outer.cloneNode();
  const outerDeepClone = outer.cloneNode(true);

  assertNotEquals(outer, outerShallowClone);
  assertNotEquals(outer, outerDeepClone);
  assertNotEquals(outer.content, outerShallowClone.content);
  assertNotEquals(outer.content, outerDeepClone.content);
  assertNotEquals(outerShallowClone.content, outerDeepClone.content);

  const outerDeepCloneInner = outerDeepClone.content.querySelector(
    "#inner",
  ) as HTMLTemplateElement;

  assertEquals(outerShallowClone.content.childNodes.length, 0);
  assertEquals(outerDeepClone.content.childNodes.length, 7);
  assertEquals(outerShallowClone.querySelector("#inner"), null);
  assertEquals(outerShallowClone.content.querySelector("#inner"), null);
  assertEquals(outerDeepClone.querySelector("#inner"), null);
  assertEquals(outerDeepCloneInner.constructor, HTMLTemplateElement);

  assertNotEquals(outerDeepCloneInner, inner);
  assertNotEquals(outerDeepCloneInner.content, inner.content);
  assertEquals(outerDeepCloneInner.childNodes.length, 0);
  assertEquals(
    outerDeepCloneInner.content.childNodes.length,
    inner.content.childNodes.length,
  );
  assertEquals(outerDeepCloneInner.content.children[0].textContent, "qux");
  assertEquals(
    outerDeepCloneInner.content.children[0].textContent,
    inner.content.children[0].textContent,
  );
  assertEquals(
    outerDeepCloneInner.content.children[0].tagName,
    inner.content.children[0].tagName,
  );
  assertNotEquals(
    outerDeepCloneInner.content.children[0],
    inner.content.children[0],
  );

  outer.innerHTML = "";
  const emptyOuterShallowClone = outer.cloneNode();
  const emptyOuterDeepClone = outer.cloneNode(true);

  assertEquals(emptyOuterShallowClone.content.childNodes.length, 0);
  assertEquals(emptyOuterDeepClone.content.childNodes.length, 0);
  assertNotEquals(emptyOuterShallowClone.content, outer.content);
  assertNotEquals(emptyOuterDeepClone.content, outer.content);
  assertEquals(outer.querySelector("template"), null);
  assertEquals(emptyOuterDeepClone.querySelector("template"), null);

  outer.innerHTML =
    `<span>spanning</span><template id=other-inner><figure>pretty</figure></template>`;

  const replacedOuterShallowClone = outer.cloneNode();
  const replacedOuterDeepClone = outer.cloneNode(true);

  assertEquals(replacedOuterShallowClone.content.childNodes.length, 0);
  assertEquals(replacedOuterDeepClone.content.childNodes.length, 2);
  assertEquals(replacedOuterShallowClone.querySelector("span"), null);
  assertEquals(replacedOuterDeepClone.querySelector("span"), null);
  assertEquals(replacedOuterShallowClone.content.querySelector("span"), null);
  assertEquals(
    replacedOuterDeepClone.content.querySelector("span")?.tagName,
    "SPAN",
  );
  assertEquals(replacedOuterDeepClone.content.querySelector("figure"), null);

  const replacedOuterDeepCloneInner = replacedOuterDeepClone.content
    .querySelector("template") as HTMLTemplateElement;

  assertEquals(replacedOuterDeepCloneInner?.constructor, HTMLTemplateElement);
  assertEquals(replacedOuterDeepCloneInner.querySelector("figure"), null);
  assertEquals(
    replacedOuterDeepCloneInner.content.querySelector("figure")?.tagName,
    "FIGURE",
  );

  replacedOuterDeepCloneInner.textContent = "";
  assertEquals(
    replacedOuterDeepCloneInner.content.querySelector("figure")?.tagName,
    "FIGURE",
  );

  replacedOuterDeepCloneInner.innerHTML = "";
  assertEquals(
    replacedOuterDeepCloneInner.content.querySelector("figure")?.tagName,
    undefined,
  );
});

Deno.test("HTMLTemplateElement parent will properly print its innerHTML", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div class=parent><template><p>foo bars</p></template></div>
    `,
    "text/html",
  );
  const templateParent = doc.querySelector(".parent")!;
  assertEquals(
    templateParent.outerHTML,
    `<div class="parent"><template><p>foo bars</p></template></div>`,
  );
});
