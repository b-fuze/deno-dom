import { Node, NodeType } from "./node.ts";
import { Element } from "./element.ts";

export function getElementsByClassName(
  element: any,
  className: string,
  search: Node[],
): Node[] {
  for (const child of element.childNodes) {
    if (child.nodeType === NodeType.ELEMENT_NODE) {
      const classList = className.trim().split(/\s+/);
      let matchesCount = 0;

      for (const singleClassName of classList) {
        if ((<Element> child).classList.contains(singleClassName)) {
          matchesCount++;
        }
      }

      // ensure that all class names are present
      if (matchesCount === classList.length) {
        search.push(child);
      }

      getElementsByClassName(<Element> child, className, search);
    }
  }

  return search;
}
