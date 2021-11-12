import { DOMParser } from "../../deno-dom-wasm.ts";
import {
  assertEquals,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("setting Element.innerHTML yields children with correct .parentNode's", () => {
  const doc = new DOMParser().parseFromString(
    `<div id=parent></div>`,
    "text/html",
  )!;

  const parent = doc.querySelector("#parent")!;
  parent.innerHTML = `
    <div id=child></div>
  `;
  const child = doc.querySelector("#child")!;

  assertEquals(child.parentNode, parent, "parentNode is the parent");
});
