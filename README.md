# Deno DOM

An implementation of the browser DOM—primarily for SSR—in Deno. Implemented with
Rust, WASM, and obviously, Deno/TypeScript.

### EVERYTHING is subject to change until noted otherwise.

Read the [design!](./design.md)

You can run the super primitive [basic test](./test/basic.ts) in the [test dir](./test/) by changing into the directory then running
```
deno run --allow-read basic.ts
```

Deno DOM has two backends, WASM and native (not functional yet). You can use the
respective by importing either `deno-dom-wasm.ts` or `deno-dom-native.ts`.

