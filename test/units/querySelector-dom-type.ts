///<reference lib="dom" />
import { DOMParser } from "../../deno-dom-wasm.ts";

Deno.test("querySelector<T> and querySelectorAll<T> typings", () => {
  const doc = new DOMParser().parseFromString(
    `
    <div>
      <select>
        <option></option>
        <option></option>
      </select>
    </div>
  `,
    "text/html",
  )!;

  // We don't actually test anything here, we just challenge the TypeScript typings
  const div = doc.querySelector<HTMLDivElement>("div")!;
  const select = div.querySelector<HTMLSelectElement>("p")!;
  select?.selectedOptions;
  doc.querySelectorAll<HTMLOptionElement>("option")!;
});
