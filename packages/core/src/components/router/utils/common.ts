import { NavOutletElement } from './interfaces';

export class RouterSegments {
  private path: string[];
  constructor(path: string[]) {
    this.path = path.slice();
  }

  isDefault(): boolean {
    if (this.path.length > 0) {
      return this.path[0] === '';
    }
    return true;
  }

  next(): string {
    if (this.path.length > 0) {
      return this.path.shift() as string;
    }
    return '';
  }
}

const navs = ['ION-NAV', 'ION-TABS'];
export function breadthFirstSearch(root: HTMLElement): NavOutletElement | null {
  if (!root) {
    console.error('search root is null');
    return null;
  }
  // we do a Breadth-first search
  // Breadth-first search (BFS) is an algorithm for traversing or searching tree
  // or graph data structures.It starts at the tree root(or some arbitrary node of a graph,
  // sometimes referred to as a 'search key'[1]) and explores the neighbor nodes
  // first, before moving to the next level neighbours.

  const queue = [root];
  let node: HTMLElement | undefined;
  while (node = queue.shift()) {
    // visit node
    if (navs.indexOf(node.tagName) >= 0) {
      return node as NavOutletElement;
    }

    // queue children
    const children = node.children;
    for (let i = 0; i < children.length; i++) {
      queue.push(children[i] as NavOutletElement);
    }
  }
  return null;
}
