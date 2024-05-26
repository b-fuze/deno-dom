import { DOMParser } from "../../deno-dom-wasm.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Node.dispatchEvent", () => {
  const doc = new DOMParser().parseFromString(
    `<div></div>`,
    "text/html",
  );
  const div = doc.querySelector("div")!;
  let called = false;
  div.addEventListener("click", () => {
    called = true;
  });
  div.dispatchEvent(new Event("click"));
  assert(called);
});

Deno.test("Node.dispatchEvent, event bubbles", async () => {
  const doc = new DOMParser().parseFromString(
    `<div class="parent"><div class="child"></div></div>`,
    "text/html",
  );
  const parent = doc.querySelector(".parent")!;
  const child = doc.querySelector(".child")!;
  let called = false;
  // FIXME(kt3k): this empty event handler is necessary to work around
  // the bug in EventTarget impl in Deno.
  child.addEventListener("click", () => {});
  parent.addEventListener("click", () => {
    called = true;
  });
  child.dispatchEvent(new Event("click", { bubbles: true }));
  await new Promise<void>((resolve) => setTimeout(resolve, 100));
  assertEquals(called, true);
});

Deno.test("Node.removeEventListener removes the event listener", () => {
  const doc = new DOMParser().parseFromString(
    `<div></div>`,
    "text/html",
  );
  const div = doc.querySelector("div")!;
  let callCount = 0;
  const handler = () => {
    callCount++;
  };
  div.addEventListener("click", handler);
  div.dispatchEvent(new Event("click"));
  assertEquals(callCount, 1);
  div.removeEventListener("click", handler);
  div.dispatchEvent(new Event("click"));
  assertEquals(callCount, 1);
});
