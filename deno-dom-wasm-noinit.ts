import initWasm, {
  parse,
  parse_frag as parseFrag,
} from "./build/deno-wasm/deno-wasm.js";
import { type Parser, register } from "./src/parser.ts";

export async function initParser() {
  await initWasm();
  register(
    parse,
    parseFrag as Parser,
  );
}

export * from "./src/api.ts";
