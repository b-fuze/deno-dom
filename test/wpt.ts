import { walkSync } from "https://deno.land/std@0.75.0/fs/walk.ts";
import { dirname, fromFileUrl, join } from "https://deno.land/std@0.75.0/path/mod.ts";
import { run } from "./wpt-runner.ts";
import type { Backend } from "./wpt-runner.ts";

const wptDirRoot = join(dirname(fromFileUrl(import.meta.url)), "../wpt");
const wptNodeTests = wptDirRoot + "/dom/nodes";
const wptTraversalTests = wptDirRoot + "/dom/traversal";
const wptCollectionTests = wptDirRoot + "/dom/collections";

const include = new RegExp([
  "ChildNode-",
  "Document-",
  "Comment-",
  "Element-",
  "getElementsByClassName-",
  "Node-",
  "ParentNode-",
  "Text-",
  "TreeWalker",
].join("|"));

const exclude = new RegExp([
  "-namespace",
  "ProcessingInstruction",
  "CDATA", // TODO: maybe implement CDATA support
  "createEvent",
  "nodes/Node-cloneNode-on-inactive-document-crash", // Tests iframe which won't be implemented
  "nodes/DOMImplementation-createHTMLDocument-with-null-browsing-context-crash", // Uses iframe
].join("|"));

export function test(backend: Backend) {
  // WPT tests are only explicitly run
  if (!Deno.args.find(arg => ["-w", "--wpt"].includes(arg))) {
    return;
  }

  const testFiles: string[] = [];
  const limit = Infinity;
  let count = 0;

  for (const testDir of [wptTraversalTests, wptNodeTests]) {
    for (const entry of walkSync(testDir)) {
      const { path } = entry;

      if (path.endsWith(".html") && include.test(path) && !exclude.test(path)) {
        testFiles.push(path);
        count++;

        if (count === limit) {
          break;
        }
      }
    }
  }

  for (const test of testFiles) {
    const name = test
      .replace(/.+dom\//, "")
      .replace(".html", "")
      .replace(/\s+/g, " ");
    Deno.test(name, async () => {
      await run(test, wptDirRoot, backend);
    });
  }
}

