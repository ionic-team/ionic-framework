var /** @type {?} */ PREVIOUS_CELL = {
    row: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    tmpl: -1
};
/**
 * NO DOM
 * @param {?} stopAtHeight
 * @param {?} records
 * @param {?} cells
 * @param {?} headerFn
 * @param {?} footerFn
 * @param {?} data
 * @return {?}
 */
export function processRecords(stopAtHeight, records, cells, headerFn, footerFn, data) {
    var /** @type {?} */ record;
    var /** @type {?} */ startRecordIndex;
    var /** @type {?} */ previousCell;
    var /** @type {?} */ tmpData;
    var /** @type {?} */ lastRecordIndex = records ? (records.length - 1) : -1;
    if (cells.length) {
        // we already have cells
        previousCell = cells[cells.length - 1];
        if (previousCell.top + previousCell.height > stopAtHeight) {
            return;
        }
        startRecordIndex = (previousCell.record + 1);
    }
    else {
        // no cells have been created yet
        previousCell = PREVIOUS_CELL;
        startRecordIndex = 0;
    }
    var /** @type {?} */ processedTotal = 0;
    for (var /** @type {?} */ recordIndex = startRecordIndex; recordIndex <= lastRecordIndex; recordIndex++) {
        record = records[recordIndex];
        if (headerFn) {
            tmpData = headerFn(record, recordIndex, records);
            if (tmpData !== null) {
                // add header data
                previousCell = addCell(previousCell, recordIndex, TEMPLATE_HEADER, tmpData, data.hdrWidth, data.hdrHeight, data.viewWidth);
                cells.push(previousCell);
            }
        }
        // add item data
        previousCell = addCell(previousCell, recordIndex, TEMPLATE_ITEM, null, data.itmWidth, data.itmHeight, data.viewWidth);
        cells.push(previousCell);
        if (footerFn) {
            tmpData = footerFn(record, recordIndex, records);
            if (tmpData !== null) {
                // add footer data
                previousCell = addCell(previousCell, recordIndex, TEMPLATE_FOOTER, tmpData, data.ftrWidth, data.ftrHeight, data.viewWidth);
                cells.push(previousCell);
            }
        }
        if (previousCell.record === lastRecordIndex) {
            previousCell.isLast = true;
        }
        // should always process at least 3 records
        processedTotal++;
        if (previousCell.top + previousCell.height + data.itmHeight > stopAtHeight && processedTotal > 3) {
            return;
        }
    }
}
/**
 * @param {?} previousCell
 * @param {?} recordIndex
 * @param {?} tmpl
 * @param {?} tmplData
 * @param {?} cellWidth
 * @param {?} cellHeight
 * @param {?} viewportWidth
 * @return {?}
 */
function addCell(previousCell, recordIndex, tmpl, tmplData, cellWidth, cellHeight, viewportWidth) {
    var /** @type {?} */ newCell;
    if (previousCell.left + previousCell.width + cellWidth > viewportWidth) {
        // add a new cell in a new row
        newCell = {
            record: recordIndex,
            tmpl: tmpl,
            row: (previousCell.row + 1),
            width: cellWidth,
            height: cellHeight,
            top: (previousCell.top + previousCell.height),
            left: 0,
            reads: 0,
        };
    }
    else {
        // add a new cell in the same row
        newCell = {
            record: recordIndex,
            tmpl: tmpl,
            row: previousCell.row,
            width: cellWidth,
            height: cellHeight,
            top: previousCell.top,
            left: (previousCell.left + previousCell.width),
            reads: 0,
        };
    }
    if (tmplData) {
        newCell.data = tmplData;
    }
    return newCell;
}
/**
 * NO DOM
 * @param {?} startCellIndex
 * @param {?} endCellIndex
 * @param {?} scrollingDown
 * @param {?} cells
 * @param {?} records
 * @param {?} nodes
 * @param {?} viewContainer
 * @param {?} itmTmp
 * @param {?} hdrTmp
 * @param {?} ftrTmp
 * @param {?} initialLoad
 * @return {?}
 */
