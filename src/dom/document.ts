import { setLock, getLock } from "../constructor-lock.ts";
import { Node, NodeType, Text, Comment } from "./node.ts";
import { Element } from "./element.ts";

export class DOMImplementation {
  constructor() {
    if (getLock()) {
      throw new TypeError("Illegal constructor.");
    }
  }

  createDocument() {
    throw new Error("Unimplemented"); // TODO
  }

  createHTMLDocument(titleStr?: string): HTMLDocument {
    titleStr += "";

    // TODO: Figure out a way to make `setLock` invocations less redundant
    setLock(false);
    const doc = new HTMLDocument();

    setLock(false);
    const docType = new DocumentType("html", "", "");
    doc.appendChild(docType);

    const html = new Element("html", doc, []);
    html._setOwnerDocument(doc);

    const head = new Element("head", html, []);
    const body = new Element("body", html, []);

    const title = new Element("title", head, []);
    const titleText = new Text(titleStr);
    title.appendChild(titleText);
    doc._setDocumentTitle(titleStr!);

    doc.head = head;
    doc.body = body;

    setLock(true);
    return doc;
  }

  createDocumentType(qualifiedName: string, publicId: string, systemId: string): DocumentType {
    setLock(false);
    const doctype = new DocumentType(qualifiedName, publicId, systemId);
    setLock(true);

    return doctype;
  }
}

export class DocumentType extends Node {
  #qualifiedName = "";
  #publicId = "";
  #systemId = "";

  constructor(
    name: string,
    publicId: string,
    systemId: string,
  ) {
    super(
      "html", 
      NodeType.DOCUMENT_TYPE_NODE, 
      null
    );

    this.#qualifiedName = name;
    this.#publicId = publicId;
    this.#systemId = systemId;
  }

  get name() {
    return this.#qualifiedName;
  }

  get publicId() {
    return this.#publicId;
  }

  get systemId() {
    return this.#systemId;
  }
}

export interface ElementCreationOptions {
  is: string;
}

export type VisibilityState = "visible" | "hidden" | "prerender";

export class Document extends Node {
  public head: Element = <Element> <unknown> null;
  public body: Element = <Element> <unknown> null;
  public implementation: DOMImplementation;

  #lockState = false;
  #documentURI = "about:blank"; // TODO
  #title = "";

  constructor() {
    super(
      (setLock(false), "#document"),
      NodeType.DOCUMENT_NODE,
      null,
    );

    setLock(false);
    this.implementation = new DOMImplementation();
    setLock(true);
  }

  get documentURI() {
    return this.#documentURI;
  }

  get title() {
    return this.#title; // TODO
  }

  get cookie() {
    return ""; // TODO
  }

  set cookie(newCookie: string) {
    // TODO
  }

  get visibilityState(): VisibilityState {
    return "visible";
  }

  get hidden() {
    return false;
  }

  get documentElement(): Element | null {
    for (const node of this.childNodes) {
      if (node.nodeType === NodeType.ELEMENT_NODE) {
        return <Element> node;
      }
    }

    return null;
  }

  _setDocumentTitle(title: string) {
    this.#title = title;
  }

  appendChild(child: Node) {
    super.appendChild(child);
    child._setOwnerDocument(this);
  }

  createElement(tagName: string, options?: ElementCreationOptions): Element {
    tagName = tagName.toUpperCase();

    setLock(false);
    const elm = new Element(tagName, null, []);
    elm._setOwnerDocument(this);
    setLock(true);
    return elm;
  }

  createTextNode(data?: string): Text {
    return new Text(data);
  }

  createComment(data?: string): Comment {
    return new Comment(data);
  }
}

export class HTMLDocument extends Document {
  constructor() {
    let lock = getLock();
    super();

    if (lock) {
      throw new TypeError("Illegal constructor.");
    }

    setLock(false);
  }
}

