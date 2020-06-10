import { nodesFromString } from "../deno-dom-wasm.ts";
import { readFileStrSync } from "https://deno.land/std/fs/read_file_str.ts";

const now = performance.now();
const nodes = nodesFromString(readFileStrSync("./c.html"));
console.log("time:" + (performance.now() - now) + "ms");

