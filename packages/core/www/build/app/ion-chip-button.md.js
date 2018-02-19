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
    static get style() { return ".chip-button {\n  border-radius: 50%;\n  margin: 0;\n  position: relative;\n  width: 32px;\n  height: 32px;\n  border: 0;\n}\n\n.chip-button:active, .chip-button:focus {\n  outline: none;\n}\n\n.chip-button-inner {\n  display: flex;\n  flex-flow: row nowrap;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n\n.chip-button-md {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.chip-button-clear-md {\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n  background-color: transparent;\n}\n\n.chip-button-md-primary {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.chip-md-primary .chip-button-md {\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n  background-color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n}\n\n.chip-button-clear-md-primary {\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n  background-color: transparent;\n}\n\n.chip-md-primary .chip-button-clear-md {\n  color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background-color: transparent;\n}\n\n.chip-button-md-secondary {\n  color: var(--ion-color-md-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  background-color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.chip-md-secondary .chip-button-md {\n  color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n  background-color: var(--ion-color-md-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n}\n\n.chip-button-clear-md-secondary {\n  color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n  background-color: transparent;\n}\n\n.chip-md-secondary .chip-button-clear-md {\n  color: var(--ion-color-md-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  background-color: transparent;\n}\n\n.chip-button-md-tertiary {\n  color: var(--ion-color-md-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  background-color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.chip-md-tertiary .chip-button-md {\n  color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n  background-color: var(--ion-color-md-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n}\n\n.chip-button-clear-md-tertiary {\n  color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n  background-color: transparent;\n}\n\n.chip-md-tertiary .chip-button-clear-md {\n  color: var(--ion-color-md-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  background-color: transparent;\n}\n\n.chip-button-md-success {\n  color: var(--ion-color-md-success-contrast, var(--ion-color-success-contrast, #fff));\n  background-color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.chip-md-success .chip-button-md {\n  color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n  background-color: var(--ion-color-md-success-contrast, var(--ion-color-success-contrast, #fff));\n}\n\n.chip-button-clear-md-success {\n  color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n  background-color: transparent;\n}\n\n.chip-md-success .chip-button-clear-md {\n  color: var(--ion-color-md-success-contrast, var(--ion-color-success-contrast, #fff));\n  background-color: transparent;\n}\n\n.chip-button-md-warning {\n  color: var(--ion-color-md-warning-contrast, var(--ion-color-warning-contrast, #000));\n  background-color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.chip-md-warning .chip-button-md {\n  color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n  background-color: var(--ion-color-md-warning-contrast, var(--ion-color-warning-contrast, #000));\n}\n\n.chip-button-clear-md-warning {\n  color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n  background-color: transparent;\n}\n\n.chip-md-warning .chip-button-clear-md {\n  color: var(--ion-color-md-warning-contrast, var(--ion-color-warning-contrast, #000));\n  background-color: transparent;\n}\n\n.chip-button-md-danger {\n  color: var(--ion-color-md-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  background-color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.chip-md-danger .chip-button-md {\n  color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n  background-color: var(--ion-color-md-danger-contrast, var(--ion-color-danger-contrast, #fff));\n}\n\n.chip-button-clear-md-danger {\n  color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n  background-color: transparent;\n}\n\n.chip-md-danger .chip-button-clear-md {\n  color: var(--ion-color-md-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  background-color: transparent;\n}\n\n.chip-button-md-light {\n  color: var(--ion-color-md-light-contrast, var(--ion-color-light-contrast, #000));\n  background-color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.chip-md-light .chip-button-md {\n  color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n  background-color: var(--ion-color-md-light-contrast, var(--ion-color-light-contrast, #000));\n}\n\n.chip-button-clear-md-light {\n  color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n  background-color: transparent;\n}\n\n.chip-md-light .chip-button-clear-md {\n  color: var(--ion-color-md-light-contrast, var(--ion-color-light-contrast, #000));\n  background-color: transparent;\n}\n\n.chip-button-md-medium {\n  color: var(--ion-color-md-medium-contrast, var(--ion-color-medium-contrast, #000));\n  background-color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.chip-md-medium .chip-button-md {\n  color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n  background-color: var(--ion-color-md-medium-contrast, var(--ion-color-medium-contrast, #000));\n}\n\n.chip-button-clear-md-medium {\n  color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n  background-color: transparent;\n}\n\n.chip-md-medium .chip-button-clear-md {\n  color: var(--ion-color-md-medium-contrast, var(--ion-color-medium-contrast, #000));\n  background-color: transparent;\n}\n\n.chip-button-md-dark {\n  color: var(--ion-color-md-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  background-color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}\n\n.chip-md-dark .chip-button-md {\n  color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n  background-color: var(--ion-color-md-dark-contrast, var(--ion-color-dark-contrast, #fff));\n}\n\n.chip-button-clear-md-dark {\n  color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n  background-color: transparent;\n}\n\n.chip-md-dark .chip-button-clear-md {\n  color: var(--ion-color-md-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  background-color: transparent;\n}"; }
    static get styleMode() { return "md"; }
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
