import { DOMParser, DOMTokenList } from "../../deno-dom-wasm.ts";
import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Element.classList.value", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='foo bar'></div>",
    "text/html",
  )!;
  const div = doc.querySelector("div")!;
  assert(
    div.classList.value === "foo bar",
    `div.classList.value should be "foo bar", got "${div.classList.value}"`,
  );
  assert(
    div.classList.contains("foo"),
    "div.classList.contains('foo') should be true",
  );
  assert(
    div.classList.contains("bar"),
    "div.classList.contains('bar') should be true",
  );
  div.classList.value = "fiz  baz fiz";
  assert(
    div.classList.value === "fiz  baz fiz",
    `div.classList.value should be "fiz  baz fiz", got "${div.classList.value}"`,
  );
  assert(
    !div.classList.contains("foo"),
    "div.classList.contains('foo') should be false",
  );
  assert(
    !div.classList.contains("bar"),
    "div.classList.contains('bar') should be false",
  );
  assert(
    div.classList.contains("fiz"),
    "div.classList.contains('fiz') should be true",
  );
  assert(
    div.classList.contains("baz"),
    "div.classList.contains('baz') should be true",
  );
  div.classList.add("qux");
  assert(
    // @ts-ignore
    div.classList.value === "fiz baz qux",
    `div.classList.value should be "fiz baz qux", got "${div.classList.value}"`,
  );
});

Deno.test("Element.classList.length", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a   b b'></div>",
    "text/html",
  )!;
  const div = doc.querySelector("div")!;
  assert(
    div.classList.length === 2,
    `classList.length should be 2 for 'a   b b'; got ${div.classList.length}. Duplicates are removed.`,
  );
  div.classList.add("c");
  assert(
    // @ts-ignore
    div.classList.length === 3,
    `classList.length should be 3 for 'a b c'; got ${div.classList.length}.`,
  );
  div.classList.remove("a", "b");
  assert(
    div.classList.length === 1,
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
  const doc = new DOMParser().parseFromString("<div></div>", "text/html")!;
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
});

Deno.test("Element.classList.remove", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a b c'></div>",
    "text/html",
  )!;
  const div = doc.querySelector("div")!;
  div.classList.remove("a");
  assert(
    div.classList.value === "b c",
    `classList.value should be 'b c' after removing 'a'; got ${div.classList.value}.`,
  );
  div.classList.remove("b", "c");
  assert(
    // @ts-ignore
    div.classList.value === "",
    `classList.value should be '' after removing 'b' and 'c'; got ${div.classList.value}.`,
  );
});

