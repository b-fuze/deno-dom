import {
  DocumentFragment,
  DOMParser,
  HTMLTemplateElement,
  NodeType,
} from "../../deno-dom-wasm.ts";
import { assertStrictEquals as assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";

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
  )!;

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
