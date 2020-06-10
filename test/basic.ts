import { nodesFromString } from "../deno-dom-wasm.ts";
import { readFileStrSync } from "https://deno.land/std/fs/read_file_str.ts";

console.dir(nodesFromString(readFileStrSync("./basic.html")), { depth: null });

