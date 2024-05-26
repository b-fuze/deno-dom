import initWasm, {
  parse,
  parse_frag as parseFrag,
} from "./build/deno-wasm/deno-wasm.js";
import { register } from "./src/parser.ts";

export async function initParser() {
  await initWasm();
  register(
    parse,
    parseFrag as unknown as (
      html: string,
      context_local_name?: string,
    ) => string,
  );
}

export * from "./src/api.ts";