export function populateNodeData(startCellIndex, endCellIndex, scrollingDown, cells, records, nodes, viewContainer, itmTmp, hdrTmp, ftrTmp, initialLoad) {
    if (!records || records.length === 0) {
        nodes.length = 0;
        return true;
    }
    var /** @type {?} */ recordsLength = records.length;
    var /** @type {?} */ hasChanges = false;
    var /** @type {?} */ node;
    var /** @type {?} */ availableNode;
    var /** @type {?} */ cell;
    var /** @type {?} */ isAlreadyRendered;
    var /** @type {?} */ viewInsertIndex = null;
    var /** @type {?} */ totalNodes = nodes.length;
    var /** @type {?} */ templateRef;
    startCellIndex = Math.max(startCellIndex, 0);
    endCellIndex = Math.min(endCellIndex, cells.length - 1);
    for (var /** @type {?} */ cellIndex = startCellIndex; cellIndex <= endCellIndex; cellIndex++) {
        cell = cells[cellIndex];
        availableNode = null;
        isAlreadyRendered = false;
        // find the first one that's available
        if (!initialLoad) {
            for (var /** @type {?} */ i = 0; i < totalNodes; i++) {
                node = nodes[i];
                if (cell.tmpl !== node.tmpl || i === 0 && cellIndex !== 0) {
                    // the cell must use the correct template
                    // first node can only be used by the first cell (css :first-child reasons)
                    // this node is never available to be reused
                    continue;
                }
                if (node.cell === cellIndex) {
                    isAlreadyRendered = true;
                    break;
                }
                if (node.cell < startCellIndex || node.cell > endCellIndex) {
                    if (!availableNode) {
                        // havent gotten an available node yet
                        availableNode = nodes[i];
                    }
                    else if (scrollingDown) {
                        // scrolling down
                        if (node.cell < availableNode.cell) {
                            availableNode = nodes[i];
                        }
                    }
                    else {
                        // scrolling up
                        if (node.cell > availableNode.cell) {
                            availableNode = nodes[i];
                        }
                    }
                }
            }
            if (isAlreadyRendered) {
                continue;
            }
        }
        if (!availableNode) {
            // did not find an available node to put the cell data into
            // insert a new node before the last record nodes
            if (viewInsertIndex === null) {
                viewInsertIndex = -1;
                for (var /** @type {?} */ j = totalNodes - 1; j >= 0; j--) {
                    node = nodes[j];
                    if (node) {
                        viewInsertIndex = viewContainer.indexOf(node.view);
                        break;
                    }
                }
            }
            // select which templateRef should be used for this cell
            templateRef = cell.tmpl === TEMPLATE_HEADER ? hdrTmp : cell.tmpl === TEMPLATE_FOOTER ? ftrTmp : itmTmp;
            if (!templateRef) {
                console.error("virtual" + (cell.tmpl === TEMPLATE_HEADER ? 'Header' : cell.tmpl === TEMPLATE_FOOTER ? 'Footer' : 'Item') + " template required");
                continue;
            }
            availableNode = {
                tmpl: cell.tmpl,
                view: viewContainer.createEmbeddedView(templateRef, new VirtualContext(null, null, null), viewInsertIndex)
            };
            totalNodes = nodes.push(availableNode);
        }
        // assign who's the new cell index for this node
        availableNode.cell = cellIndex;
        // apply the cell's data to this node
        var /** @type {?} */ context = availableNode.view.context;
        context.$implicit = cell.data || records[cell.record];
        context.index = cellIndex;
        context.count = recordsLength;
        availableNode.hasChanges = true;
        availableNode.lastTransform = null;
        hasChanges = true;
    }
    return hasChanges;
}
/**
 * DOM READ
 * @param {?} plt
 * @param {?} nodes
 * @param {?} cells
 * @param {?} data
 * @return {?}
 */
export function initReadNodes(plt, nodes, cells, data) {
    if (nodes.length && cells.length) {
        // first node
        // ******** DOM READ ****************
        var /** @type {?} */ ele = getElement(nodes[0]);
        var /** @type {?} */ firstCell = cells[0];
        firstCell.top = ele.clientTop;
        firstCell.left = ele.clientLeft;
        firstCell.row = 0;
        // ******** DOM READ ****************
        updateDimensions(plt, nodes, cells, data, true);
    }
}
/**
 * DOM READ
 * @param {?} plt
 * @param {?} nodes
 * @param {?} cells
 * @param {?} data
 * @param {?} initialUpdate
 * @return {?}
 */
