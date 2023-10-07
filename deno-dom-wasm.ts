import init, { parse, parse_frag } from "./build/deno-wasm/deno-wasm.js";
import { register } from "./src/parser.ts";

await init();
register(
  parse,
  parse_frag as unknown as (
    html: string,
    context_local_name?: string,
  ) => string,
);

export * from "./src/api.ts";
