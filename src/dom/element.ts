import { getLock } from "../constructor-lock.ts";
import { Node, NodeType } from "./node.ts";

export class DOMTokenList extends Set<string> {
  contains(token: string): boolean {
    return this.has(token);
  }
}

let attrLock = true;
export class Attr {
  #namedNodeMap: NamedNodeMap | null = null;
  #name: string = "";

  constructor(map: NamedNodeMap, name: string) {
    if (attrLock) {
      throw new TypeError("Illegal constructor");
    }

    this.#name = name;
    this.#namedNodeMap = map;
  }

  get name() {
    return this.#name;
  }

  get value() {
    return (<{[attribute: string]: string}> <unknown> this.#namedNodeMap)[this.#name];
  }
}

export class NamedNodeMap {
  #attrObjCache: {
    [attribute: string]: Attr;
  } = {};

  private newAttr(attribute: string): Attr {
    attrLock = false;
    const attr = new Attr(this, attribute);
    attrLock = true;
    return attr;
  }

  getNamedItem(attribute: string) {
    return this.#attrObjCache[attribute] ?? (this.#attrObjCache[attribute] = this.newAttr(attribute));
  }

  setNamedItem(...args: any) {
    // TODO
  }
}

export class Element extends Node {
  public classList = new DOMTokenList();
  public attributes: NamedNodeMap & {[attribute: string]: string} = <any> new NamedNodeMap();

  constructor(
    public tagName: string,
    parentNode: Node | null,
    attributes: [string, string][],
  ) {
    super(
      tagName,
      NodeType.ELEMENT_NODE,
      parentNode,
    );
    if (getLock()) {
      throw new TypeError("Illegal constructor");
    }

    for (const attr of attributes) {
      this.attributes[attr[0]] = attr[1];
    }
  }

  get className(): string {
    return Array.from(this.classList).join(" ");
  }

  set className(className: string) {
    // TODO
  }

  getAttribute(name: string): string | null {
    return this.attributes[name] ?? null;
  }

  setAttribute(name: string, value: any) {
    this.attributes[name] = "" + value;
  }
}

