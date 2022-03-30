import { DOMParser } from "../deno-dom-wasm.ts";

const parser = new DOMParser();

const c = Deno.readTextFileSync("./c.html");
const runs = parseInt(Deno.args[0], 10);

for (let i = 0; i < runs; i++) {
  const document = parser.parseFromString(c, "text/html");
  const divs = Array.from(
    document!.querySelectorAll('div[aria-controls^="ot-desc"]'),
  );
}

let avgAccum = 0;

for (let i = 0; i < runs; i++) {
  const now = performance.now();
  const document = parser.parseFromString(c, "text/html");
  const divs = Array.from(
    document!.querySelectorAll('div[aria-controls^="ot-desc"]'),
  );
  avgAccum += performance.now() - now;
}

console.log("time:" + (avgAccum / runs) + "ms runs:" + runs);
