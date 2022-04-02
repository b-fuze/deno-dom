import { Node, NodeType } from "./node.ts";
import UtilTypes from "./utils-types.ts";
import type { Element } from "./element.ts";
import type { DocumentFragment } from "./document-fragment.ts";

/**
 * Due to circular imports
 */
export let DocumentFragmentDeferred: typeof DocumentFragment;
export let ElementDeferred: typeof Element;

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

export function isDocumentFragment(node: Node): node is DocumentFragment {
  let obj: any = node;

  if (!(obj && typeof obj === "object")) {
    return false;
  }

  while (true) {
    switch (obj.constructor) {
      case UtilTypes.DocumentFragment:
        return true;

      case Node:
      case UtilTypes.Element:
        return false;

      // FIXME: We should probably throw here?

      case Object:
      case null:
      case undefined:
        return false;

      default:
        obj = Reflect.getPrototypeOf(obj);
    }
  }
}

/**
 * Sets the new parent for the children via _setParent() on all
 * the child nodes and removes them from the DocumentFragment's
 * childNode list.
 *
 * A helper function for appendChild, etc. It should be called
 * _after_ the children are already pushed onto the new parent's
 * childNodes.
 */
export function moveDocumentFragmentChildren(
  fragment: DocumentFragment,
  newParent: Node,
) {
  const childCount = fragment.childNodes.length;

  for (const child of fragment.childNodes) {
    child._setParent(newParent);
  }

  const mutator = fragment._getChildNodesMutator();
  mutator.splice(0, childCount);
}
