import {
  Element,
  HTMLCollection,
  NodeList,
  nodesFromString,
} from "../../deno-dom-wasm.ts";
import { assert } from "assert";

Deno.test("Array instanceof Array", () => {
  assert([] instanceof Array);
  assert(Array.isArray([]));
});

Deno.test("NodeList not instanceof Array", () => {
  const nodes = nodesFromString(
    Deno.readTextFileSync(new URL("./basic.html", import.meta.url)),
  );
  assert(!(nodes instanceof Array));
  assert(!Array.isArray(nodes));
});

Deno.test("HTMLCollection not instanceof Array", () => {
  const nodes = nodesFromString(
    Deno.readTextFileSync(new URL("./basic.html", import.meta.url)),
  );
  assert(!((nodes as Element).children instanceof Array));
  assert(!Array.isArray((nodes as Element).children));
});

Deno.test("Nullish not instanceof NodeList", () => {
  assert(!(null as any instanceof NodeList));
  assert(!(undefined as any instanceof NodeList));
});

Deno.test("Nullish not instanceof HTMLCollection", () => {
  assert(!(null as any instanceof HTMLCollection));
  assert(!(undefined as any instanceof HTMLCollection));
});

Deno.test("Subclass instanceof Array", () => {
  class Foo extends Array {}
  assert(new Foo() instanceof Array);
  assert(Array.isArray(new Foo()));
});

Deno.test("Array not instanceof subclass", () => {
  class Foo extends Array {}
  assert(!([] instanceof Foo));
});
