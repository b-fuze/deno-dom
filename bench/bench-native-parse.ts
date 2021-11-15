import { nodesFromString } from "../deno-dom-native.ts";

const c = Deno.readTextFileSync("./c.html");
const runs = parseInt(Deno.args[0], 10);

for (let i=0; i<runs; i++) {
  const parsed = nodesFromString(c);
}

let avgAccum = 0;

for (let i=0; i<runs; i++) {
  const now = performance.now();
  const nodes = nodesFromString(c);
  avgAccum += (performance.now() - now);
}

console.log("time:" + (avgAccum / runs) + "ms runs:" + runs);

