import { DOMParser, DOMTokenList } from "../../deno-dom-wasm.ts";
import {
  assert,
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Element.classList.value", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a b'></div><main></main>",
    "text/html",
  );
  const div = doc.querySelector("div")!;
  const main = doc.querySelector("main")!;
  main.classList.value = "a b";
  assertStrictEquals(
    div.classList.value,
    "a b",
    `div.classList.value should be "a b", got "${div.classList.value}"`,
  );
  assert(
    div.classList.contains("a"),
    "div.classList.contains('a') should be true",
  );
  assert(
    div.classList.contains("b"),
    "div.classList.contains('b') should be true",
  );
  div.classList.value = "c  d c";
  assertStrictEquals(
    div.classList.value,
    "c  d c",
    `div.classList.value should be "c  d c", got "${div.classList.value}"`,
  );
  assert(
    !div.classList.contains("a"),
    "div.classList.contains('a') should be false",
  );
  assert(
    !div.classList.contains("b"),
    "div.classList.contains('b') should be false",
  );
  assert(
    div.classList.contains("c"),
    "div.classList.contains('c') should be true",
  );
  assert(
    div.classList.contains("d"),
    "div.classList.contains('d') should be true",
  );
  div.classList.add("e");
  assertStrictEquals(
    div.classList.value,
    "c d e",
    `div.classList.value should be "c d e", got "${div.classList.value}"`,
  );
  assertStrictEquals(
    main.getAttribute("class"),
    "a b",
    "main.classList.value = ... should set the 'class' attribute",
  );
});

Deno.test("Element.classList.length", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a   b b'></div>",
    "text/html",
  );
  const div = doc.querySelector("div")!;
  assertStrictEquals(
    div.classList.length,
    2,
    `classList.length should be 2 for 'a   b b'; got ${div.classList.length}. Duplicates are removed.`,
  );
  div.classList.add("c");
  assertStrictEquals(
    div.classList.length,
    3,
    `classList.length should be 3 for 'a b c'; got ${div.classList.length}.`,
  );
  div.classList.remove("a", "b");
  assertStrictEquals(
    div.classList.length,
    1,
    `classList.length should be 1 for 'c'; got ${div.classList.length}.`,
  );

  assertThrows(
    // @ts-ignore
    () => div.classList.length = 0,
    TypeError,
    undefined,
    "classList.length should be readonly",
  );
});

Deno.test("Element.classList.add", () => {
  const doc = new DOMParser().parseFromString(
    "<div></div><main></main>",
    "text/html",
  );
  const div = doc.querySelector("div")!;
  div.classList.add("a");
  div.classList.add("b", "c");
  assert(
    div.classList.contains("a"),
    `classList.contains('a') should be true; got ${
      div.classList.contains("a")
    }.`,
  );
  assert(
    div.classList.contains("b"),
    `classList.contains('b') should be true; got ${
      div.classList.contains("b")
    }.`,
  );
  assert(
    div.classList.contains("c"),
    `classList.contains('c') should be true"; got ${
      div.classList.contains("c")
    }.`,
  );
  assertThrows(
    () => div.classList.add(""),
    DOMException,
    "The token provided must not be empty",
    "DOMTokenList.add() shouldn't accept an empty string.",
  );
  assertStrictEquals(
    div.getAttribute("class"),
    "a b c",
    "div.classList.add(...) should set the 'class' attribute",
  );
});

Deno.test("Element.classList.remove", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a b c'></div>",
    "text/html",
  );
  const div = doc.querySelector("div")!;
  div.classList.remove("a");
  assertStrictEquals(
    div.classList.value,
    "b c",
    `classList.value should be 'b c' after removing 'a'; got ${div.classList.value}.`,
  );
  div.classList.remove("b", "c");
  assertStrictEquals(
    div.classList.value,
    "",
    `classList.value should be '' after removing 'b' and 'c'; got ${div.classList.value}.`,
  );
  assertThrows(
    () => div.classList.remove(""),
    DOMException,
    "The token provided must not be empty",
    "DOMTokenList.remove() shouldn't accept an empty string.",
  );
});

