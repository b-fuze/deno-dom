import init, { parse } from "./build/deno-wasm/deno-wasm.js";
import { register } from "./src/parser.ts";

await init();
register(parse);

export * from "./src/api.ts";

