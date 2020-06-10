const parse5 = require("parse5");
const fs = require("fs");
const { performance } = require("perf_hooks");

const c = fs.readFileSync(__dirname + "/c.html", "utf8");

// Warm up the engine
parse5.parse(c);
parse5.parse(c);
parse5.parse(c);
parse5.parse(c);
parse5.parse(c);
parse5.parse(c);
parse5.parse(c);
parse5.parse(c);

const now = performance.now();
const document = parse5.parse(c);
console.log("time:" + (performance.now() - now) + "ms");

