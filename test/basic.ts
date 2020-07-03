import { nodesFromString, NodeList } from "../deno-dom-wasm.ts";
import { readFileStrSync } from "https://deno.land/std/fs/read_file_str.ts";

const nodes = nodesFromString(readFileStrSync("./basic.html"));

const childNodes = nodes.childNodes;
console.log(childNodes instanceof NodeList);
console.log(childNodes instanceof Array);
console.log(Array.isArray(childNodes));
console.log();
console.log([] instanceof NodeList);
console.log([] instanceof Array);
console.log(Array.isArray([]));

for (const child of nodes.childNodes) {
  console.log("child", child);
}

