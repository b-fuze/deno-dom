import { Document } from "../deno-dom-wasm.ts";

const doc = new Document().implementation.createHTMLDocument("Hello Frens");
console.dir(doc, { depth: Infinity });

