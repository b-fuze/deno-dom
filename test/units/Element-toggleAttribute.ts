import { DOMParser } from "../../deno-dom-wasm.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Element.toggleAttribute toggles attribute", () => {
  const doc = new DOMParser().parseFromString(
    `<input>`,
    "text/html",
  )!;

  const input = doc.querySelector("input")!;
  assert(!input.hasAttribute("disabled"));

  for (const _ of [1, 2]) {
    input.toggleAttribute("disabled", true);
    assertEquals(input.outerHTML, `<input disabled="">`);
  }

  for (const _ of [1, 2]) {
    input.toggleAttribute("disabled", false);
    assertEquals(input.outerHTML, `<input>`);
  }

  for (const _ of [1, 2]) {
    input.toggleAttribute("disabled");
    assertEquals(input.outerHTML, `<input disabled="">`);
    input.toggleAttribute("disabled");
    assertEquals(input.outerHTML, `<input>`);
  }
});
