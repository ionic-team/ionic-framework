/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { createThemedClasses } from './chunk2.js';
import { debounce } from './chunk1.js';

class Searchbar {
    constructor() {
        this.isCancelVisible = false;
        this.shouldBlur = true;
        this.shouldAlignLeft = true;
        this.activated = false;
        this.focused = false;
        /**
         * If true, enable searchbar animation. Default `false`.
         */
        this.animated = false;
        /**
         * Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.
         */
        this.autocomplete = 'off';
        /**
         * Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.
         */
        this.autocorrect = 'off';
        /**
         * Set the the cancel button text. Default: `"Cancel"`.
         */
        this.cancelButtonText = 'Cancel';
        /**
         * Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `250`.
         */
        this.debounce = 250;
        /**
         * Set the input's placeholder. Default `"Search"`.
         */
        this.placeholder = 'Search';
        /**
         * If true, show the cancel button. Default `false`.
         */
        this.showCancelButton = false;
        /**
         * If true, enable spellcheck on the input. Default `false`.
         */
        this.spellcheck = false;
        /**
         * Set the type of the input. Values: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, `"url"`. Default `"search"`.
         */
        this.type = 'search';
    }
    debounceInput() {
        this.ionInput.emit = debounce(this.ionInput.emit.bind(this.ionInput), this.debounce);
    }
    componentDidLoad() {
        this.positionElements();
        this.debounceInput();
    }
    /**
     * Clears the input field and triggers the control change.
     */
    clearInput(ev) {
        this.ionClear.emit({ event: ev });
        // setTimeout() fixes https://github.com/ionic-team/ionic/issues/7527
        // wait for 4 frames
        setTimeout(() => {
            const value = this.value;
            if (value !== undefined && value !== '') {
                this.value = '';
                this.ionInput.emit({ event: ev });
            }
        }, 16 * 4);
        this.shouldBlur = false;
    }
    /**
     * Clears the input field and tells the input to blur since
     * the clearInput function doesn't want the input to blur
     * then calls the custom cancel function if the user passed one in.
     */
    cancelSearchbar(ev) {
        this.ionCancel.emit({ event: ev });
        this.clearInput(ev);
        this.shouldBlur = true;
        this.activated = false;
    }
    /**
     * Update the Searchbar input value when the input changes
     */
    inputChanged(ev) {
        this.value = ev.target && ev.target.value;
        this.ionInput.emit(ev);
    }
    inputUpdated() {
        // const inputEl = this.el.querySelector('.searchbar-input') as HTMLInputElment;
        // It is important not to re-assign the value if it is the same, because,
        // otherwise, the caret is moved to the end of the input
        // if (inputEl && inputEl.value !== this.value) {
        //   // inputEl.value = this.value;
        //   this.value = inputEl.value;
        // }
        this.positionElements();
    }
    /**
     * Sets the Searchbar to not focused and checks if it should align left
     * based on whether there is a value in the searchbar or not.
     */
    inputBlurred() {
        const inputEl = this.el.querySelector('.searchbar-input');
        // shouldBlur determines if it should blur
        // if we are clearing the input we still want to stay focused in the input
        if (this.shouldBlur === false) {
            inputEl.focus();
            this.shouldBlur = true;
            this.ionBlur.emit({ this: this });
            this.inputUpdated();
            return;
        }
        this.focused = false;
        this.positionElements();
    }
    /**
     * Sets the Searchbar to focused and active on input focus.
     */
    inputFocused() {
        this.activated = true;
        this.focused = true;
        this.ionFocus.emit({ this: this });
        this.inputUpdated();
        this.positionElements();
    }
    /**
     * Positions the input search icon, placeholder, and the cancel button
     * based on the input value and if it is focused. (ios only)
     */
    positionElements() {
        const prevAlignLeft = this.shouldAlignLeft;
        const shouldAlignLeft = (!this.animated || (this.value && this.value.toString().trim() !== '') || this.focused === true);
        this.shouldAlignLeft = shouldAlignLeft;
        if (this.mode !== 'ios') {
            return;
        }
        if (prevAlignLeft !== shouldAlignLeft) {
            this.positionPlaceholder();
        }
        if (this.animated) {
            this.positionCancelButton();
        }
    }
    /**
     * Positions the input placeholder
     */
    positionPlaceholder() {
        const isRTL = document.dir === 'rtl';
        const inputEl = this.el.querySelector('.searchbar-input');
        const iconEl = this.el.querySelector('.searchbar-search-icon');
        if (this.shouldAlignLeft) {
            inputEl.removeAttribute('style');
            iconEl.removeAttribute('style');
        }
        else {
            // Create a dummy span to get the placeholder width
            const tempSpan = document.createElement('span');
            tempSpan.innerHTML = this.placeholder;
            document.body.appendChild(tempSpan);
            // Get the width of the span then remove it
            const textWidth = tempSpan.offsetWidth;
            document.body.removeChild(tempSpan);
            // Calculate the input padding
            const inputLeft = 'calc(50% - ' + (textWidth / 2) + 'px)';
            // Calculate the icon margin
            const iconLeft = 'calc(50% - ' + ((textWidth / 2) + 30) + 'px)';
            // Set the input padding start and icon margin start
            if (isRTL) {
                inputEl.style.paddingRight = inputLeft;
                iconEl.style.marginRight = iconLeft;
            }
            else {
                inputEl.style.paddingLeft = inputLeft;
                iconEl.style.marginLeft = iconLeft;
            }
        }
    }
    /**
     * Show the iOS Cancel button on focus, hide it offscreen otherwise
     */
    positionCancelButton() {
        const isRTL = document.dir === 'rtl';
        const cancelButton = this.el.querySelector('.searchbar-cancel-button-ios');
        const shouldShowCancel = this.focused;
        if (shouldShowCancel !== this.isCancelVisible) {
            const cancelStyle = cancelButton.style;
            this.isCancelVisible = shouldShowCancel;
            if (shouldShowCancel) {
                if (isRTL) {
                    cancelStyle.marginLeft = '0';
                }
                else {
                    cancelStyle.marginRight = '0';
                }
            }
            else {
                const offset = cancelButton.offsetWidth;
                if (offset > 0) {
                    if (isRTL) {
                        cancelStyle.marginLeft = -offset + 'px';
                    }
                    else {
                        cancelStyle.marginRight = -offset + 'px';
                    }
                }
            }
        }
    }
    hostData() {
        return {
            class: {
                'searchbar-active': this.activated,
                'searchbar-animated': this.animated,
                'searchbar-has-value': (this.value !== undefined && this.value !== ''),
                'searchbar-show-cancel': this.showCancelButton,
                'searchbar-left-aligned': this.shouldAlignLeft,
                'searchbar-has-focus': this.focused
            }
        };
    }
    render() {
        const cancelButtonClasses = createThemedClasses(this.mode, this.color, 'searchbar-cancel-button');
        const searchIconClasses = createThemedClasses(this.mode, this.color, 'searchbar-search-icon');
        const cancelButton = this.showCancelButton
            ? h("button", { type: 'button', tabindex: this.mode === 'ios' && !this.activated ? -1 : null, onClick: this.cancelSearchbar.bind(this), onMouseDown: this.cancelSearchbar.bind(this), class: cancelButtonClasses }, this.mode === 'md'
                ? h("ion-icon", { name: 'md-arrow-back' })
                : this.cancelButtonText)
            : null;
        const searchbar = [
            h("div", { class: 'searchbar-input-container' },
                this.mode === 'md' ? cancelButton : null,
                h("div", { class: searchIconClasses }),
                h("input", { class: 'searchbar-input', onInput: this.inputChanged.bind(this), onBlur: this.inputBlurred.bind(this), onFocus: this.inputFocused.bind(this), placeholder: this.placeholder, type: this.type, value: this.value, autoComplete: this.autocomplete, autoCorrect: this.autocorrect, spellCheck: this.spellcheck }),
                h("button", { type: 'button', class: 'searchbar-clear-icon', onClick: this.clearInput.bind(this), onMouseDown: this.clearInput.bind(this) }))
        ];
        if (this.mode === 'ios') {
            searchbar.push(cancelButton);
        }
        return searchbar;
    }
    static get is() { return "ion-searchbar"; }
    static get host() { return { "theme": "searchbar" }; }
    static get properties() { return { "activated": { "state": true }, "animated": { "type": Boolean, "attr": "animated" }, "autocomplete": { "type": String, "attr": "autocomplete" }, "autocorrect": { "type": String, "attr": "autocorrect" }, "cancelButtonText": { "type": String, "attr": "cancel-button-text" }, "color": { "type": String, "attr": "color" }, "debounce": { "type": Number, "attr": "debounce", "watchCallbacks": ["debounceInput"] }, "el": { "elementRef": true }, "focused": { "state": true }, "mode": { "type": "Any", "attr": "mode" }, "placeholder": { "type": String, "attr": "placeholder" }, "showCancelButton": { "type": Boolean, "attr": "show-cancel-button" }, "spellcheck": { "type": Boolean, "attr": "spellcheck" }, "type": { "type": String, "attr": "type" }, "value": { "type": String, "attr": "value", "mutable": true } }; }
    static get events() { return [{ "name": "ionInput", "method": "ionInput", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionCancel", "method": "ionCancel", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionClear", "method": "ionClear", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionBlur", "method": "ionBlur", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionFocus", "method": "ionFocus", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-searchbar {\n  box-sizing: border-box;\n  position: relative;\n  display: flex;\n  align-items: center;\n  width: 100%;\n}\n\n.searchbar-icon {\n  pointer-events: none;\n}\n\n.searchbar-input-container {\n  position: relative;\n  display: block;\n  flex-shrink: 1;\n  width: 100%;\n}\n\n.searchbar-input {\n  -moz-appearance: none;\n  -ms-appearance: none;\n  -webkit-appearance: none;\n  appearance: none;\n  box-sizing: border-box;\n  display: block;\n  width: 100%;\n  border: 0;\n  font-family: inherit;\n}\n\n.searchbar-input:active, .searchbar-input:focus {\n  outline: none;\n}\n\n.searchbar-input::-webkit-search-cancel-button {\n  display: none;\n}\n\n.searchbar-clear-icon {\n  margin: 0;\n  padding: 0;\n  display: none;\n  min-height: 0;\n}\n\n.searchbar-has-value.searchbar-has-focus .searchbar-clear-icon {\n  display: block;\n}\n\n.searchbar-md {\n  padding: 8px;\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n  background: inherit;\n}\n\n.searchbar-search-icon-md {\n  left: 16px;\n  top: 11px;\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'><path%20fill='var(--ion-text-md-color-step-400,%20var(--ion-text-color-step-400,%20%23666666))'%20d='M337.509,305.372h-17.501l-6.571-5.486c20.791-25.232,33.922-57.054,33.922-93.257C347.358,127.632,283.896,64,205.135,64C127.452,64,64,127.632,64,206.629s63.452,142.628,142.225,142.628c35.011,0,67.831-13.167,92.991-34.008l6.561,5.487v17.551L415.18,448L448,415.086L337.509,305.372z%20M206.225,305.372c-54.702,0-98.463-43.887-98.463-98.743c0-54.858,43.761-98.742,98.463-98.742c54.7,0,98.462,43.884,98.462,98.742C304.687,261.485,260.925,305.372,206.225,305.372z'/></svg>\");\n  width: 21px;\n  height: 21px;\n}\n\n.searchbar-cancel-button-md {\n  left: 10px;\n  top: 0;\n  margin: 0;\n  display: none;\n  height: 100%;\n  border: 0;\n  font-size: 1.8em;\n  color: var(--ion-text-md-color-step-100, var(--ion-text-color-step-100, #1a1a1a));\n  background-color: transparent;\n}\n\n.searchbar-search-icon-md,\n.searchbar-cancel-button-md {\n  position: absolute;\n  background-repeat: no-repeat;\n  background-size: 20px;\n}\n\n.searchbar-search-icon-md.activated,\n.searchbar-cancel-button-md.activated {\n  background-color: transparent;\n}\n\n.searchbar-md .searchbar-input {\n  padding: 6px 55px;\n  border-radius: 2px;\n  background-position: left 8px center;\n  height: auto;\n  font-size: 16px;\n  font-weight: 400;\n  line-height: 30px;\n  color: var(--ion-text-md-color-step-150, var(--ion-text-color-step-150, #262626));\n  background-color: var(--ion-background-md-color, var(--ion-background-color, #fff));\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n}\n\n.searchbar-md .searchbar-input::-moz-placeholder {\n  color: var(--ion-placeholder-text-md-color, var(--ion-placeholder-text-color, #999));\n}\n\n.searchbar-md .searchbar-input:-ms-input-placeholder {\n  color: var(--ion-placeholder-text-md-color, var(--ion-placeholder-text-color, #999));\n}\n\n.searchbar-md .searchbar-input::-webkit-input-placeholder {\n  text-indent: 0;\n  color: var(--ion-placeholder-text-md-color, var(--ion-placeholder-text-color, #999));\n}\n\n.searchbar-md .searchbar-clear-icon {\n  right: 13px;\n  top: 0;\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'><polygon%20fill='var(--ion-text-md-color-step-400,%20var(--ion-text-color-step-400,%20%23666666))'%20points='405,136.798%20375.202,107%20256,226.202%20136.798,107%20107,136.798%20226.202,256%20107,375.202%20136.798,405%20256,285.798%20375.202,405%20405,375.202%20285.798,256'/></svg>\");\n  padding: 0;\n  background-position: center;\n  position: absolute;\n  width: 22px;\n  height: 100%;\n  border: 0;\n  background-color: transparent;\n  background-repeat: no-repeat;\n  background-size: 22px;\n}\n\n.searchbar-md .searchbar-clear-icon.activated {\n  background-color: transparent;\n}\n\n.searchbar-has-focus.searchbar-show-cancel .searchbar-search-icon-md {\n  display: none;\n}\n\n.searchbar-has-focus.searchbar-show-cancel .searchbar-cancel-button-md {\n  display: inline-flex;\n}\n\n.toolbar .searchbar-md {\n  padding: 3px;\n}"; }
    static get styleMode() { return "md"; }
}

export { Searchbar as IonSearchbar };
