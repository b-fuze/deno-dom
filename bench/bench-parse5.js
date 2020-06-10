const parse5 = require("parse5");
const fs = require("fs");
const { performance } = require("perf_hooks");

const c = fs.readFileSync(__dirname + "/c.html", "utf8");

const now = performance.now();
const document = parse5.parse(c);
console.log("time:" + (performance.now() - now) + "ms");

