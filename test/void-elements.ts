import { Document } from "../deno-dom-wasm.ts";

const document = new Document().implementation.createHTMLDocument();
const voidElement = document.createElement('br');

console.log(`innerHTML: "${voidElement.innerHTML}" (should be empty)`);
console.log(`outerHTML: "${voidElement.outerHTML}" (should be <br>)`);

voidElement.appendChild(document.createElement('div'));
console.log('childNodes.length: ', voidElement.childNodes.length);

console.log(`innerHTML with child: "${voidElement.innerHTML}"`);
console.log(`outerHTML with child: "${voidElement.outerHTML}"`);
