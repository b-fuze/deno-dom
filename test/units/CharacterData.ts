import { Comment, DOMParser, NodeType, Text } from "../../deno-dom-wasm.ts";
import { assertStrictEquals as assertEquals } from "assert";

Deno.test("CharacterData.nodeValue/data", () => {
  const doc = new DOMParser().parseFromString(
    `foo<!--bar-->`,
    "text/html",
  );

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

Deno.test("CharacterData.after/before/remove/replaceWith", () => {
  const doc = new DOMParser().parseFromString(
    `foo<!--bar-->`,
    "text/html",
  );

  const text = doc.body.childNodes[0] as Text;
  const comment = doc.body.childNodes[1] as Comment;

  assertEquals(doc.body.childNodes.length, 2);
  assertEquals((text as any).previousSibling, null);

  text.before(new Comment("fizz"));

  assertEquals(doc.body.childNodes[0].nodeValue, "fizz");
  assertEquals(doc.body.childNodes.length, 3);
  assertEquals(text.previousSibling?.nodeValue, "fizz");
  assertEquals(text.previousSibling?.nodeType, NodeType.COMMENT_NODE);
  assertEquals(text.nextSibling?.nodeValue, "bar");
  assertEquals(text.nextSibling?.nodeType, NodeType.COMMENT_NODE);

  text.after(new Text(" extra"));

  assertEquals(doc.body.childNodes[2].nodeValue, " extra");
  assertEquals(doc.body.childNodes.length, 4);
  assertEquals(
    doc.body.outerHTML,
    `<body><!--fizz-->foo extra<!--bar--></body>`,
  );
  assertEquals(text.nextSibling?.nodeValue, " extra");
  assertEquals(text.nextSibling?.nodeType, NodeType.TEXT_NODE);

  const div = doc.createElement("div");
  div.innerHTML = "html";
  text.replaceWith("stuff", div);

  assertEquals(doc.body.childNodes.length, 5);
  assertEquals(
    doc.body.outerHTML,
    `<body><!--fizz-->stuff<div>html</div> extra<!--bar--></body>`,
  );
  assertEquals(div.nextSibling?.nodeValue, " extra");
  assertEquals(text.parentNode, null);
  assertEquals(text.parentElement, null);
  assertEquals(div.previousSibling?.nodeValue, "stuff");
  assertEquals(div.nextSibling?.nodeValue, " extra");
  assertEquals(div.nextSibling?.nextSibling, comment);

  comment.remove();

  assertEquals(doc.body.childNodes.length, 4);
  assertEquals(div.nextSibling?.nextSibling, null);
  assertEquals(comment.parentNode, null);
  assertEquals(comment.parentElement, null);
  assertEquals(comment.previousSibling, null);
  assertEquals(comment.nextSibling, null);
});

Deno.test("CharacterData.textContent", () => {
  const doc = new DOMParser().parseFromString(
    `<body>foo</body>`,
    "text/html",
  );
  const text = doc.body.childNodes[0];
  assertEquals(text.textContent, "foo");
  text.textContent = "bar";
  assertEquals(text.textContent, "bar");
});
