// TODO: Heavily WIP
export class CSSStyleValue {
  #property: string;
  #value: string;

  constructor(
    poperty: string,
    value: string,
  ) {
    this.#property = poperty;
    this.#value = value;
  }

  static parse(
    property: string,
    value: string,
  ): CSSStyleValue {
    return new CSSStyleValue(property, value);
  }

  static parseAll(
    property: string,
    value: string,
  ) {
    throw new Error("Method not implemented.");
  }
}
