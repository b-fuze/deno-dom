# Benchmarks
These benchmarks should really be taken with a grain of salt, but they aren't
entirely dismissible in my opinion. There are two benchmarks here, and you run 
them by invoking the shell scripts listed below.

## Raw HTML Parsing
Bench raw parsing of HTML (somewhat unfair in Deno DOM's case because
it actually produces a DOM tree)

```
bash ./bench-parse.sh
```

Results:
```
Deno DOM WASM   - time:44.45ms runs:40
Deno DOM Native - time:25.747656975ms runs:40
Node.js Parse5  - time:167.74452359999958ms runs:40
```

## Queryable DOM Tree
```
bash ./bench-dom.sh
```

Results:
```
Benchmark: Parse c.html, produce a DOM, then run
querySelectorAll('div[aria-controls^="ot-desc"]')

Deno DOM WASM   - time:65.75ms runs:40
Deno DOM Native - time:37.808892225ms runs:40
Node.js JSDOM   - time:488.211494675ms runs:40
```

### Machine specs
OS: Ubuntu 21.04 (5.12.19-051219-generic x84\_64 kernel)
CPU: 
```
Model:      AMD Ryzen 5 4500U with Radeon Graphics
L1d cache:  192 KiB
L1i cache:  192 KiB
L2 cache:   3 MiB
L3 cache:   8 MiB
```
Deno: 1.16.1
