/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { debounce } from './chunk1.js';
import { createThemedClasses } from './chunk2.js';

class Input {
    constructor() {
        /**
         * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Defaults to `"none"`.
         */
        this.autocapitalize = 'none';
        /**
         * Indicates whether the value of the control can be automatically completed by the browser. Defaults to `"off"`.
         */
        this.autocomplete = 'off';
        /**
         * Whether autocorrection should be enabled when the user is entering/editing the text value. Defaults to `"off"`.
         */
        this.autocorrect = 'off';
        /**
         * This Boolean attribute lets you specify that a form control should have input focus when the page loads. Defaults to `false`.
         */
        this.autofocus = false;
        /**
         * If true and the type is `checkbox` or `radio`, the control is selected by default. Defaults to `false`.
         */
        this.checked = false;
        /**
         * If true, a clear icon will appear in the input when there is a value. Clicking it clears the input. Defaults to `false`.
         */
        this.clearInput = false;
        /**
         * Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `0`.
         */
        this.debounce = 0;
        /**
         * If true, the user cannot interact with the input. Defaults to `false`.
         */
        this.disabled = false;
        /**
         * If true, the user cannot modify the value. Defaults to `false`.
         */
        this.readonly = false;
        /**
         * If true, the user must fill in a value before submitting a form.
         */
        this.required = false;
        /**
         * If true, the element will have its spelling and grammar checked. Defaults to `false`.
         */
        this.spellcheck = false;
        /**
         * The type of control to display. The default type is text. Possible values are: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, or `"url"`.
         */
        this.type = 'text';
    }
    checkedChanged() {
        this.emitStyle();
    }
    debounceInput() {
        this.ionInput.emit = debounce(this.ionInput.emit.bind(this.ionInput), this.debounce);
    }
    disabledChanged() {
        this.emitStyle();
    }
    /**
     * Update the native input element when the value changes
     */
    valueChanged() {
        const inputEl = this.el.querySelector('input');
        if (inputEl && inputEl.value !== this.value) {
            inputEl.value = this.value;
        }
    }
    componentDidLoad() {
        this.debounceInput();
        this.emitStyle();
        // By default, password inputs clear after focus when they have content
        if (this.type === 'password' && this.clearOnEdit !== false) {
            this.clearOnEdit = true;
        }
    }
    emitStyle() {
        clearTimeout(this.styleTmr);
        console.log('classes', this.el.classList);
        const styles = {
            'input': true,
            'input-checked': this.checked,
            'input-disabled': this.disabled,
            'input-has-value': this.hasValue(),
            'input-has-focus': this.hasFocus()
        };
        this.styleTmr = setTimeout(() => {
            this.ionStyle.emit(styles);
        });
    }
    inputBlurred(ev) {
        this.ionBlur.emit(ev);
        this.focusChange(this.hasFocus());
        this.emitStyle();
    }
    inputChanged(ev) {
        this.value = ev.target && ev.target.value;
        this.ionInput.emit(ev);
        this.emitStyle();
    }
    inputFocused(ev) {
        this.ionFocus.emit(ev);
        this.focusChange(this.hasFocus());
        this.emitStyle();
    }
    focusChange(inputHasFocus) {
        // If clearOnEdit is enabled and the input blurred but has a value, set a flag
        if (this.clearOnEdit && !inputHasFocus && this.hasValue()) {
            this.didBlurAfterEdit = true;
        }
    }
    inputKeydown(ev) {
        this.checkClearOnEdit(ev);
    }
    /**
     * Check if we need to clear the text input if clearOnEdit is enabled
     */
    checkClearOnEdit(ev) {
        if (!this.clearOnEdit) {
            return;
        }
        // Did the input value change after it was blurred and edited?
        if (this.didBlurAfterEdit && this.hasValue()) {
            // Clear the input
            this.clearTextInput(ev);
        }
        // Reset the flag
        this.didBlurAfterEdit = false;
    }
    clearTextInput(ev) {
        this.value = '';
        this.ionInput.emit(ev);
    }
    hasFocus() {
        // check if an input has focus or not
        return this.el && (this.el.querySelector(':focus') === this.el.querySelector('input'));
    }
    hasValue() {
        return (this.value !== null && this.value !== undefined && this.value !== '');
    }
    render() {
        const themedClasses = createThemedClasses(this.mode, this.color, 'native-input');
        // TODO aria-labelledby={this.item.labelId}
        return [
            h("input", { "aria-disabled": this.disabled ? 'true' : false, accept: this.accept, autoCapitalize: this.autocapitalize, autoComplete: this.autocomplete, autoCorrect: this.autocorrect, autoFocus: this.autofocus, checked: this.checked, class: themedClasses, disabled: this.disabled, inputMode: this.inputmode, min: this.min, max: this.max, minLength: this.minlength, maxLength: this.maxlength, multiple: this.multiple, name: this.name, pattern: this.pattern, placeholder: this.placeholder, results: this.results, readOnly: this.readonly, required: this.required, spellCheck: this.spellcheck, step: this.step, size: this.size, type: this.type, value: this.value, onBlur: this.inputBlurred.bind(this), onInput: this.inputChanged.bind(this), onFocus: this.inputFocused.bind(this), onKeyDown: this.inputKeydown.bind(this) }),
            h("button", { type: 'button', hidden: this.clearInput !== true, class: 'input-clear-icon', onClick: this.clearTextInput.bind(this), onMouseDown: this.clearTextInput.bind(this) })
        ];
    }
    static get is() { return "ion-input"; }
    static get host() { return { "theme": "input" }; }
    static get properties() { return { "accept": { "type": String, "attr": "accept" }, "autocapitalize": { "type": String, "attr": "autocapitalize" }, "autocomplete": { "type": String, "attr": "autocomplete" }, "autocorrect": { "type": String, "attr": "autocorrect" }, "autofocus": { "type": Boolean, "attr": "autofocus" }, "checked": { "type": Boolean, "attr": "checked", "watchCallbacks": ["checkedChanged"] }, "clearInput": { "type": Boolean, "attr": "clear-input" }, "clearOnEdit": { "type": Boolean, "attr": "clear-on-edit", "mutable": true }, "debounce": { "type": Number, "attr": "debounce", "watchCallbacks": ["debounceInput"] }, "disabled": { "type": Boolean, "attr": "disabled", "watchCallbacks": ["disabledChanged"] }, "el": { "elementRef": true }, "inputmode": { "type": String, "attr": "inputmode" }, "max": { "type": String, "attr": "max" }, "maxlength": { "type": Number, "attr": "maxlength" }, "min": { "type": String, "attr": "min" }, "minlength": { "type": Number, "attr": "minlength" }, "multiple": { "type": Boolean, "attr": "multiple" }, "name": { "type": String, "attr": "name" }, "pattern": { "type": String, "attr": "pattern" }, "placeholder": { "type": String, "attr": "placeholder" }, "readonly": { "type": Boolean, "attr": "readonly" }, "required": { "type": Boolean, "attr": "required" }, "results": { "type": Number, "attr": "results" }, "size": { "type": Number, "attr": "size" }, "spellcheck": { "type": Boolean, "attr": "spellcheck" }, "step": { "type": String, "attr": "step" }, "type": { "type": String, "attr": "type" }, "value": { "type": String, "attr": "value", "mutable": true, "watchCallbacks": ["valueChanged"] } }; }
    static get events() { return [{ "name": "ionInput", "method": "ionInput", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionStyle", "method": "ionStyle", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionBlur", "method": "ionBlur", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionFocus", "method": "ionFocus", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-input {\n  position: relative;\n  display: block;\n  flex: 1;\n  width: 100%;\n}\n\n.item-input ion-input {\n  position: static;\n}\n\n.native-input {\n  -moz-appearance: none;\n  -ms-appearance: none;\n  -webkit-appearance: none;\n  appearance: none;\n  border-radius: 0;\n  display: inline-block;\n  flex: 1;\n  width: 92%;\n  width: calc(100% - 10px);\n  border: 0;\n  background: transparent;\n}\n\n.native-input:active, .native-input:focus {\n  outline: none;\n}\n\n.native-input[disabled] {\n  opacity: .4;\n}\n\ninput.native-input:-webkit-autofill {\n  background-color: transparent;\n}\n\n.input-cover {\n  left: 0;\n  top: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n\n.input[disabled] .input-cover {\n  pointer-events: none;\n}\n\n.item-input-has-focus .input-cover {\n  display: none;\n}\n\n.item-input-has-focus {\n  pointer-events: none;\n}\n\n.item-input-has-focus input,\n.item-input-has-focus a,\n.item-input-has-focus button {\n  pointer-events: auto;\n}\n\n[next-input] {\n  padding: 0;\n  position: absolute;\n  bottom: 20px;\n  width: 1px;\n  height: 1px;\n  border: 0;\n  background: transparent;\n  pointer-events: none;\n}\n\n.input-clear-icon {\n  margin: 0;\n  padding: 0;\n  background-position: center;\n  position: absolute;\n  top: 0;\n  display: none;\n  height: 100%;\n  background-repeat: no-repeat;\n}\n\n.item-input-has-focus.item-input-has-value .input-clear-icon {\n  display: block;\n}\n\n.native-input-ios {\n  margin: 11px 8px 11px 0;\n  padding: 0;\n  width: calc(100% - 8px);\n  font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Roboto\", sans-serif;\n  font-size: inherit;\n}\n\n.native-input-ios::-moz-placeholder {\n  color: var(--ion-placeholder-text-ios-color, var(--ion-placeholder-text-color, #999));\n}\n\n.native-input-ios:-ms-input-placeholder {\n  color: var(--ion-placeholder-text-ios-color, var(--ion-placeholder-text-color, #999));\n}\n\n.native-input-ios::-webkit-input-placeholder {\n  text-indent: 0;\n  color: var(--ion-placeholder-text-ios-color, var(--ion-placeholder-text-color, #999));\n}\n\n.input-ios .inset-input {\n  padding: 5.5px 8px;\n  margin: 5.5px 16px 5.5px 0;\n}\n\n.item-ios.item-input.item-input-has-focus .item-inner {\n  border-bottom-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.list-ios ion-item:last-child .item-input.item-input-has-focus {\n  border-bottom-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.list-ios ion-item:last-child .item-input.item-input-has-focus .item-inner {\n  box-shadow: none;\n}\n\n.item-ios.item-input.ng-valid.item-input-has-value:not(.item-input-has-focus) .item-inner {\n  border-bottom-color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.list-ios ion-item:last-child .item-input.ng-valid.item-input-has-value:not(.item-input-has-focus) {\n  border-bottom-color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.list-ios ion-item:last-child .item-input.ng-valid.item-input-has-value:not(.item-input-has-focus) .item-inner {\n  box-shadow: none;\n}\n\n.item-ios.item-input.ng-invalid.ng-touched:not(.item-input-has-focus) .item-inner {\n  border-bottom-color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.list-ios ion-item:last-child .item-input.ng-invalid.ng-touched:not(.item-input-has-focus) {\n  border-bottom-color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.list-ios ion-item:last-child .item-input.ng-invalid.ng-touched:not(.item-input-has-focus) .item-inner {\n  box-shadow: none;\n}\n\n.item-ios.item-label-stacked .native-input,\n.item-ios.item-label-floating .native-input {\n  margin-left: 0;\n  margin-top: 8px;\n  margin-bottom: 8px;\n  width: calc(100% - 8px);\n}\n\n.item-ios.item-label-stacked .label-ios + .input + .cloned-input,\n.item-ios.item-label-floating .label-ios + .input + .cloned-input {\n  margin-left: 0;\n}\n\n.label-ios + ion-input .native-input,\n.label-ios + .input + .cloned-input {\n  margin-left: 16px;\n}\n\n.input-ios[clear-input] {\n  position: relative;\n}\n\n.input-ios[clear-input] .native-input {\n  padding-right: 46px;\n}\n\n.input-ios .input-clear-icon {\n  right: 0;\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'><path%20fill='var(--ion-text-ios-color-step-400,%20var(--ion-text-color-step-400,%20%23666666))'%20d='M403.1,108.9c-81.2-81.2-212.9-81.2-294.2,0s-81.2,212.9,0,294.2c81.2,81.2,212.9,81.2,294.2,0S484.3,190.1,403.1,108.9z%20M352,340.2L340.2,352l-84.4-84.2l-84,83.8L160,339.8l84-83.8l-84-83.8l11.8-11.8l84,83.8l84.4-84.2l11.8,11.8L267.6,256L352,340.2z'/></svg>\");\n  width: 30px;\n  background-color: transparent;\n  background-size: 18px;\n}"; }
    static get styleMode() { return "ios"; }
}

export { Input as IonInput };
