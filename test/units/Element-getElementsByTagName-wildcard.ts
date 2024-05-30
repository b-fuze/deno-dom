import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertStrictEquals as assertEquals } from "assert";

Deno.test("Element.getElementsByTagName(wildcard)", () => {
  const doc = new DOMParser().parseFromString(
    `
    <div id=parent>
      <p>
        <button>Hello, <b>world!</b></button>
      </p>
      <img src=foo.png>
    </div>
  `,
    "text/html",
  );

  const parent = doc.querySelector("#parent")!;

  assertEquals(parent.getElementsByTagName("*").length, 4);
});
