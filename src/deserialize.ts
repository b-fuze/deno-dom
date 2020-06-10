import { parse } from "./parser.ts";
import { setLock } from "./constructor-lock.ts";
import { Node, Text } from "./dom/node.ts";
import { Element } from "./dom/element.ts";

export function nodesFromString(html: string): Node {
  setLock(false);
  const parsed = JSON.parse(parse(html));
  const node = nodeFromArray(parsed, null);
  setLock(true);

  return node;
}

function nodeFromArray(data: any, parentNode: Node | null): Node {
  const elm = new Element(data[0], parentNode, data[1]);
  const childNodes = elm.childNodes;

  for (const child of data.slice(2)) {
    switch (typeof child) {
      case "string":
        childNodes.push(new Text(child));
        break;
      case "object":
        childNodes.push(nodeFromArray(child, elm));
        break;
    }
  }

  return elm;
}

