/**
 * @module
 *
 * This module is deprecated.
 *
 * This module previously exposed an API allowing deferred loading of the
 * WASM module, as the WASM loading process for Deno was suboptimal before.
 * However, that is no longer the longer case.
 *
 * The API specific to this module (`initParser()`) is now a no-op.
 */

import { parse, parse_frag as parseFrag } from "./build/deno-wasm/deno-wasm.js";
import { type Parser, register } from "./src/parser.ts";

register(
  parse,
  parseFrag as Parser,
);

/**
 * @deprecated
 */
export function initParser() {}

export * from "./src/api.ts";
