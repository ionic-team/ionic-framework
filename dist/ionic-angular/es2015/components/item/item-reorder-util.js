/**
 * @hidden
 * @param {?} element
 * @return {?}
 */
export function indexForItem(element) {
    return element['$ionIndex'];
}
/**
 * @hidden
 * @param {?} element
 * @return {?}
 */
export function reorderListForItem(element) {
    return element['$ionReorderList'];
}
/**
 * @hidden
 * @param {?} node
 * @param {?} listNode
 * @return {?}
 */
export function findReorderItem(node, listNode) {
    let /** @type {?} */ nested = 0;
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
//# sourceMappingURL=item-reorder-util.js.map