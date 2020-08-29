import { nodesFromString, NodeList } from "../deno-dom-wasm.ts";

const nodes = nodesFromString(Deno.readTextFileSync("./basic.html"));

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