export function updateDimensions(plt, nodes, cells, data, initialUpdate) {
    var /** @type {?} */ node;
    var /** @type {?} */ element;
    var /** @type {?} */ cell;
    var /** @type {?} */ previousCell;
    var /** @type {?} */ totalCells = cells.length;
    for (var /** @type {?} */ i = 0; i < nodes.length; i++) {
        node = nodes[i];
        cell = cells[node.cell];
        // read element dimensions if they haven't been checked enough times
        if (cell && cell.reads < REQUIRED_DOM_READS) {
            element = getElement(node);
            // ******** DOM READ ****************
            readElements(plt, cell, element);
            if (initialUpdate) {
                // update estimated dimensions with more accurate dimensions
                if (cell.tmpl === TEMPLATE_HEADER) {
                    data.hdrHeight = cell.height;
                    if (cell.left === 0) {
                        data.hdrWidth = cell.width;
                    }
                }
                else if (cell.tmpl === TEMPLATE_FOOTER) {
                    data.ftrHeight = cell.height;
                    if (cell.left === 0) {
                        data.ftrWidth = cell.width;
                    }
                }
                else {
                    data.itmHeight = cell.height;
                    if (cell.left === 0) {
                        data.itmWidth = cell.width;
                    }
                }
            }
            cell.reads++;
        }
    }
    // figure out which cells are currently viewable within the viewport
    var /** @type {?} */ viewableBottom = (data.scrollTop + data.viewHeight);
    data.topViewCell = totalCells;
    data.bottomViewCell = 0;
    if (totalCells > 0) {
        // completely realign position to ensure they're all accurately placed
        cell = cells[0];
        previousCell = {
            row: 0,
            width: 0,
            height: 0,
            top: cell.top,
            left: 0,
            tmpl: -1
        };
        for (var /** @type {?} */ i_1 = 0; i_1 < totalCells; i_1++) {
            cell = cells[i_1];
            if (previousCell.left + previousCell.width + cell.width > data.viewWidth) {
                // new row
                cell.row++;
                cell.top = (previousCell.top + previousCell.height);
                cell.left = 0;
            }
            else {
                // same row
                cell.row = previousCell.row;
                cell.top = previousCell.top;
                cell.left = (previousCell.left + previousCell.width);
            }
            // figure out which cells are viewable within the viewport
            if (cell.top + cell.height > data.scrollTop && i_1 < data.topViewCell) {
                data.topViewCell = i_1;
            }
            else if (cell.top < viewableBottom && i_1 > data.bottomViewCell) {
                data.bottomViewCell = i_1;
            }
            previousCell = cell;
        }
    }
}
/**
 * @param {?} nodes
 * @param {?} cells
 * @param {?} data
 * @return {?}
 */
export function updateNodeContext(nodes, cells, data) {
    // ensure each node has the correct bounds in its context
    var /** @type {?} */ node;
    var /** @type {?} */ cell;
    var /** @type {?} */ bounds;
    for (var /** @type {?} */ i = 0, /** @type {?} */ ilen = nodes.length; i < ilen; i++) {
        node = nodes[i];
        cell = cells[node.cell];
        if (node && cell) {
            bounds = node.view.context.bounds;
            bounds.top = cell.top + data.viewTop;
            bounds.bottom = bounds.top + cell.height;
            bounds.left = cell.left + data.viewLeft;
            bounds.right = bounds.left + cell.width;
            bounds.width = cell.width;
            bounds.height = cell.height;
        }
    }
}
/**
 * DOM READ
 * @param {?} plt
 * @param {?} cell
 * @param {?} element
 * @return {?}
 */
function readElements(plt, cell, element) {
    // ******** DOM READ ****************
    var /** @type {?} */ styles = plt.getElementComputedStyle(/** @type {?} */ (element));
    // ******** DOM READ ****************
    cell.left = (element.clientLeft - parseFloat(styles.marginLeft));
    // ******** DOM READ ****************
    cell.width = (element.offsetWidth + parseFloat(styles.marginLeft) + parseFloat(styles.marginRight));
    // ******** DOM READ ****************
    cell.height = (element.offsetHeight + parseFloat(styles.marginTop) + parseFloat(styles.marginBottom));
}
/**
 * DOM WRITE
 * @param {?} plt
 * @param {?} nodes
 * @param {?} cells
 * @param {?} totalRecords
 * @return {?}
 */
