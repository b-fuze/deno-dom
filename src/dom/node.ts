import { getLock, setLock } from "../constructor-lock.ts";
import { NodeList, NodeListMutator, nodeListMutatorSym } from "./node-list.ts";
import { HTMLCollection, HTMLCollectionMutator, HTMLCollectionMutatorSym } from "./html-collection.ts";
import type { Element } from "./element.ts";
import type { Document } from "./document.ts";

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

const nodesAndTextNodes = (nodes: (Node | any)[], parentNode: Node) => {
  return nodes.map(n => {
    let node = n;

    if (!(n instanceof Node)) {
      node = new Text("" + n);
    }

    node._setParent(parentNode);
    return node;
  });
}

export class Node extends EventTarget {
  public nodeValue: string | null;
  public childNodes: NodeList;
  public parentElement: Element | null;
  #childNodesMutator: NodeListMutator;
  #ownerDocument: Document | null = null;
  private _ancestors = new Set<Node>();

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
    this.childNodes = new NodeList();
    this.#childNodesMutator = this.childNodes[nodeListMutatorSym]();
    this.parentElement = <Element> parentNode;

    if (parentNode) {
      parentNode.appendChild(this);
    }
  }

  _getChildNodesMutator(): NodeListMutator {
    return this.#childNodesMutator;
  }

  _setParent(newParent: Node | null) {
    // Update ancestors for child nodes
    for (const child of this.childNodes) {
      child._setParent(this);
    }

    if (this.parentNode === newParent) {
      return;
    }

    this.parentNode = newParent;

    if (newParent) {
      // If this a document node or another non-element node
      // then parentElement should be set to null
      if (newParent.nodeType === NodeType.ELEMENT_NODE) {
        this.parentElement = newParent as unknown as Element;
      } else {
        this.parentElement = null;
      }

      this._setOwnerDocument(newParent.#ownerDocument);

      // Add parent chain to ancestors
      let parent: Node | null = newParent;
      this._ancestors = new Set(newParent._ancestors);
      this._ancestors.add(newParent);
    } else {
      this.parentElement = null;
      this._ancestors.clear();
    }
  }

  _assertNotAncestor(child: Node) {
    // Check this child isn't an ancestor
    if (this._ancestors.has(child) || child === this) {
      throw new Error("DOMException: The new child is an ancestor of the parent");
    }
  }

  _setOwnerDocument(document: Document | null) {
    if (this.#ownerDocument !== document) {
      this.#ownerDocument = document;

      for (const child of this.childNodes) {
        child._setOwnerDocument(document);
      }
    }
  }

  get ownerDocument() {
    return this.#ownerDocument;
  }

  get textContent(): string {
    let out = "";

    for (const child of this.childNodes) {
      switch (child.nodeType) {
        case NodeType.TEXT_NODE:
          out += child.nodeValue;
          break;
        case NodeType.ELEMENT_NODE:
          out += child.textContent;
          break;
      }
    }

    return out;
  }

  set textContent(content: string) {
    for (const child of this.childNodes) {
      child._setParent(null);
    }

    this._getChildNodesMutator().splice(0, this.childNodes.length);
    this.appendChild(new Text(content));
  }

  get firstChild() {
    return this.childNodes[0] || null;
  }

  get lastChild() {
    return this.childNodes[this.childNodes.length - 1] || null;
  }

  cloneNode() {
    // TODO
  }

  remove() {
    const parent = this.parentNode;

    if (parent) {
      const nodeList = parent._getChildNodesMutator();
      const idx = nodeList.indexOf(this);
      nodeList.splice(idx, 1);
      this._setParent(null);
    }
  }

  appendChild(child: Node): Node {
    this._assertNotAncestor(child); // FIXME: Should this really be a method?
    const oldParentNode = child.parentNode;

    // Check if we already own this child
    if (oldParentNode === this) {
      if (this.#childNodesMutator.indexOf(child) !== -1) {
        return child;
      }
    } else if (oldParentNode) {
      child.remove();
    }

    child._setParent(this);
    this.#childNodesMutator.push(child);

    return child;
  }

  removeChild(child: Node) {
    // TODO
  }

  replaceChild(newChild: Node, oldChild: Node): Node {
    if (oldChild.parentNode !== this) {
      throw new Error("Old child's parent is not the current node.");
    }

    oldChild.replaceWith(newChild);
    return oldChild;
  }

  private insertBeforeAfter(nodes: (Node | string)[], side: number) {
    const parentNode = this.parentNode!;
    const mutator = parentNode._getChildNodesMutator();
    const index = mutator.indexOf(this);
    nodes = nodesAndTextNodes(nodes, parentNode);

    mutator.splice(index + side, 0, ...(<Node[]> nodes));
  }

  before(...nodes: (Node | string)[]) {
    if (this.parentNode) {
      this.insertBeforeAfter(nodes, 0);
    }
  }

  after(...nodes: (Node | string)[]) {
    if (this.parentNode) {
      this.insertBeforeAfter(nodes, 1);
    }
  }

  insertBefore(newNode: Node, refNode: Node | null): Node {
    this._assertNotAncestor(newNode);
    const mutator = this._getChildNodesMutator();

    if (refNode === null) {
      this.appendChild(newNode);
      return newNode;
    }

    const index = mutator.indexOf(refNode);
    if (index === -1) {
      throw new Error("DOMException: Child to insert before is not a child of this node");
    }

    newNode._setParent(this);
    mutator.splice(index, 0, newNode);

    return newNode;
  }

  replaceWith(...nodes: (Node | string)[]) {
    if (this.parentNode) {
      const parentNode = this.parentNode;
      const mutator = parentNode._getChildNodesMutator();
      const index = mutator.indexOf(this);
      nodes = nodesAndTextNodes(nodes, parentNode);

      mutator.splice(index, 1, ...(<Node[]> nodes));
      this._setParent(null);
    }
  }

  get children(): HTMLCollection {
    const collection = new HTMLCollection();
    const mutator = collection[HTMLCollectionMutatorSym]();

    for (const child of this.childNodes) {
      if (child.nodeType === NodeType.ELEMENT_NODE) {
        mutator.push(<Element> child);
      }
    }

    return collection;
  }

  get nextSibling(): Node | null {
    const parent = this.parentNode;

    if (!parent) {
      return null;
    }

    const index = parent._getChildNodesMutator().indexOf(this);
    let next: Node | null = this.childNodes[index + 1] || null;

    return next;
  }

  get previousSibling(): Node | null {
    const parent = this.parentNode;

    if (!parent) {
      return null;
    }

    const index = parent._getChildNodesMutator().indexOf(this);
    let prev: Node | null = this.childNodes[index - 1] || null;

    return prev;
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
    text: string = "",
  ) {
    let oldLock = getLock();
    setLock(false);
    super(
      text,
      "#text",
      NodeType.TEXT_NODE,
      null,
    );

    this.nodeValue = text;
    setLock(oldLock);
  }

  get textContent(): string {
    return <string> this.nodeValue;
  }
}

export class Comment extends CharacterData {
  constructor(
    text: string = "",
  ) {
    let oldLock = getLock();
    setLock(false);
    super(
      text,
      "#comment",
      NodeType.COMMENT_NODE,
      null,
    );

    this.nodeValue = text;
    setLock(oldLock);
  }

  get textContent(): string {
    return <string> this.nodeValue;
  }
}

