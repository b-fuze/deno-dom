import { CTOR_KEY } from "../constructor-lock.ts";

export class DOMStringMap {
  [key: string]: string

  constructor(
    key: typeof CTOR_KEY,
  ) {
    if (key !== CTOR_KEY) {
      throw new TypeError("Illegal constructor");
    }
  }

  [Symbol.toStringTag]: "DOMStringMap";
}
