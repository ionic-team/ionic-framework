/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { getButtonClassMap, getElementClassMap } from './chunk2.js';

class ChipButton {
    constructor() {
        /**
         * If true, the user cannot interact with the chip button. Defaults to `false`.
         */
        this.disabled = false;
    }
    /**
     * Get the classes for the style
     * Chip buttons can only be clear or default (solid)
     */
    getStyleClassMap(buttonType) {
        return getColorClassMap(this.color, buttonType, this.fill || 'default', this.mode);
    }
    render() {
        const buttonType = 'chip-button';
        const hostClasses = getElementClassMap(this.el.classList);
        const TagType = this.href ? 'a' : 'button';
        const buttonClasses = Object.assign({}, hostClasses, getButtonClassMap(buttonType, this.mode), this.getStyleClassMap(buttonType));
        return (h(TagType, { class: buttonClasses, disabled: this.disabled, href: this.href },
            h("span", { class: 'chip-button-inner' },
                h("slot", null)),
            this.mode === 'md' && h("ion-ripple-effect", null)));
    }
    static get is() { return "ion-chip-button"; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "disabled": { "type": Boolean, "attr": "disabled" }, "el": { "elementRef": true }, "fill": { "type": String, "attr": "fill" }, "href": { "type": String, "attr": "href" }, "mode": { "type": "Any", "attr": "mode" } }; }
    static get style() { return ".chip-button {\n  border-radius: 50%;\n  margin: 0;\n  position: relative;\n  width: 32px;\n  height: 32px;\n  border: 0;\n}\n\n.chip-button:active, .chip-button:focus {\n  outline: none;\n}\n\n.chip-button-inner {\n  display: flex;\n  flex-flow: row nowrap;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n\n.chip-button-ios {\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.chip-button-clear-ios {\n  color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n  background-color: transparent;\n}\n\n.chip-button-ios-primary {\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.chip-ios-primary .chip-button-ios {\n  color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n  background-color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n}\n\n.chip-button-clear-ios-primary {\n  color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n  background-color: transparent;\n}\n\n.chip-ios-primary .chip-button-clear-ios {\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: transparent;\n}\n\n.chip-button-ios-secondary {\n  color: var(--ion-color-ios-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  background-color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.chip-ios-secondary .chip-button-ios {\n  color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n  background-color: var(--ion-color-ios-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n}\n\n.chip-button-clear-ios-secondary {\n  color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n  background-color: transparent;\n}\n\n.chip-ios-secondary .chip-button-clear-ios {\n  color: var(--ion-color-ios-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  background-color: transparent;\n}\n\n.chip-button-ios-tertiary {\n  color: var(--ion-color-ios-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  background-color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.chip-ios-tertiary .chip-button-ios {\n  color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n  background-color: var(--ion-color-ios-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n}\n\n.chip-button-clear-ios-tertiary {\n  color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n  background-color: transparent;\n}\n\n.chip-ios-tertiary .chip-button-clear-ios {\n  color: var(--ion-color-ios-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  background-color: transparent;\n}\n\n.chip-button-ios-success {\n  color: var(--ion-color-ios-success-contrast, var(--ion-color-success-contrast, #fff));\n  background-color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.chip-ios-success .chip-button-ios {\n  color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n  background-color: var(--ion-color-ios-success-contrast, var(--ion-color-success-contrast, #fff));\n}\n\n.chip-button-clear-ios-success {\n  color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n  background-color: transparent;\n}\n\n.chip-ios-success .chip-button-clear-ios {\n  color: var(--ion-color-ios-success-contrast, var(--ion-color-success-contrast, #fff));\n  background-color: transparent;\n}\n\n.chip-button-ios-warning {\n  color: var(--ion-color-ios-warning-contrast, var(--ion-color-warning-contrast, #000));\n  background-color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.chip-ios-warning .chip-button-ios {\n  color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n  background-color: var(--ion-color-ios-warning-contrast, var(--ion-color-warning-contrast, #000));\n}\n\n.chip-button-clear-ios-warning {\n  color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n  background-color: transparent;\n}\n\n.chip-ios-warning .chip-button-clear-ios {\n  color: var(--ion-color-ios-warning-contrast, var(--ion-color-warning-contrast, #000));\n  background-color: transparent;\n}\n\n.chip-button-ios-danger {\n  color: var(--ion-color-ios-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  background-color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.chip-ios-danger .chip-button-ios {\n  color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n  background-color: var(--ion-color-ios-danger-contrast, var(--ion-color-danger-contrast, #fff));\n}\n\n.chip-button-clear-ios-danger {\n  color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n  background-color: transparent;\n}\n\n.chip-ios-danger .chip-button-clear-ios {\n  color: var(--ion-color-ios-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  background-color: transparent;\n}\n\n.chip-button-ios-light {\n  color: var(--ion-color-ios-light-contrast, var(--ion-color-light-contrast, #000));\n  background-color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.chip-ios-light .chip-button-ios {\n  color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n  background-color: var(--ion-color-ios-light-contrast, var(--ion-color-light-contrast, #000));\n}\n\n.chip-button-clear-ios-light {\n  color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n  background-color: transparent;\n}\n\n.chip-ios-light .chip-button-clear-ios {\n  color: var(--ion-color-ios-light-contrast, var(--ion-color-light-contrast, #000));\n  background-color: transparent;\n}\n\n.chip-button-ios-medium {\n  color: var(--ion-color-ios-medium-contrast, var(--ion-color-medium-contrast, #000));\n  background-color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.chip-ios-medium .chip-button-ios {\n  color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n  background-color: var(--ion-color-ios-medium-contrast, var(--ion-color-medium-contrast, #000));\n}\n\n.chip-button-clear-ios-medium {\n  color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n  background-color: transparent;\n}\n\n.chip-ios-medium .chip-button-clear-ios {\n  color: var(--ion-color-ios-medium-contrast, var(--ion-color-medium-contrast, #000));\n  background-color: transparent;\n}\n\n.chip-button-ios-dark {\n  color: var(--ion-color-ios-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  background-color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}\n\n.chip-ios-dark .chip-button-ios {\n  color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n  background-color: var(--ion-color-ios-dark-contrast, var(--ion-color-dark-contrast, #fff));\n}\n\n.chip-button-clear-ios-dark {\n  color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n  background-color: transparent;\n}\n\n.chip-ios-dark .chip-button-clear-ios {\n  color: var(--ion-color-ios-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  background-color: transparent;\n}"; }
    static get styleMode() { return "ios"; }
}
/**
 * Get the classes for the color
 */
function getColorClassMap(color, buttonType, style, mode) {
    const className = (style === 'default') ? `${buttonType}` : `${buttonType}-${style}`;
    const map = {
        [className]: true,
        [`${className}-${mode}`]: true
    };
    if (color) {
        map[`${className}-${mode}-${color}`] = true;
    }
    return map;
}

export { ChipButton as IonChipButton };
