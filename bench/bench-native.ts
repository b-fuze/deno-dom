import { nodesFromString } from "../deno-dom-native.ts";
import { readFileStrSync } from "https://deno.land/std/fs/read_file_str.ts";

const c = readFileStrSync("./c.html");
const runs = 20;
let avgAccum = 0;

for (let i=0; i<runs; i++) {
  const now = performance.now();
  const nodes = nodesFromString(c);
  avgAccum += (performance.now() - now);
}

console.log("time:" + (avgAccum / runs) + "ms runs:" + runs);

