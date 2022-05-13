import { Comment, Node, nodesAndTextNodes, NodeType, Text } from "./node.ts";
import { NodeList } from "./node-list.ts";
import UtilTypes from "./utils-types.ts";
import type { Element } from "./element.ts";
import type { DocumentFragment } from "./document-fragment.ts";

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

/**
 * @param tagName Uppercase tagname like Element.tagName
 */
export function getInnerHtmlFromNodes(
  nodes: NodeList,
  tagName: string,
): string {
  let out = "";

  for (const child of nodes) {
    switch (child.nodeType) {
      case NodeType.ELEMENT_NODE:
        out += (child as Element).outerHTML;
        break;

      case NodeType.COMMENT_NODE:
        out += `<!--${(child as Comment).data}-->`;
        break;

      case NodeType.TEXT_NODE:
        // Special handling for rawtext-like elements.
        switch (tagName) {
          case "STYLE":
          case "SCRIPT":
          case "XMP":
          case "IFRAME":
          case "NOEMBED":
          case "NOFRAMES":
          case "PLAINTEXT":
            out += (child as Text).data;
            break;

          default:
            // escaping: https://html.spec.whatwg.org/multipage/parsing.html#escapingString
            out += (child as Text).data
              .replace(/&/g, "&amp;")
              .replace(/\xA0/g, "&nbsp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            break;
        }

        break;
    }
  }

  return out;
}

// FIXME: This uses the incorrect .attributes implementation, it
// should probably be changed when .attributes is fixed
export function getElementAttributesString(
  attributes: Record<string, string>,
): string {
  let out = "";

  for (const attribute of Object.keys(attributes)) {
    out += ` ${attribute.toLowerCase()}`;

    // escaping: https://html.spec.whatwg.org/multipage/parsing.html#escapingString
    if (attributes[attribute] != null) {
      out += `="${
        attributes[attribute]
          .replace(/&/g, "&amp;")
          .replace(/\xA0/g, "&nbsp;")
          .replace(/"/g, "&quot;")
      }"`;
    }
  }

  return out;
}

export function insertBeforeAfter(
  node: Node,
  nodes: (Node | string)[],
  side: number,
) {
  const parentNode = node.parentNode!;
  const mutator = parentNode._getChildNodesMutator();
  const index = mutator.indexOf(node);
  nodes = nodesAndTextNodes(nodes, parentNode);

  mutator.splice(index + side, 0, ...(<Node[]> nodes));
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

export function kebabToCamel (
  input: string,
) {
  return input.toLowerCase().replace(
    /-([a-z])/g,
    (_, letter) => letter.toUpperCase(),
  );
}

export function camelToKebab (
  input: string,
) {
  return input.replace(
    /(?<!^)([A-Z])/g,
    "-$1",
  ).toLowerCase();
}
