/**
 * @module
 *
 * This module exposes the Deno DOM API with the WASM (Web Assembly) backend
 *
 * @example
 * ```typescript
 * import { DOMParser, Element } from "jsr:@b-fuze/deno-dom";
 *
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

import { initExports } from "./build/deno-wasm/deno-wasm-legacy.js";
import { register } from "./src/parser.ts";

const { parse, parse_frag } = await initExports();

register(
  parse,
  parse_frag as unknown as (
    html: string,
    context_local_name?: string,
  ) => string,
);

export * from "./src/api.ts";
