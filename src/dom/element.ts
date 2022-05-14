import { CTOR_KEY } from "../constructor-lock.ts";
import { fragmentNodesFromString } from "../deserialize.ts";
import { Comment, Node, nodesAndTextNodes, NodeType, Text } from "./node.ts";
import { NodeList, nodeListMutatorSym } from "./node-list.ts";
import { HTMLCollection } from "./html-collection.ts";
import {
  getElementAttributesString,
  getElementsByClassName,
  getInnerHtmlFromNodes,
  insertBeforeAfter,
} from "./utils.ts";
import UtilTypes from "./utils-types.ts";

export interface DOMTokenList {
  [index: number]: string;
}
export class DOMTokenList {
  #value = "";
  #set = new Set<string>();
  #onChange: (className: string) => void;

  constructor(
    onChange: (className: string) => void,
    key: typeof CTOR_KEY,
  ) {
    if (key !== CTOR_KEY) {
      throw new TypeError("Illegal constructor");
    }
    this.#onChange = onChange;
  }

  static #invalidToken(
    token: string,
  ) {
    return token === "" || /[\t\n\f\r ]/.test(token);
  }

  #setIndices() {
    const classes = Array.from(this.#set);
    for (let i = 0; i < classes.length; i++) {
      this[i] = classes[i];
    }
  }

  set value(
    input: string,
  ) {
    this.#value = input;
    this.#set = new Set(
      input.trim().split(/[\t\n\f\r\s]+/g),
    );
    this.#setIndices();
    this.#onChange(this.#value);
  }

  get value() {
    return this.#value;
  }

  get length() {
    return this.#set.size;
  }

  *entries(): IterableIterator<[number, string]> {
    const array = Array.from(this.#set);
    for (let i = 0; i < array.length; i++) {
      yield [i, array[i]];
    }
  }

  *values(): IterableIterator<string> {
    yield* this.#set.values();
  }

  *keys(): IterableIterator<number> {
    for (let i = 0; i < this.#set.size; i++) {
      yield i;
    }
  }

  *[Symbol.iterator](): IterableIterator<string> {
    yield* this.#set.values();
  }

  item(
    index: number,
  ) {
    index = Number(index);
    if (Number.isNaN(index) || index === Infinity) index = 0;
    return this[Math.trunc(index) % 2 ** 32] ?? null;
  }

  contains(
    element: string,
  ) {
    return this.#set.has(element);
  }

  add(
    ...elements: Array<string>
  ) {
    for (const element of elements) {
      if (DOMTokenList.#invalidToken(element)) {
        throw new DOMException(
          "Failed to execute 'add' on 'DOMTokenList': The token provided must not be empty.",
        );
      }
      const { size } = this.#set;
      this.#set.add(element);
      if (size < this.#set.size) {
        this[size] = element;
      }
    }
    this.#value = Array.from(this.#set).join(" ");
  }

  remove(
    ...elements: Array<string>
  ) {
    const { size } = this.#set;
    for (const element of elements) {
      if (DOMTokenList.#invalidToken(element)) {
        throw new DOMException(
          "Failed to execute 'remove' on 'DOMTokenList': The token provided must not be empty.",
        );
      }
      this.#set.delete(element);
    }
    if (size !== this.#set.size) {
      for (let i = this.#set.size; i < size; i++) {
        delete this[i];
      }
      this.#setIndices();
    }
    this.#value = Array.from(this.#set).join(" ");
  }

  replace(
    oldToken: string,
    newToken: string,
  ) {
    if ([oldToken, newToken].some((v) => DOMTokenList.#invalidToken(v))) {
      throw new DOMException(
        "Failed to execute 'replace' on 'DOMTokenList': The token provided must not be empty.",
      );
    }
    if (!this.#set.has(oldToken)) {
      return false;
    }

    if (this.#set.has(newToken)) {
      this.remove(oldToken);
    } else {
      this.#set.delete(oldToken);
      this.#set.add(newToken);
      this.#setIndices();
      this.#value = Array.from(this.#set).join(" ");
    }
    return true;
  }

  supports(): never {
    throw new Error("Not implemented");
  }

  toggle(
    element: string,
    force?: boolean,
  ) {
    if (force !== undefined) {
      const operation = force ? "add" : "remove";
      this[operation](element);
      return false;
    } else {
      const contains = this.contains(element);
      const operation = contains ? "remove" : "add";
      this[operation](element);
      return !contains;
    }
  }

  forEach(
    callback: (value: string, index: number, list: DOMTokenList) => void,
  ) {
    for (const [i, value] of this.entries()) {
      callback(value, i, this);
    }
  }
}

export class Attr {
  #namedNodeMap: NamedNodeMap | null = null;
  #name: string = "";

  constructor(map: NamedNodeMap, name: string, key: typeof CTOR_KEY) {
    if (key !== CTOR_KEY) {
      throw new TypeError("Illegal constructor");
    }

    this.#name = name;
    this.#namedNodeMap = map;
  }

  get name() {
    return this.#name;
  }

  get value() {
    return (<{ [attribute: string]: string }> <unknown> this.#namedNodeMap)[
      this.#name
    ];
  }
}

export class NamedNodeMap {
  #attrObjCache: {
    [attribute: string]: Attr;
  } = {};

  private newAttr(attribute: string): Attr {
    return new Attr(this, attribute, CTOR_KEY);
  }

  getNamedItem(attribute: string) {
    return this.#attrObjCache[attribute] ??
      (this.#attrObjCache[attribute] = this.newAttr(attribute));
  }

  setNamedItem(...args: any) {
    // TODO
  }
}

export class Element extends Node {
  #classList = new DOMTokenList(
    (className) => {
      if (this.hasAttribute("class") || className !== "") {
        this.attributes["class"] = className;
      }
    },
    CTOR_KEY,
  );
  public attributes: NamedNodeMap & { [attribute: string]: string } =
    <any> new NamedNodeMap();
  localName: string;

  #currentId = "";

  constructor(
    public tagName: string,
    parentNode: Node | null,
    attributes: [string, string][],
    key: typeof CTOR_KEY,
  ) {
    super(
      tagName,
      NodeType.ELEMENT_NODE,
      parentNode,
      key,
    );

    for (const attr of attributes) {
      this.attributes[attr[0]] = attr[1];

      switch (attr[0]) {
        case "class":
          this.#classList.value = attr[1];
          break;
        case "id":
          this.#currentId = attr[1];
          break;
      }
    }

    this.tagName = this.nodeName = tagName.toUpperCase();
    this.localName = tagName.toLowerCase();
  }

  _shallowClone(): Node {
    // FIXME: This attribute copying needs to also be fixed in other
    // elements that override _shallowClone like <template>
    const attributes: [string, string][] = [];
    for (const attribute of this.getAttributeNames()) {
      attributes.push([attribute, this.attributes[attribute]]);
    }
    return new Element(this.nodeName, null, attributes, CTOR_KEY);
  }

  get childElementCount(): number {
    return this._getChildNodesMutator().elementsView().length;
  }

  get className(): string {
    return this.getAttribute("class") ?? "";
  }

  set className(className: string) {
    this.setAttribute("class", className);
    this.#classList.value = className;
  }

  get classList(): DOMTokenList {
    return this.#classList;
  }

  get outerHTML(): string {
    const tagName = this.tagName.toLowerCase();
    let out = "<" + tagName;

    out += getElementAttributesString(this.attributes);

    // Special handling for void elements
    switch (tagName) {
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "img":
      case "input":
      case "link":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
        out += ">";
        break;

      default:
        out += ">" + this.innerHTML + `</${tagName}>`;
        break;
    }

    return out;
  }

  set outerHTML(html: string) {
    // TODO: Someday...
  }

  get innerHTML(): string {
    return getInnerHtmlFromNodes(this.childNodes, this.tagName);
  }

  set innerHTML(html: string) {
    // Remove all children
    for (const child of this.childNodes) {
      child._setParent(null);
    }

    const mutator = this._getChildNodesMutator();
    mutator.splice(0, this.childNodes.length);

    // Parse HTML into new children
    if (html.length) {
      const parsed = fragmentNodesFromString(html);
      mutator.push(...parsed.childNodes[0].childNodes);

      for (const child of this.childNodes) {
        child._setParent(this);
        child._setOwnerDocument(this.ownerDocument);
      }
    }
  }

  get children(): HTMLCollection {
    return this._getChildNodesMutator().elementsView();
  }

  get id(): string {
    return this.#currentId || "";
  }

  set id(id: string) {
    this.setAttribute("id", this.#currentId = id);
  }

  getAttributeNames(): string[] {
    return Object.getOwnPropertyNames(this.attributes);
  }

  getAttribute(name: string): string | null {
    return this.attributes[name?.toLowerCase()] ?? null;
  }

  setAttribute(rawName: string, value: any) {
    const name = rawName?.toLowerCase();
    const strValue = String(value);
    this.attributes[name] = strValue;

    if (name === "id") {
      this.#currentId = strValue;
    } else if (name === "class") {
      this.#classList.value = strValue;
    }
  }

  removeAttribute(rawName: string) {
    const name = rawName?.toLowerCase();
    delete this.attributes[name];
    if (name === "class") {
      this.#classList.value = "";
    }
  }

  hasAttribute(name: string): boolean {
    return this.attributes.hasOwnProperty(name?.toLowerCase());
  }

  hasAttributeNS(_namespace: string, name: string): boolean {
    // TODO: Use namespace
    return this.attributes.hasOwnProperty(name?.toLowerCase());
  }

  replaceWith(...nodes: (Node | string)[]) {
    this._replaceWith(...nodes);
  }

  replaceChildren(
    ...nodes: Node[]
  ) {
    for (let i = this.childNodes.length - 1; i >= 0; i--) {
      this.removeChild(this.childNodes[i]);
    }
    this.append(...nodes);
  }

  remove() {
    this._remove();
  }

  append(...nodes: (Node | string)[]) {
    const mutator = this._getChildNodesMutator();
    mutator.push(...nodesAndTextNodes(nodes, this));
  }

  prepend(...nodes: (Node | string)[]) {
    const mutator = this._getChildNodesMutator();
    mutator.splice(0, 0, ...nodesAndTextNodes(nodes, this));
  }

  before(...nodes: (Node | string)[]) {
    if (this.parentNode) {
      insertBeforeAfter(this, nodes, 0);
    }
  }

  after(...nodes: (Node | string)[]) {
    if (this.parentNode) {
      insertBeforeAfter(this, nodes, 1);
    }
  }

  get firstElementChild(): Element | null {
    const elements = this._getChildNodesMutator().elementsView();
    return elements[0] ?? null;
  }

  get lastElementChild(): Element | null {
    const elements = this._getChildNodesMutator().elementsView();
    return elements[elements.length - 1] ?? null;
  }

  get nextElementSibling(): Element | null {
    const parent = this.parentNode;

    if (!parent) {
      return null;
    }

    const mutator = parent._getChildNodesMutator();
    const index = mutator.indexOfElementsView(this);
    const elements = mutator.elementsView();
    return elements[index + 1] ?? null;
  }

  get previousElementSibling(): Element | null {
    const parent = this.parentNode;

    if (!parent) {
      return null;
    }

    const mutator = parent._getChildNodesMutator();
    const index = mutator.indexOfElementsView(this);
    const elements = mutator.elementsView();
    return elements[index - 1] ?? null;
  }

  querySelector(selectors: string): Element | null {
    if (!this.ownerDocument) {
      throw new Error("Element must have an owner document");
    }

    return this.ownerDocument!._nwapi.first(selectors, this);
  }

  querySelectorAll(selectors: string): NodeList {
    if (!this.ownerDocument) {
      throw new Error("Element must have an owner document");
    }

    const nodeList = new NodeList();
    const mutator = nodeList[nodeListMutatorSym]();
    mutator.push(...this.ownerDocument!._nwapi.select(selectors, this));

    return nodeList;
  }

  matches(selectorString: string): boolean {
    return this.ownerDocument!._nwapi.match(selectorString, this);
  }

  // TODO: DRY!!!
  getElementById(id: string): Element | null {
    for (const child of this.childNodes) {
      if (child.nodeType === NodeType.ELEMENT_NODE) {
        if ((<Element> child).id === id) {
          return <Element> child;
        }

        const search = (<Element> child).getElementById(id);
        if (search) {
          return search;
        }
      }
    }

    return null;
  }

  getElementsByTagName(tagName: string): Element[] {
    const fixCaseTagName = tagName.toUpperCase();

    if (fixCaseTagName === "*") {
      return <Element[]> this._getElementsByTagNameWildcard([]);
    } else {
      return <Element[]> this._getElementsByTagName(tagName.toUpperCase(), []);
    }
  }

  _getElementsByTagNameWildcard(search: Node[]): Node[] {
    for (const child of this.childNodes) {
      if (child.nodeType === NodeType.ELEMENT_NODE) {
        search.push(child);
        (<Element> child)._getElementsByTagNameWildcard(search);
      }
    }

    return search;
  }

  _getElementsByTagName(tagName: string, search: Node[]): Node[] {
    for (const child of this.childNodes) {
      if (child.nodeType === NodeType.ELEMENT_NODE) {
        if ((<Element> child).tagName === tagName) {
          search.push(child);
        }

        (<Element> child)._getElementsByTagName(tagName, search);
      }
    }

    return search;
  }

  getElementsByClassName(className: string): Element[] {
    return <Element[]> getElementsByClassName(this, className, []);
  }

  getElementsByTagNameNS(_namespace: string, localName: string): Element[] {
    // TODO: Use namespace
    return this.getElementsByTagName(localName);
  }
}

UtilTypes.Element = Element;
