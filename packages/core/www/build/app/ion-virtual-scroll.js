/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

const MIN_READS = 2;
function updateVDom(dom, heightIndex, cells, range) {
    // reset dom
    for (const node of dom) {
        // node.top = -9999;
        node.change = 0 /* NoChange */;
        node.d = true;
    }
    // try to match into exisiting dom
    const toMutate = [];
    const end = range.offset + range.length;
    for (let i = range.offset; i < end; i++) {
        const cell = cells[i];
        const node = dom.find((n) => n.d && n.cell === cell);
        if (node) {
            const top = heightIndex[i];
            if (top !== node.top) {
                node.top = top;
                node.change = 1 /* Position */;
            }
            node.d = false;
        }
        else {
            toMutate.push(cell);
        }
    }
    // needs to append
    const pool = dom.filter((n) => n.d);
    // console.log('toMutate', toMutate.length);
    for (const cell of toMutate) {
        const node = pool.find(n => n.d && n.cell.type === cell.type);
        const index = cell.index;
        if (node) {
            node.d = false;
            node.change = 2 /* Cell */;
            node.cell = cell;
            node.top = heightIndex[index];
        }
        else {
            dom.push({
                d: false,
                cell: cell,
                visible: true,
                change: 2 /* Cell */,
                top: heightIndex[index],
            });
        }
    }
    dom
        .filter((n) => n.d && n.top !== -9999)
        .forEach((n) => {
        n.change = 1 /* Position */;
        n.top = -9999;
    });
}
function doRender(el, itemRender, dom, updateCellHeight) {
    const children = el.children;
    const childrenNu = children.length;
    let child;
    for (let i = 0; i < dom.length; i++) {
        const node = dom[i];
        const cell = node.cell;
        // the cell change, the content must be updated
        if (node.change === 2 /* Cell */) {
            if (i < childrenNu) {
                child = children[i];
                itemRender(child, cell, i);
            }
            else {
                child = itemRender(null, cell, i);
                child.classList.add('virtual-item');
                el.appendChild(child);
            }
            child['$ionCell'] = cell;
        }
        else {
            child = children[i];
        }
        // only update position when it changes
        if (node.change !== 0 /* NoChange */) {
            child.style.transform = `translate3d(0,${node.top}px,0)`;
        }
        // update visibility
        const visible = cell.visible;
        if (node.visible !== visible) {
            if (visible) {
                child.classList.remove('virtual-loading');
            }
            else {
                child.classList.add('virtual-loading');
            }
            node.visible = visible;
        }
        // dynamic height
        if (cell.reads > 0) {
            updateCellHeight(cell, child);
            cell.reads--;
        }
    }
}
function getViewport(scrollTop, vierportHeight, margin) {
    return {
        top: Math.max(scrollTop - margin, 0),
        bottom: scrollTop + vierportHeight + margin
    };
}
function getRange(heightIndex, viewport, buffer) {
    const topPos = viewport.top;
    const bottomPos = viewport.bottom;
    // find top index
    let i = 0;
    for (; i < heightIndex.length; i++) {
        if (heightIndex[i] > topPos) {
            break;
        }
    }
    const offset = Math.max(i - buffer - 1, 0);
    // find bottom index
    for (; i < heightIndex.length; i++) {
        if (heightIndex[i] >= bottomPos) {
            break;
        }
    }
    const end = Math.min(i + buffer, heightIndex.length);
    const length = end - offset;
    return { offset, length };
}
function getShouldUpdate(dirtyIndex, currentRange, range) {
    const end = range.offset + range.length;
    return (dirtyIndex <= end ||
        currentRange.offset !== range.offset ||
        currentRange.length !== range.length);
}
function findCellIndex(cells, index) {
    if (index === 0) {
        return 0;
    }
    return cells.findIndex(c => c.index === index);
}
function inplaceUpdate(dst, src, offset) {
    if (offset === 0 && src.length >= dst.length) {
        return src;
    }
    for (let i = 0; i < src.length; i++) {
        dst[i + offset] = src[i];
    }
    return dst;
}
function calcCells(items, itemHeight, headerFn, footerFn, approxHeaderHeight, approxFooterHeight, approxItemHeight, j, offset, len) {
    const cells = [];
    const end = len + offset;
    for (let i = offset; i < end; i++) {
        const item = items[i];
        if (headerFn) {
            const value = headerFn(item, i, items);
            if (value != null) {
                cells.push({
                    i: j++,
                    type: 1 /* Header */,
                    value: value,
                    index: i,
                    height: approxHeaderHeight,
                    reads: MIN_READS,
                    visible: false,
                });
            }
        }
        cells.push({
            i: j++,
            type: 0 /* Item */,
            value: item,
            index: i,
            height: itemHeight ? itemHeight(item, i) : approxItemHeight,
            reads: itemHeight ? 0 : MIN_READS,
            visible: !!itemHeight,
        });
        if (footerFn) {
            const value = footerFn(item, i, items);
            if (value != null) {
                cells.push({
                    i: j++,
                    type: 2 /* Footer */,
                    value: value,
                    index: i,
                    height: approxFooterHeight,
                    reads: 2,
                    visible: false,
                });
            }
        }
    }
    return cells;
}
function calcHeightIndex(buf, cells, index) {
    let acum = buf[index];
    for (; index < buf.length; index++) {
        buf[index] = acum;
        acum += cells[index].height;
    }
    return acum;
}
function resizeBuffer(buf, len) {
    if (!buf) {
        return new Uint32Array(len);
    }
    if (buf.length === len) {
        return buf;
    }
    else if (len > buf.length) {
        const newBuf = new Uint32Array(len);
        newBuf.set(buf);
        return newBuf;
    }
    else {
        return buf.subarray(0, len);
    }
}
function positionForIndex(index, cells, heightIndex) {
    const cell = cells.find(cell => cell.type === 0 /* Item */ && cell.index === index);
    if (cell) {
        return heightIndex[cell.i];
    }
    return -1;
}

