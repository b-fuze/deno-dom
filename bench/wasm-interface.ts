import init, { parse } from "../build/deno-wasm/deno-wasm.js";
import { readFileStrSync } from "https://deno.land/std/fs/read_file_str.ts";

await init();

const html = readFileStrSync("/c.html");

// Warm up the engine
JSON.parse(parse(html));
JSON.parse(parse(html));
JSON.parse(parse(html));
JSON.parse(parse(html));
JSON.parse(parse(html));
JSON.parse(parse(html));
JSON.parse(parse(html));
JSON.parse(parse(html));

const now = performance.now();
const parsed = JSON.parse(parse(html));
console.log("time:" + (performance.now() - now) + "ms");
// console.log(JSON.parse(parsed));

