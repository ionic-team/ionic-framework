/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { debounce } from './chunk1.js';
import { createThemedClasses } from './chunk2.js';

class Textarea {
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
         * This Boolean attribute lets you specify that a form control should have input focus when the page loads. Defaults to `false`.
         */
        this.autofocus = false;
        /**
         * Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `0`.
         */
        this.debounce = 0;
        /**
         * If true, the user cannot interact with the textarea. Defaults to `false`.
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
        const inputEl = this.el.querySelector('textarea');
        if (inputEl.value !== this.value) {
            inputEl.value = this.value;
        }
    }
    componentDidLoad() {
        this.debounceInput();
        this.emitStyle();
    }
    emitStyle() {
        clearTimeout(this.styleTmr);
        const styles = {
            'textarea': true,
            'input': true,
            'input-disabled': this.disabled,
            'input-has-value': this.hasValue(),
            'input-has-focus': this.hasFocus()
        };
        this.styleTmr = setTimeout(() => {
            this.ionStyle.emit(styles);
        });
    }
    clearTextInput(ev) {
        this.value = '';
        this.ionInput.emit(ev);
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
    focusChange(inputHasFocus) {
        // If clearOnEdit is enabled and the input blurred but has a value, set a flag
        if (this.clearOnEdit && !inputHasFocus && this.hasValue()) {
            this.didBlurAfterEdit = true;
        }
    }
    hasFocus() {
        // check if an input has focus or not
        return this.el && (this.el.querySelector(':focus') === this.el.querySelector('textarea'));
    }
    hasValue() {
        return (this.value !== null && this.value !== undefined && this.value !== '');
    }
    render() {
        const themedClasses = createThemedClasses(this.mode, this.color, 'native-textarea');
        // TODO aria-labelledby={this.item.labelId}
        return (h("textarea", { autoCapitalize: this.autocapitalize, 
            // autoComplete={this.autocomplete}
            autoFocus: this.autofocus, disabled: this.disabled, maxLength: this.maxlength, minLength: this.minlength, name: this.name, placeholder: this.placeholder, readOnly: this.readonly, required: this.required, spellCheck: this.spellcheck, cols: this.cols, rows: this.rows, wrap: this.wrap, class: themedClasses, onBlur: this.inputBlurred.bind(this), onInput: this.inputChanged.bind(this), onFocus: this.inputFocused.bind(this), onKeyDown: this.inputKeydown.bind(this) }, this.value));
    }
    static get is() { return "ion-textarea"; }
    static get host() { return { "theme": "textarea" }; }
    static get properties() { return { "autocapitalize": { "type": String, "attr": "autocapitalize" }, "autocomplete": { "type": String, "attr": "autocomplete" }, "autofocus": { "type": Boolean, "attr": "autofocus" }, "clearOnEdit": { "type": Boolean, "attr": "clear-on-edit", "mutable": true }, "cols": { "type": Number, "attr": "cols" }, "debounce": { "type": Number, "attr": "debounce", "watchCallbacks": ["debounceInput"] }, "disabled": { "type": Boolean, "attr": "disabled", "watchCallbacks": ["disabledChanged"] }, "el": { "elementRef": true }, "maxlength": { "type": Number, "attr": "maxlength" }, "minlength": { "type": Number, "attr": "minlength" }, "name": { "type": String, "attr": "name" }, "placeholder": { "type": String, "attr": "placeholder" }, "readonly": { "type": Boolean, "attr": "readonly" }, "required": { "type": Boolean, "attr": "required" }, "rows": { "type": Number, "attr": "rows" }, "spellcheck": { "type": Boolean, "attr": "spellcheck" }, "value": { "type": String, "attr": "value", "mutable": true, "watchCallbacks": ["valueChanged"] }, "wrap": { "type": String, "attr": "wrap" } }; }
    static get events() { return [{ "name": "ionInput", "method": "ionInput", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionStyle", "method": "ionStyle", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionBlur", "method": "ionBlur", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionFocus", "method": "ionFocus", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-textarea {\n  position: relative;\n  display: block;\n  flex: 1;\n  width: 100%;\n}\n\n.item-input ion-textarea {\n  position: static;\n}\n\n.item.item-textarea {\n  align-items: stretch;\n}\n\n.native-textarea {\n  -moz-appearance: none;\n  -ms-appearance: none;\n  -webkit-appearance: none;\n  appearance: none;\n  border-radius: 0;\n  display: block;\n  flex: 1;\n  width: 92%;\n  width: calc(100% - 10px);\n  border: 0;\n  font-size: inherit;\n  background: transparent;\n}\n\n.native-textarea:active, .native-textarea:focus {\n  outline: none;\n}\n\n.native-textarea[disabled] {\n  opacity: .4;\n}\n\n.platform-mobile .native-textarea {\n  resize: none;\n}\n\n.item-input-has-focus a,\n.item-input-has-focus button,\n.item-input-has-focus textarea {\n  pointer-events: auto;\n}\n\n.textarea-cover {\n  left: 0;\n  top: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n\n.textarea[disabled] .textarea-cover {\n  pointer-events: none;\n}\n\n.native-textarea-ios {\n  margin: 11px 8px 11px 0;\n  padding: 0;\n  width: calc(100% - 8px);\n  font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Roboto\", sans-serif;\n  font-size: inherit;\n}\n\n.native-textarea-ios::-moz-placeholder {\n  color: var(--ion-placeholder-text-ios-color, var(--ion-placeholder-text-color, #999));\n}\n\n.native-textarea-ios:-ms-input-placeholder {\n  color: var(--ion-placeholder-text-ios-color, var(--ion-placeholder-text-color, #999));\n}\n\n.native-textarea-ios::-webkit-input-placeholder {\n  text-indent: 0;\n  color: var(--ion-placeholder-text-ios-color, var(--ion-placeholder-text-color, #999));\n}\n\n.item-ios.item-label-stacked .native-textarea,\n.item-ios.item-label-floating .native-textarea {\n  margin-left: 0;\n  margin-top: 8px;\n  margin-bottom: 8px;\n  width: calc(100% - 8px);\n}\n\n.item-ios.item-label-stacked .label-ios + .input + .cloned-input,\n.item-ios.item-label-floating .label-ios + .input + .cloned-input {\n  margin-left: 0;\n}\n\n.label-ios + ion-textarea .native-textarea,\n.label-ios + .input + .cloned-input {\n  margin-left: 16px;\n  width: calc(100% - (16px / 2) - 16px);\n}"; }
    static get styleMode() { return "ios"; }
}

export { Textarea as IonTextarea };
