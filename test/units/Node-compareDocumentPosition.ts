import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";

const html = `
<!DOCTYPE html>
<html>
  <body>
    <div id="a">
      <div id="b">
        <div id="c"></div>
      </div>
      <div id="d"></div>
    </div>
    <div id="e">
      <div id="f">
      </div>
    </div>
  </body>
</html>
`;

Deno.test("Node.compareDocumentPosition", () => {
  const doc = new DOMParser().parseFromString(html, "text/html")!;
  const divA = doc.querySelector("#a")!;
  const divB = doc.querySelector("#b")!;
  const divC = doc.querySelector("#c")!;
  const divD = doc.querySelector("#d")!;
  const divE = doc.querySelector("#e")!;
  const divF = doc.querySelector("#f")!;
  const body = doc.body;

  const doc2 = new DOMParser().parseFromString(html, "text/html")!;
  const divA2 = doc2.querySelector("#a")!;

  assertEquals([
    divA.compareDocumentPosition(divF),
    divB.compareDocumentPosition(divF),
    divF.compareDocumentPosition(divA),
    divE.compareDocumentPosition(divE),
    divE.compareDocumentPosition(divF),
    divF.compareDocumentPosition(divE),
    divF.compareDocumentPosition(divC),
    divE.compareDocumentPosition(divD),
    divC.compareDocumentPosition(body),
    body.compareDocumentPosition(divF),
    body.compareDocumentPosition(divA2),
    divA2.compareDocumentPosition(divF),
    divA2.compareDocumentPosition(body),
    doc.compareDocumentPosition(divD),
    // FIXME: Maybe change these magic numbers to their corresponding
    // bitmask values...
  ], [4, 4, 2, 0, 20, 10, 2, 2, 10, 20, 35, 35, 35, 20]);
});
