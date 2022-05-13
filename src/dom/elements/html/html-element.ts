import { CTOR_KEY } from "../../../constructor-lock.ts";
import { StylePropertyMap } from "../../css/StylePropertyMap.ts";
import { Element } from "../../element.ts";
import { Text } from "../../node.ts";
import { CSSStyleDeclaration } from "../../css/CSSStyleDeclaration.ts";
import { HTMLBRElement } from "./html-br-element.ts";
import { DOMStringMap } from "../../DOMStringMap.ts";

export class HTMLElement extends Element {
  static #convertLineBreaksToBRs(
    text: string,
  ) {
    return (
      text
        .split("\n")
        .flatMap((s) => [
          new Text(s),
          new HTMLBRElement(null, [], CTOR_KEY),
        ])
        .slice(0, -1)
    );
  }

  accessKey: string = "";

  get accessKeyLabel() {
    return "";
  }

  #stylePropertyMap = new StylePropertyMap();
  get attributeStyleMap(): StylePropertyMap {
    return this.#stylePropertyMap;
  }

  contentEditable = false;

  get isContentEditable() {
    return this.contentEditable;
  }

  dataset: DOMStringMap = new DOMStringMap(CTOR_KEY);

  dir = "auto";

  draggable = false;

  enterkeyhint = "";

  hidden = false;

  inert = false;

  get innerText(): string {
    return this.textContent;
  }

  set innerText(
    text: string,
  ) {
    this.replaceChildren(
      ...HTMLElement.#convertLineBreaksToBRs(text),
    );
  }

  lang = "";

  noModule = false;

  nonce = 0;

  get offsetHeight() {
    return 0;
  }

  get offsetLeft() {
    return 0;
  }

  get offsetParent() {
    return null;
  }

  get offsetTop() {
    return 0;
  }

  get offsetWidth() {
    return 0;
  }

  get outerText() {
    return this.textContent;
  }

  set outerText(text: string) {
    this.replaceWith(
      ...HTMLElement.#convertLineBreaksToBRs(text),
    );
  }

  // TODO: should return HTMLPropertiesCollection
  get properties() {
    throw new Error("Method not implemented.");
  }

  spellcheck = true;

  #cssStyleDeclaration = new CSSStyleDeclaration();
  get style(): CSSStyleDeclaration {
    return this.#cssStyleDeclaration;
  }

  set style(
    text: string | CSSStyleDeclaration,
  ) {
    if (typeof text === "string") {
      this.#cssStyleDeclaration.cssText = text;
    } else {
      // TS enforces setters to accept the type getters return, but this isn't constructrable anyway
      throw new TypeError("Illegal argument: CSSStyleDeclaration");
    }
  }

  tabIndex = -1;

  title = "";

  translate = false;

  attachInternals() {
    throw new Error("Method not implemented.");
  }
}
