import { camelToKebab } from "../utils.ts";

export class CSSStyleDeclaration {
  [property: string]: unknown

  #map = new Map<string, { value: string; important: boolean }>();

  constructor() {
    return new Proxy(this, {
      get(
        target: CSSStyleDeclaration,
        property: string,
      ) {
        return target[property] ??
          target.#map.get(camelToKebab(property))?.value;
      },

      set(
        target: CSSStyleDeclaration,
        property: string,
        value: string,
      ) {
        if (property in CSSStyleDeclaration.prototype) return false;

        target.#map.set(
          camelToKebab(property),
          CSSStyleDeclaration.#parsePriority(value),
        );
        return true;
      },
    });
  }

  static #parsePriority(
    input: string,
  ) {
    const { value, priority } =
      input.match(/(?<value>^.+)(?<priority>\s+!important$)/u)?.groups ?? {};
    if (value && priority) {
      return {
        important: true,
        value: value,
      };
    } else {
      return {
        important: false,
        value: input,
      };
    }
  }

  get cssText() {
    let result = "";
    for (const [key, { value, important }] of this.#map) {
      result += `${key}: ${value}${important ? " !important" : ""}; `;
    }
    return result;
  }

  set cssText(
    text: string,
  ) {
    this.#map.clear();
    const entries = (
      text
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) =>
          s
            .split(":")
            .map((s) => s.trim())
        )
    );
    for (const [key, value] of entries) {
      this.#map.set(key, CSSStyleDeclaration.#parsePriority(value));
    }
  }

  get length() {
    return this.#map.size;
  }

  get parentRule() {
    return null;
  }

  get cssFloat() {
    return this.#map.get("float")?.value ?? "";
  }

  set cssFloat(
    value: string,
  ) {
    this.#map.set("float", CSSStyleDeclaration.#parsePriority(value));
  }

  getPropertyPriority(
    propertyName: string,
  ) {
    return this.#map.get(propertyName)?.important ? "important" : "";
  }

  getPropertyValue(
    propertyName: string,
  ) {
    return this.#map.get(propertyName)?.value ?? "";
  }

  item(
    index: number,
  ) {
    return Array.from(this.#map.values())[index] ?? "";
  }

  removeProperty(
    propertyName: string,
  ) {
    this.#map.delete(propertyName);
  }

  setProperty(
    propertyName: string,
    value: string,
    priority?: string,
  ) {
    this.#map.set(
      propertyName,
      {
        value,
        important: priority === "important",
      },
    );
  }
}
