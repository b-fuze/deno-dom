/**
 * @module
 *
 * This module exposes the Deno DOM API with the WASM (Web Assembly) backend.
 * This module is different from the primary WASM module because it allows
 * you to control when the WASM HTML parsing engine loads (which is a
 * relatively slow process). You can't use any of the parsing functions
 * of Deno DOM until you invoke the async `initParser()` export.
 *
 * @example
 * ```ts
 * import { DOMParser, initParser } from "jsr:@b-fuze/deno-dom/wasm-noinit";
 *
 * // ...and when you need Deno DOM's parser make sure you initialize it...
 * await initParser();
 *
 * // Then you can use Deno DOM as you would normally
 * const doc = new DOMParser().parseFromString(
 *   `
 *     <h1>Hello World!</h1>
 *     <p>Hello from <a href="https://deno.land/">Deno!</a></p>
 *   `,
 *   "text/html",
 * );
 *
 * const p = doc.querySelector("p")!;
 * console.log(p.textContent); // "Hello from Deno!"
 * ```
 */

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
