const { JSDOM } = require("jsdom");
const fs = require("fs");
const { performance } = require("perf_hooks");

const c = fs.readFileSync(__dirname + "/c.html", "utf8");

const runs = parseInt(process.argv[2], 10);

for (let i = 0; i < runs; i++) {
  const document = new JSDOM(c).window.document;
  const divs = Array.from(
    document.querySelectorAll('div[aria-controls^="ot-desc"]'),
  );
}

let avgAccum = 0;

for (let i = 0; i < runs; i++) {
  const now = performance.now();
  const document = new JSDOM(c).window.document;
  const divs = Array.from(
    document.querySelectorAll('div[aria-controls^="ot-desc"]'),
  );
  avgAccum += performance.now() - now;
}

console.log("time:" + (avgAccum / runs) + "ms runs:" + runs);
