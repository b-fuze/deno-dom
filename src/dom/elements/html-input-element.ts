import type { Node } from "../node.ts";
import type { CTOR_KEY } from "../../constructor-lock.ts";
import { Element } from "../element.ts";

export class HTMLInputElement extends Element {
  constructor(
    parentNode: Node | null,
    attributes: [string, string][],
    key: typeof CTOR_KEY,
  ) {
    super(
      "INPUT",
      parentNode,
      attributes,
      key,
    );
  }

  get value() {
    return this.getAttribute("value") ?? "";
  }
  set value(value: any) {
    this.setAttribute("value", value);
    this.dispatchEvent(new Event("input"));
  }

  get checked() {
    return this.hasAttribute("checked");
  }
  set checked(value: boolean) {
    this.toggleAttribute("checked", value);
    this.dispatchEvent(new Event("input"));
  }
}
