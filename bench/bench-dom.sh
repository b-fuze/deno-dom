#!/bin/bash

cat <<MSG
Benchmark: Parse c.html, produce a DOM, then run
querySelectorAll('div[aria-controls^="ot-desc"]')

MSG

RUNS=40

echo -n "Deno DOM WASM   - "
deno run --allow-read ./bench-wasm-dom.ts $RUNS 2>&1 | grep time:

echo -n "Deno DOM Native - "
deno run -A --unstable ./bench-native-dom.ts $RUNS 2>&1 | grep time:

echo -n "Node.js JSDOM   - "
node --max-old-space-size=$(( 1024 * 6 )) ./bench-jsdom.js $RUNS

