/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { clamp } from './chunk1.js';
import { hapticSelectionChanged, hapticSelectionEnd, hapticSelectionStart } from './chunk6.js';
import { CSS_PROP } from './chunk4.js';

const AUTO_SCROLL_MARGIN = 60;
const SCROLL_JUMP = 10;
const ITEM_REORDER_SELECTED = 'reorder-selected';

class ReorderGroup {
    constructor() {
        this.selectedItemEl = null;
        this.cachedHeights = [];
        this.enabled = false;
        this.iconVisible = false;
        this.activated = false;
        /**
         * If true, the reorder will be hidden. Defaults to `true`.
         */
        this.disabled = true;
    }
    disabledChanged(disabled) {
        if (!disabled) {
            this.enabled = true;
            this.dom.raf(() => {
                this.iconVisible = true;
            });
        }
        else {
            this.iconVisible = false;
            setTimeout(() => this.enabled = false, 400);
        }
    }
    componentDidLoad() {
        this.containerEl = this.el.querySelector('ion-gesture');
        this.scrollEl = this.el.closest('ion-scroll');
        if (!this.disabled) {
            this.disabledChanged(false);
        }
    }
    componentDidUnload() {
        this.onDragEnd();
    }
    canStart(ev) {
        if (this.selectedItemEl) {
            return false;
        }
        const target = ev.event.target;
        const reorderEl = target.closest('ion-reorder');
        if (!reorderEl) {
            return false;
        }
        const item = findReorderItem(reorderEl, this.containerEl);
        if (!item) {
            console.error('reorder node not found');
            return false;
        }
        ev.data = item;
        return true;
    }
    onDragStart(ev) {
        const item = this.selectedItemEl = ev.data;
        const heights = this.cachedHeights;
        heights.length = 0;
        const el = this.containerEl;
        const children = el.children;
        if (!children || children.length === 0) {
            return;
        }
        let sum = 0;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            sum += child.offsetHeight;
            heights.push(sum);
            child.$ionIndex = i;
        }
        const box = this.containerEl.getBoundingClientRect();
        this.containerTop = box.top;
        this.containerBottom = box.bottom;
        if (this.scrollEl) {
            const scrollBox = this.scrollEl.getBoundingClientRect();
            this.scrollElInitial = this.scrollEl.scrollTop;
            this.scrollElTop = scrollBox.top + AUTO_SCROLL_MARGIN;
            this.scrollElBottom = scrollBox.bottom - AUTO_SCROLL_MARGIN;
        }
        else {
            this.scrollElInitial = 0;
            this.scrollElTop = 0;
            this.scrollElBottom = 0;
        }
        this.lastToIndex = indexForItem(item);
        this.selectedItemHeight = item.offsetHeight;
        this.activated = true;
        item.classList.add(ITEM_REORDER_SELECTED);
        hapticSelectionStart();
    }
    onDragMove(ev) {
        const selectedItem = this.selectedItemEl;
        if (!selectedItem) {
            return;
        }
        // Scroll if we reach the scroll margins
        const scroll = this.autoscroll(ev.currentY);
        // // Get coordinate
        const top = this.containerTop - scroll;
        const bottom = this.containerBottom - scroll;
        const currentY = clamp(top, ev.currentY, bottom);
        const deltaY = scroll + currentY - ev.startY;
        const normalizedY = currentY - top;
        const toIndex = this.itemIndexForTop(normalizedY);
        if (toIndex !== undefined && (toIndex !== this.lastToIndex)) {
            const fromIndex = indexForItem(selectedItem);
            this.lastToIndex = toIndex;
            hapticSelectionChanged();
            this.reorderMove(fromIndex, toIndex);
        }
        // Update selected item position
        selectedItem.style[CSS_PROP.transformProp] = `translateY(${deltaY}px)`;
    }
    onDragEnd() {
        this.activated = false;
        const selectedItem = this.selectedItemEl;
        if (!selectedItem) {
            return;
        }
        const children = this.containerEl.children;
        const toIndex = this.lastToIndex;
        const fromIndex = indexForItem(selectedItem);
        const ref = (fromIndex < toIndex)
            ? children[toIndex + 1]
            : children[toIndex];
        this.containerEl.insertBefore(selectedItem, ref);
        const len = children.length;
        const transform = CSS_PROP.transformProp;
        for (let i = 0; i < len; i++) {
            children[i].style[transform] = '';
        }
        const reorderInactive = () => {
            if (this.selectedItemEl) {
                this.selectedItemEl.style.transition = '';
                this.selectedItemEl.classList.remove(ITEM_REORDER_SELECTED);
                this.selectedItemEl = null;
            }
        };
        if (toIndex === fromIndex) {
            selectedItem.style.transition = 'transform 200ms ease-in-out';
            setTimeout(reorderInactive, 200);
        }
        else {
            reorderInactive();
        }
        hapticSelectionEnd();
    }
    itemIndexForTop(deltaY) {
        const heights = this.cachedHeights;
        let i = 0;
        // TODO: since heights is a sorted array of integers, we can do
        // speed up the search using binary search. Remember that linear-search is still
        // faster than binary-search for small arrays (<64) due CPU branch misprediction.
        for (i = 0; i < heights.length; i++) {
            if (heights[i] > deltaY) {
                break;
            }
        }
        return i;
    }
    /********* DOM WRITE ********* */
    reorderMove(fromIndex, toIndex) {
        const itemHeight = this.selectedItemHeight;
        const children = this.containerEl.children;
        const transform = CSS_PROP.transformProp;
        for (let i = 0; i < children.length; i++) {
            const style = children[i].style;
            let value = '';
            if (i > fromIndex && i <= toIndex) {
                value = `translateY(${-itemHeight}px)`;
            }
            else if (i < fromIndex && i >= toIndex) {
                value = `translateY(${itemHeight}px)`;
            }
            style[transform] = value;
        }
    }
    autoscroll(posY) {
        if (!this.scrollEl) {
            return 0;
        }
        let amount = 0;
        if (posY < this.scrollElTop) {
            amount = -SCROLL_JUMP;
        }
        else if (posY > this.scrollElBottom) {
            amount = SCROLL_JUMP;
        }
        if (amount !== 0) {
            this.scrollEl.scrollBy(0, amount);
        }
        return this.scrollEl.scrollTop - this.scrollElInitial;
    }
    hostData() {
        return {
            class: {
                'reorder-enabled': this.enabled,
                'reorder-list-active': this.activated,
                'reorder-visible': this.iconVisible
            }
        };
    }
    render() {
        return (h("ion-gesture", Object.assign({}, {
            canStart: this.canStart.bind(this),
            onStart: this.onDragStart.bind(this),
            onMove: this.onDragMove.bind(this),
            onEnd: this.onDragEnd.bind(this),
            disabled: this.disabled,
            disableScroll: true,
            gestureName: 'reorder',
            gesturePriority: 30,
            type: 'pan',
            direction: 'y',
            threshold: 0,
            attachTo: 'body'
        }),
            h("slot", null)));
    }
    static get is() { return "ion-reorder-group"; }
    static get host() { return { "theme": "reorder-group" }; }
    static get properties() { return { "activated": { "state": true }, "disabled": { "type": Boolean, "attr": "disabled", "watchCallbacks": ["disabledChanged"] }, "dom": { "context": "dom" }, "el": { "elementRef": true }, "enabled": { "state": true }, "iconVisible": { "state": true } }; }
    static get style() { return ".reorder-group > ion-gesture {\n  display: block;\n}\n\n.reorder-list-active ion-gesture > * {\n  transition: transform 300ms;\n  will-change: transform;\n}"; }
}
function indexForItem(element) {
    return element['$ionIndex'];
}
function findReorderItem(node, container) {
    let nested = 0;
    let parent;
    while (node && nested < 6) {
        parent = node.parentNode;
        if (parent === container) {
            return node;
        }
        node = parent;
        nested++;
    }
    return null;
}

export { ReorderGroup as IonReorderGroup };
