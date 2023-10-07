import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";

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

Deno.test(
  "Element.innerHTML includes context",
  () => {
    const doc = new DOMParser().parseFromString(
      `
        <table><tr id=parent-row></tr></table>
        <div id=parent-div></div>
      `,
      "text/html",
    )!;

    const parentRow = doc.querySelector("#parent-row")!;
    parentRow.innerHTML = "<th>This is a header</th>";

    assertEquals(
      parentRow.innerHTML,
      "<th>This is a header</th>",
    );

    const parentDiv = doc.querySelector("#parent-div")!;
    parentDiv.innerHTML = "<th>This is a header</th>";

    assertEquals(
      parentDiv.innerHTML,
      "This is a header",
    );
  },
);
