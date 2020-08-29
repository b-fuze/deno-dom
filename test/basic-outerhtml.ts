import { DOMParser } from "../deno-dom-wasm.ts";

const doc = new DOMParser().parseFromString(Deno.readTextFileSync("./basic.html"), "text/html");
// console.dir(html, { depth: Infinity });

const body = doc!.body;
console.log(body.outerHTML);

body.innerHTML = "<p>Things were said</p>\nOh <b>ye</b>"
console.dir(doc!.body.outerHTML);

