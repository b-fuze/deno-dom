# Deno DOM Design Doc

People:
  - b-fuze (author)

## Overview

This is an attempt to implement the browser's DOM API as a Deno module; in an effort to facilitate parsing of arbitrary HTML into a DOM tree, its manipulation, and (re)serialization into HTML form. The primary API is JS, in a Deno-based environment. The internal parsing and rendering facilities will be implemented in Rust, with the JS-Rust interface achieved via wasmbindgen, and the user-land API implemented in TypeScript hopefully mirroring the actual DOM API we're familiar with.

## Motivation

This project is primarily aimed at enabling SSR in [Deno](https://deno.land/), however it should be general enough to also aid in things like webscraping, HTML manipulation, etc.

## Goals

 - HTML parser in Deno
 - Fast
 - Mirror most\* supported DOM APIs as closely as possible
 - Provide specific APIs in addition to DOM APIs to make certain operations more efficient, like controlling Shadow DOM (see Open Questions)
 - Use cutting-edge JS features like private class members, optional chaining, etc

## Non-Goals

 - Headless browser implementation
 - Ability to run JS embedded in documents (`<script>` tags, `onload`, etc)
 - Parse CSS or JS (they're just text, but this may be supported in the future for CSSOM)
 - Support older (or even not so old) JS engines. In other words, there will be no support of transpilation to ES5, no support of polyfills, etc
 - Support special functionality of obsolet HTML elements (`<marquee>`, etc)

## Open Questions

### Shadow DOM

Shadow DOM is a supported feature, yet shadow DOM can't be represented in HTML and can only be constructed with DOM APIs. This is problematic for situations like SSR where you need to serialize the tree into HTML. How should it be handled?

Some ideas:

 - Rendered as HTML child nodes
 - Omitted entirely
 - Some flag of sorts that toggles its serializability
 - Inline JS that would render the respective shadow DOM for the concerned elements?

### Proxies

It is known that proxies can incur runtime costs, as they are a somewhat magical existence in the context of JS engines. However, they may be necessary for things like [`Element.attributes`](https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes) that enable to manipulate an element's attributes simply by setting or removing properties on a "normal JS object."

One consideration is to make it opt-in by making `.attributes` a getter that will generate a `Proxy` on-the-fly when needed.

### SVG

???

## Implementation

In JS land there will be typical classes like `HTMLDocument`, `Text`, `HTMLDivElement`, etc. These will be built from either parsing a document or directly from `document.createElement(...)`.

### Caching

Elements will cache various aspects of their children like class name maps, tag name maps, etc. It will also cache its `innerHTML`, `innerText`, and `textContent`.

### Example Usage

Example parsing a basic document
```typescript
import { DOMParser } from "./deno-dom/mod.ts"

const doc = new DOMParser().parseFromString(`
  <p>Hello <b>World!</b></p>
`, "text/html");

const text = doc.querySelector("p").childNodes[0].textContent;
console.log(text); // "Hello "
```

<!-- vim:set textwidth=0: -->

