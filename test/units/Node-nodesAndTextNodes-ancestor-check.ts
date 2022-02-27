import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertThrows } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Element.replaceWith ancestor check", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div class=main>
        <div class=a>a</div>
      </div>
      <div class=b>b</div>
    `,
    "text/html",
  )!;
  const divMain = doc.querySelector(".main")!;
  const divA = doc.querySelector(".a")!;
  const divB = doc.querySelector(".b")!;

  assertThrows(() => {
    divA.replaceWith(divMain);
  });

  divA.replaceWith(divB);
});

Deno.test("Element.append ancestor check", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div class=main>
        <div class=a>a</div>
      </div>
      <div class=b>b</div>
    `,
    "text/html",
  )!;
  const divMain = doc.querySelector(".main")!;
  const divA = doc.querySelector(".a")!;
  const divB = doc.querySelector(".b")!;

  assertThrows(() => {
    divA.append(divMain);
  });

  divA.append(divB);
});

Deno.test("Element.before ancestor check", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div class=main>
        <div class=a>a</div>
      </div>
      <div class=b>b</div>
    `,
    "text/html",
  )!;
  const divMain = doc.querySelector(".main")!;
  const divA = doc.querySelector(".a")!;
  const divB = doc.querySelector(".b")!;

  assertThrows(() => {
    divA.before(divMain);
  });

  divA.before(divB);
});

Deno.test("Element.after ancestor check", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div class=main>
        <div class=a>a</div>
      </div>
      <div class=b>b</div>
    `,
    "text/html",
  )!;
  const divMain = doc.querySelector(".main")!;
  const divA = doc.querySelector(".a")!;
  const divB = doc.querySelector(".b")!;

  assertThrows(() => {
    divA.after(divMain);
  });

  divA.after(divB);
});

