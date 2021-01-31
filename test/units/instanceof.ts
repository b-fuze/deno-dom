import { DOMParser, NodeList, nodesFromString } from "../../deno-dom-wasm.ts";
import { assert } from "https://deno.land/std@0.85.0/testing/asserts.ts";

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
  assert(!(nodes.children instanceof Array));
  assert(!Array.isArray(nodes.children));
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
