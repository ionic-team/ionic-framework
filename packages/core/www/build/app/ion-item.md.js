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
    static get style() { return "ion-item {\n  display: block;\n  contain: content;\n}\n\n.item-block {\n  margin: 0;\n  padding: 0;\n  text-align: initial;\n  display: flex;\n  overflow: hidden;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  min-height: 44px;\n  border: 0;\n  font-weight: normal;\n  line-height: normal;\n  text-decoration: none;\n  color: inherit;\n}\n\n.item-inner {\n  margin: 0;\n  padding: 0;\n  display: flex;\n  overflow: hidden;\n  flex: 1;\n  flex-direction: inherit;\n  align-items: inherit;\n  align-self: stretch;\n  min-height: inherit;\n  border: 0;\n}\n\n.input-wrapper {\n  display: flex;\n  overflow: hidden;\n  flex: 1;\n  flex-direction: inherit;\n  align-items: inherit;\n  align-self: stretch;\n  text-overflow: ellipsis;\n}\n\n.item[no-lines],\n.item.item[no-lines] .item-inner {\n  border: 0;\n}\n\nion-item-group {\n  display: block;\n}\n\n[vertical-align-top],\nion-input.item {\n  align-items: flex-start;\n}\n\n.item-cover {\n  left: 0;\n  top: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  cursor: pointer;\n}\n\n.item > ion-icon,\n.item-inner > ion-icon {\n  font-size: 1.6em;\n}\n\n.item .button {\n  margin: 0;\n}\n\n.item-disabled {\n  cursor: default;\n  opacity: .4;\n  pointer-events: none;\n}\n\n.item-md {\n  padding-left: 16px;\n  padding-right: 0;\n  position: relative;\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n  font-size: 16px;\n  font-weight: normal;\n  text-transform: none;\n  color: var(--ion-item-md-text-color, var(--ion-item-text-color, var(--ion-text-color, #000)));\n  background-color: var(--ion-item-md-background-color, var(--ion-item-background-color, var(--ion-background-color, #fff)));\n  box-shadow: none;\n  transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.item-md.activated {\n  background-color: var(--ion-item-md-background-color-active, var(--ion-item-background-color-active, #f1f1f1));\n}\n\n.item-md[no-lines] {\n  border-width: 0;\n}\n\n.item-md h1 {\n  margin: 0 0 2px;\n  font-size: 24px;\n  font-weight: normal;\n}\n\n.item-md h2 {\n  margin: 2px 0;\n  font-size: 16px;\n  font-weight: normal;\n}\n\n.item-md h3,\n.item-md h4,\n.item-md h5,\n.item-md h6 {\n  margin: 2px 0;\n  font-size: 14px;\n  font-weight: normal;\n  line-height: normal;\n}\n\n.item-md p {\n  margin: 0 0 2px;\n  overflow: inherit;\n  font-size: 14px;\n  line-height: normal;\n  text-overflow: inherit;\n  color: var(--ion-text-md-color-step-400, var(--ion-text-color-step-400, #666666));\n}\n\n.item-md.item-block .item-inner {\n  padding-right: 8px;\n  border-bottom: 1px solid var(--ion-item-md-border-color, var(--ion-item-border-color, #dedede));\n}\n\n.list-md .item-input:last-child {\n  border-bottom: 1px solid var(--ion-item-md-border-color, var(--ion-item-border-color, #dedede));\n}\n\n.item-md [slot=\"start\"],\n.item-md [slot=\"end\"] {\n  margin: 9px 8px 9px 0;\n}\n\n.item-md > ion-icon[slot=\"start\"],\n.item-md > ion-icon[slot=\"end\"] {\n  margin-left: 0;\n  margin-top: 11px;\n  margin-bottom: 10px;\n}\n\n.item-md > ion-icon[slot=\"start\"] + .item-inner,\n.item-md > ion-icon[slot=\"start\"] + .item-input {\n  margin-left: 24px;\n}\n\n.item-md ion-avatar[slot=\"start\"],\n.item-md ion-thumbnail[slot=\"start\"] {\n  margin: 8px 16px 8px 0;\n}\n\n.item-md ion-avatar[slot=\"end\"],\n.item-md ion-thumbnail[slot=\"end\"] {\n  margin: 8px;\n}\n\n.item-md.item-label-stacked [slot=\"end\"],\n.item-md.item-label-floating [slot=\"end\"] {\n  margin-top: 7px;\n  margin-bottom: 7px;\n}\n\n.item-md .button-small-md {\n  padding: 0 0.6em;\n  height: 25px;\n  font-size: 12px;\n}\n\n.item-md .button-small-md ion-icon[slot=\"icon-only\"] {\n  padding: 0;\n}\n\n.item-md ion-avatar {\n  width: 40px;\n  height: 40px;\n}\n\n.item-md ion-thumbnail {\n  width: 80px;\n  height: 80px;\n}\n\n.item-md .text-md-primary {\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.item-md-primary,\n.item-divider-md-primary {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.item-md-primary p,\n.item-divider-md-primary p {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n}\n\n.item-md-primary.activated,\n.item-divider-md-primary.activated {\n  background-color: var(--ion-color-md-primary-tint, var(--ion-color-primary-tint, #5a96ff));\n}\n\n.item-md .text-md-secondary {\n  color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.item-md-secondary,\n.item-divider-md-secondary {\n  color: var(--ion-color-md-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  background-color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.item-md-secondary p,\n.item-divider-md-secondary p {\n  color: var(--ion-color-md-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n}\n\n.item-md-secondary.activated,\n.item-divider-md-secondary.activated {\n  background-color: var(--ion-color-md-secondary-tint, var(--ion-color-secondary-tint, #47df74));\n}\n\n.item-md .text-md-tertiary {\n  color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.item-md-tertiary,\n.item-divider-md-tertiary {\n  color: var(--ion-color-md-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  background-color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.item-md-tertiary p,\n.item-divider-md-tertiary p {\n  color: var(--ion-color-md-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n}\n\n.item-md-tertiary.activated,\n.item-divider-md-tertiary.activated {\n  background-color: var(--ion-color-md-tertiary-tint, var(--ion-color-tertiary-tint, #f5b255));\n}\n\n.item-md .text-md-success {\n  color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.item-md-success,\n.item-divider-md-success {\n  color: var(--ion-color-md-success-contrast, var(--ion-color-success-contrast, #fff));\n  background-color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.item-md-success p,\n.item-divider-md-success p {\n  color: var(--ion-color-md-success-contrast, var(--ion-color-success-contrast, #fff));\n}\n\n.item-md-success.activated,\n.item-divider-md-success.activated {\n  background-color: var(--ion-color-md-success-tint, var(--ion-color-success-tint, #28e070));\n}\n\n.item-md .text-md-warning {\n  color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.item-md-warning,\n.item-divider-md-warning {\n  color: var(--ion-color-md-warning-contrast, var(--ion-color-warning-contrast, #000));\n  background-color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.item-md-warning p,\n.item-divider-md-warning p {\n  color: var(--ion-color-md-warning-contrast, var(--ion-color-warning-contrast, #000));\n}\n\n.item-md-warning.activated,\n.item-divider-md-warning.activated {\n  background-color: var(--ion-color-md-warning-tint, var(--ion-color-warning-tint, #ffd31a));\n}\n\n.item-md .text-md-danger {\n  color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.item-md-danger,\n.item-divider-md-danger {\n  color: var(--ion-color-md-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  background-color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.item-md-danger p,\n.item-divider-md-danger p {\n  color: var(--ion-color-md-danger-contrast, var(--ion-color-danger-contrast, #fff));\n}\n\n.item-md-danger.activated,\n.item-divider-md-danger.activated {\n  background-color: var(--ion-color-md-danger-tint, var(--ion-color-danger-tint, #f65050));\n}\n\n.item-md .text-md-light {\n  color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.item-md-light,\n.item-divider-md-light {\n  color: var(--ion-color-md-light-contrast, var(--ion-color-light-contrast, #000));\n  background-color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.item-md-light p,\n.item-divider-md-light p {\n  color: var(--ion-color-md-light-contrast, var(--ion-color-light-contrast, #000));\n}\n\n.item-md-light.activated,\n.item-divider-md-light.activated {\n  background-color: var(--ion-color-md-light-tint, var(--ion-color-light-tint, whitesmoke));\n}\n\n.item-md .text-md-medium {\n  color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.item-md-medium,\n.item-divider-md-medium {\n  color: var(--ion-color-md-medium-contrast, var(--ion-color-medium-contrast, #000));\n  background-color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.item-md-medium p,\n.item-divider-md-medium p {\n  color: var(--ion-color-md-medium-contrast, var(--ion-color-medium-contrast, #000));\n}\n\n.item-md-medium.activated,\n.item-divider-md-medium.activated {\n  background-color: var(--ion-color-md-medium-tint, var(--ion-color-medium-tint, #a2a4ab));\n}\n\n.item-md .text-md-dark {\n  color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}\n\n.item-md-dark,\n.item-divider-md-dark {\n  color: var(--ion-color-md-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  background-color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}\n\n.item-md-dark p,\n.item-divider-md-dark p {\n  color: var(--ion-color-md-dark-contrast, var(--ion-color-dark-contrast, #fff));\n}\n\n.item-md-dark.activated,\n.item-divider-md-dark.activated {\n  background-color: var(--ion-color-md-dark-tint, var(--ion-color-dark-tint, #383838));\n}"; }
    static get styleMode() { return "md"; }
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
    static get style() { return "ion-label {\n  margin: 0;\n  display: block;\n  overflow: hidden;\n  flex: 1;\n  font-size: inherit;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.item-input ion-label {\n  flex: initial;\n  max-width: 200px;\n  pointer-events: none;\n}\n\n[text-wrap] ion-label {\n  white-space: normal;\n}\n\nion-label[fixed] {\n  flex: 0 0 100px;\n  width: 100px;\n  min-width: 100px;\n  max-width: 200px;\n}\n\n.item-label-stacked ion-label,\n.item-label-floating ion-label {\n  align-self: stretch;\n  width: auto;\n  max-width: 100%;\n}\n\nion-label[stacked],\nion-label[floating] {\n  margin-bottom: 0;\n}\n\n.item-label-stacked .input-wrapper,\n.item-label-floating .input-wrapper {\n  flex: 1;\n  flex-direction: column;\n}\n\n.item-label-stacked ion-select,\n.item-label-floating ion-select {\n  align-self: stretch;\n  max-width: 100%;\n}\n\n.label-md {\n  margin: 13px 8px 13px 0;\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n}\n\n[text-wrap] .label-md {\n  font-size: 14px;\n  line-height: 1.5;\n}\n\n.item-input .label-md,\n.item-select .label-md,\n.item-datetime .label-md {\n  color: var(--ion-text-md-color-step-600, var(--ion-text-color-step-600, #999999));\n}\n\n.label-md[stacked] {\n  font-size: 12px;\n}\n\n.label-md[floating] {\n  transform: translate3d(0,  27px,  0);\n  transform-origin: left top;\n  transition: transform 150ms ease-in-out;\n}\n\n.label-md[stacked],\n.label-md[floating] {\n  margin-left: 0;\n  margin-bottom: 0;\n}\n\n.item-input-has-focus .label-md[stacked],\n.item-input-has-focus .label-md[floating] {\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.item-input-has-focus .label-md[floating],\n.item-input-has-value .label-md[floating] {\n  transform: translate3d(0,  0,  0) scale(0.8);\n}\n\n.label-md-primary,\n.item-input .label-md-primary,\n.item-select .label-md-primary,\n.item-datetime .label-md-primary {\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.label-md-secondary,\n.item-input .label-md-secondary,\n.item-select .label-md-secondary,\n.item-datetime .label-md-secondary {\n  color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.label-md-tertiary,\n.item-input .label-md-tertiary,\n.item-select .label-md-tertiary,\n.item-datetime .label-md-tertiary {\n  color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.label-md-success,\n.item-input .label-md-success,\n.item-select .label-md-success,\n.item-datetime .label-md-success {\n  color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.label-md-warning,\n.item-input .label-md-warning,\n.item-select .label-md-warning,\n.item-datetime .label-md-warning {\n  color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.label-md-danger,\n.item-input .label-md-danger,\n.item-select .label-md-danger,\n.item-datetime .label-md-danger {\n  color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.label-md-light,\n.item-input .label-md-light,\n.item-select .label-md-light,\n.item-datetime .label-md-light {\n  color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.label-md-medium,\n.item-input .label-md-medium,\n.item-select .label-md-medium,\n.item-datetime .label-md-medium {\n  color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.label-md-dark,\n.item-input .label-md-dark,\n.item-select .label-md-dark,\n.item-datetime .label-md-dark {\n  color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "md"; }
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
    static get style() { return "ion-list {\n  margin: 0;\n  padding: 0;\n  display: block;\n  contain: content;\n  list-style-type: none;\n}\n\nion-list[inset] {\n  overflow: hidden;\n  transform: translateZ(0);\n}\n\n.list-md {\n  margin: -1px 0 16px;\n}\n\n.list-md .item-block .item-inner {\n  border-bottom: 1px solid var(--ion-item-md-border-color, var(--ion-item-border-color, #dedede));\n}\n\n.list-md > .item-block:last-child ion-label,\n.list-md > .item-block:last-child .item-inner,\n.list-md > .item-sliding:last-child ion-label,\n.list-md > .item-sliding:last-child .item-inner {\n  border-bottom: 0;\n}\n\n.list-md > ion-input:last-child::after {\n  left: 0;\n}\n\n.list-md .item[no-lines],\n.list-md .item[no-lines] .item-inner {\n  border-width: 0;\n}\n\n.list-md + ion-list ion-list-header {\n  margin-top: -16px;\n}\n\n.list-md[inset] {\n  margin: 16px;\n  border-radius: 2px;\n}\n\n.list-md[inset] .item:first-child {\n  border-top-left-radius: 2px;\n  border-top-right-radius: 2px;\n  border-top-width: 0;\n}\n\n.list-md[inset] .item:last-child {\n  border-bottom-right-radius: 2px;\n  border-bottom-left-radius: 2px;\n  border-bottom-width: 0;\n}\n\n.list-md[inset] .item-input {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.list-md[inset] + ion-list[inset] {\n  margin-top: 0;\n}\n\n.list-md[inset] ion-list-header {\n  background-color: var(--ion-item-md-background-color, var(--ion-item-background-color, var(--ion-background-color, #fff)));\n}\n\n.list-md[no-lines] .item-block,\n.list-md[no-lines] .item .item-inner {\n  border-width: 0;\n}"; }
    static get styleMode() { return "md"; }
}

