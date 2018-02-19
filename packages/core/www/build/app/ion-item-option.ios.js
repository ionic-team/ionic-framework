/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class ItemOption {
    constructor() {
        /**
         * If true, the user cannot interact with the item option. Defaults to `false`.
         */
        this.disabled = false;
        /**
         * If true, the option will expand to take up the available width and cover any other options. Defaults to `false`.
         */
        this.expandable = false;
    }
    notCaptured() {
        // if (!clickedOptionButton(ev)) {
        //   this.closeOpened();
        // }
    }
    clickedOptionButton(ev) {
        const el = ev.target.closest('ion-item-option');
        return !!el;
    }
    hostData() {
        return {
            class: {
                'item-option-expandable': this.expandable
            }
        };
    }
    render() {
        const TagType = this.href ? 'a' : 'button';
        return (h(TagType, { class: 'item-option-button', disabled: this.disabled, href: this.href, onClick: this.clickedOptionButton.bind(this) },
            h("span", { class: 'item-option-button-inner' },
                h("slot", { name: 'start' }),
                h("slot", { name: 'top' }),
                h("slot", { name: 'icon-only' }),
                h("slot", null),
                h("slot", { name: 'bottom' }),
                h("slot", { name: 'end' }))));
    }
    static get is() { return "ion-item-option"; }
    static get host() { return { "theme": "item-option" }; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "disabled": { "type": Boolean, "attr": "disabled" }, "expandable": { "type": Boolean, "attr": "expandable" }, "href": { "type": String, "attr": "href" }, "mode": { "type": "Any", "attr": "mode" } }; }
    static get style() { return ".item-option-button {\n  padding: 0 0.7em;\n  width: 100%;\n  height: 100%;\n  border: 0;\n  font-size: 1em;\n  color: inherit;\n  background: none;\n}\n\nion-item-options .item-option-button-inner {\n  flex-direction: column;\n}\n\n.item-option-button-inner {\n  display: flex;\n  flex-flow: row nowrap;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n\n.item-option-button [slot=\"icon-only\"] {\n  padding: 0;\n  min-width: .9em;\n  font-size: 1.8em;\n}\n\n.item-option-expandable {\n  flex-shrink: 0;\n  transition-duration: 0;\n  transition-property: none;\n  transition-timing-function: cubic-bezier(0.65, 0.05, 0.36, 1);\n}\n\n.item-sliding-active-swipe-right .item-options-right .item-option-expandable {\n  transition-duration: .6s;\n  transition-property: padding-left;\n  padding-left: 90%;\n  order: 1;\n}\n\n.item-sliding-active-swipe-left .item-options-left .item-option-expandable {\n  transition-duration: .6s;\n  transition-property: padding-right;\n  padding-right: 90%;\n  order: -1;\n}\n\n.item-option-ios {\n  font-size: 16px;\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.list-ios .item-options-right ion-item-option:last-child {\n  padding-right: calc(constant(safe-area-inset-right) + 0.7em);\n  padding-right: calc(env(safe-area-inset-right) + 0.7em);\n}\n\n.list-ios .item-options-left ion-item-option:first-child {\n  padding-left: calc(constant(safe-area-inset-left) + 0.7em);\n  padding-left: calc(env(safe-area-inset-left) + 0.7em);\n}\n\n.item-option-ios-primary {\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.item-option-ios-secondary {\n  color: var(--ion-color-ios-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  background-color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.item-option-ios-tertiary {\n  color: var(--ion-color-ios-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  background-color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.item-option-ios-success {\n  color: var(--ion-color-ios-success-contrast, var(--ion-color-success-contrast, #fff));\n  background-color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.item-option-ios-warning {\n  color: var(--ion-color-ios-warning-contrast, var(--ion-color-warning-contrast, #000));\n  background-color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.item-option-ios-danger {\n  color: var(--ion-color-ios-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  background-color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.item-option-ios-light {\n  color: var(--ion-color-ios-light-contrast, var(--ion-color-light-contrast, #000));\n  background-color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.item-option-ios-medium {\n  color: var(--ion-color-ios-medium-contrast, var(--ion-color-medium-contrast, #000));\n  background-color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.item-option-ios-dark {\n  color: var(--ion-color-ios-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  background-color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "ios"; }
}

export { ItemOption as IonItemOption };