export function writeToNodes(plt, nodes, cells, totalRecords) {
    var /** @type {?} */ node;
    var /** @type {?} */ element;
    var /** @type {?} */ cell;
    var /** @type {?} */ transform;
    var /** @type {?} */ totalCells = Math.max(totalRecords, cells.length);
    for (var /** @type {?} */ i = 0, /** @type {?} */ ilen = nodes.length; i < ilen; i++) {
        node = nodes[i];
        cell = cells[node.cell];
        transform = "translate3d(" + cell.left + "px," + cell.top + "px,0px)";
        if (node.lastTransform !== transform) {
            element = getElement(node);
            if (element) {
                // ******** DOM WRITE ****************
                element.style[plt.Css.transform] = node.lastTransform = transform;
                // ******** DOM WRITE ****************
                element.classList.add('virtual-position');
                // https://www.w3.org/TR/wai-aria/states_and_properties#aria-posinset
                // ******** DOM WRITE ****************
                element.setAttribute('aria-posinset', node.cell + 1);
                // https://www.w3.org/TR/wai-aria/states_and_properties#aria-setsize
                // ******** DOM WRITE ****************
                element.setAttribute('aria-setsize', totalCells);
            }
        }
    }
}
/**
 * NO DOM
 * @param {?} cells
 * @param {?} data
 * @return {?}
 */
export function adjustRendered(cells, data) {
    // figure out which cells should be rendered
    var /** @type {?} */ cell;
    var /** @type {?} */ lastRow = -1;
    var /** @type {?} */ cellsRenderHeight = 0;
    var /** @type {?} */ maxRenderHeight = (data.renderHeight - data.itmHeight);
    var /** @type {?} */ totalCells = cells.length;
    var /** @type {?} */ viewableRenderedPadding = (data.itmHeight < 90 ? VIEWABLE_RENDERED_PADDING : 0);
    if (data.scrollDiff > 0) {
        // scrolling down
        data.topCell = Math.max(data.topViewCell - viewableRenderedPadding, 0);
        data.bottomCell = Math.min(data.topCell + 2, totalCells - 1);
        for (var /** @type {?} */ i = data.topCell; i < totalCells; i++) {
            cell = cells[i];
            if (cell.row !== lastRow) {
                cellsRenderHeight += cell.height;
                lastRow = cell.row;
            }
            if (i > data.bottomCell) {
                data.bottomCell = i;
            }
            if (cellsRenderHeight >= maxRenderHeight) {
                break;
            }
        }
    }
    else {
        // scroll up
        data.bottomCell = Math.min(data.bottomViewCell + viewableRenderedPadding, totalCells - 1);
        data.topCell = Math.max(data.bottomCell - 2, 0);
        for (var /** @type {?} */ i_2 = data.bottomCell; i_2 >= 0; i_2--) {
            cell = cells[i_2];
            if (cell.row !== lastRow) {
                cellsRenderHeight += cell.height;
                lastRow = cell.row;
            }
            if (i_2 < data.topCell) {
                data.topCell = i_2;
            }
            if (cellsRenderHeight >= maxRenderHeight) {
                break;
            }
        }
    }
}
/**
 * NO DOM
 * @param {?} totalRecords
 * @param {?} lastCell
 * @return {?}
 */
export function getVirtualHeight(totalRecords, lastCell) {
    if (lastCell.record >= totalRecords - 1) {
        return (lastCell.top + lastCell.height);
    }
    var /** @type {?} */ unknownRecords = (totalRecords - lastCell.record - 1);
    var /** @type {?} */ knownHeight = (lastCell.top + lastCell.height);
    return Math.ceil(knownHeight + ((knownHeight / (totalRecords - unknownRecords)) * unknownRecords));
}
/**
 * NO DOM
 * @param {?} totalRecords
 * @param {?} lastCell
 * @param {?} existingHeight
 * @param {?} difference
 * @return {?}
 */
export function estimateHeight(totalRecords, lastCell, existingHeight, difference) {
    if (!totalRecords || !lastCell) {
        return 0;
    }
    var /** @type {?} */ newHeight = getVirtualHeight(totalRecords, lastCell);
    var /** @type {?} */ percentToBottom = (lastCell.record / (totalRecords - 1));
    var /** @type {?} */ diff = Math.abs(existingHeight - newHeight);
    if ((diff > (newHeight * difference)) ||
        (percentToBottom > .995)) {
        return newHeight;
    }
    return existingHeight;
}
/**
 * DOM READ
 * @param {?} data
 * @param {?} virtualScrollElement
 * @param {?} approxItemWidth
 * @param {?} approxItemHeight
 * @param {?} appoxHeaderWidth
 * @param {?} approxHeaderHeight
 * @param {?} approxFooterWidth
 * @param {?} approxFooterHeight
 * @param {?} bufferRatio
 * @return {?}
 */
