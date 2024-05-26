import {
  Comment,
  DocumentFragment,
  DOMParser,
  Element,
  Node,
  Text,
} from "../../deno-dom-wasm.ts";
import {
  assert,
  assertNotStrictEquals as assetNotEquals,
  assertStrictEquals as assertEquals,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("DocumentFragment", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div id=parent></div>
    `,
    "text/html",
  );

  const parent = doc.querySelector("#parent")!;
  const frag = new DocumentFragment();
  const frag2 = doc.createDocumentFragment();
  frag.append("foo", new Comment("bar"), doc.createElement("img"));

  assertEquals(frag.childNodes.length, 3);
  assertEquals(frag.children.length, 1);
  assertEquals(frag.childNodes[0].nodeType, Node.TEXT_NODE);
  assertEquals(frag.childNodes[1].nodeValue, "bar");

  parent.appendChild(frag);

  assertEquals(frag.parentNode, null);
  assertEquals(frag.parentElement, null);
  assertEquals(frag.childNodes.length, 0);
  assertEquals(parent.childNodes.length, 3);
  assertEquals(parent.childNodes[0].nodeType, Node.TEXT_NODE);
  assertEquals(parent.childNodes[1].nodeValue, "bar");

  frag2.appendChild(doc.createElement("aside"));
  frag2.append(
    doc.createElement("p"),
    doc.createElement("button"),
    new Text("fizz"),
  );
  frag2.prepend(doc.createElement("div"));

  const newChildrenHtml = `
    <div class=a>
      <div class=b></div>
      <p>
        <img class="this-img" foo=bar />
      </p>
    </div>
  `;

  assert(frag2.lastElementChild);
  frag2.lastElementChild!.innerHTML = newChildrenHtml;

  assertEquals(frag2.childNodes.length, 5);
  assertEquals((frag2.childNodes[0] as Element).tagName, "DIV");
  assertEquals(frag2.children.length, 4);
  assertEquals(frag2.querySelector(".a .this-img[foo=bar]")?.tagName, "IMG");

  frag.insertBefore(frag2, null);

  assertEquals(frag2.parentNode, null);
  assertEquals(frag2.parentElement, null);
  assertEquals(frag2.childNodes.length, 0);
  assertEquals(frag2.querySelector(".a .this-img"), null);
  assertEquals(frag.childNodes.length, 5);
  assertEquals(frag.children.length, 4);

  parent.children[0].before(frag);

  assertEquals(parent.childNodes.length, 8);
  assertEquals((parent.childNodes[2] as Element).tagName, "DIV");
  assertEquals((parent.childNodes[3] as Element).tagName, "ASIDE");
  assertEquals(parent.querySelector(".a .this-img")?.tagName, "IMG");

  parent.after(frag);
  parent.after(frag2);

  assertEquals(frag.parentNode, null);
  assertEquals(frag.parentElement, null);
  assertEquals(frag2.parentNode, null);
  assertEquals(frag2.parentElement, null);
  assertEquals(doc.body.childNodes.length, 2);

  parent.replaceWith(frag);

  assertEquals(doc.body.childNodes.length, 1);
  assertEquals(doc.body.children.length, 0);

  const div = doc.createElement("div");
  const video = doc.createElement("video");
  doc.body.append(div);
  frag2.prepend(video);

  doc.body.replaceChild(frag2, div);

  assertEquals(doc.body.lastElementChild, video);
  assertEquals(frag2.childNodes.length, 0);
  assertEquals(frag2.parentNode, null);
  assertEquals(frag2.parentElement, null);
});

Deno.test("DocumentFragment.cloneNode", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div>foo <b>bar</b></div>
    `,
    "text/html",
  );
  const frag = doc.createDocumentFragment()!;
  const div = doc.querySelector("div")!;
  frag.append(div);

  const shallowFragClone = frag.cloneNode() as DocumentFragment;

  assertEquals(shallowFragClone.childNodes.length, 0);
  assertEquals(shallowFragClone.children.length, 0);
  assertEquals(shallowFragClone.querySelectorAll("*").length, 0);
  assetNotEquals(frag, shallowFragClone);

  const deepFragClone = frag.cloneNode(true) as DocumentFragment;

  assertEquals(deepFragClone.childNodes.length, 1);
  assertEquals(deepFragClone.children.length, 1);
  assertEquals(
    deepFragClone.children[0].outerHTML,
    `<div>foo <b>bar</b></div>`,
  );
  assertEquals(deepFragClone.querySelectorAll("*").length, 2);
  assetNotEquals(frag, deepFragClone);
  assetNotEquals(shallowFragClone, deepFragClone);
  assetNotEquals(div, deepFragClone.children[0]);
});
