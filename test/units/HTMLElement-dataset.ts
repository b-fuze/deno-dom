import { DOMParser } from "../../deno-dom-wasm.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

// FIXME: should be HTMLElement but it's not implemented yet
Deno.test("Element#dataset", () => {
  const doc = new DOMParser().parseFromString(
    `<div bar=nope foo=notdataset data-foo=bar data--foo-bar=baz></div>`,
    "text/html",
  );
  const div = doc.querySelector("div")!;

  assertEquals(div.dataset.foo, "bar");
  assertEquals(div.dataset.FooBar, "baz");
  assertEquals(div.dataset.bar, undefined);
  assertEquals("foo" in div.dataset, true);
  assertEquals("FooBar" in div.dataset, true);
  assertEquals("bar" in div.dataset, false);
  assertEquals(Object.keys(div.dataset), ["foo", "FooBar"]);
  assertEquals(div.hasAttribute("data-foo"), true);
  assertEquals(div.hasAttribute("data--foo-bar"), true);

  delete div.dataset.FooBar;

  assertEquals(div.dataset.foo, "bar");
  assertEquals(div.dataset.FooBar, undefined);
  assertEquals(div.dataset.bar, undefined);
  assertEquals("foo" in div.dataset, true);
  assertEquals("FooBar" in div.dataset, false);
  assertEquals("bar" in div.dataset, false);
  assertEquals(Object.keys(div.dataset), ["foo"]);
  assertEquals(div.hasAttribute("data-foo"), true);
  assertEquals(div.hasAttribute("data--foo-bar"), false);
  assertEquals(
    div.outerHTML,
    `<div bar="nope" foo="notdataset" data-foo="bar"></div>`,
  );

  div.dataset.FIZZy = 42 as unknown as string;

  assertEquals(div.dataset.foo, "bar");
  assertEquals(div.dataset.FooBar, undefined);
  assertEquals(div.dataset.bar, undefined);
  assertEquals(div.dataset.FIZZy, "42");
  assertEquals("foo" in div.dataset, true);
  assertEquals("FooBar" in div.dataset, false);
  assertEquals("bar" in div.dataset, false);
  assertEquals("FIZZy" in div.dataset, true);
  assertEquals(Object.keys(div.dataset), ["foo", "FIZZy"]);
  assertEquals(div.hasAttribute("data-foo"), true);
  assertEquals(div.hasAttribute("data--foo-bar"), false);
  assertEquals(div.hasAttribute("data--f-i-z-zy"), true);
  assertEquals(
    div.outerHTML,
    `<div bar="nope" foo="notdataset" data-foo="bar" data--f-i-z-zy="42"></div>`,
  );

  div.removeAttribute("data-foo");

  assertEquals(div.dataset.foo, undefined);
  assertEquals(div.dataset.FooBar, undefined);
  assertEquals(div.dataset.bar, undefined);
  assertEquals(div.dataset.FIZZy, "42");
  assertEquals("foo" in div.dataset, false);
  assertEquals("FooBar" in div.dataset, false);
  assertEquals("bar" in div.dataset, false);
  assertEquals("FIZZy" in div.dataset, true);
  assertEquals(Object.keys(div.dataset), ["FIZZy"]);
  assertEquals(div.hasAttribute("data-foo"), false);
  assertEquals(div.hasAttribute("data--foo-bar"), false);
  assertEquals(div.hasAttribute("data--f-i-z-zy"), true);
  assertEquals(
    div.outerHTML,
    `<div bar="nope" foo="notdataset" data--f-i-z-zy="42"></div>`,
  );

  div.setAttribute("data--éclair", true);

  assertEquals(div.dataset.foo, undefined);
  assertEquals(div.dataset.FooBar, undefined);
  assertEquals(div.dataset.bar, undefined);
  assertEquals(div.dataset.FIZZy, "42");
  assertEquals(div.dataset["-éclair"], "true");
  assertEquals("foo" in div.dataset, false);
  assertEquals("FooBar" in div.dataset, false);
  assertEquals("bar" in div.dataset, false);
  assertEquals("FIZZy" in div.dataset, true);
  assertEquals("-éclair" in div.dataset, true);
  assertEquals(Object.keys(div.dataset), ["FIZZy", "-éclair"]);
  assertEquals(div.hasAttribute("data-foo"), false);
  assertEquals(div.hasAttribute("data--foo-bar"), false);
  assertEquals(div.hasAttribute("data--f-i-z-zy"), true);
  assertEquals(div.hasAttribute("data--éclair"), true);
  assertEquals(
    div.outerHTML,
    `<div bar="nope" foo="notdataset" data--f-i-z-zy="42" data--éclair="true"></div>`,
  );

  assertThrows(() => {
    div.dataset["-e"] = "fails";
  });

  assertThrows(() => {
    div.dataset["—"] = "fails";
  });
});
