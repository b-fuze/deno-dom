import { DOMParser } from "../../deno-dom-wasm.ts";
import type { HTMLTemplateElement } from "../../src/dom/elements/html-template-element.ts";

Deno.test("querySelector<T> and querySelectorAll<T> typings", () => {
  const doc = new DOMParser().parseFromString(
    `<template></template>`,
    "text/html",
  );

  // We don't actually test anything here, we just challenge the TypeScript typings
  doc.querySelector<HTMLTemplateElement>("template")!.content;
});