Deno.test("Element.classList.item", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a b c b a'></div>",
    "text/html",
  );
  const div = doc.querySelector("div")!;

  assertStrictEquals(
    div.classList.item(0),
    "a",
    `classList.item(0) should be 'a'; got ${div.classList.item(0)}.`,
  );
  assertStrictEquals(
    div.classList.item(-0),
    "a",
    `classList.item(-0) should be 'a'; got ${
      div.classList.item(-0)
    }. -0 is treated same as 0.`,
  );
  assertStrictEquals(
    div.classList.item(0.9),
    "a",
    `classList.item(0.9) should be 'a'; got ${
      div.classList.item(0.9)
    }. Input should be truncated.`,
  );
  assertStrictEquals(
    div.classList.item(-0.9),
    "a",
    `classList.item(-0.9) should be 'a'; got ${
      div.classList.item(-0.9)
    }. Input should be truncated to -0 and treated as 0.`,
  );
  assertStrictEquals(
    div.classList.item(NaN),
    "a",
    `classList.item(NaN) should be 'a'; got ${
      div.classList.item(NaN)
    }. NaN should be treated as 0.`,
  );
  assertStrictEquals(
    div.classList.item(Infinity),
    "a",
    `classList.item(Infinity) should be 'a'; got ${
      div.classList.item(Infinity)
    }. Infinity should be treated as 0.`,
  );
  assertStrictEquals(
    div.classList.item(2 ** 32),
    "a",
    `classList.item(2**32) should be 'a'; got ${
      div.classList.item(2 ** 32)
    }. Input should be modulo 2**32 after truncation.`,
  );
  assertStrictEquals(
    div.classList.item(2 ** 32 * 2 + 0.5),
    "a",
    `classList.item(2**32*2) should be 'a'; got ${
      div.classList.item(2 ** 32 * 2)
    }. Input should be modulo 2**32 after truncation.`,
  );

  assertStrictEquals(
    div.classList.item(1),
    "b",
    `classList.item(1) should be 'b'; got ${div.classList.item(1)}.`,
  );
  assertStrictEquals(
    div.classList.item(2 ** 32 + 1),
    "b",
    `classList.item(2**32+1) should be 'b'; got ${
      div.classList.item(2 ** 32 + 1)
    }. Input should be modulo 2**32 after truncation.`,
  );
  assertStrictEquals(
    div.classList.item(2 ** 32 * 2 + 1.9),
    "b",
    `classList.item(2**32*2+1) should be 'b'; got ${
      div.classList.item(2 ** 32 * 2 + 1)
    }. Input should be modulo 2**32 after truncation.`,
  );

  assertStrictEquals(
    div.classList.item(2),
    "c",
    `classList.item(2) should be 'c'; got ${div.classList.item(2)}.`,
  );
  assertStrictEquals(
    div.classList.item(2 ** 32 * 2 + 2.1),
    "c",
    `classList.item(2**32*2+2) should be 'c'; got ${
      div.classList.item(2 ** 32 * 2 + 2.1)
    }. Input should be modulo 2**32 after truncation.`,
  );
  assertStrictEquals(
    div.classList.item(Math.E),
    "c",
    `classList.item(Math.E) should be 'c'; got ${
      div.classList.item(Math.E)
    }. Input should be truncated.`,
  );

  assertStrictEquals(
    div.classList.item(3),
    null,
    `classList.item(3) should be null; got ${div.classList.item(3)}.`,
  );
  assertStrictEquals(
    div.classList.item(2 ** 16),
    null,
    `classList.item(2**16) should be null; got ${div.classList.item(2 ** 16)}.`,
  );
  assertStrictEquals(
    div.classList.item(2 ** 32 * 2 + 3),
    null,
    `classList.item(2**32*2+3) should be null; got ${
      div.classList.item(2 ** 32 * 2 + 3)
    }.`,
  );
  assertStrictEquals(
    div.classList.item(-1),
    null,
    `classList.item(-1) should be null; got ${
      div.classList.item(-1)
    }. Negative values don't act the same as Array.prototype.at().`,
  );
  assertStrictEquals(
    div.classList.item(-Infinity),
    null,
    `classList.item(-Infinity) should be null; got ${
      div.classList.item(-Infinity)
    }. Negative values don't act the same as Array.prototype.at().`,
  );
});

