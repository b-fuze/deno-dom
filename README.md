# Deno DOM

An implementation of the browser DOM—primarily for SSR—in Deno. Implemented with
Rust, WASM, and obviously, Deno/TypeScript.

## Example
```typescript
import { DOMParser, Element } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

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

Deno DOM has **two** backends, WASM and native using Deno native plugins. Both 
APIs are **identical**, the difference being only in performance. The WASM 
backend works with all Deno restrictions, but the native backend requires 
the `--unstable --allow-plugin` flags. You can switch between them by 
importing either `deno-dom-wasm.ts` or `deno-dom-native.ts`.

Deno DOM is still under development, but is fairly usable for basic HTML
manipulation needs.

### WebAssembly Startup Penalty
Deno suffers an initial startup penalty in Deno DOM WASM due to Top Level
Await (TLA) preparing the WASM parser. As an alternative to running the
initiation on startup, you can initialize Deno DOM's parser on-demand
yourself when you need it by importing from `deno-dom-wasm-noinit.ts`.
Example:
```typescript
// Note: -wasm-noinit.ts and not -wasm.ts
import { initParser, DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm-noinit.ts";

// ...and when you need Deno DOM make sure you initialize the parser...
await initParser();

// Then you can use Deno DOM as you would normally
const doc = new DOMParser().parseFromString(`
  <h1>Lorem ipsum dolor...</h1>
`, "text/html");
```

## Documentation
Refer to MDN (Mozilla Developer Network) for documentation. If there are
inconsistencies (that aren't a result of legacy APIs) file an issue.

## Goals

 - HTML parser in Deno
 - Fast
 - Mirror _most_ supported DOM APIs as closely as possible
 - Provide specific APIs in addition to DOM APIs to make certain operations more efficient, like controlling Shadow DOM (see Open Questions)
 - Use cutting-edge JS features like private class members, optional chaining, etc

## Non-Goals

 - Headless browser implementation
 - Ability to run JS embedded in documents (`<script>` tags, `onload`, etc)
 - Parse CSS or JS (they're just text, but this may be supported in the future for CSSOM)
 - Support older (or even not so old) JS engines. In other words, there will be no support of transpilation to ES5, no support of polyfills, etc
 - Support special functionality of obsolete HTML elements (`<marquee>`, etc)

## Running tests
To run tests (excluding WPT tests) use the following for WASM
```sh
deno test --allow-read wasm.test.ts
```
Or the following for native (native requires more permissions)
```sh
deno test --unstable -A native.test.ts
```
To run WPT tests update the WPT submodule
```sh
git submodule update --progress --depth 1
```
Then append `-- --wpt` to the test command before running it, e.g. for WASM
```sh
deno test --allow-read wasm.test.ts -- --wpt
```

WPT tests are still a WIP, passed tests likely haven't actually passed.

## Building Deno DOM Native
Deno DOM native is a faster backend for Deno DOM (check [benchmarks](./bench/)), however, 
the WASM backend is sufficient for almost all use-cases.

**Note:** If you're running an x86\_64 system with either Windows, Linux, or macOS, then
you probably don't need to build the plugin. Deno DOM native downloads a prebuilt
binary in those cases.

To build Deno DOM's native backend, [install Rust](https://www.rust-lang.org/learn/get-started) if you haven't already,
then run
```sh
cargo build --release
```
which produces a binary located at `target/release/libplugin.{so,dll,dylib}` (extension depends on your system).

To use the new binary you need to set the **`DENO_DOM_PLUGIN`** env var to the path of the binary produced
in the previous step. **Don't forget** to run Deno with `--allow-env`.

# Credits
 - html5ever developers for the HTML parser
 - nwsapi developers for the selector parser

