import { Comment, Document } from "../../deno-dom-wasm.ts";
import { assertEquals } from "https://deno.land/std@0.139.0/testing/asserts.ts";

Deno.test("Element.childElementCount with three children", () => {
  const document = new Document();
  const list = document.createElement("ul");
  for (let i = 0; i < 3; i++) {
    list.appendChild(document.createElement("li"));
  }
  assertEquals(list.childElementCount, 3);
});

Deno.test("Element.childElementCount with non-node", () => {
  const document = new Document();
  const divider = document.createElement("div");
  divider.appendChild(document.createElement("p"));
  divider.appendChild(new Comment());
  assertEquals(divider.childElementCount, 1);
});

Deno.test("Document.childElementCount with three children", () => {
  const document = new Document();
  for (let i = 0; i < 3; i++) {
    document.appendChild(document.createElement("ul"));
  }
  assertEquals(document.childElementCount, 3);
});

Deno.test("Element.childElementCount with non-node", () => {
  const document = new Document();
  document.appendChild(document.createElement("p"));
  document.appendChild(new Comment());
  assertEquals(document.childElementCount, 1);
});