Deno.test("Element.classList.replace", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a   b b'></div>",
    "text/html",
  );
  const div = doc.querySelector("div")!;

  assert(
    div.classList.replace("a", "b"),
    "replace('a', 'b') should return true",
  );
  assertStrictEquals(
    div.classList.value,
    "b",
    "replace('a', 'b') on 'a   b b' should set value to 'b'",
  );

  assert(
    div.classList.replace("b", "c"),
    "replace('b', 'c') should return true",
  );
  assertStrictEquals(
    div.classList.value,
    "c",
    "replace('b', 'c') on 'b' should set value to 'c'",
  );

  assert(
    !div.classList.replace("a", "b"),
    "replace('a', 'b') on 'c' should return false",
  );
  assertStrictEquals(
    div.classList.value,
    "c",
    "replace('a', 'b') on 'c' should not change value",
  );

  assertThrows(
    () => div.classList.replace("", "b"),
    DOMException,
    "The token provided must not be empty",
    "replace('', 'b') should throw DOMException",
  );

  assertThrows(
    () => div.classList.replace("a", ""),
    DOMException,
    "The token provided must not be empty",
    "replace('a', '') should throw DOMException",
  );
});

Deno.test("Element.classList.toggle", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a   b b'></div>",
    "text/html",
  );
  const div = doc.querySelector("div")!;

  assert(!div.classList.toggle("a"), "toggle('a') should return false");
  assert(div.classList.toggle("a"), "toggle('a') should return true");
  assert(div.classList.toggle("c"), "toggle('c') should return true");
  assertStrictEquals(div.classList.value, "b a c");
});

Deno.test("Element.classList.forEach", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a   b b'></div>",
    "text/html",
  );
  const div = doc.querySelector("div")!;

  const classes: Array<[string, number, DOMTokenList]> = [];
  div.classList.forEach((...args) => {
    classes.push(args);
  });

  assertEquals(
    classes,
    [
      ["a", 0, div.classList],
      ["b", 1, div.classList],
    ],
  );
});

Deno.test("Element.classList.entries", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a   b b'></div>",
    "text/html",
  );
  const div = doc.querySelector("div")!;

  const classes = [...div.classList.entries()];

  assertEquals(
    classes,
    [
      [0, "a"],
      [1, "b"],
    ],
  );
});

Deno.test("Element.classList.values", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a   b b'></div>",
    "text/html",
  );
  const div = doc.querySelector("div")!;

  const classes = [...div.classList.values()];

  assertEquals(
    classes,
    ["a", "b"],
  );
});

Deno.test("Element.classList.keys", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a   b b'></div>",
    "text/html",
  );
  const div = doc.querySelector("div")!;

  const classes = [...div.classList.keys()];

  assertEquals(
    classes,
    [0, 1],
  );
});

Deno.test("Element.classList.@@iterator", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a   b b'></div>",
    "text/html",
  );
  const div = doc.querySelector("div")!;

  const classes = [...div.classList];

  assertEquals(
    classes,
    ["a", "b"],
  );
});

Deno.test("Element.classList.#onChange", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a'></div>",
    "text/html",
  );
  const div = doc.querySelector("div")!;

  div.classList.add("b");

  assertEquals(
    div.className,
    "a b",
  );

  div.classList.remove("a");

  assertEquals(
    div.className,
    "b",
  );

  div.classList.replace("b", "c");

  assertEquals(
    div.className,
    "c",
  );

  div.classList.toggle("c");

  assertEquals(
    div.className,
    "",
  );

  div.classList.value = "d e";

  assertEquals(
    div.className,
    "d e",
  );

  div.classList.value = "";
  div.classList.add("f");

  assertEquals(
    div.className,
    "f",
  );
});
