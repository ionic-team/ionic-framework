/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { debounce } from './chunk1.js';

class Checkbox {
    constructor() {
        /**
         * If true, the checkbox is selected. Defaults to `false`.
         */
        this.checked = false;
        /**
         * If true, the user cannot interact with the checkbox. Defaults to `false`.
         */
        this.disabled = false;
        /**
         * the value of the checkbox.
         */
        this.value = 'on';
    }
    componentWillLoad() {
        this.inputId = `ion-cb-${checkboxIds++}`;
        if (this.name === undefined) {
            this.name = this.inputId;
        }
        this.emitStyle();
    }
    componentDidLoad() {
        this.ionStyle.emit = debounce(this.ionStyle.emit.bind(this.ionStyle));
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
    checkedChanged(isChecked) {
        if (this.didLoad) {
            this.ionChange.emit({
                checked: isChecked,
                value: this.value
            });
        }
        this.emitStyle();
    }
    emitStyle() {
        this.ionStyle.emit({
            'checkbox-disabled': this.disabled,
            'checkbox-checked': this.checked,
        });
    }
    onChange() {
        this.checked = !this.checked;
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
        return {
            class: {
                'checkbox-checked': this.checked,
                'checkbox-disabled': this.disabled,
                'checkbox-key': this.keyFocus
            }
        };
    }
    render() {
        const checkboxClasses = {
            'checkbox-icon': true,
            'checkbox-checked': this.checked
        };
        return [
            h("div", { class: checkboxClasses },
                h("div", { class: 'checkbox-inner' })),
            h("input", { type: 'checkbox', onChange: this.onChange.bind(this), onFocus: this.onFocus.bind(this), onBlur: this.onBlur.bind(this), onKeyUp: this.onKeyUp.bind(this), checked: this.checked, id: this.inputId, name: this.name, value: this.value, disabled: this.disabled, ref: r => this.nativeInput = r })
        ];
    }
    static get is() { return "ion-checkbox"; }
    static get host() { return { "theme": "checkbox" }; }
    static get properties() { return { "checked": { "type": Boolean, "attr": "checked", "mutable": true, "watchCallbacks": ["checkedChanged"] }, "color": { "type": String, "attr": "color" }, "disabled": { "type": Boolean, "attr": "disabled", "watchCallbacks": ["emitStyle"] }, "keyFocus": { "state": true }, "mode": { "type": "Any", "attr": "mode" }, "name": { "type": String, "attr": "name", "mutable": true }, "value": { "type": String, "attr": "value" } }; }
    static get events() { return [{ "name": "ionChange", "method": "ionChange", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionFocus", "method": "ionFocus", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionBlur", "method": "ionBlur", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionStyle", "method": "ionStyle", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-checkbox {\n  position: relative;\n  display: inline-block;\n}\n\nion-checkbox input {\n  left: 0;\n  top: 0;\n  margin: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  cursor: pointer;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\n.checkbox-ios .checkbox-icon {\n  border-radius: 50%;\n  position: relative;\n  width: 21px;\n  height: 21px;\n  border-width: 1px;\n  border-style: solid;\n  border-color: var(--ion-item-ios-border-color, var(--ion-item-border-color, #c8c7cc));\n  background-color: var(--ion-item-ios-background-color, var(--ion-background-ios-color, var(--ion-background-color, #fff)));\n  contain: strict;\n}\n\n.checkbox-ios .checkbox-checked {\n  border-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n  background-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.checkbox-ios .checkbox-checked .checkbox-inner {\n  left: 7px;\n  top: 4px;\n  position: absolute;\n  width: 4px;\n  height: 9px;\n  border-width: 1px;\n  border-top-width: 0;\n  border-left-width: 0;\n  border-style: solid;\n  border-color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  transform: rotate(45deg);\n}\n\n.checkbox-ios.checkbox-disabled,\n.item-ios.item-checkbox-disabled ion-label {\n  opacity: 0.3;\n  pointer-events: none;\n}\n\n.checkbox-key .checkbox-icon::after {\n  border-radius: 50%;\n  left: -9px;\n  top: -9px;\n  position: absolute;\n  display: block;\n  width: 36px;\n  height: 36px;\n  background: var(--ion-color-ios-primary-tint, var(--ion-color-primary-tint, #5a96ff));\n  content: \"\";\n  opacity: .2;\n}\n\n.item.item-ios .checkbox-ios {\n  margin: 8px 16px 8px 2px;\n  position: static;\n  display: block;\n}\n\n.item.item-ios .checkbox-ios[slot=\"end\"] {\n  margin: 10px 8px 9px 0;\n}\n\n.checkbox-ios-primary .checkbox-checked {\n  border-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n  background-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.checkbox-ios-primary .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n}\n\n.checkbox-ios-secondary .checkbox-checked {\n  border-color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n  background-color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.checkbox-ios-secondary .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-ios-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n}\n\n.checkbox-ios-tertiary .checkbox-checked {\n  border-color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n  background-color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.checkbox-ios-tertiary .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-ios-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n}\n\n.checkbox-ios-success .checkbox-checked {\n  border-color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n  background-color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.checkbox-ios-success .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-ios-success-contrast, var(--ion-color-success-contrast, #fff));\n}\n\n.checkbox-ios-warning .checkbox-checked {\n  border-color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n  background-color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.checkbox-ios-warning .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-ios-warning-contrast, var(--ion-color-warning-contrast, #000));\n}\n\n.checkbox-ios-danger .checkbox-checked {\n  border-color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n  background-color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.checkbox-ios-danger .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-ios-danger-contrast, var(--ion-color-danger-contrast, #fff));\n}\n\n.checkbox-ios-light .checkbox-checked {\n  border-color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n  background-color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.checkbox-ios-light .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-ios-light-contrast, var(--ion-color-light-contrast, #000));\n}\n\n.checkbox-ios-medium .checkbox-checked {\n  border-color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n  background-color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.checkbox-ios-medium .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-ios-medium-contrast, var(--ion-color-medium-contrast, #000));\n}\n\n.checkbox-ios-dark .checkbox-checked {\n  border-color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n  background-color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}\n\n.checkbox-ios-dark .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-ios-dark-contrast, var(--ion-color-dark-contrast, #fff));\n}"; }
    static get styleMode() { return "ios"; }
}
let checkboxIds = 0;

export { Checkbox as IonCheckbox };
