/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { createThemedClasses, getElementClassMap } from './chunk2.js';

class Item {
    constructor() {
        this.itemStyles = {};
        /**
         * If true, the user cannot interact with the item. Defaults to `false`.
         */
        this.disabled = false;
        /**
         * Whether or not this item should be tappable.
         * If true, a button tag will be rendered. Default `true`.
         */
        this.tappable = false;
    }
    itemStyle(ev) {
        ev.stopPropagation();
        let hasChildStyleChange = false;
        const tagName = ev.target.tagName;
        const updatedStyles = ev.detail;
        for (const key in updatedStyles) {
            if (('item-' + key) !== key) {
                Object.defineProperty(updatedStyles, 'item-' + key, Object.getOwnPropertyDescriptor(updatedStyles, key));
                delete updatedStyles[key];
                hasChildStyleChange = true;
            }
        }
        this.itemStyles[tagName] = updatedStyles;
        if (hasChildStyleChange) {
            this.hasStyleChange = true;
        }
    }
    componentDidLoad() {
        // Change the button size to small for each ion-button in the item
        // unless the size is explicitly set
        const buttons = this.el.querySelectorAll('ion-button');
        for (let i = 0; i < buttons.length; i++) {
            if (!buttons[i].size) {
                buttons[i].size = 'small';
            }
        }
    }
    render() {
        let childStyles = {};
        for (const key in this.itemStyles) {
            childStyles = Object.assign(childStyles, this.itemStyles[key]);
        }
        const themedClasses = Object.assign({}, childStyles, createThemedClasses(this.mode, this.color, 'item'), getElementClassMap(this.el.classList), { 'item-block': true, 'item-disabled': this.disabled });
        this.hasStyleChange = false;
        const clickable = this.href || this.onclick || this.tappable;
        let TagType = 'div';
        if (clickable) {
            TagType = this.href ? 'a' : 'button';
        }
        const attrs = (TagType === 'button')
            ? { type: 'button' }
            : {};
        return (h(TagType, Object.assign({ class: themedClasses }, attrs),
            h("slot", { name: 'start' }),
            h("div", { class: 'item-inner' },
                h("div", { class: 'input-wrapper' },
                    h("slot", null)),
                h("slot", { name: 'end' })),
            clickable && this.mode === 'md' && h("ion-ripple-effect", null)));
    }
    static get is() { return "ion-item"; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "disabled": { "type": Boolean, "attr": "disabled" }, "el": { "elementRef": true }, "hasStyleChange": { "state": true }, "href": { "type": String, "attr": "href" }, "mode": { "type": "Any", "attr": "mode" }, "onclick": { "type": "Any", "attr": "onclick" }, "tappable": { "type": Boolean, "attr": "tappable" } }; }
    static get style() { return "ion-item {\n  display: block;\n  contain: content;\n}\n\n.item-block {\n  margin: 0;\n  padding: 0;\n  text-align: initial;\n  display: flex;\n  overflow: hidden;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  min-height: 44px;\n  border: 0;\n  font-weight: normal;\n  line-height: normal;\n  text-decoration: none;\n  color: inherit;\n}\n\n.item-inner {\n  margin: 0;\n  padding: 0;\n  display: flex;\n  overflow: hidden;\n  flex: 1;\n  flex-direction: inherit;\n  align-items: inherit;\n  align-self: stretch;\n  min-height: inherit;\n  border: 0;\n}\n\n.input-wrapper {\n  display: flex;\n  overflow: hidden;\n  flex: 1;\n  flex-direction: inherit;\n  align-items: inherit;\n  align-self: stretch;\n  text-overflow: ellipsis;\n}\n\n.item[no-lines],\n.item.item[no-lines] .item-inner {\n  border: 0;\n}\n\nion-item-group {\n  display: block;\n}\n\n[vertical-align-top],\nion-input.item {\n  align-items: flex-start;\n}\n\n.item-cover {\n  left: 0;\n  top: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  cursor: pointer;\n}\n\n.item > ion-icon,\n.item-inner > ion-icon {\n  font-size: 1.6em;\n}\n\n.item .button {\n  margin: 0;\n}\n\n.item-disabled {\n  cursor: default;\n  opacity: .4;\n  pointer-events: none;\n}\n\n.item-ios {\n  padding-left: 16px;\n  padding-left: calc(constant(safe-area-inset-left) + 16px);\n  padding-left: calc(env(safe-area-inset-left) + 16px);\n  border-radius: 0;\n  position: relative;\n  font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Roboto\", sans-serif;\n  font-size: 17px;\n  color: var(--ion-item-ios-text-color, var(--ion-item-text-color, var(--ion-text-color, #000)));\n  background-color: var(--ion-item-ios-background-color, var(--ion-background-ios-color, var(--ion-background-color, #fff)));\n  transition: background-color 200ms linear;\n}\n\n.item-ios.activated {\n  background-color: var(--ion-item-ios-background-color-active, var(--ion-item-background-color-active, #d9d9d9));\n  transition-duration: 0ms;\n}\n\n.item-ios h1 {\n  margin: 0 0 2px;\n  font-size: 24px;\n  font-weight: normal;\n}\n\n.item-ios h2 {\n  margin: 0 0 2px;\n  font-size: 17px;\n  font-weight: normal;\n}\n\n.item-ios h3,\n.item-ios h4,\n.item-ios h5,\n.item-ios h6 {\n  margin: 0 0 3px;\n  font-size: 14px;\n  font-weight: normal;\n  line-height: normal;\n}\n\n.item-ios p {\n  margin: 0 0 2px;\n  overflow: inherit;\n  font-size: 14px;\n  line-height: normal;\n  text-overflow: inherit;\n  color: var(--ion-text-ios-color-step-600, var(--ion-text-color-step-600, #999999));\n}\n\n.item-ios h2:last-child,\n.item-ios h3:last-child,\n.item-ios h4:last-child,\n.item-ios h5:last-child,\n.item-ios h6:last-child,\n.item-ios p:last-child {\n  margin-bottom: 0;\n}\n\n.item-ios.item-block .item-inner {\n  padding-right: 8px;\n  border-bottom: 0.55px solid var(--ion-item-ios-border-color, var(--ion-item-border-color, #c8c7cc));\n}\n\n\@media screen and (orientation: landscape) {\n  .item-ios.item-block .item-inner {\n    padding-right: calc(constant(safe-area-inset-right) + 8px);\n    padding-right: calc(env(safe-area-inset-right) + 8px);\n  }\n}\n\n.item-ios [slot=\"start\"] {\n  margin: 8px 16px 8px 0;\n}\n\n.item-ios [slot=\"end\"] {\n  margin: 8px;\n}\n\n.item-ios > ion-icon[slot=\"start\"],\n.item-ios > ion-icon[slot=\"end\"] {\n  margin-left: 0;\n  margin-top: 9px;\n  margin-bottom: 8px;\n}\n\n.item-ios.item-label-stacked [slot=\"end\"],\n.item-ios.item-label-floating [slot=\"end\"] {\n  margin-top: 6px;\n  margin-bottom: 6px;\n}\n\n.item-ios .button-small-ios {\n  padding: 0 0.5em;\n  height: 24px;\n  font-size: 13px;\n}\n\n.item-ios .button-small-ios ion-icon[slot=\"icon-only\"] {\n  padding: 0 1px;\n}\n\n.item-ios ion-avatar {\n  width: 36px;\n  height: 36px;\n}\n\n.item-ios ion-thumbnail {\n  width: 56px;\n  height: 56px;\n}\n\n.item-ios[detail-push] .item-inner,\nbutton.item-ios:not([detail-none]) .item-inner,\na.item-ios:not([detail-none]) .item-inner {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2012%2020'><path%20d='M2,20l-2-2l8-8L0,2l2-2l10,10L2,20z'%20fill='var(--ion-item-ios-border-color,%20var(--ion-item-border-color,%20%23c8c7cc))'/></svg>\");\n  padding-right: 32px;\n  background-position: right 14px center;\n  background-position: right calc(14px + constant(safe-area-inset-right)) center;\n  background-position: right calc(14px + env(safe-area-inset-right)) center;\n  background-repeat: no-repeat;\n  background-size: 14px 14px;\n}\n\n.item-ios .text-ios-primary {\n  color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.item-ios-primary,\n.item-divider-ios-primary {\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.item-ios-primary p,\n.item-divider-ios-primary p {\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n}\n\n.item-ios-primary.activated,\n.item-divider-ios-primary.activated {\n  background-color: var(--ion-color-ios-primary-tint, var(--ion-color-primary-tint, #5a96ff));\n}\n\n.item-ios .text-ios-secondary {\n  color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.item-ios-secondary,\n.item-divider-ios-secondary {\n  color: var(--ion-color-ios-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  background-color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.item-ios-secondary p,\n.item-divider-ios-secondary p {\n  color: var(--ion-color-ios-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n}\n\n.item-ios-secondary.activated,\n.item-divider-ios-secondary.activated {\n  background-color: var(--ion-color-ios-secondary-tint, var(--ion-color-secondary-tint, #47df74));\n}\n\n.item-ios .text-ios-tertiary {\n  color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.item-ios-tertiary,\n.item-divider-ios-tertiary {\n  color: var(--ion-color-ios-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  background-color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.item-ios-tertiary p,\n.item-divider-ios-tertiary p {\n  color: var(--ion-color-ios-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n}\n\n.item-ios-tertiary.activated,\n.item-divider-ios-tertiary.activated {\n  background-color: var(--ion-color-ios-tertiary-tint, var(--ion-color-tertiary-tint, #f5b255));\n}\n\n.item-ios .text-ios-success {\n  color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.item-ios-success,\n.item-divider-ios-success {\n  color: var(--ion-color-ios-success-contrast, var(--ion-color-success-contrast, #fff));\n  background-color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.item-ios-success p,\n.item-divider-ios-success p {\n  color: var(--ion-color-ios-success-contrast, var(--ion-color-success-contrast, #fff));\n}\n\n.item-ios-success.activated,\n.item-divider-ios-success.activated {\n  background-color: var(--ion-color-ios-success-tint, var(--ion-color-success-tint, #28e070));\n}\n\n.item-ios .text-ios-warning {\n  color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.item-ios-warning,\n.item-divider-ios-warning {\n  color: var(--ion-color-ios-warning-contrast, var(--ion-color-warning-contrast, #000));\n  background-color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.item-ios-warning p,\n.item-divider-ios-warning p {\n  color: var(--ion-color-ios-warning-contrast, var(--ion-color-warning-contrast, #000));\n}\n\n.item-ios-warning.activated,\n.item-divider-ios-warning.activated {\n  background-color: var(--ion-color-ios-warning-tint, var(--ion-color-warning-tint, #ffd31a));\n}\n\n.item-ios .text-ios-danger {\n  color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.item-ios-danger,\n.item-divider-ios-danger {\n  color: var(--ion-color-ios-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  background-color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.item-ios-danger p,\n.item-divider-ios-danger p {\n  color: var(--ion-color-ios-danger-contrast, var(--ion-color-danger-contrast, #fff));\n}\n\n.item-ios-danger.activated,\n.item-divider-ios-danger.activated {\n  background-color: var(--ion-color-ios-danger-tint, var(--ion-color-danger-tint, #f65050));\n}\n\n.item-ios .text-ios-light {\n  color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.item-ios-light,\n.item-divider-ios-light {\n  color: var(--ion-color-ios-light-contrast, var(--ion-color-light-contrast, #000));\n  background-color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.item-ios-light p,\n.item-divider-ios-light p {\n  color: var(--ion-color-ios-light-contrast, var(--ion-color-light-contrast, #000));\n}\n\n.item-ios-light.activated,\n.item-divider-ios-light.activated {\n  background-color: var(--ion-color-ios-light-tint, var(--ion-color-light-tint, whitesmoke));\n}\n\n.item-ios .text-ios-medium {\n  color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.item-ios-medium,\n.item-divider-ios-medium {\n  color: var(--ion-color-ios-medium-contrast, var(--ion-color-medium-contrast, #000));\n  background-color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.item-ios-medium p,\n.item-divider-ios-medium p {\n  color: var(--ion-color-ios-medium-contrast, var(--ion-color-medium-contrast, #000));\n}\n\n.item-ios-medium.activated,\n.item-divider-ios-medium.activated {\n  background-color: var(--ion-color-ios-medium-tint, var(--ion-color-medium-tint, #a2a4ab));\n}\n\n.item-ios .text-ios-dark {\n  color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}\n\n.item-ios-dark,\n.item-divider-ios-dark {\n  color: var(--ion-color-ios-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  background-color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}\n\n.item-ios-dark p,\n.item-divider-ios-dark p {\n  color: var(--ion-color-ios-dark-contrast, var(--ion-color-dark-contrast, #fff));\n}\n\n.item-ios-dark.activated,\n.item-divider-ios-dark.activated {\n  background-color: var(--ion-color-ios-dark-tint, var(--ion-color-dark-tint, #383838));\n}"; }
    static get styleMode() { return "ios"; }
}

