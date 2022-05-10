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

Deno.test("rawtext elements don't get XML escaped", () => {
  const doc = new DOMParser().parseFromString(
    `
      <script>((a,b) => a < b)(1337, 42 & 0);</script>
    `,
    "text/html",
  )!;

  const script = doc.querySelector("script")!;
  assertEquals(
    script.outerHTML,
    `<script>((a,b) => a < b)(1337, 42 & 0);</script>`,
  );
});
