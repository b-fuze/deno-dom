# Deno DOM

This is the branch of Deno DOM that was going to have a Rust representation in
WASM with a light Javascript interface on top. However, WASM <-> JS string
passing turned out to be too expensive and until [WASM Interfaces](https://github.com/WebAssembly/interface-types/blob/master/proposals/interface-types/Explainer.md)
(currently [Phase 1](https://github.com/WebAssembly/proposals#phase-1---feature-proposal-cg)) becomes a thing.

An implementation of the browser DOM—primarily for SSR—in Deno. Implemented with
Rust, WASM, and obviously, Deno/TypeScript.

Read the [design!](./design.md)

In case you're curious, no, nothing works yet.