class Label {
    constructor() {
        /**
         * If true, the label will sit alongside an input. Defaults to `false`.
         */
        this.fixed = false;
        /**
         * If true, the label will float above an input when the value is empty or the input is focused. Defaults to `false`.
         */
        this.floating = false;
        /**
         * If true, the label will be stacked above an input. Defaults to `false`.
         */
        this.stacked = false;
    }
    getText() {
        return this.el.textContent || '';
    }
    componentDidLoad() {
        this.emitStyle();
    }
    emitStyle() {
        clearTimeout(this.styleTmr);
        const styles = {
            'label-fixed': this.fixed,
            'label-floating': this.floating,
            'label-stacked': this.stacked
        };
        this.styleTmr = setTimeout(() => {
            this.ionStyle.emit(styles);
        });
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-label"; }
    static get host() { return { "theme": "label" }; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "el": { "elementRef": true }, "fixed": { "type": Boolean, "attr": "fixed" }, "floating": { "type": Boolean, "attr": "floating" }, "getText": { "method": true }, "mode": { "type": "Any", "attr": "mode" }, "stacked": { "type": Boolean, "attr": "stacked" } }; }
    static get events() { return [{ "name": "ionStyle", "method": "ionStyle", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-label {\n  margin: 0;\n  display: block;\n  overflow: hidden;\n  flex: 1;\n  font-size: inherit;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.item-input ion-label {\n  flex: initial;\n  max-width: 200px;\n  pointer-events: none;\n}\n\n[text-wrap] ion-label {\n  white-space: normal;\n}\n\nion-label[fixed] {\n  flex: 0 0 100px;\n  width: 100px;\n  min-width: 100px;\n  max-width: 200px;\n}\n\n.item-label-stacked ion-label,\n.item-label-floating ion-label {\n  align-self: stretch;\n  width: auto;\n  max-width: 100%;\n}\n\nion-label[stacked],\nion-label[floating] {\n  margin-bottom: 0;\n}\n\n.item-label-stacked .input-wrapper,\n.item-label-floating .input-wrapper {\n  flex: 1;\n  flex-direction: column;\n}\n\n.item-label-stacked ion-select,\n.item-label-floating ion-select {\n  align-self: stretch;\n  max-width: 100%;\n}\n\n.label-ios {\n  margin: 11px 8px 11px 0;\n  font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Roboto\", sans-serif;\n}\n\n.label-ios[stacked] {\n  margin-bottom: 4px;\n  font-size: 12px;\n}\n\n.label-ios[floating] {\n  margin-bottom: 0;\n  transform: translate3d(0,  27px,  0);\n  transform-origin: left top;\n  transition: transform 150ms ease-in-out;\n}\n\n.item-input-has-focus .label-ios[floating],\n.item-input-has-value .label-ios[floating] {\n  transform: translate3d(0,  0,  0) scale(0.8);\n}\n\n.label-ios-primary,\n.item-input .label-ios-primary,\n.item-select .label-ios-primary,\n.item-datetime .label-ios-primary {\n  color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.label-ios-secondary,\n.item-input .label-ios-secondary,\n.item-select .label-ios-secondary,\n.item-datetime .label-ios-secondary {\n  color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.label-ios-tertiary,\n.item-input .label-ios-tertiary,\n.item-select .label-ios-tertiary,\n.item-datetime .label-ios-tertiary {\n  color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.label-ios-success,\n.item-input .label-ios-success,\n.item-select .label-ios-success,\n.item-datetime .label-ios-success {\n  color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.label-ios-warning,\n.item-input .label-ios-warning,\n.item-select .label-ios-warning,\n.item-datetime .label-ios-warning {\n  color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.label-ios-danger,\n.item-input .label-ios-danger,\n.item-select .label-ios-danger,\n.item-datetime .label-ios-danger {\n  color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.label-ios-light,\n.item-input .label-ios-light,\n.item-select .label-ios-light,\n.item-datetime .label-ios-light {\n  color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.label-ios-medium,\n.item-input .label-ios-medium,\n.item-select .label-ios-medium,\n.item-datetime .label-ios-medium {\n  color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.label-ios-dark,\n.item-input .label-ios-dark,\n.item-select .label-ios-dark,\n.item-datetime .label-ios-dark {\n  color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "ios"; }
}

class List {
    getOpenedItem() {
        return this.openedItem;
    }
    setOpenedItem(itemSliding) {
        this.openedItem = itemSliding;
    }
    /**
     * Close the sliding items. Items can also be closed from the [Item Sliding](../../item-sliding/ItemSliding).
     */
    closeSlidingItems() {
        if (this.openedItem) {
            this.openedItem.close();
            this.openedItem = null;
            return true;
        }
        return false;
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-list"; }
    static get host() { return { "theme": "list" }; }
    static get properties() { return { "closeSlidingItems": { "method": true }, "getOpenedItem": { "method": true }, "setOpenedItem": { "method": true } }; }
    static get style() { return "ion-list {\n  margin: 0;\n  padding: 0;\n  display: block;\n  contain: content;\n  list-style-type: none;\n}\n\nion-list[inset] {\n  overflow: hidden;\n  transform: translateZ(0);\n}\n\n.list-ios {\n  margin: -1px 0 32px;\n}\n\n.list-ios > .item-block:first-child {\n  border-top: 0.55px solid var(--ion-item-ios-border-color, var(--ion-item-border-color, #c8c7cc));\n}\n\n.list-ios > .item-block:last-child,\n.list-ios > .item-sliding:last-child .item-block {\n  border-bottom: 0.55px solid var(--ion-item-ios-border-color, var(--ion-item-border-color, #c8c7cc));\n}\n\n.list-ios > .item-block:last-child .item-inner,\n.list-ios > .item-sliding:last-child .item-block .item-inner {\n  border-bottom: 0;\n}\n\n.list-ios .item-block .item-inner {\n  border-bottom: 0.55px solid var(--ion-item-ios-border-color, var(--ion-item-border-color, #c8c7cc));\n}\n\n.list-ios .item[no-lines],\n.list-ios .item[no-lines] .item-inner {\n  border-width: 0;\n}\n\n.list-ios:not([inset]) + .list-ios:not([inset]) ion-list-header {\n  margin-top: -10px;\n  padding-top: 0;\n}\n\n.list-ios[inset] {\n  margin: 16px;\n  border-radius: 4px;\n}\n\n.list-ios[inset] ion-list-header {\n  background-color: var(--ion-item-ios-background-color, var(--ion-background-ios-color, var(--ion-background-color, #fff)));\n}\n\n.list-ios[inset] .item {\n  border-bottom: 1px solid var(--ion-item-ios-border-color, var(--ion-item-border-color, #c8c7cc));\n}\n\n.list-ios[inset] .item-inner {\n  border-bottom: 0;\n}\n\n.list-ios[inset] > .item:first-child,\n.list-ios[inset] > .item-sliding:first-child .item {\n  border-top: 0;\n}\n\n.list-ios[inset] > .item:last-child,\n.list-ios[inset] > .item-sliding:last-child .item {\n  border-bottom: 0;\n}\n\n.list-ios[inset] + ion-list[inset] {\n  margin-top: 0;\n}\n\n.list-ios[no-lines] ion-list-header,\n.list-ios[no-lines] .item,\n.list-ios[no-lines] .item .item-inner {\n  border-width: 0;\n}"; }
    static get styleMode() { return "ios"; }
}

class ListHeader {
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-list-header"; }
    static get host() { return { "theme": "list-header" }; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "mode": { "type": "Any", "attr": "mode" } }; }
    static get style() { return "ion-list-header {\n  margin: 0;\n  padding: 0;\n  display: flex;\n  overflow: hidden;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  min-height: 40px;\n}\n\n.list-header-ios {\n  padding-left: 16px;\n  position: relative;\n  border-bottom: 0.55px solid var(--ion-item-ios-border-color, var(--ion-item-border-color, #c8c7cc));\n  font-size: 12px;\n  font-weight: 500;\n  letter-spacing: 1px;\n  text-transform: uppercase;\n  color: var(--ion-text-ios-color-step-150, var(--ion-text-color-step-150, #262626));\n  background: transparent;\n}\n\n.list-header-ios-primary {\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.list-header-ios-secondary {\n  color: var(--ion-color-ios-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  background-color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.list-header-ios-tertiary {\n  color: var(--ion-color-ios-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  background-color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.list-header-ios-success {\n  color: var(--ion-color-ios-success-contrast, var(--ion-color-success-contrast, #fff));\n  background-color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.list-header-ios-warning {\n  color: var(--ion-color-ios-warning-contrast, var(--ion-color-warning-contrast, #000));\n  background-color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.list-header-ios-danger {\n  color: var(--ion-color-ios-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  background-color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.list-header-ios-light {\n  color: var(--ion-color-ios-light-contrast, var(--ion-color-light-contrast, #000));\n  background-color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.list-header-ios-medium {\n  color: var(--ion-color-ios-medium-contrast, var(--ion-color-medium-contrast, #000));\n  background-color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.list-header-ios-dark {\n  color: var(--ion-color-ios-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  background-color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "ios"; }
}

class Radio {
    constructor() {
        /*
         * If true, the user cannot interact with the radio. Defaults to `false`.
         */
        this.disabled = false;
        /**
         * If true, the radio is selected. Defaults to `false`.
         */
        this.checked = false;
    }
    componentWillLoad() {
        this.inputId = 'ion-rb-' + (radioButtonIds++);
        if (this.value === undefined) {
            this.value = this.inputId;
        }
        this.emitStyle();
    }
    componentDidLoad() {
        this.ionRadioDidLoad.emit({ radio: this });
        this.nativeInput.checked = this.checked;
        this.didLoad = true;
        const parentItem = this.nativeInput.closest('ion-item');
        if (parentItem) {
            const itemLabel = parentItem.querySelector('ion-label');
            if (itemLabel) {
                itemLabel.id = this.inputId + '-lbl';
                this.nativeInput.setAttribute('aria-labelledby', itemLabel.id);
            }
        }
    }
    componentDidUnload() {
        this.ionRadioDidUnload.emit({ radio: this });
    }
    colorChanged() {
        this.emitStyle();
    }
    checkedChanged(isChecked) {
        if (this.nativeInput.checked !== isChecked) {
            // keep the checked value and native input `nync
            this.nativeInput.checked = isChecked;
        }
        clearTimeout(this.checkedTmr);
        this.checkedTmr = setTimeout(() => {
            // only emit ionSelect when checked is true
            if (this.didLoad && isChecked) {
                this.ionSelect.emit({
                    checked: isChecked,
                    value: this.value
                });
            }
        });
        this.emitStyle();
    }
    disabledChanged(isDisabled) {
        this.nativeInput.disabled = isDisabled;
        this.emitStyle();
    }
    emitStyle() {
        clearTimeout(this.styleTmr);
        this.styleTmr = setTimeout(() => {
            this.ionStyle.emit(Object.assign({}, createThemedClasses(this.mode, this.color, 'radio'), { 'radio-checked': this.checked, 'radio-disabled': this.disabled }));
        });
    }
    onClick() {
        this.checkedChanged(true);
    }
    onChange() {
        this.checked = true;
        this.nativeInput.focus();
    }
    onKeyUp() {
        this.keyFocus = true;
    }
    onFocus() {
        this.ionFocus.emit();
    }
    onBlur() {
        this.keyFocus = false;
        this.ionBlur.emit();
    }
    hostData() {
        const hostAttrs = {
            'class': {
                'radio-checked': this.checked,
                'radio-disabled': this.disabled,
                'radio-key': this.keyFocus
            }
        };
        return hostAttrs;
    }
    render() {
        const radioClasses = {
            'radio-icon': true,
            'radio-checked': this.checked
        };
        return [
            h("div", { class: radioClasses },
                h("div", { class: 'radio-inner' })),
            h("input", { type: 'radio', onClick: this.onClick.bind(this), onChange: this.onChange.bind(this), onFocus: this.onFocus.bind(this), onBlur: this.onBlur.bind(this), onKeyUp: this.onKeyUp.bind(this), id: this.inputId, name: this.name, value: this.value, disabled: this.disabled, ref: r => this.nativeInput = r })
        ];
    }
    static get is() { return "ion-radio"; }
    static get host() { return { "theme": "radio" }; }
    static get properties() { return { "checked": { "type": Boolean, "attr": "checked", "mutable": true, "watchCallbacks": ["checkedChanged"] }, "color": { "type": String, "attr": "color", "watchCallbacks": ["colorChanged"] }, "disabled": { "type": Boolean, "attr": "disabled", "watchCallbacks": ["disabledChanged"] }, "keyFocus": { "state": true }, "mode": { "type": "Any", "attr": "mode" }, "name": { "type": String, "attr": "name" }, "value": { "type": String, "attr": "value", "mutable": true } }; }
    static get events() { return [{ "name": "ionRadioDidLoad", "method": "ionRadioDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionRadioDidUnload", "method": "ionRadioDidUnload", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionStyle", "method": "ionStyle", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionSelect", "method": "ionSelect", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionFocus", "method": "ionFocus", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionBlur", "method": "ionBlur", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-radio {\n  box-sizing: border-box;\n  position: relative;\n  display: inline-block;\n}\n\nion-radio input {\n  left: 0;\n  top: 0;\n  margin: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  cursor: pointer;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\nion-radio input:active, ion-radio input:focus {\n  outline: none;\n}\n\nion-radio .radio-icon {\n  box-sizing: border-box;\n}\n\n.radio-ios .radio-icon {\n  position: relative;\n  display: block;\n  width: 16px;\n  height: 21px;\n  contain: strict;\n}\n\n.radio-ios .radio-checked .radio-inner {\n  left: 7px;\n  top: 4px;\n  position: absolute;\n  width: 5px;\n  height: 12px;\n  border-width: 2px;\n  border-top-width: 0;\n  border-left-width: 0;\n  border-style: solid;\n  border-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n  transform: rotate(45deg);\n}\n\n.radio-ios.radio-disabled,\n.item-ios.item-radio-disabled ion-label {\n  opacity: 0.3;\n  pointer-events: none;\n}\n\n.radio-key .radio-icon::after {\n  border-radius: 50%;\n  left: -9px;\n  top: -8px;\n  position: absolute;\n  display: block;\n  width: 36px;\n  height: 36px;\n  background: var(--ion-color-ios-primary-tint, var(--ion-color-primary-tint, #5a96ff));\n  content: \"\";\n  opacity: .2;\n}\n\n.item-ios .radio-ios {\n  margin: 8px 11px 8px 8px;\n  position: static;\n  display: block;\n}\n\n.item-ios .radio-ios[slot=\"start\"] {\n  margin: 8px 21px 8px 3px;\n}\n\n.item-radio.item-ios ion-label {\n  margin-left: 0;\n}\n\n.item-radio-checked.item-ios ion-label {\n  color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.item-radio-ios-primary.item-radio-checked ion-label {\n  color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.radio-ios-primary .radio-checked {\n  color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.radio-ios-primary .radio-checked .radio-inner {\n  border-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.item-radio-ios-secondary.item-radio-checked ion-label {\n  color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.radio-ios-secondary .radio-checked {\n  color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.radio-ios-secondary .radio-checked .radio-inner {\n  border-color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.item-radio-ios-tertiary.item-radio-checked ion-label {\n  color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.radio-ios-tertiary .radio-checked {\n  color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.radio-ios-tertiary .radio-checked .radio-inner {\n  border-color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.item-radio-ios-success.item-radio-checked ion-label {\n  color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.radio-ios-success .radio-checked {\n  color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.radio-ios-success .radio-checked .radio-inner {\n  border-color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.item-radio-ios-warning.item-radio-checked ion-label {\n  color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.radio-ios-warning .radio-checked {\n  color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.radio-ios-warning .radio-checked .radio-inner {\n  border-color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.item-radio-ios-danger.item-radio-checked ion-label {\n  color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.radio-ios-danger .radio-checked {\n  color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.radio-ios-danger .radio-checked .radio-inner {\n  border-color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.item-radio-ios-light.item-radio-checked ion-label {\n  color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.radio-ios-light .radio-checked {\n  color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.radio-ios-light .radio-checked .radio-inner {\n  border-color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.item-radio-ios-medium.item-radio-checked ion-label {\n  color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.radio-ios-medium .radio-checked {\n  color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.radio-ios-medium .radio-checked .radio-inner {\n  border-color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.item-radio-ios-dark.item-radio-checked ion-label {\n  color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}\n\n.radio-ios-dark .radio-checked {\n  color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}\n\n.radio-ios-dark .radio-checked .radio-inner {\n  border-color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "ios"; }
}
let radioButtonIds = 0;

class RadioGroup {
    constructor() {
        this.radios = [];
        /*
         * If true, the radios can be deselected. Default false.
         */
        this.allowEmptySelection = false;
        /*
         * If true, the user cannot interact with the radio group. Default false.
         */
        this.disabled = false;
    }
    disabledChanged() {
        this.setDisabled();
    }
    valueChanged() {
        // this radio group's value just changed
        // double check the button with this value is checked
        if (this.value === undefined) {
            // set to undefined
            // ensure all that are checked become unchecked
            this.radios.filter(r => r.checked).forEach(radio => {
                radio.checked = false;
            });
        }
        else {
            let hasChecked = false;
            this.radios.forEach(radio => {
                if (radio.value === this.value) {
                    if (!radio.checked && !hasChecked) {
                        // correct value for this radio
                        // but this radio isn't checked yet
                        // and we haven't found a checked yet
                        // so CHECK IT!
                        radio.checked = true;
                    }
                    else if (hasChecked && radio.checked) {
                        // somehow we've got multiple radios
                        // with the same value, but only one can be checked
                        radio.checked = false;
                    }
                    // remember we've got a checked radio button now
                    hasChecked = true;
                }
                else if (radio.checked) {
                    // this radio doesn't have the correct value
                    // and it's also checked, so let's uncheck it
                    radio.checked = false;
                }
            });
        }
        if (this.didLoad) {
            // emit the new value
            this.ionChange.emit({ value: this.value });
        }
    }
    onRadioDidLoad(ev) {
        const radio = ev.target;
        this.radios.push(radio);
        radio.name = this.name;
        if (this.value !== undefined && radio.value === this.value) {
            // this radio-group has a value and this
            // radio equals the correct radio-group value
            // so let's check this radio
            radio.checked = true;
        }
        else if (this.value === undefined && radio.checked) {
            // this radio-group does not have a value
            // but this radio is checked, so let's set the
            // radio-group's value from the checked radio
            this.value = radio.value;
        }
        else if (radio.checked) {
            // if it doesn't match one of the above cases, but the
            // radio is still checked, then we need to uncheck it
            radio.checked = false;
        }
    }
    onRadioDidUnload(ev) {
        const index = this.radios.indexOf(ev.target);
        if (index > -1) {
            this.radios.splice(index, 1);
        }
    }
    onRadioSelect(ev) {
        // ionSelect only come from the checked radio button
        this.radios.forEach(radio => {
            if (radio === ev.target) {
                if (radio.value !== this.value) {
                    this.value = radio.value;
                }
            }
            else {
                radio.checked = false;
            }
        });
    }
    componentWillLoad() {
        this.name = this.name || 'ion-rg-' + (radioGroupIds++);
    }
    componentDidLoad() {
        // Get the list header if it exists and set the id
        // this is used to set aria-labelledby
        let header = this.el.querySelector('ion-list-header');
        if (!header) {
            header = this.el.querySelector('ion-item-divider');
        }
        if (header) {
            const label = header.querySelector('ion-label');
            if (label) {
                this.labelId = label.id = this.name + '-lbl';
            }
        }
        this.setDisabled();
        this.didLoad = true;
    }
    setDisabled() {
        this.radios.forEach(radio => {
            radio.disabled = this.disabled;
        });
    }
    hostData() {
        const hostAttrs = {
            'role': 'radiogroup'
        };
        if (this.labelId) {
            hostAttrs['aria-labelledby'] = this.labelId;
        }
        return hostAttrs;
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-radio-group"; }
    static get properties() { return { "allowEmptySelection": { "type": Boolean, "attr": "allow-empty-selection" }, "disabled": { "type": Boolean, "attr": "disabled", "watchCallbacks": ["disabledChanged"] }, "el": { "elementRef": true }, "labelId": { "state": true }, "name": { "type": String, "attr": "name", "mutable": true }, "value": { "type": String, "attr": "value", "mutable": true, "watchCallbacks": ["valueChanged"] } }; }
    static get events() { return [{ "name": "ionChange", "method": "ionChange", "bubbles": true, "cancelable": true, "composed": true }]; }
}
let radioGroupIds = 0;

class SelectPopover {
    constructor() {
        this.options = [];
    }
    onSelect(ev) {
        const option = this.options.find(o => o.value === ev.target.value);
        option && option.handler && option.handler();
    }
    render() {
        return (h("ion-list", { "no-lines": this.mode === 'md' },
            this.title ? h("ion-list-header", null, this.title) : null,
            this.subTitle || this.message
                ? h("ion-item", null,
                    h("ion-label", null,
                        this.subTitle ? h("h3", null, this.subTitle) : null,
                        this.message ? h("p", null, this.message) : null))
                : null,
            h("ion-radio-group", null, this.options.map(option => h("ion-item", null,
                h("ion-label", null, option.text),
                h("ion-radio", { checked: option.checked, value: option.value, disabled: option.disabled }))))));
    }
    static get is() { return "ion-select-popover"; }
    static get host() { return { "theme": "select-popover" }; }
    static get properties() { return { "message": { "type": String, "attr": "message" }, "options": { "type": "Any", "attr": "options" }, "subTitle": { "type": String, "attr": "sub-title" }, "title": { "type": String, "attr": "title" } }; }
}

export { Item as IonItem, Label as IonLabel, List as IonList, ListHeader as IonListHeader, Radio as IonRadio, RadioGroup as IonRadioGroup, SelectPopover as IonSelectPopover };
