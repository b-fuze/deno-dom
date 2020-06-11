# Deno DOM Rust Crates
These crates are for building/testing the Rust WASM and native Deno plugin code.

 - `core/`: html5ever, RcDom, and direct Deno DOM bindings, common dependency for all other crates
 - `wasm/`: WASM lib
 - `plugin/`: Deno native plugin
 - `cli-test/`: Basic CLI program to test the output of the parser

## Building with GNU Make

Build the WASM lib
```
make wasm
```

Build the native plugin
```
make plugin
```

Build the CLI
```
make cli
```

Build all the above
```
make
```

