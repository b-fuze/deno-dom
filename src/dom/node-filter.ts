import { Node } from "./node.ts";

export abstract class NodeFilter {
    static FILTER_ACCEPT = 1;
    static FILTER_REJECT = 2;
    static FILTER_SKIP = 3;

    // staticants for whatToShow
    static SHOW_ALL = 0xFFFFFFFF;
    static SHOW_ELEMENT = 0x1;
    static SHOW_ATTRIBUTE = 0x2;
    static SHOW_TEXT = 0x4;
    static SHOW_CDATA_SECTION = 0x8;
    static SHOW_ENTITY_REFERENCE = 0x10; // legacy
    static SHOW_ENTITY = 0x20; // legacy
    static SHOW_PROCESSING_INSTRUCTION = 0x40;
    static SHOW_COMMENT = 0x80;
    static SHOW_DOCUMENT = 0x100;
    static SHOW_DOCUMENT_TYPE = 0x200;
    static SHOW_DOCUMENT_FRAGMENT = 0x400;
    static SHOW_NOTATION = 0x800; // legacy
}

export interface Filter {  
    acceptNode(node: Node): number;
}
