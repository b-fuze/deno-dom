const parse5 = require("parse5");
const fs = require("fs");
const { performance } = require("perf_hooks");

const c = fs.readFileSync(__dirname + "/c.html", "utf8");

const runs = 20;
let avgAccum = 0;

for (let i=0; i<runs; i++) {
  const now = performance.now();
  const document = parse5.parse(c);
  avgAccum += (performance.now() - now);
}

console.log("time:" + (avgAccum / runs) + "ms runs:" + runs);

