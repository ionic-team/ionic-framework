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
    static get style() { return "ion-checkbox {\n  position: relative;\n  display: inline-block;\n}\n\nion-checkbox input {\n  left: 0;\n  top: 0;\n  margin: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  cursor: pointer;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\n.checkbox-md .checkbox-icon {\n  border-radius: 2px;\n  position: relative;\n  width: 16px;\n  height: 16px;\n  border-width: 2px;\n  border-style: solid;\n  border-color: var(--ion-border-md-color, var(--ion-border-color, #c1c4cd));\n  background-color: var(--ion-item-md-background-color, var(--ion-item-background-color, var(--ion-background-color, #fff)));\n  transition-duration: 280ms;\n  transition-property: background;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  contain: strict;\n}\n\n.checkbox-md .checkbox-checked {\n  border-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.checkbox-md .checkbox-checked .checkbox-inner {\n  left: 4px;\n  top: 0;\n  position: absolute;\n  width: 5px;\n  height: 10px;\n  border-width: 2px;\n  border-top-width: 0;\n  border-left-width: 0;\n  border-style: solid;\n  border-color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  transform: rotate(45deg);\n}\n\n.checkbox-md.checkbox-disabled,\n.item-md.item-checkbox-disabled ion-label {\n  opacity: 0.3;\n  pointer-events: none;\n}\n\n.checkbox-key .checkbox-icon::after {\n  border-radius: 50%;\n  left: -12px;\n  top: -12px;\n  position: absolute;\n  display: block;\n  width: 36px;\n  height: 36px;\n  background: var(--ion-color-md-primary-tint, var(--ion-color-primary-tint, #5a96ff));\n  content: \"\";\n  opacity: .2;\n}\n\n.item.item-md .checkbox-md {\n  margin: 9px 36px 9px 4px;\n  position: static;\n  display: block;\n}\n\n.item.item-md .checkbox-md[slot=\"end\"] {\n  margin: 11px 10px 10px 0;\n}\n\n.checkbox-md + .item-inner ion-label {\n  margin-left: 0;\n}\n\n.checkbox-md-primary .checkbox-checked {\n  border-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.checkbox-md-primary .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n}\n\n.checkbox-md-secondary .checkbox-checked {\n  border-color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n  background-color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.checkbox-md-secondary .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-md-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n}\n\n.checkbox-md-tertiary .checkbox-checked {\n  border-color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n  background-color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.checkbox-md-tertiary .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-md-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n}\n\n.checkbox-md-success .checkbox-checked {\n  border-color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n  background-color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.checkbox-md-success .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-md-success-contrast, var(--ion-color-success-contrast, #fff));\n}\n\n.checkbox-md-warning .checkbox-checked {\n  border-color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n  background-color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.checkbox-md-warning .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-md-warning-contrast, var(--ion-color-warning-contrast, #000));\n}\n\n.checkbox-md-danger .checkbox-checked {\n  border-color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n  background-color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.checkbox-md-danger .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-md-danger-contrast, var(--ion-color-danger-contrast, #fff));\n}\n\n.checkbox-md-light .checkbox-checked {\n  border-color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n  background-color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.checkbox-md-light .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-md-light-contrast, var(--ion-color-light-contrast, #000));\n}\n\n.checkbox-md-medium .checkbox-checked {\n  border-color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n  background-color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.checkbox-md-medium .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-md-medium-contrast, var(--ion-color-medium-contrast, #000));\n}\n\n.checkbox-md-dark .checkbox-checked {\n  border-color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n  background-color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}\n\n.checkbox-md-dark .checkbox-checked .checkbox-inner {\n  border-color: var(--ion-color-md-dark-contrast, var(--ion-color-dark-contrast, #fff));\n}"; }
    static get styleMode() { return "md"; }
}
let checkboxIds = 0;

export { Checkbox as IonCheckbox };