class ListHeader {
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-list-header"; }
    static get host() { return { "theme": "list-header" }; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "mode": { "type": "Any", "attr": "mode" } }; }
    static get style() { return "ion-list-header {\n  margin: 0;\n  padding: 0;\n  display: flex;\n  overflow: hidden;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  min-height: 40px;\n}\n\n.list-header-md {\n  padding-left: 16px;\n  margin-bottom: 13px;\n  min-height: 45px;\n  border-top: 1px solid var(--ion-item-md-border-color, var(--ion-item-border-color, #dedede));\n  font-size: 14px;\n  color: var(--ion-text-md-color-step-400, var(--ion-text-color-step-400, #666666));\n}\n\n.list-header-md-primary {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.list-header-md-secondary {\n  color: var(--ion-color-md-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  background-color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.list-header-md-tertiary {\n  color: var(--ion-color-md-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  background-color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.list-header-md-success {\n  color: var(--ion-color-md-success-contrast, var(--ion-color-success-contrast, #fff));\n  background-color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.list-header-md-warning {\n  color: var(--ion-color-md-warning-contrast, var(--ion-color-warning-contrast, #000));\n  background-color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.list-header-md-danger {\n  color: var(--ion-color-md-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  background-color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.list-header-md-light {\n  color: var(--ion-color-md-light-contrast, var(--ion-color-light-contrast, #000));\n  background-color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.list-header-md-medium {\n  color: var(--ion-color-md-medium-contrast, var(--ion-color-medium-contrast, #000));\n  background-color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.list-header-md-dark {\n  color: var(--ion-color-md-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  background-color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "md"; }
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
    static get style() { return "ion-radio {\n  box-sizing: border-box;\n  position: relative;\n  display: inline-block;\n}\n\nion-radio input {\n  left: 0;\n  top: 0;\n  margin: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  cursor: pointer;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\nion-radio input:active, ion-radio input:focus {\n  outline: none;\n}\n\nion-radio .radio-icon {\n  box-sizing: border-box;\n}\n\n.radio-md .radio-icon {\n  left: 0;\n  top: 0;\n  margin: 0;\n  border-radius: 50%;\n  position: relative;\n  display: block;\n  width: 16px;\n  height: 16px;\n  border-width: 2px;\n  border-style: solid;\n  border-color: var(--ion-text-md-color-step-600, var(--ion-text-color-step-600, #999999));\n  contain: layout size style;\n}\n\n.radio-md .radio-inner {\n  left: 2px;\n  top: 2px;\n  border-radius: 50%;\n  position: absolute;\n  width: 8px;\n  height: 8px;\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n  transform: scale3d(0, 0, 0);\n  transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.radio-md .radio-checked {\n  border-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.radio-md .radio-checked .radio-inner {\n  transform: scale3d(1, 1, 1);\n}\n\n.radio-md.radio-disabled,\n.item-md.item-radio-disabled ion-label {\n  opacity: 0.3;\n  pointer-events: none;\n}\n\n.radio-key .radio-icon::after {\n  border-radius: 50%;\n  left: -12px;\n  top: -12px;\n  position: absolute;\n  display: block;\n  width: 36px;\n  height: 36px;\n  background: var(--ion-color-md-primary-tint, var(--ion-color-primary-tint, #5a96ff));\n  content: \"\";\n  opacity: .2;\n}\n\n.item-md .radio-md {\n  margin: 9px 10px 9px 0;\n  position: static;\n  display: block;\n}\n\n.item-md .radio-md[slot=\"start\"] {\n  margin: 11px 36px 10px 4px;\n}\n\n.item-radio.item-md ion-label {\n  margin-left: 0;\n}\n\n.item-radio-checked.item-md ion-label {\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.item-radio-md-primary.item-radio-checked ion-label {\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.radio-md-primary .radio-checked {\n  border-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.radio-md-primary .radio-inner {\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.item-radio-md-secondary.item-radio-checked ion-label {\n  color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.radio-md-secondary .radio-checked {\n  border-color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.radio-md-secondary .radio-inner {\n  background-color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.item-radio-md-tertiary.item-radio-checked ion-label {\n  color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.radio-md-tertiary .radio-checked {\n  border-color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.radio-md-tertiary .radio-inner {\n  background-color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.item-radio-md-success.item-radio-checked ion-label {\n  color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.radio-md-success .radio-checked {\n  border-color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.radio-md-success .radio-inner {\n  background-color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.item-radio-md-warning.item-radio-checked ion-label {\n  color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.radio-md-warning .radio-checked {\n  border-color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.radio-md-warning .radio-inner {\n  background-color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.item-radio-md-danger.item-radio-checked ion-label {\n  color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.radio-md-danger .radio-checked {\n  border-color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.radio-md-danger .radio-inner {\n  background-color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.item-radio-md-light.item-radio-checked ion-label {\n  color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.radio-md-light .radio-checked {\n  border-color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.radio-md-light .radio-inner {\n  background-color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.item-radio-md-medium.item-radio-checked ion-label {\n  color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.radio-md-medium .radio-checked {\n  border-color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.radio-md-medium .radio-inner {\n  background-color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.item-radio-md-dark.item-radio-checked ion-label {\n  color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}\n\n.radio-md-dark .radio-checked {\n  border-color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}\n\n.radio-md-dark .radio-inner {\n  background-color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "md"; }
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
