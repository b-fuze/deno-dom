import { Comment, DOMParser, Text } from "../../deno-dom-wasm.ts";
import { assertStrictEquals as assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("CharacterData.nodeValue/data", () => {
  const doc = new DOMParser().parseFromString(
    `foo<!--bar-->`,
    "text/html",
  )!;

  const text = doc.body.childNodes[0] as Text;
  const comment = doc.body.childNodes[1] as Comment;

  assertEquals(text.nodeValue, "foo");
  assertEquals(text.nodeValue, text.data);
  assertEquals(text.nodeValue, text.textContent);
  assertEquals(comment.data, "bar");
  assertEquals(comment.nodeValue, comment.data);
  assertEquals(comment.nodeValue, comment.textContent);

  text.data += " fizz";
  assertEquals(text.nodeValue, "foo fizz");
  assertEquals(text.data, "foo fizz");
  assertEquals(text.textContent, "foo fizz");

  assertEquals(doc.body.outerHTML, "<body>foo fizz<!--bar--></body>");

  comment.nodeValue = null;
  assertEquals(comment.nodeValue, "");
  assertEquals(comment.data, "");
  assertEquals(comment.textContent, "");
  assertEquals(doc.body.outerHTML, "<body>foo fizz<!----></body>");

  comment.nodeValue = {};
  assertEquals(
    doc.body.outerHTML,
    "<body>foo fizz<!--[object Object]--></body>",
  );

  text.nodeValue = "";
  assertEquals(text.data, "");
  assertEquals(doc.body.outerHTML, "<body><!--[object Object]--></body>");
});

Deno.test("Text/Comment constructors with non-strings", () => {
  const textNull = new Text(null as any);
  const commentNull = new Comment(null as any);
  const textObject = new Text({} as any);
  const commentObject = new Comment({} as any);
  const textZero = new Text(0 as any);
  const commentZero = new Comment(0 as any);

  assertEquals(textNull.nodeValue, "null");
  assertEquals(textNull.data, "null");
  assertEquals(textNull.textContent, "null");
  assertEquals(commentNull.nodeValue, "null");
  assertEquals(commentNull.data, "null");
  assertEquals(commentNull.textContent, "null");

  assertEquals(textObject.nodeValue, "[object Object]");
  assertEquals(textObject.data, "[object Object]");
  assertEquals(textObject.textContent, "[object Object]");
  assertEquals(commentObject.nodeValue, "[object Object]");
  assertEquals(commentObject.data, "[object Object]");
  assertEquals(commentObject.textContent, "[object Object]");

  assertEquals(textZero.nodeValue, "0");
  assertEquals(textZero.data, "0");
  assertEquals(textZero.textContent, "0");
  assertEquals(commentZero.nodeValue, "0");
  assertEquals(commentZero.data, "0");
  assertEquals(commentZero.textContent, "0");
});