Deno.test("Element.classList.item", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a b c b a'></div>",
    "text/html",
  )!;
  const div = doc.querySelector("div")!;

  assert(
    div.classList.item(0) === "a",
    `classList.item(0) should be 'a'; got ${div.classList.item(0)}.`,
  );
  assert(
    div.classList.item(-0) === "a",
    `classList.item(-0) should be 'a'; got ${
      div.classList.item(-0)
    }. -0 is treated same as 0.`,
  );
  assert(
    div.classList.item(0.9) === "a",
    `classList.item(0.9) should be 'a'; got ${
      div.classList.item(0.9)
    }. Input should be truncated.`,
  );
  assert(
    div.classList.item(-0.9) === "a",
    `classList.item(-0.9) should be 'a'; got ${
      div.classList.item(-0.9)
    }. Input should be truncated to -0 and treated as 0.`,
  );
  assert(
    div.classList.item(NaN) === "a",
    `classList.item(NaN) should be 'a'; got ${
      div.classList.item(NaN)
    }. NaN should be treated as 0.`,
  );
  assert(
    div.classList.item(Infinity) === "a",
    `classList.item(Infinity) should be 'a'; got ${
      div.classList.item(Infinity)
    }. Infinity should be treated as 0.`,
  );
  assert(
    div.classList.item(2 ** 32) === "a",
    `classList.item(2**32) should be 'a'; got ${
      div.classList.item(2 ** 32)
    }. Input should be modulo 2**32 after truncation.`,
  );
  assert(
    div.classList.item(2 ** 32 * 2 + 0.5) === "a",
    `classList.item(2**32*2) should be 'a'; got ${
      div.classList.item(2 ** 32 * 2)
    }. Input should be modulo 2**32 after truncation.`,
  );

  assert(
    div.classList.item(1) === "b",
    `classList.item(1) should be 'b'; got ${div.classList.item(1)}.`,
  );
  assert(
    div.classList.item(2 ** 32 + 1) === "b",
    `classList.item(2**32+1) should be 'b'; got ${
      div.classList.item(2 ** 32 + 1)
    }. Input should be modulo 2**32 after truncation.`,
  );
  assert(
    div.classList.item(2 ** 32 * 2 + 1.9) === "b",
    `classList.item(2**32*2+1) should be 'b'; got ${
      div.classList.item(2 ** 32 * 2 + 1)
    }. Input should be modulo 2**32 after truncation.`,
  );

  assert(
    div.classList.item(2) === "c",
    `classList.item(2) should be 'c'; got ${div.classList.item(2)}.`,
  );
  assert(
    div.classList.item(2 ** 32 * 2 + 2.1) === "c",
    `classList.item(2**32*2+2) should be 'c'; got ${
      div.classList.item(2 ** 32 * 2 + 2.1)
    }. Input should be modulo 2**32 after truncation.`,
  );
  assert(
    div.classList.item(Math.E) === "c",
    `classList.item(Math.E) should be 'c'; got ${
      div.classList.item(Math.E)
    }. Input should be truncated.`,
  );

  assert(
    div.classList.item(3) == null,
    `classList.item(3) should be null; got ${div.classList.item(3)}.`,
  );
  assert(
    div.classList.item(2 ** 16) === null,
    `classList.item(2**16) should be null; got ${div.classList.item(2 ** 16)}.`,
  );
  assert(
    div.classList.item(2 ** 32 * 2 + 3) === null,
    `classList.item(2**32*2+3) should be null; got ${
      div.classList.item(2 ** 32 * 2 + 3)
    }.`,
  );
  assert(
    div.classList.item(-1) == null,
    `classList.item(-1) should be null; got ${
      div.classList.item(-1)
    }. Negative values don't act the same as Array.prototype.at().`,
  );
  assert(
    div.classList.item(-Infinity) == null,
    `classList.item(-Infinity) should be null; got ${
      div.classList.item(-Infinity)
    }. Negative values don't act the same as Array.prototype.at().`,
  );
});

Deno.test("Element.classList.replace", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a   b b'></div>",
    "text/html",
  )!;
  const div = doc.querySelector("div")!;

  assert(
    div.classList.replace("a", "b") === true,
    "replace('a', 'b') should return true",
  );
  assert(
    div.classList.value === "b",
    "replace('a', 'b') on 'a   b b' should set value to 'b'",
  );

  assert(
    div.classList.replace("b", "c") === true,
    "replace('b', 'c') should return true",
  );
  assert(
    // @ts-ignore
    div.classList.value === "c",
    "replace('b', 'c') on 'b' should set value to 'c'",
  );

  assert(
    div.classList.replace("a", "b") === false,
    "replace('a', 'b') on 'c' should return false",
  );
  assert(
    div.classList.value === "c",
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
  )!;
  const div = doc.querySelector("div")!;

  assert(!div.classList.toggle("a"), "toggle('a') should return false");
  assert(div.classList.toggle("a"), "toggle('a') should return true");
  assert(div.classList.toggle("c"), "toggle('c') should return true");
  assertEquals(div.classList.value, "b a c");
});


Deno.test("Element.classList.forEach", () => {
  const doc = new DOMParser().parseFromString(
    "<div class='a   b b'></div>",
    "text/html",
  )!;
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
  )!;
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
  )!;
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
  )!;
  const div = doc.querySelector("div")!;

  const classes = [...div.classList.keys()];

  assertEquals(
    classes, 
    [0, 1],
  );
});
