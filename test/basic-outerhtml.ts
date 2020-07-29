import { DOMParser } from "../deno-dom-wasm.ts";
import { readFileStrSync } from "https://deno.land/std/fs/read_file_str.ts";

const doc = new DOMParser().parseFromString(readFileStrSync("./basic.html"), "text/html");
// console.dir(html, { depth: Infinity });

const body = doc!.body;
console.log(body.outerHTML);

body.innerHTML = "<p>Things were said</p>\nOh <b>ye</b>"
console.dir(doc!.body.outerHTML);

