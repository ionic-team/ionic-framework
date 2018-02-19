/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { isRightSide } from './chunk1.js';

class ItemOptions {
    constructor() {
        /**
         * The side the option button should be on. Defaults to `"right"`.
         * If you have multiple `ion-item-options`, a side must be provided for each.
         */
        this.side = 'right';
    }
    isRightSide() {
        return isRightSide(this.side, true);
    }
    width() {
        return this.el.offsetWidth;
    }
    fireSwipeEvent(value) {
        this.ionSwipe.emit(value);
    }
    hostData() {
        return {
            class: {
                'item-options-left': !this.isRightSide(),
                'item-options-right': this.isRightSide()
            }
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-item-options"; }
    static get properties() { return { "el": { "elementRef": true }, "fireSwipeEvent": { "method": true }, "isRightSide": { "method": true }, "side": { "type": "Any", "attr": "side" }, "width": { "method": true } }; }
    static get events() { return [{ "name": "ionSwipe", "method": "ionSwipe", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-item-options {\n  position: absolute;\n  z-index: 1;\n  display: none;\n  height: 100%;\n  font-size: 14px;\n  top: 0;\n  right: 0;\n  justify-content: flex-end;\n}\n\nion-item-options.hydrated {\n  visibility: hidden;\n}\n\n.item-options-left {\n  right: auto;\n  left: 0;\n  justify-content: flex-start;\n}\n\n.item-sliding-active-slide ion-item-options {\n  display: flex;\n}\n\n.item-sliding-active-slide.item-sliding-active-options-left .item-options-left,\n.item-sliding-active-slide.item-sliding-active-options-right ion-item-options:not(.item-options-left) {\n  width: 100%;\n  visibility: visible;\n}\n\n.list-md ion-item-options {\n  border-bottom: 1px solid var(--ion-item-md-border-color, var(--ion-item-border-color, #dedede));\n}\n\n.list-md[no-lines] ion-item-options {\n  border-width: 0;\n}"; }
    static get styleMode() { return "md"; }
}

export { ItemOptions as IonItemOptions };
