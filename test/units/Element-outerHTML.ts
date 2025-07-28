import { DOMParser } from "../../deno-dom-wasm.ts";
import {
  assertStrictEquals as assertEquals,
  assertThrows,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

// TODO: More comprehensive tests

Deno.test("Element.outerHTML", () => {
  const doc = new DOMParser().parseFromString(
    `
      <button onclick=false data-foo="bar baz">Hi, <strong qux>there!</strong></button>
    `,
    "text/html",
  )!;

  const button = doc.querySelector("button")!;
  assertEquals(
    button.outerHTML,
    `<button onclick="false" data-foo="bar baz">Hi, <strong qux="">there!</strong></button>`,
  );
});

Deno.test("Element.outerHTML rawtext elements don't get XML escaped", () => {
  const doc = new DOMParser().parseFromString(
    `
      <script>((a,b) => a < b)(1337, 42 & 0);</script>
      <div>((a,b) => a < b)(1337, 42 & 0);</div>
    `,
    "text/html",
  );

  const script = doc.querySelector("script")!;
  const div = doc.querySelector("div")!;
  assertEquals(
    script.outerHTML,
    `<script>((a,b) => a < b)(1337, 42 & 0);</script>`,
  );
  assertEquals(
    div.outerHTML,
    `<div>((a,b) =&gt; a &lt; b)(1337, 42 &amp; 0);</div>`,
  );
});

Deno.test("Element.outerHTML void elements don't print their contents", () => {
  const doc = new DOMParser().parseFromString(
    `<img src="./foo.png" class="bar"/> <img class="invalid-img"></img> <div>unclosed`,
    "text/html",
  );

  const body = doc.querySelector("body")!;
  assertEquals(
    body.outerHTML,
    `<body><img src="./foo.png" class="bar"> <img class="invalid-img"> <div>unclosed</div></body>`,
  );

  const img = doc.querySelector("img")!;
  img.append(Object.assign(doc.createElement("div"), {
    textContent: "you shouldn't be here",
  }));

  assertEquals(img.outerHTML, `<img src="./foo.png" class="bar">`);
  assertEquals(img.innerHTML, `<div>you shouldn't be here</div>`);
});

Deno.test("Element.outerHTML won't overflow the stack for deeply nested HTML", () => {
  const html = new Array(2000)
    .fill("<div>Hello ")
    .reduce((acc, tag, i) => tag + (i + 1) + acc + "</div>", "");
  const doc = new DOMParser().parseFromString(html, "text/html");

  const htmlElement = doc.documentElement!;
  assertEquals(htmlElement.outerHTML.length > 0, true);
});

Deno.test("Element.outerHTML can be set to replace element", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div class=parent><div class=child></div></div>
      <div class=otherparent><span>1st</span><div class=otherchild>second</div><!--third--></div>
      <table><tbody><tr><td>hello</td></tr></tbody></table>
    `,
    "text/html",
  );
  const parent = doc.querySelector(".parent")!;
  const child = doc.querySelector(".child")!;
  const otherParent = doc.querySelector(".otherparent")!;
  const otherChild = doc.querySelector(".otherchild")!;
  const tbody = doc.querySelector("tbody")!;
  const tr = tbody.children[0];

  const newHTML =
    `<span>foo <em>fib</em></span>text nodes<strong fizz=qux>bar</strong><!--comment-->`;
  const serializedNewHTML = newHTML.replace("qux", '"qux"');
  child.outerHTML = newHTML;

  assertEquals(child.parentNode, null);
  assertEquals(
    Array.from(parent.childNodes).find((node) => node === child),
    undefined,
  );
  assertEquals(parent.children.length, 2);
  assertEquals(parent.childNodes.length, 4);
  assertEquals(parent.innerHTML, serializedNewHTML);

  const newChild = parent.children[0];
  newChild.outerHTML = `<tr><td>goodbye</td></tr>`;
  assertEquals(newChild.parentNode, null);
  assertEquals(
    Array.from(parent.childNodes).find((node) => node === newChild),
    undefined,
  );
  assertEquals(parent.children.length, 1);
  assertEquals(parent.childNodes.length, 4);
  assertEquals(
    parent.innerHTML,
    "goodbye" + serializedNewHTML.slice(serializedNewHTML.indexOf("text")),
  );

  assertEquals(tbody.innerHTML, `<tr><td>hello</td></tr>`);
  tr.outerHTML = `<tr><td>goodbye</td></tr>`;

  assertEquals(tr.parentNode, null);
  assertEquals(
    Array.from(tbody.childNodes).find((node) => node === tr),
    undefined,
  );
  assertEquals(tbody.children.length, 1);
  assertEquals(tbody.childNodes.length, 1);
  assertEquals(tbody.innerHTML, `<tr><td>goodbye</td></tr>`);

  otherChild.outerHTML = `<aside>seconded</aside><!--not counted-->`;

  assertEquals(otherChild.parentNode, null);
  assertEquals(otherChild.parentElement, null);
  assertEquals(
    Array.from(otherParent.childNodes).find((node) => node === otherChild),
    undefined,
  );
  assertEquals(otherParent.children.length, 2);
  assertEquals(otherParent.childNodes.length, 4);
  assertEquals(
    otherParent.outerHTML,
    `<div class="otherparent"><span>1st</span><aside>seconded</aside><!--not counted--><!--third--></div>`,
  );

  const solitaryDiv = doc.createElement("div");
  solitaryDiv.outerHTML = `<span>no-op</span>`;

  assertEquals(solitaryDiv.parentNode, null);
  assertEquals(solitaryDiv.outerHTML, `<div></div>`);

  const frag = doc.createDocumentFragment();
  const fragChild = doc.createElement("div");
  frag.appendChild(fragChild);
  assertEquals(fragChild.parentNode, frag);
  assertEquals(frag.childNodes[0].nodeName, "DIV");
  assertEquals(frag.childNodes.length, 1);

  fragChild.outerHTML = `
    <aside></aside>
    <!---->
    <tr><td>only text nodes allowed</td></tr>
    <button></button>
  `.replace(/\s{2,}/g, "");

  assertEquals(fragChild.parentNode, null);
  assertEquals(frag.children.length, 2);
  assertEquals(frag.childNodes.length, 4);
  assertEquals(
    Array.from(frag.childNodes).map((node) => node.nodeName).join("-"),
    "ASIDE-#comment-#text-BUTTON",
  );

  assertThrows(() => {
    doc.documentElement!.outerHTML = "<div>not new document element</div>";
  });
});

Deno.test(
  "setting Element.innerHTML should not escape <noscript> contents",
  () => {
    const doc = new DOMParser().parseFromString(
      `
        <div></div>
      `,
      "text/html",
    )!;

    const div = doc.querySelector("div")!;
    div.innerHTML = `<noscript><div id="fizz">foo & bar</div></noscript>`;
    const noscript = doc.querySelector("noscript")!;

    assertEquals(
      noscript.outerHTML,
      `<noscript><div id="fizz">foo & bar</div></noscript>`,
    );
  },
);
