import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertEquals } from "assert";

Deno.test("Adjacent siblings", () => {
  const doc = new DOMParser().parseFromString(
    // !!! Do not change formatting as it will  !!!
    // !!! change text nodes and break the test !!!
    `<div class=main>
        <div class=a>a</div><div class=b>b</div><!-- foo bar --><div class=c>c</div>
      </div>`,
    "text/html",
  );
  const divMain = doc.querySelector(".main");
  const divA = doc.querySelector(".a");
  const divB = doc.querySelector(".b");
  const divC = doc.querySelector(".c");
  const comment = doc.querySelector(".main")?.childNodes[3]!;

  assertEquals(divMain?.nextSibling, null, "null is div.main's nextSibling");
  assertEquals(
    divMain?.previousSibling,
    null,
    "null is div.main's previousSibling",
  );

  assertEquals(divA?.nextSibling, divB, "div.b is div.a's nextSibling");
  assertEquals(divB?.previousSibling, divA, "div.a is div.b's previousSibling");
  assertEquals(divB?.nextSibling, comment, "comment is div.b's nextSibling");
  assertEquals(
    divC?.previousSibling,
    comment,
    "comment is div.c's previousSibling",
  );

  assertEquals(
    divMain?.nextElementSibling,
    null,
    "null is div.main's nextElementSibling",
  );
  assertEquals(
    divMain?.previousElementSibling,
    null,
    "null is div.main's previousElementSibling",
  );

  assertEquals(
    divB?.nextElementSibling,
    divC,
    "div.c is div.b's nextElementSibling",
  );
  assertEquals(
    divC?.previousElementSibling,
    divB,
    "div.b is div.c's previousElementSibling",
  );
});
