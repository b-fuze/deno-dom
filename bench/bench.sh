#!/bin/bash

echo -n "Deno DOM WASM - "
deno run --allow-read ./bench-wasm.ts | grep time:

echo -n "Deno DOM Native - "
deno run -A --unstable ./bench-native.ts | grep time:

echo -n "Node.js Parse5 - "
node ./bench-parse5.js

