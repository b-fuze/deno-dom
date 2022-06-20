import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertEquals } from "https://deno.land/std@0.139.0/testing/asserts.ts";
import { HTMLElement } from "../../src/dom/elements/html/html-element.ts";

// FIXME: should be HTMLElement but it's not implemented yet
Deno.test("Element#innerText", () => {
  const doc = new DOMParser().parseFromString(
    `<div>foo <strong>bar</strong></div>`,
    "text/html",
  )!;
  const div = doc.querySelector("div") as HTMLElement;

  assertEquals(div.innerText, div.textContent, "innerText equals textContent");
  div.innerHTML = "<em>qux</em> fizz";
  assertEquals(
    div.innerText,
    "qux fizz",
    "innerText reflects innerHTML changes",
  );
  div.innerText = "42 divs";
  assertEquals(
    div.textContent,
    "42 divs",
    `setting innerText, expected "42 divs", got "${div.textContent}"`,
  );
  div.innerText = "foo\nbar";
  assertEquals(
    div.textContent,
    "foobar",
    `setting innerText with line break, expected "foobar", got "${div.textContent}"`,
  );
  assertEquals(
    div.innerHTML,
    "foo<br>bar",
    `setting innerText with line break, expected "foo<br>bar", got "${div.textContent}"`,
  );
});
