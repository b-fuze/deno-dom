import { DOMParser } from "../../deno-dom-wasm.ts";
import {
  assertStrictEquals as assertEquals,
  assertThrows,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

// TODO: More comprehensive tests

Deno.test("Node.insertBefore", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div class=parent>
        <div class=child1></div>
        <div class=child2></div>
        <div class=child3><div class=child3_1></div></div>
      </div>
    `,
    "text/html",
  );

  const body = doc.body;
  const parent = doc.querySelector(".parent")!;
  const child1 = doc.querySelector(".child1")!;
  const child2 = doc.querySelector(".child2")!;
  const child3 = doc.querySelector(".child3")!;
  const child3_1 = doc.querySelector(".child3_1")!;

  assertEquals(parent.firstElementChild?.className, "child1");
  assertEquals(parent.children.length, 3);
  assertEquals(child2.parentNode, parent);
  parent.insertBefore(child2, child1);
  assertEquals(parent.firstElementChild?.className, "child2");
  assertEquals(parent.children.length, 3);
  assertEquals(child2.parentNode, parent);

  assertEquals(child3.childNodes.length, 1);
  assertEquals(child3.firstElementChild?.className, "child3_1");
  assertEquals(child3_1.parentNode, child3);
  parent.insertBefore(child3_1, null);
  assertEquals(parent.lastElementChild?.className, "child3_1");
  assertEquals(child3.childNodes.length, 0);
  assertEquals(child3.firstChild, null);
  assertEquals(child3_1.parentNode, parent);

  assertEquals(body.firstElementChild?.className, "parent");
  body.insertBefore(child2, parent);
  assertEquals(parent.firstElementChild?.className, "child1");
  assertEquals(body.children.length, 2);
  assertEquals(body.firstElementChild?.className, "child2");
  assertEquals(body.lastElementChild?.className, "parent");

  assertThrows(() => {
    parent.insertBefore(child3_1, child2);
  });
});
