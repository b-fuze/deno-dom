import { CSSStyleValue } from "./CSSStyleValue.ts";

let getMap: (instance: StylePropertyMapReadOnly) => Map<string, CSSStyleValue>;
export class StylePropertyMapReadOnly {
  #map = new Map<string, CSSStyleValue>();

  static {
    getMap = (instance: StylePropertyMapReadOnly) => instance.#map;
  }

  get size() {
    return this.#map.size;
  }

  *entires() {
    yield* this.#map.entries();
  }

  forEach(
    callbackfn: (
      value: CSSStyleValue,
      key: string,
      map: this,
    ) => void,
  ) {
    this.#map.forEach((value, key) => callbackfn(value, key, this));
  }

  get(key: string) {
    return this.#map.get(key);
  }

  getAll() {
    return Array.from(this.#map.values());
  }

  has(key: string) {
    return this.#map.has(key);
  }

  *keys() {
    yield* this.#map.keys();
  }

  *values() {
    yield* this.#map.values();
  }
}

export class StylePropertyMap extends StylePropertyMapReadOnly {
  append(
    key: string,
    value: string,
  ) {
    getMap(this).set(
      key,
      new CSSStyleValue(key, value),
    );
  }

  clear() {
    getMap(this).clear();
  }

  delete(key: string) {
    return getMap(this).delete(key);
  }

  set(
    key: string,
    value: string,
  ) {
    getMap(this).set(
      key,
      new CSSStyleValue(key, value),
    );
  }
}
