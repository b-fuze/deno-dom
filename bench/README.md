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
Deno DOM WASM   - time:168.5ms runs:20
Deno DOM Native - time:27.449885150000007ms runs:20
Node.js Parse5  - time:178.78199419998563ms runs:20
```

## Queryable DOM Tree
```
bash ./bench-dom.sh
```

Results:
```
Benchmark: Parse c.html, produce a DOM, then run
querySelectorAll('div[aria-controls^="ot-desc"]')

Deno DOM WASM   - time:174.5ms runs:20
Deno DOM Native - time:29.02453414999993ms runs:20
Node.js JSDOM   - time:492.51481600007975ms runs:20
```

### Machine specs
CPU: 
```
Model:      AMD Ryzen 5 4500U with Radeon Graphics
L1d cache:  192 KiB
L1i cache:  192 KiB
L2 cache:   3 MiB
L3 cache:   8 MiB
```

