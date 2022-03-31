import { Document, Node, NodeType } from "../../deno-dom-wasm.ts";
import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Node#TEXT_NODE, Node#ELEMENT_NODE, et al. instance nodeType constants", () => {
  const doc = new Document();
  const div = doc.createElement("div");

  assertEquals(div.ELEMENT_NODE, Node.ELEMENT_NODE, "Node#ELEMENT_NODE");
  assertEquals(div.ATTRIBUTE_NODE, Node.ATTRIBUTE_NODE, "Node#ATTRIBUTE_NODE");
  assertEquals(div.TEXT_NODE, Node.TEXT_NODE, "Node#TEXT_NODE");
  assertEquals(
    div.CDATA_SECTION_NODE,
    Node.CDATA_SECTION_NODE,
    "Node#CDATA_SECTION_NODE",
  );
  assertEquals(
    div.ENTITY_REFERENCE_NODE,
    Node.ENTITY_REFERENCE_NODE,
    "Node#ENTITY_REFERENCE_NODE",
  );
  assertEquals(div.ENTITY_NODE, Node.ENTITY_NODE, "Node#ENTITY_NODE");
  assertEquals(
    div.PROCESSING_INSTRUCTION_NODE,
    Node.PROCESSING_INSTRUCTION_NODE,
    "Node#PROCESSING_INSTRUCTION_NODE",
  );
  assertEquals(div.COMMENT_NODE, Node.COMMENT_NODE, "Node#COMMENT_NODE");
  assertEquals(div.DOCUMENT_NODE, Node.DOCUMENT_NODE, "Node#DOCUMENT_NODE");
  assertEquals(
    div.DOCUMENT_TYPE_NODE,
    Node.DOCUMENT_TYPE_NODE,
    "Node#DOCUMENT_TYPE_NODE",
  );
  assertEquals(
    div.DOCUMENT_FRAGMENT_NODE,
    Node.DOCUMENT_FRAGMENT_NODE,
    "Node#DOCUMENT_FRAGMENT_NODE",
  );
  assertEquals(div.NOTATION_NODE, Node.NOTATION_NODE, "Node#NOTATION_NODE");
});

Deno.test("Node.TEXT_NODE, Node.ELEMENT_NODE, et al. static nodeType constants", () => {
  assertEquals(Node.ELEMENT_NODE, NodeType.ELEMENT_NODE, "Node#ELEMENT_NODE");
  assertEquals(
    Node.ATTRIBUTE_NODE,
    NodeType.ATTRIBUTE_NODE,
    "Node#ATTRIBUTE_NODE",
  );
  assertEquals(Node.TEXT_NODE, NodeType.TEXT_NODE, "Node#TEXT_NODE");
  assertEquals(
    Node.CDATA_SECTION_NODE,
    NodeType.CDATA_SECTION_NODE,
    "Node#CDATA_SECTION_NODE",
  );
  assertEquals(
    Node.ENTITY_REFERENCE_NODE,
    NodeType.ENTITY_REFERENCE_NODE,
    "Node#ENTITY_REFERENCE_NODE",
  );
  assertEquals(Node.ENTITY_NODE, NodeType.ENTITY_NODE, "Node#ENTITY_NODE");
  assertEquals(
    Node.PROCESSING_INSTRUCTION_NODE,
    NodeType.PROCESSING_INSTRUCTION_NODE,
    "Node#PROCESSING_INSTRUCTION_NODE",
  );
  assertEquals(Node.COMMENT_NODE, NodeType.COMMENT_NODE, "Node#COMMENT_NODE");
  assertEquals(
    Node.DOCUMENT_NODE,
    NodeType.DOCUMENT_NODE,
    "Node#DOCUMENT_NODE",
  );
  assertEquals(
    Node.DOCUMENT_TYPE_NODE,
    NodeType.DOCUMENT_TYPE_NODE,
    "Node#DOCUMENT_TYPE_NODE",
  );
  assertEquals(
    Node.DOCUMENT_FRAGMENT_NODE,
    NodeType.DOCUMENT_FRAGMENT_NODE,
    "Node#DOCUMENT_FRAGMENT_NODE",
  );
  assertEquals(
    Node.NOTATION_NODE,
    NodeType.NOTATION_NODE,
    "Node#NOTATION_NODE",
  );
});
