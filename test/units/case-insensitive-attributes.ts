import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertEquals } from "https://deno.land/std@0.139.0/testing/asserts.ts";

Deno.test("Case insensitive attributes", () => {
  const doc = new DOMParser().parseFromString(
    `<div FooBar=baz foobar=qux fOObAR="42"></div>`,
    "text/html",
  )!;
  const div = doc.querySelector("div")!;

  assertEquals(
    div.getAttribute("foobar"),
    "baz",
    "first HTML attribute takes precedence",
  );
  assertEquals(
    div.getAttribute("FooBar"),
    "baz",
    "first HTML attribute takes precedence",
  );
  div.setAttribute("fOObAR", "fizz");
  assertEquals(
    div.getAttribute("FooBar"),
    "fizz",
    "HTML attributes mutations are case insensitive",
  );
  assertEquals(
    div.getAttribute("foobar"),
    "fizz",
    "HTML attributes mutations are case insensitive",
  );
});
