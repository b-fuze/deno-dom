import { DOMParser, Element } from "../../deno-dom-wasm.ts";
import {
  assertEquals,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Element.firstElementChild", () => {
	const doc = new DOMParser().parseFromString(
		`<div>Hello<p>Wonderful</p>and<h1>Amazing</h1>World</div>`,
		"text/html",
	)!;

  const parent = doc.querySelector("div")!;
	
	assertEquals(parent.firstElementChild!.tagName, "P");
	assertEquals(parent.firstElementChild!.textContent, "Wonderful");
});
