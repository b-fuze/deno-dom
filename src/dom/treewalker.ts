import { Node } from "./node.ts";
import { NodeFilter, Filter } from "./node-filter.ts";
import { Traverser } from "./traverser.ts";


export class TreeWalker extends Traverser {
    public currentNode: Node;

    constructor(root: Node, whatToShow?: number, filter?: Filter) {
        super(root, whatToShow, filter);
        this.currentNode = root;
    }

    parentNode(): Node | null {
        let node: Node | null = this.currentNode;
        while(node && node != this.root) {
            node = node.parentNode
            if(node && this.accept(node) == NodeFilter.FILTER_ACCEPT) {
                this.currentNode = node;
                return node;
            }
        }

        return null;
    }
  
    firstChild(): Node | null {
        return this.traverseChildren(new Forwards());
    }
  
    lastChild(): Node | null {
        return this.traverseChildren(new Backwards());
    }
  
    previousSibling(): Node | null {
        return this.traverseSiblings(new Backwards());
    }
  
    nextSibling(): Node | null {
        return this.traverseSiblings(new Forwards());
    }
  
    previousNode(): Node | null {
        let node: Node = this.currentNode;
        let tmp: Node | null;
        while(node != this.root) {
            while(tmp = node.previousSibling) {
                node = tmp;
                const result = this.accept(node);
                if(result == NodeFilter.FILTER_REJECT) {
                    continue;
                }
                while(tmp = node.lastChild) {
                    node = tmp;
                    const result = this.accept(node);
                    if(result == NodeFilter.FILTER_REJECT) {
                        break;
                    }
                }
                if(result == NodeFilter.FILTER_ACCEPT) {
                    this.currentNode = node;
                    return node;
                }
            }
            if(node == this.root) {
                return null;
            }
            if(tmp = node.parentNode) {
                node = tmp;
                const result = this.accept(node);
                if(result == NodeFilter.FILTER_ACCEPT) {
                    this.currentNode = node;
                    return node;
                }
            }
        }

        return null;
    }
  
    nextNode(): Node | null {
        let tmp: Node | null;
        let node: Node = this.currentNode;
        loop: while(true) {
            while(tmp = node.firstChild) {
                node = tmp;
                const result = this.accept(node);
                if(result == NodeFilter.FILTER_ACCEPT) {
                    this.currentNode = node;
                    return node;
                }
                if(result == NodeFilter.FILTER_REJECT) {
                    break;
                }
            }
            while(tmp = node.nextSibling) {
                node = tmp;
                const result = this.accept(node);
                if(result == NodeFilter.FILTER_ACCEPT) {
                    this.currentNode = node;
                    return node;
                }
                if(result == NodeFilter.FILTER_SKIP) {
                    continue loop;
                }
            }
            break
        } 

        return null;
    }

    private traverseChildren(strategy: Strategy): Node | null {
        let node: Node;
        let tmp: Node | null = strategy.first(this.currentNode);

        while(tmp) {
            node = tmp;
            const result = this.accept(node);
            if(result == NodeFilter.FILTER_ACCEPT) {
                this.currentNode = node;
                return node;
            }
            if(result == NodeFilter.FILTER_SKIP && (tmp = strategy.first(node))) {
                continue;
            }
            do {
                if(tmp = strategy.next(node)) {
                    break
                }
                tmp = node.parentNode;
                if(!tmp || tmp == this.root || tmp == this.currentNode) {
                    return null;
                }
                node = tmp;
            } while(tmp);
        }

        return null;
    }

    private traverseSiblings(strategy: Strategy): Node | null {
        let node: Node = this.currentNode;

        if(node == this.root) {
            return null;
        }
        
        let tmp: Node | null;
        while(true) {
            while(tmp = strategy.next(node)) {
                node = tmp;
                const result = this.accept(node);
                if(result == NodeFilter.FILTER_ACCEPT) {
                    this.currentNode = node;
                    return node;
                }
                if(!(tmp = strategy.first(tmp)) || (result == NodeFilter.FILTER_REJECT)) {
                    tmp = strategy.next(node);
                }
            }
            if((tmp = node.parentNode) && (tmp != this.root)) {
                node = tmp;
                const result = this.accept(node);
                if(result == NodeFilter.FILTER_ACCEPT) {
                    return null;
                }
            } else {
                return null;
            }
        }
    }
}

interface Strategy {
    next(node: Node): Node | null;
    first(node: Node): Node | null;
}

class Forwards implements Strategy {
    next(node: Node): Node | null {
        return node.nextSibling;
    }
    first(node: Node): Node | null {
        return node.firstChild;
    }
}

class Backwards implements Strategy {
    next(node: Node): Node | null {
        return node.previousSibling;
    }
    first(node: Node): Node | null {
        return node.lastChild;
    }
}