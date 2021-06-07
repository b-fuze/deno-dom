import { NodeFilter, Filter } from "./node-filter.ts";
import { Node } from "./node.ts";

export abstract class Traverser {
  public readonly root: Node;
  public readonly whatToShow: number;
  public readonly filter: Filter | undefined;
  private activeFlag = false;
  
  protected constructor(root: Node, whatToShow?: number, filter?: Filter) {
    this.root = root;
    this.whatToShow = whatToShow || -1;
    this.filter = filter;
  }

  protected accept(node: Node): number {
    if (this.activeFlag) {
      throw new Error("DOMException: InvalidStateError");
    }

    if (!((1 << (node.nodeType-1)) & this.whatToShow)) {
      return NodeFilter.FILTER_SKIP;
    }
    
    if (!this.filter) {
      return NodeFilter.FILTER_ACCEPT;
    }

    this.activeFlag = true;
    let result: number;
    try {
      result = this.filter.acceptNode(node);
    } catch (error) {
      this.activeFlag = false;
      throw error;
    }

    this.activeFlag = false;
    return result;
  }
}