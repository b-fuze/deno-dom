import { DOMParser } from "../deno-dom-native.ts";

const d = new TextDecoder();
const doc = new DOMParser().parseFromString(d.decode(await Deno.readFile("./basic.html")), "text/html");

// console.log(JSON.stringify(doc, (key, value) => {
//   switch (key) {
//     case "parentNode":
//     case "parentElement":
//       return value?.nodeName;
//     default:
//       return value;
//   }
// }, 4));

const b = doc?.querySelector("a > span:last-child");
console.log("b", b?.outerHTML);

