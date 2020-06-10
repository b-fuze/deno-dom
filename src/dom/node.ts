import { getLock, setLock } from "../constructor-lock.ts";
import { Element } from "./element.ts";

export class EventTarget {
  addEventListener() {
    // TODO
  }

  removeEventListener() {
    // TODO
  }

  dispatchEvent() {
    // TODO
  }
}

export enum NodeType {
  ELEMENT_NODE = 1,
  ATTRIBUTE_NODE = 2,
  TEXT_NODE = 3,
  CDATA_SECTION_NODE = 4,
  ENTITY_REFERENCE_NODE = 5,
  ENTITY_NODE = 6,
  PROCESSING_INSTRUCTION_NODE = 7,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_TYPE_NODE = 10,
  DOCUMENT_FRAGMENT_NODE = 11,
  NOTATION_NODE = 12,
}

export class NodeList extends Array<Node> {
  // TODO?
}

export class Node extends EventTarget {
  public nodeValue: string | null;
  public childNodes: NodeList;
  public parentElement: Element | null;

  constructor(
    public nodeName: string,
    public nodeType: NodeType,
    public parentNode: Node | null,
  ) {
    super();
    if (getLock()) {
      throw new TypeError("Illegal constructor");
    }

    this.nodeValue = null;
    this.childNodes = new NodeList;
    this.parentElement = <Element> parentNode;
  }

  cloneNode() {
    // TODO
  }

  remove() {
    const parent = this.parentNode;

    if (parent) {
      const idx = parent.childNodes.indexOf(this);
      parent.childNodes.splice(idx, 1);
      this.parentNode = null;
    }
  }

  appendChild(child: Node) {
    if (child.parentNode) {
      child.remove();
    }

    this.childNodes.push(child);
  }

  removeChild(child: Node) {
    // TODO
  }

  replaceChild(child: Node) {
    // TODO
  }
}

export class CharacterData extends Node {
  constructor(
    public data: string,
    nodeName: string,
    nodeType: NodeType,
    parentNode: Node | null,
  ) {
    super(
      nodeName,
      nodeType,
      parentNode,
    );
    if (getLock()) {
      throw new TypeError("Illegal constructor");
    }

    this.nodeValue = data;
  }

  get length(): number {
    return this.data.length;
  }

  // TODO: Implement NonDocumentTypeChildNode.nextElementSibling, etc
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/CharacterData
}

export class Text extends CharacterData {
  constructor(
    text: string,
    _: never = <never> <unknown> null,
  ) {
    let oldLock = getLock();
    setLock(false);
    super(
      text, 
      "#text", 
      NodeType.TEXT_NODE, 
      _,
    );
    setLock(oldLock);
  }
}

