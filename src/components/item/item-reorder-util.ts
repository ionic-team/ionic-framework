/**
 * @private
 */
export function indexForItem(element: any): number {
  return element['$ionIndex'];
}

/**
 * @private
 */
export function reorderListForItem(element: any): any {
  return element['$ionReorderList'];
}

/**
 * @private
 */
export function findReorderItem(node: any, listNode: any): HTMLElement {
  let nested = 0;
  while (node && nested < 4) {
    if (indexForItem(node) !== undefined) {
      if (listNode && node.parentNode !== listNode) {
        return null;
      }
      return node;
    }
    node = node.parentNode;
    nested++;
  }
  return null;
}
