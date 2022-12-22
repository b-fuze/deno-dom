import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertStrictEquals as assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";

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
  )!;

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
  )!;

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
  const doc = new DOMParser().parseFromString(html, "text/html")!;

  const htmlElement = doc.documentElement!;
  assertEquals(htmlElement.outerHTML.length > 0, true);
});
