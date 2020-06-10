import init, { parse } from "./build/deno-wasm/deno-wasm.js";
import { register } from "./src/parser.ts";

await init();
register(parse);

export { nodesFromString } from "./src/deserialize.ts";
export * from "./src/dom/node.ts";
export * from "./src/dom/element.ts";

