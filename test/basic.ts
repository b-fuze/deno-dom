import { nodesFromString } from "../deno-dom-wasm.ts";
import { readFileStrSync } from "https://deno.land/std/fs/read_file_str.ts";

console.log(nodesFromString(readFileStrSync("./basic.html")));

