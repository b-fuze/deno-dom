import { CTOR_KEY } from "../../../constructor-lock.ts";
import { Node } from "../../node.ts";
import { HTMLElement } from "./html-element.ts";
import UtilTypes from "../../utils-types.ts";

export class HTMLBRElement extends HTMLElement {
  constructor(
    parentNode: Node | null,
    attributes: [string, string][],
    key: typeof CTOR_KEY,
  ) {
    super("BR", parentNode, attributes, key);
  }
}

UtilTypes.HTMLBRElement = HTMLBRElement;