export function calcDimensions(data, virtualScrollElement, approxItemWidth, approxItemHeight, appoxHeaderWidth, approxHeaderHeight, approxFooterWidth, approxFooterHeight, bufferRatio) {
    // get the parent container's viewport bounds
    var /** @type {?} */ viewportElement = virtualScrollElement.parentElement;
    // ******** DOM READ ****************
    data.viewWidth = viewportElement.offsetWidth;
    // ******** DOM READ ****************
    data.viewHeight = viewportElement.offsetHeight;
    // get the virtual scroll element's offset data
    // ******** DOM READ ****************
    data.viewTop = virtualScrollElement.offsetTop;
    // ******** DOM READ ****************
    data.viewLeft = virtualScrollElement.offsetLeft;
    // the height we'd like to render, which is larger than viewable
    data.renderHeight = (data.viewHeight * bufferRatio);
    if (data.viewWidth > 0 && data.viewHeight > 0) {
        data.itmWidth = calcWidth(data.viewWidth, approxItemWidth);
        data.itmHeight = calcHeight(data.viewHeight, approxItemHeight);
        data.hdrWidth = calcWidth(data.viewWidth, appoxHeaderWidth);
        data.hdrHeight = calcHeight(data.viewHeight, approxHeaderHeight);
        data.ftrWidth = calcWidth(data.viewWidth, approxFooterWidth);
        data.ftrHeight = calcHeight(data.viewHeight, approxFooterHeight);
        data.valid = true;
    }
}
/**
 * NO DOM
 * @param {?} viewportWidth
 * @param {?} approxWidth
 * @return {?}
 */
function calcWidth(viewportWidth, approxWidth) {
    if (approxWidth.indexOf('%') > 0) {
        return (viewportWidth * (parseFloat(approxWidth) / 100));
    }
    else if (approxWidth.indexOf('px') > 0) {
        return parseFloat(approxWidth);
    }
    throw 'virtual scroll width can only use "%" or "px" units';
}
/**
 * NO DOM
 * @param {?} _viewportHeight
 * @param {?} approxHeight
 * @return {?}
 */
function calcHeight(_viewportHeight, approxHeight) {
    if (approxHeight.indexOf('px') > 0) {
        return parseFloat(approxHeight);
    }
    throw 'virtual scroll height must use "px" units';
}
/**
 * NO DOM
 * @param {?} node
 * @return {?}
 */
function getElement(node) {
    var /** @type {?} */ rootNodes = node.view.rootNodes;
    for (var /** @type {?} */ i = 0; i < rootNodes.length; i++) {
        if (rootNodes[i].nodeType === 1) {
            return rootNodes[i];
        }
    }
    return null;
}
var VirtualContext = (function () {
    /**
     * @param {?} $implicit
     * @param {?} index
     * @param {?} count
     */
    function VirtualContext($implicit, index, count) {
        this.$implicit = $implicit;
        this.index = index;
        this.count = count;
        this.bounds = {};
    }
    Object.defineProperty(VirtualContext.prototype, "first", {
        /**
         * @return {?}
         */
        get: function () { return this.index === 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualContext.prototype, "last", {
        /**
         * @return {?}
         */
        get: function () { return this.index === this.count - 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualContext.prototype, "even", {
        /**
         * @return {?}
         */
        get: function () { return this.index % 2 === 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualContext.prototype, "odd", {
        /**
         * @return {?}
         */
        get: function () { return !this.even; },
        enumerable: true,
        configurable: true
    });
    return VirtualContext;
}());
export { VirtualContext };
function VirtualContext_tsickle_Closure_declarations() {
    /** @type {?} */
    VirtualContext.prototype.bounds;
    /** @type {?} */
    VirtualContext.prototype.$implicit;
    /** @type {?} */
    VirtualContext.prototype.index;
    /** @type {?} */
    VirtualContext.prototype.count;
}
var /** @type {?} */ TEMPLATE_ITEM = 0;
var /** @type {?} */ TEMPLATE_HEADER = 1;
var /** @type {?} */ TEMPLATE_FOOTER = 2;
var /** @type {?} */ VIEWABLE_RENDERED_PADDING = 3;
var /** @type {?} */ REQUIRED_DOM_READS = 2;
//# sourceMappingURL=virtual-util.js.map