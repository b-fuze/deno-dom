import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertEquals } from "assert";

Deno.test("Element.before with siblings", () => {
  const doc = new DOMParser().parseFromString(
    `<div id="parent"><a></a><b></b><c></c></div>`,
    "text/html",
  );
  const parent = doc.getElementById("parent")!;
  const a = doc.querySelector("a")!;
  const b = doc.querySelector("b")!;
  const c = doc.querySelector("c")!;
  b.before(c, a);
  assertEquals(parent.innerHTML, "<c></c><a></a><b></b>");
});

Deno.test("Element.before with current node", () => {
  const doc = new DOMParser().parseFromString(
    `<div id="parent"><a></a><b></b><c></c></div>`,
    "text/html",
  );
  const parent = doc.getElementById("parent")!;
  const b = doc.querySelector("b")!;
  const c = doc.querySelector("c")!;
  b.before(b, c);
  assertEquals(parent.innerHTML, "<a></a><b></b><c></c>");
});

Deno.test("Element.after with siblings", () => {
  const doc = new DOMParser().parseFromString(
    `<div id="parent"><a></a><b></b><c></c></div>`,
    "text/html",
  );
  const parent = doc.getElementById("parent")!;
  const a = doc.querySelector("a")!;
  const b = doc.querySelector("b")!;
  const c = doc.querySelector("c")!;
  b.after(c, a);
  assertEquals(parent.innerHTML, "<b></b><c></c><a></a>");
});

Deno.test("Element.after with current node", () => {
  const doc = new DOMParser().parseFromString(
    `<div id="parent"><a></a><b></b><c></c></div>`,
    "text/html",
  );
  const parent = doc.getElementById("parent")!;
  const b = doc.querySelector("b")!;
  const c = doc.querySelector("c")!;
  b.after(c, b);
  assertEquals(parent.innerHTML, "<a></a><c></c><b></b>");
});

Deno.test("Element.replaceWith with siblings", () => {
  const doc = new DOMParser().parseFromString(
    `<div id="parent"><a></a><b></b><c></c></div>`,
    "text/html",
  );
  const parent = doc.getElementById("parent")!;
  const a = doc.querySelector("a")!;
  const b = doc.querySelector("b")!;
  b.replaceWith(a);
  assertEquals(parent.innerHTML, "<a></a><c></c>");
});

Deno.test("Element.replaceWith with current node", () => {
  const doc = new DOMParser().parseFromString(
    `<div id="parent"><a></a><b></b><c></c></div>`,
    "text/html",
  );
  const parent = doc.getElementById("parent")!;
  const a = doc.querySelector("a")!;
  const b = doc.querySelector("b")!;
  b.replaceWith(b, a);
  assertEquals(parent.innerHTML, "<b></b><a></a><c></c>");
});