class VirtualScroll {
    constructor() {
        this.range = { offset: 0, length: 0 };
        this.cells = [];
        this.virtualDom = [];
        this.isEnabled = false;
        this.viewportOffset = 0;
        this.currentScrollTop = 0;
        this.indexDirty = 0;
        this.totalHeight = 0;
        this.heightChanged = false;
        this.lastItemLen = 0;
        /**
         * It is important to provide this
         * if virtual item height will be significantly larger than the default
         * The approximate height of each virtual item template's cell.
         * This dimension is used to help determine how many cells should
         * be created when initialized, and to help calculate the height of
         * the scrollable area. This height value can only use `px` units.
         * Note that the actual rendered size of each cell comes from the
         * app's CSS, whereas this approximation is used to help calculate
         * initial dimensions before the item has been rendered. Default is
         * `45`.
         */
        this.approxItemHeight = 45;
        /**
         * The approximate height of each header template's cell.
         * This dimension is used to help determine how many cells should
         * be created when initialized, and to help calculate the height of
         * the scrollable area. This height value can only use `px` units.
         * Note that the actual rendered size of each cell comes from the
         * app's CSS, whereas this approximation is used to help calculate
         * initial dimensions before the item has been rendered. Default is `40px`.
         */
        this.approxHeaderHeight = 40;
        /**
         * The approximate width of each footer template's cell.
         * This dimension is used to help determine how many cells should
         * be created when initialized, and to help calculate the height of
         * the scrollable area. This value can use either `px` or `%` units.
         * Note that the actual rendered size of each cell comes from the
         * app's CSS, whereas this approximation is used to help calculate
         * initial dimensions before the item has been rendered. Default is `100%`.
         */
        this.approxFooterHeight = 40;
    }
    itemsChanged() {
        this.calcCells();
    }
    componentDidLoad() {
        this.scrollEl = this.el.closest('ion-scroll');
        if (!this.scrollEl) {
            console.error('virtual-scroll must be used inside ion-scroll/ion-content');
            return;
        }
        this.calcDimensions();
        this.calcCells();
        this.updateState();
    }
    componentDidUpdate() {
        this.updateState();
    }
    componentDidUnload() {
        this.scrollEl = null;
    }
    onScroll() {
        this.updateVirtualScroll();
    }
    onResize() {
        this.indexDirty = 0;
        this.calcDimensions();
        this.calcCells();
        this.updateVirtualScroll();
    }
    positionForItem(index) {
        return positionForIndex(index, this.cells, this.heightIndex);
    }
    markDirty(offset, len = -1) {
        // TODO: kind of hacky how we do in-place updated of the cells
        // array. this part needs a complete refactor
        if (!this.items) {
            return;
        }
        if (len === -1) {
            len = this.items.length - offset;
        }
        const max = this.lastItemLen;
        let j = 0;
        if (offset > 0 && offset < max) {
            j = findCellIndex(this.cells, offset);
        }
        else if (offset === 0) {
            j = 0;
        }
        else if (offset === max) {
            j = this.cells.length;
        }
        else {
            console.warn('bad values for markDirty');
            return;
        }
        const cells = calcCells(this.items, this.itemHeight, this.headerFn, this.footerFn, this.approxHeaderHeight, this.approxFooterHeight, this.approxItemHeight, j, offset, len);
        console.debug('[virtual] cells recalculated', cells.length);
        this.cells = inplaceUpdate(this.cells, cells, offset);
        this.lastItemLen = this.items.length;
        this.indexDirty = Math.max(offset - 1, 0);
        this.scheduleUpdate();
    }
    markDirtyTail() {
        const offset = this.lastItemLen;
        this.markDirty(offset, this.items.length - offset);
    }
    updateVirtualScroll() {
        // do nothing if there is a scheduled update
        if (!this.isEnabled || !this.scrollEl) {
            return;
        }
        if (this.timerUpdate) {
            clearTimeout(this.timerUpdate);
            this.timerUpdate = null;
        }
        this.dom.read(() => {
            let topOffset = 0;
            let node = this.el;
            while (node && node !== this.scrollEl) {
                topOffset += node.offsetTop;
                node = node.parentElement;
            }
            this.viewportOffset = topOffset;
            if (this.scrollEl) {
                this.currentScrollTop = this.scrollEl.scrollTop;
            }
        });
        this.dom.write(() => {
            const dirtyIndex = this.indexDirty;
            // get visible viewport
            const scrollTop = this.currentScrollTop - this.viewportOffset;
            const viewport = getViewport(scrollTop, this.viewportHeight, 100);
            // compute lazily the height index
            const heightIndex = this.getHeightIndex(viewport);
            // get array bounds of visible cells base in the viewport
            const range = getRange(heightIndex, viewport, 2);
            // fast path, do nothing
            const shouldUpdate = getShouldUpdate(dirtyIndex, this.range, range);
            if (!shouldUpdate) {
                return;
            }
            this.range = range;
            // in place mutation of the virtual DOM
            updateVDom(this.virtualDom, heightIndex, this.cells, range);
            // write DOM
            if (this.itemRender) {
                doRender(this.el, this.itemRender, this.virtualDom, this.updateCellHeight.bind(this));
                if (this.heightChanged) {
                    this.el.style.height = this.totalHeight + 'px';
                    this.heightChanged = false;
                }
            }
            else if (this.domRender) {
                this.domRender(this.virtualDom, this.totalHeight);
            }
        });
    }
    updateCellHeight(cell, node) {
        const update = () => {
            if (node['$ionCell'] === cell) {
                const style = window.getComputedStyle(node);
                const height = node.offsetHeight + parseFloat(style.getPropertyValue('margin-bottom'));
                this.setCellHeight(cell, height);
            }
        };
        if ('componentOnReady' in node) {
            node.componentOnReady(update);
        }
        else {
            update();
        }
    }
    setCellHeight(cell, height) {
        const index = cell.i;
        // the cell might changed since the height update was scheduled
        if (cell !== this.cells[index]) {
            return;
        }
        cell.visible = true;
        if (cell.height !== height) {
            console.debug(`[virtual] cell height changed ${cell.height}px -> ${height}px`);
            cell.height = height;
            this.indexDirty = Math.min(this.indexDirty, index);
            this.scheduleUpdate();
        }
    }
    scheduleUpdate() {
        clearTimeout(this.timerUpdate);
        this.timerUpdate = setTimeout(() => this.updateVirtualScroll(), 100);
    }
    updateState() {
        const shouldEnable = !!(this.scrollEl &&
            this.cells &&
            (this.itemRender || this.domRender) &&
            this.viewportHeight > 1);
        if (shouldEnable !== this.isEnabled) {
            this.enableScrollEvents(shouldEnable);
            if (shouldEnable) {
                this.updateVirtualScroll();
            }
        }
    }
    calcCells() {
        if (!this.items) {
            return;
        }
        this.lastItemLen = this.items.length;
        this.cells = calcCells(this.items, this.itemHeight, this.headerFn, this.footerFn, this.approxHeaderHeight, this.approxFooterHeight, this.approxItemHeight, 0, 0, this.lastItemLen);
        console.debug('[virtual] cells recalculated', this.cells.length);
        this.indexDirty = 0;
    }
    getHeightIndex(_) {
        if (this.indexDirty !== Infinity) {
            this.calcHeightIndex(this.indexDirty);
        }
        return this.heightIndex;
    }
    calcHeightIndex(index = 0) {
        // TODO: optimize, we don't need to calculate all the cells
        this.heightIndex = resizeBuffer(this.heightIndex, this.cells.length);
        const totalHeight = calcHeightIndex(this.heightIndex, this.cells, index);
        if (totalHeight !== this.totalHeight) {
            console.debug(`[virtual] total height changed: ${this.totalHeight}px -> ${totalHeight}px`);
            this.totalHeight = totalHeight;
            this.heightChanged = true;
        }
        console.debug('[virtual] height index recalculated', this.heightIndex.length - index);
        this.indexDirty = Infinity;
    }
    calcDimensions() {
        if (this.scrollEl) {
            this.viewportHeight = this.scrollEl.offsetHeight;
        }
    }
    enableScrollEvents(shouldListen) {
        if (this.scrollEl) {
            this.isEnabled = shouldListen;
            this.enableListener(this, 'scroll', shouldListen, this.scrollEl);
        }
    }
    static get is() { return "ion-virtual-scroll"; }
    static get properties() { return { "approxFooterHeight": { "type": Number, "attr": "approx-footer-height" }, "approxHeaderHeight": { "type": Number, "attr": "approx-header-height" }, "approxItemHeight": { "type": Number, "attr": "approx-item-height" }, "dom": { "context": "dom" }, "domRender": { "type": "Any", "attr": "dom-render" }, "el": { "elementRef": true }, "enableListener": { "context": "enableListener" }, "footerFn": { "type": "Any", "attr": "footer-fn" }, "headerFn": { "type": "Any", "attr": "header-fn" }, "itemHeight": { "type": "Any", "attr": "item-height", "watchCallbacks": ["itemsChanged"] }, "itemRender": { "type": "Any", "attr": "item-render" }, "items": { "type": "Any", "attr": "items", "watchCallbacks": ["itemsChanged"] }, "markDirty": { "method": true }, "markDirtyTail": { "method": true }, "nodeHeight": { "type": "Any", "attr": "node-height" }, "positionForItem": { "method": true } }; }
    static get style() { return "ion-virtual-scroll {\n  position: relative;\n  display: block;\n  width: 100%;\n  contain: strict;\n}\n\n.virtual-loading {\n  opacity: 0;\n}\n\n.virtual-item {\n  left: 0;\n  right: 0;\n  top: 0;\n  position: absolute;\n  transition-duration: 0ms;\n  will-change: transform;\n  contain: content;\n}"; }
}

export { VirtualScroll as IonVirtualScroll };
