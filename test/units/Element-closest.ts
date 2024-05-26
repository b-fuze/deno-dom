import { DOMParser } from "../../deno-dom-wasm.ts";
import { assert } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Element-closest", () => {
  const doc = new DOMParser().parseFromString(
    `
    <html class="class-a" id="a">
      <body class="class-b" id="b">
        <div class="class-c" id="c">
          <div class="class-d" id="d"></div>
        </div>
      </body>
    </html>
  `,
    "text/html",
  );
  const a = doc.getElementById("a")!;
  const b = doc.getElementById("b")!;
  const c = doc.getElementById("c")!;
  const d = doc.getElementById("d")!;

  // Match self
  assert(d.closest(".class-d") === d);

  // Match parent
  assert(d.closest(".class-c") === c);

  // Match grandparent
  assert(d.closest(".class-b") === b);

  // Match document element
  assert(d.closest(".class-a") === a);

  // No match
  assert(d.closest(".class-no-match") === null);
});
