import { Node } from "./node.ts";

export enum NodeFilter {
  FILTER_ACCEPT = 1,
  FILTER_REJECT,
  FILTER_SKIP,

  // staticants for whatToShow
  SHOW_ALL = -1,
  SHOW_ELEMENT = 0x1,
  SHOW_ATTRIBUTE = 0x2,
  SHOW_TEXT = 0x4,
  SHOW_CDATA_SECTION = 0x8,
  SHOW_ENTITY_REFERENCE = 0x10, // legacy
  SHOW_ENTITY = 0x20, // legacy
  SHOW_PROCESSING_INSTRUCTION = 0x40,
  SHOW_COMMENT = 0x80,
  SHOW_DOCUMENT = 0x100,
  SHOW_DOCUMENT_TYPE = 0x200,
  SHOW_DOCUMENT_FRAGMENT = 0x400,
  SHOW_NOTATION = 0x800, // legacy
}

export interface Filter {  
  acceptNode(node: Node): number;
}
