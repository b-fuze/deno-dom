# Deno DOM

An implementation of the browser DOM—primarily for SSR—in Deno. Implemented with
Rust, WASM, and obviously, Deno/TypeScript.

## Example

*mod.ts*
```typescript
import { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.2-alpha4/deno-dom-native.ts";

const doc = new DOMParser().parseFromString(`
  <h1>Hello World!</h1>
  <p>Hello from <a href="https://deno.land/">Deno!</a></p>
`, "text/html")!;

const p = doc.querySelector("p")!;

console.log(p.textContent); // "Hello from Deno!"
console.log(p.childNodes[1].textContent); // "Deno!"

p.innerHTML = "DOM in <b>Deno</b> is pretty cool";
console.log(p.children[0].outerHTML); // "<b>Deno</b>"
```

*minimum tsconfig.json*
```json
{
  "compilerOptions": {
    "importsNotUsedAsValues": "remove",
    "isolatedModules": false
  }
}
```

To see your example in action, run:
```sh
deno run -c ./tsconfig.json -A --unstable ./mod.ts
```

You should see output like:
```
Hello from Deno!
Deno!
<html>DOM in <b>Deno</b> is pretty cool</html>
```

Deno DOM has **two** backends, WASM and native using Deno native plugins. Both 
APIs are **identical**, the difference being only in performance. The WASM 
backend works with all Deno restrictions, but the native backend requires 
the `--unstable --allow-plugin` flags. You can switch between them by 
importing either `deno-dom-wasm.ts` or `deno-dom-native.ts`.

Deno DOM is still under development, but is fairly usable for basic HTML
manipulation needs.

## Goals

 - HTML parser in Deno
 - Fast
 - Mirror most\* supported DOM APIs as closely as possible
 - Provide specific APIs in addition to DOM APIs to make certain operations more efficient, like controlling Shadow DOM (see Open Questions)
 - Use cutting-edge JS features like private class members, optional chaining, etc

## Non-Goals

 - Headless browser implementation
 - Ability to run JS embedded in documents (`<script>` tags, `onload`, etc)
 - Parse CSS or JS (they're just text, but this may be supported in the future for CSSOM)
 - Support older (or even not so old) JS engines. In other words, there will be no support of transpilation to ES5, no support of polyfills, etc
 - Support special functionality of obsolet HTML elements (`<marquee>`, etc)

# Credits
 - html5ever developers for the HTML parser
 - nwsapi developers for the selector parser

