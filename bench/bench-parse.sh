#!/bin/bash

echo -n "Deno DOM WASM   - "
deno run --allow-read ./bench-wasm-parse.ts 2>&1 | grep time:

echo -n "Deno DOM Native - "
deno run -A --unstable ./bench-native-parse.ts 2>&1 | grep time:

echo -n "Node.js Parse5  - "
node ./bench-parse5.js

