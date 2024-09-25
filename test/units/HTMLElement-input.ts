import { DOMParser } from "../../deno-dom-wasm.ts";
import { expect, fn } from "expect";
import type { HTMLInputElement } from "../../src/dom/elements/html-input-element.ts";

Deno.test("HTMLInputElement reacts to value and checked properties changes", () => {
  const doc = new DOMParser().parseFromString(
    `<input value="foo" type="checkbox">`,
    "text/html",
  );
  const listener = fn() as unknown as EventListenerObject;
  const input = doc.querySelector<HTMLInputElement>("input")!;

  expect(input.value).toBe("foo");
  expect(input.checked).toBe(false);

  input.addEventListener("input", listener);

  input.value = "bar";
  expect(input.value).toBe("bar");
  expect(input.getAttribute("value")).toBe("bar");
  expect(listener).toBeCalledTimes(1);

  input.checked = true;
  expect(input.checked).toBe(true);
  expect(input.hasAttribute("checked")).toBe(true);
  expect(listener).toBeCalledTimes(2);

  input.checked = false;
  expect(input.checked).toBe(false);
  expect(input.hasAttribute("checked")).toBe(false);
  expect(listener).toBeCalledTimes(3);
});
