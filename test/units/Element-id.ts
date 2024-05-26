import { Comment, DOMParser, Node } from "../../deno-dom-wasm.ts";
import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Element.id", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div id=parent />
    `,
    "text/html",
  );

  const parent = doc.querySelector("#parent");

  if (!parent) throw new Error("Expected parent");

  assertEquals(parent.children.length, 0);
  assertEquals(parent.id, "parent");
  assertEquals(parent.getAttribute("id"), "parent");

  let nextId = `parent${Math.random()}`;

  parent.id = nextId;

  assertEquals(parent.id, nextId);
  assertEquals(parent.getAttribute("id"), nextId);

  nextId = `parent${Math.random()}`;

  parent.setAttribute("id", nextId);

  assertEquals(parent.id, nextId);
  assertEquals(parent.getAttribute("id"), nextId);
});
