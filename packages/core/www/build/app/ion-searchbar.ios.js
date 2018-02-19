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
    static get style() { return "ion-searchbar {\n  box-sizing: border-box;\n  position: relative;\n  display: flex;\n  align-items: center;\n  width: 100%;\n}\n\n.searchbar-icon {\n  pointer-events: none;\n}\n\n.searchbar-input-container {\n  position: relative;\n  display: block;\n  flex-shrink: 1;\n  width: 100%;\n}\n\n.searchbar-input {\n  -moz-appearance: none;\n  -ms-appearance: none;\n  -webkit-appearance: none;\n  appearance: none;\n  box-sizing: border-box;\n  display: block;\n  width: 100%;\n  border: 0;\n  font-family: inherit;\n}\n\n.searchbar-input:active, .searchbar-input:focus {\n  outline: none;\n}\n\n.searchbar-input::-webkit-search-cancel-button {\n  display: none;\n}\n\n.searchbar-clear-icon {\n  margin: 0;\n  padding: 0;\n  display: none;\n  min-height: 0;\n}\n\n.searchbar-has-value.searchbar-has-focus .searchbar-clear-icon {\n  display: block;\n}\n\n.searchbar-ios {\n  padding: 12px;\n  height: 60px;\n  font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Roboto\", sans-serif;\n  contain: strict;\n}\n\n.searchbar-ios .searchbar-input-container {\n  height: 36px;\n  contain: strict;\n}\n\n.searchbar-search-icon-ios {\n  background-position: center;\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2013%2013'><path%20fill='var(--ion-text-ios-color-step-400,%20var(--ion-text-color-step-400,%20%23666666))'%20d='M5,1c2.2,0,4,1.8,4,4S7.2,9,5,9S1,7.2,1,5S2.8,1,5,1%20M5,0C2.2,0,0,2.2,0,5s2.2,5,5,5s5-2.2,5-5S7.8,0,5,0%20L5,0z'/><line%20stroke='var(--ion-text-ios-color-step-400,%20var(--ion-text-color-step-400,%20%23666666))'%20stroke-miterlimit='10'%20x1='12.6'%20y1='12.6'%20x2='8.2'%20y2='8.2'/></svg>\");\n  margin-left: calc(50% - 60px);\n  left: 9px;\n  top: 0;\n  position: absolute;\n  width: 14px;\n  height: 100%;\n  background-repeat: no-repeat;\n  background-size: 13px;\n  contain: strict;\n}\n\n.searchbar-ios .searchbar-input {\n  padding: 0 28px;\n  border-radius: 10px;\n  height: 100%;\n  font-size: 14px;\n  font-weight: 400;\n  color: var(--ion-text-ios-color, var(--ion-text-color, #000));\n  background-color: rgba(0, 0, 0, var(--ion-alpha-ios-low, var(--ion-alpha-low, 0.1)));\n  contain: strict;\n}\n\n.searchbar-ios .searchbar-input::-moz-placeholder {\n  color: var(--ion-text-ios-color-step-400, var(--ion-text-color-step-400, #666666));\n}\n\n.searchbar-ios .searchbar-input:-ms-input-placeholder {\n  color: var(--ion-text-ios-color-step-400, var(--ion-text-color-step-400, #666666));\n}\n\n.searchbar-ios .searchbar-input::-webkit-input-placeholder {\n  text-indent: 0;\n  color: var(--ion-text-ios-color-step-400, var(--ion-text-color-step-400, #666666));\n}\n\n.searchbar-ios .searchbar-clear-icon {\n  right: 0;\n  top: 0;\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'><path%20fill='var(--ion-text-ios-color-step-400,%20var(--ion-text-color-step-400,%20%23666666))'%20d='M403.1,108.9c-81.2-81.2-212.9-81.2-294.2,0s-81.2,212.9,0,294.2c81.2,81.2,212.9,81.2,294.2,0S484.3,190.1,403.1,108.9z%20M352,340.2L340.2,352l-84.4-84.2l-84,83.8L160,339.8l84-83.8l-84-83.8l11.8-11.8l84,83.8l84.4-84.2l11.8,11.8L267.6,256L352,340.2z'/></svg>\");\n  background-position: center;\n  position: absolute;\n  width: 30px;\n  height: 100%;\n  border: 0;\n  background-color: transparent;\n  background-repeat: no-repeat;\n  background-size: 18px;\n}\n\n.searchbar-cancel-button-ios {\n  padding: 0 0 0 8px;\n  display: none;\n  flex-shrink: 0;\n  border: 0;\n  font-size: 16px;\n  color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n  background-color: transparent;\n  cursor: pointer;\n}\n\n.searchbar-left-aligned .searchbar-search-icon-ios {\n  margin-left: 0;\n}\n\n.searchbar-ios.searchbar-left-aligned .searchbar-input {\n  padding-left: 30px;\n}\n\n.searchbar-show-cancel.searchbar-has-focus .searchbar-cancel-button-ios,\n.searchbar-show-cancel.searchbar-animated .searchbar-cancel-button-ios {\n  display: block;\n}\n\n.searchbar-animated .searchbar-search-icon-ios,\n.searchbar-ios.searchbar-animated .searchbar-input {\n  transition: all 300ms ease;\n}\n\n.searchbar-animated.searchbar-has-focus .searchbar-cancel-button-ios {\n  opacity: 1;\n  pointer-events: auto;\n}\n\n.searchbar-animated .searchbar-cancel-button-ios {\n  margin-right: -100%;\n  transform: translate3d(0,  0,  0);\n  opacity: 0;\n  transition: all 300ms ease;\n  pointer-events: none;\n}\n\n.searchbar-ios-primary .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.enable-hover .searchbar-ios-primary .searchbar-cancel-button-ios:hover {\n  color: var(--ion-color-ios-primary-tint, var(--ion-color-primary-tint, #5a96ff));\n}\n\n.toolbar-ios-primary .searchbar-search-icon-ios {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2013%2013'><path%20fill='var(--ion-color-ios-primary-contrast,%20var(--ion-color-primary-contrast,%20%23fff))'%20d='M5,1c2.2,0,4,1.8,4,4S7.2,9,5,9S1,7.2,1,5S2.8,1,5,1%20M5,0C2.2,0,0,2.2,0,5s2.2,5,5,5s5-2.2,5-5S7.8,0,5,0%20L5,0z'/><line%20stroke='var(--ion-color-ios-primary-contrast,%20var(--ion-color-primary-contrast,%20%23fff))'%20stroke-miterlimit='10'%20x1='12.6'%20y1='12.6'%20x2='8.2'%20y2='8.2'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-primary .searchbar-ios .searchbar-input {\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  background: var(--ion-color-ios-primary-shade, var(--ion-color-primary-shade, #3f79e0));\n}\n\n.toolbar-ios-primary .searchbar-ios .searchbar-input::-moz-placeholder {\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-primary .searchbar-ios .searchbar-input:-ms-input-placeholder {\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-primary .searchbar-ios .searchbar-input::-webkit-input-placeholder {\n  text-indent: 0;\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-primary .searchbar-ios .searchbar-clear-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'><path%20fill='var(--ion-color-ios-primary-contrast,%20var(--ion-color-primary-contrast,%20%23fff))'%20d='M403.1,108.9c-81.2-81.2-212.9-81.2-294.2,0s-81.2,212.9,0,294.2c81.2,81.2,212.9,81.2,294.2,0S484.3,190.1,403.1,108.9z%20M352,340.2L340.2,352l-84.4-84.2l-84,83.8L160,339.8l84-83.8l-84-83.8l11.8-11.8l84,83.8l84.4-84.2l11.8,11.8L267.6,256L352,340.2z'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-primary .searchbar-ios .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-primary-contrast, var(--ion-color-primary-contrast, #fff));\n}\n\n.searchbar-ios-secondary .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.enable-hover .searchbar-ios-secondary .searchbar-cancel-button-ios:hover {\n  color: var(--ion-color-ios-secondary-tint, var(--ion-color-secondary-tint, #47df74));\n}\n\n.toolbar-ios-secondary .searchbar-search-icon-ios {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2013%2013'><path%20fill='var(--ion-color-ios-secondary-contrast,%20var(--ion-color-secondary-contrast,%20%23fff))'%20d='M5,1c2.2,0,4,1.8,4,4S7.2,9,5,9S1,7.2,1,5S2.8,1,5,1%20M5,0C2.2,0,0,2.2,0,5s2.2,5,5,5s5-2.2,5-5S7.8,0,5,0%20L5,0z'/><line%20stroke='var(--ion-color-ios-secondary-contrast,%20var(--ion-color-secondary-contrast,%20%23fff))'%20stroke-miterlimit='10'%20x1='12.6'%20y1='12.6'%20x2='8.2'%20y2='8.2'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-secondary .searchbar-ios .searchbar-input {\n  color: var(--ion-color-ios-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  background: var(--ion-color-ios-secondary-shade, var(--ion-color-secondary-shade, #2cc158));\n}\n\n.toolbar-ios-secondary .searchbar-ios .searchbar-input::-moz-placeholder {\n  color: var(--ion-color-ios-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-secondary .searchbar-ios .searchbar-input:-ms-input-placeholder {\n  color: var(--ion-color-ios-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-secondary .searchbar-ios .searchbar-input::-webkit-input-placeholder {\n  text-indent: 0;\n  color: var(--ion-color-ios-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-secondary .searchbar-ios .searchbar-clear-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'><path%20fill='var(--ion-color-ios-secondary-contrast,%20var(--ion-color-secondary-contrast,%20%23fff))'%20d='M403.1,108.9c-81.2-81.2-212.9-81.2-294.2,0s-81.2,212.9,0,294.2c81.2,81.2,212.9,81.2,294.2,0S484.3,190.1,403.1,108.9z%20M352,340.2L340.2,352l-84.4-84.2l-84,83.8L160,339.8l84-83.8l-84-83.8l11.8-11.8l84,83.8l84.4-84.2l11.8,11.8L267.6,256L352,340.2z'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-secondary .searchbar-ios .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-secondary-contrast, var(--ion-color-secondary-contrast, #fff));\n}\n\n.searchbar-ios-tertiary .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.enable-hover .searchbar-ios-tertiary .searchbar-cancel-button-ios:hover {\n  color: var(--ion-color-ios-tertiary-tint, var(--ion-color-tertiary-tint, #f5b255));\n}\n\n.toolbar-ios-tertiary .searchbar-search-icon-ios {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2013%2013'><path%20fill='var(--ion-color-ios-tertiary-contrast,%20var(--ion-color-tertiary-contrast,%20%23fff))'%20d='M5,1c2.2,0,4,1.8,4,4S7.2,9,5,9S1,7.2,1,5S2.8,1,5,1%20M5,0C2.2,0,0,2.2,0,5s2.2,5,5,5s5-2.2,5-5S7.8,0,5,0%20L5,0z'/><line%20stroke='var(--ion-color-ios-tertiary-contrast,%20var(--ion-color-tertiary-contrast,%20%23fff))'%20stroke-miterlimit='10'%20x1='12.6'%20y1='12.6'%20x2='8.2'%20y2='8.2'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-tertiary .searchbar-ios .searchbar-input {\n  color: var(--ion-color-ios-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  background: var(--ion-color-ios-tertiary-shade, var(--ion-color-tertiary-shade, #d7953a));\n}\n\n.toolbar-ios-tertiary .searchbar-ios .searchbar-input::-moz-placeholder {\n  color: var(--ion-color-ios-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-tertiary .searchbar-ios .searchbar-input:-ms-input-placeholder {\n  color: var(--ion-color-ios-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-tertiary .searchbar-ios .searchbar-input::-webkit-input-placeholder {\n  text-indent: 0;\n  color: var(--ion-color-ios-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-tertiary .searchbar-ios .searchbar-clear-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'><path%20fill='var(--ion-color-ios-tertiary-contrast,%20var(--ion-color-tertiary-contrast,%20%23fff))'%20d='M403.1,108.9c-81.2-81.2-212.9-81.2-294.2,0s-81.2,212.9,0,294.2c81.2,81.2,212.9,81.2,294.2,0S484.3,190.1,403.1,108.9z%20M352,340.2L340.2,352l-84.4-84.2l-84,83.8L160,339.8l84-83.8l-84-83.8l11.8-11.8l84,83.8l84.4-84.2l11.8,11.8L267.6,256L352,340.2z'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-tertiary .searchbar-ios .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-tertiary-contrast, var(--ion-color-tertiary-contrast, #fff));\n}\n\n.searchbar-ios-success .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.enable-hover .searchbar-ios-success .searchbar-cancel-button-ios:hover {\n  color: var(--ion-color-ios-success-tint, var(--ion-color-success-tint, #28e070));\n}\n\n.toolbar-ios-success .searchbar-search-icon-ios {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2013%2013'><path%20fill='var(--ion-color-ios-success-contrast,%20var(--ion-color-success-contrast,%20%23fff))'%20d='M5,1c2.2,0,4,1.8,4,4S7.2,9,5,9S1,7.2,1,5S2.8,1,5,1%20M5,0C2.2,0,0,2.2,0,5s2.2,5,5,5s5-2.2,5-5S7.8,0,5,0%20L5,0z'/><line%20stroke='var(--ion-color-ios-success-contrast,%20var(--ion-color-success-contrast,%20%23fff))'%20stroke-miterlimit='10'%20x1='12.6'%20y1='12.6'%20x2='8.2'%20y2='8.2'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-success .searchbar-ios .searchbar-input {\n  color: var(--ion-color-ios-success-contrast, var(--ion-color-success-contrast, #fff));\n  background: var(--ion-color-ios-success-shade, var(--ion-color-success-shade, #0ec254));\n}\n\n.toolbar-ios-success .searchbar-ios .searchbar-input::-moz-placeholder {\n  color: var(--ion-color-ios-success-contrast, var(--ion-color-success-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-success .searchbar-ios .searchbar-input:-ms-input-placeholder {\n  color: var(--ion-color-ios-success-contrast, var(--ion-color-success-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-success .searchbar-ios .searchbar-input::-webkit-input-placeholder {\n  text-indent: 0;\n  color: var(--ion-color-ios-success-contrast, var(--ion-color-success-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-success .searchbar-ios .searchbar-clear-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'><path%20fill='var(--ion-color-ios-success-contrast,%20var(--ion-color-success-contrast,%20%23fff))'%20d='M403.1,108.9c-81.2-81.2-212.9-81.2-294.2,0s-81.2,212.9,0,294.2c81.2,81.2,212.9,81.2,294.2,0S484.3,190.1,403.1,108.9z%20M352,340.2L340.2,352l-84.4-84.2l-84,83.8L160,339.8l84-83.8l-84-83.8l11.8-11.8l84,83.8l84.4-84.2l11.8,11.8L267.6,256L352,340.2z'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-success .searchbar-ios .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-success-contrast, var(--ion-color-success-contrast, #fff));\n}\n\n.searchbar-ios-warning .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.enable-hover .searchbar-ios-warning .searchbar-cancel-button-ios:hover {\n  color: var(--ion-color-ios-warning-tint, var(--ion-color-warning-tint, #ffd31a));\n}\n\n.toolbar-ios-warning .searchbar-search-icon-ios {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2013%2013'><path%20fill='var(--ion-color-ios-warning-contrast,%20var(--ion-color-warning-contrast,%20%23000))'%20d='M5,1c2.2,0,4,1.8,4,4S7.2,9,5,9S1,7.2,1,5S2.8,1,5,1%20M5,0C2.2,0,0,2.2,0,5s2.2,5,5,5s5-2.2,5-5S7.8,0,5,0%20L5,0z'/><line%20stroke='var(--ion-color-ios-warning-contrast,%20var(--ion-color-warning-contrast,%20%23000))'%20stroke-miterlimit='10'%20x1='12.6'%20y1='12.6'%20x2='8.2'%20y2='8.2'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-warning .searchbar-ios .searchbar-input {\n  color: var(--ion-color-ios-warning-contrast, var(--ion-color-warning-contrast, #000));\n  background: var(--ion-color-ios-warning-shade, var(--ion-color-warning-shade, #e0b500));\n}\n\n.toolbar-ios-warning .searchbar-ios .searchbar-input::-moz-placeholder {\n  color: var(--ion-color-ios-warning-contrast, var(--ion-color-warning-contrast, #000));\n  opacity: 0.5;\n}\n\n.toolbar-ios-warning .searchbar-ios .searchbar-input:-ms-input-placeholder {\n  color: var(--ion-color-ios-warning-contrast, var(--ion-color-warning-contrast, #000));\n  opacity: 0.5;\n}\n\n.toolbar-ios-warning .searchbar-ios .searchbar-input::-webkit-input-placeholder {\n  text-indent: 0;\n  color: var(--ion-color-ios-warning-contrast, var(--ion-color-warning-contrast, #000));\n  opacity: 0.5;\n}\n\n.toolbar-ios-warning .searchbar-ios .searchbar-clear-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'><path%20fill='var(--ion-color-ios-warning-contrast,%20var(--ion-color-warning-contrast,%20%23000))'%20d='M403.1,108.9c-81.2-81.2-212.9-81.2-294.2,0s-81.2,212.9,0,294.2c81.2,81.2,212.9,81.2,294.2,0S484.3,190.1,403.1,108.9z%20M352,340.2L340.2,352l-84.4-84.2l-84,83.8L160,339.8l84-83.8l-84-83.8l11.8-11.8l84,83.8l84.4-84.2l11.8,11.8L267.6,256L352,340.2z'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-warning .searchbar-ios .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-warning-contrast, var(--ion-color-warning-contrast, #000));\n}\n\n.searchbar-ios-danger .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.enable-hover .searchbar-ios-danger .searchbar-cancel-button-ios:hover {\n  color: var(--ion-color-ios-danger-tint, var(--ion-color-danger-tint, #f65050));\n}\n\n.toolbar-ios-danger .searchbar-search-icon-ios {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2013%2013'><path%20fill='var(--ion-color-ios-danger-contrast,%20var(--ion-color-danger-contrast,%20%23fff))'%20d='M5,1c2.2,0,4,1.8,4,4S7.2,9,5,9S1,7.2,1,5S2.8,1,5,1%20M5,0C2.2,0,0,2.2,0,5s2.2,5,5,5s5-2.2,5-5S7.8,0,5,0%20L5,0z'/><line%20stroke='var(--ion-color-ios-danger-contrast,%20var(--ion-color-danger-contrast,%20%23fff))'%20stroke-miterlimit='10'%20x1='12.6'%20y1='12.6'%20x2='8.2'%20y2='8.2'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-danger .searchbar-ios .searchbar-input {\n  color: var(--ion-color-ios-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  background: var(--ion-color-ios-danger-shade, var(--ion-color-danger-shade, #d83636));\n}\n\n.toolbar-ios-danger .searchbar-ios .searchbar-input::-moz-placeholder {\n  color: var(--ion-color-ios-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-danger .searchbar-ios .searchbar-input:-ms-input-placeholder {\n  color: var(--ion-color-ios-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-danger .searchbar-ios .searchbar-input::-webkit-input-placeholder {\n  text-indent: 0;\n  color: var(--ion-color-ios-danger-contrast, var(--ion-color-danger-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-danger .searchbar-ios .searchbar-clear-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'><path%20fill='var(--ion-color-ios-danger-contrast,%20var(--ion-color-danger-contrast,%20%23fff))'%20d='M403.1,108.9c-81.2-81.2-212.9-81.2-294.2,0s-81.2,212.9,0,294.2c81.2,81.2,212.9,81.2,294.2,0S484.3,190.1,403.1,108.9z%20M352,340.2L340.2,352l-84.4-84.2l-84,83.8L160,339.8l84-83.8l-84-83.8l11.8-11.8l84,83.8l84.4-84.2l11.8,11.8L267.6,256L352,340.2z'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-danger .searchbar-ios .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-danger-contrast, var(--ion-color-danger-contrast, #fff));\n}\n\n.searchbar-ios-light .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.enable-hover .searchbar-ios-light .searchbar-cancel-button-ios:hover {\n  color: var(--ion-color-ios-light-tint, var(--ion-color-light-tint, whitesmoke));\n}\n\n.toolbar-ios-light .searchbar-search-icon-ios {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2013%2013'><path%20fill='var(--ion-color-ios-light-contrast,%20var(--ion-color-light-contrast,%20%23000))'%20d='M5,1c2.2,0,4,1.8,4,4S7.2,9,5,9S1,7.2,1,5S2.8,1,5,1%20M5,0C2.2,0,0,2.2,0,5s2.2,5,5,5s5-2.2,5-5S7.8,0,5,0%20L5,0z'/><line%20stroke='var(--ion-color-ios-light-contrast,%20var(--ion-color-light-contrast,%20%23000))'%20stroke-miterlimit='10'%20x1='12.6'%20y1='12.6'%20x2='8.2'%20y2='8.2'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-light .searchbar-ios .searchbar-input {\n  color: var(--ion-color-ios-light-contrast, var(--ion-color-light-contrast, #000));\n  background: var(--ion-color-ios-light-shade, var(--ion-color-light-shade, #d7d7d7));\n}\n\n.toolbar-ios-light .searchbar-ios .searchbar-input::-moz-placeholder {\n  color: var(--ion-color-ios-light-contrast, var(--ion-color-light-contrast, #000));\n  opacity: 0.5;\n}\n\n.toolbar-ios-light .searchbar-ios .searchbar-input:-ms-input-placeholder {\n  color: var(--ion-color-ios-light-contrast, var(--ion-color-light-contrast, #000));\n  opacity: 0.5;\n}\n\n.toolbar-ios-light .searchbar-ios .searchbar-input::-webkit-input-placeholder {\n  text-indent: 0;\n  color: var(--ion-color-ios-light-contrast, var(--ion-color-light-contrast, #000));\n  opacity: 0.5;\n}\n\n.toolbar-ios-light .searchbar-ios .searchbar-clear-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'><path%20fill='var(--ion-color-ios-light-contrast,%20var(--ion-color-light-contrast,%20%23000))'%20d='M403.1,108.9c-81.2-81.2-212.9-81.2-294.2,0s-81.2,212.9,0,294.2c81.2,81.2,212.9,81.2,294.2,0S484.3,190.1,403.1,108.9z%20M352,340.2L340.2,352l-84.4-84.2l-84,83.8L160,339.8l84-83.8l-84-83.8l11.8-11.8l84,83.8l84.4-84.2l11.8,11.8L267.6,256L352,340.2z'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-light .searchbar-ios .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-light-contrast, var(--ion-color-light-contrast, #000));\n}\n\n.searchbar-ios-medium .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.enable-hover .searchbar-ios-medium .searchbar-cancel-button-ios:hover {\n  color: var(--ion-color-ios-medium-tint, var(--ion-color-medium-tint, #a2a4ab));\n}\n\n.toolbar-ios-medium .searchbar-search-icon-ios {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2013%2013'><path%20fill='var(--ion-color-ios-medium-contrast,%20var(--ion-color-medium-contrast,%20%23000))'%20d='M5,1c2.2,0,4,1.8,4,4S7.2,9,5,9S1,7.2,1,5S2.8,1,5,1%20M5,0C2.2,0,0,2.2,0,5s2.2,5,5,5s5-2.2,5-5S7.8,0,5,0%20L5,0z'/><line%20stroke='var(--ion-color-ios-medium-contrast,%20var(--ion-color-medium-contrast,%20%23000))'%20stroke-miterlimit='10'%20x1='12.6'%20y1='12.6'%20x2='8.2'%20y2='8.2'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-medium .searchbar-ios .searchbar-input {\n  color: var(--ion-color-ios-medium-contrast, var(--ion-color-medium-contrast, #000));\n  background: var(--ion-color-ios-medium-shade, var(--ion-color-medium-shade, #86888f));\n}\n\n.toolbar-ios-medium .searchbar-ios .searchbar-input::-moz-placeholder {\n  color: var(--ion-color-ios-medium-contrast, var(--ion-color-medium-contrast, #000));\n  opacity: 0.5;\n}\n\n.toolbar-ios-medium .searchbar-ios .searchbar-input:-ms-input-placeholder {\n  color: var(--ion-color-ios-medium-contrast, var(--ion-color-medium-contrast, #000));\n  opacity: 0.5;\n}\n\n.toolbar-ios-medium .searchbar-ios .searchbar-input::-webkit-input-placeholder {\n  text-indent: 0;\n  color: var(--ion-color-ios-medium-contrast, var(--ion-color-medium-contrast, #000));\n  opacity: 0.5;\n}\n\n.toolbar-ios-medium .searchbar-ios .searchbar-clear-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'><path%20fill='var(--ion-color-ios-medium-contrast,%20var(--ion-color-medium-contrast,%20%23000))'%20d='M403.1,108.9c-81.2-81.2-212.9-81.2-294.2,0s-81.2,212.9,0,294.2c81.2,81.2,212.9,81.2,294.2,0S484.3,190.1,403.1,108.9z%20M352,340.2L340.2,352l-84.4-84.2l-84,83.8L160,339.8l84-83.8l-84-83.8l11.8-11.8l84,83.8l84.4-84.2l11.8,11.8L267.6,256L352,340.2z'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-medium .searchbar-ios .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-medium-contrast, var(--ion-color-medium-contrast, #000));\n}\n\n.searchbar-ios-dark .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}\n\n.enable-hover .searchbar-ios-dark .searchbar-cancel-button-ios:hover {\n  color: var(--ion-color-ios-dark-tint, var(--ion-color-dark-tint, #383838));\n}\n\n.toolbar-ios-dark .searchbar-search-icon-ios {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2013%2013'><path%20fill='var(--ion-color-ios-dark-contrast,%20var(--ion-color-dark-contrast,%20%23fff))'%20d='M5,1c2.2,0,4,1.8,4,4S7.2,9,5,9S1,7.2,1,5S2.8,1,5,1%20M5,0C2.2,0,0,2.2,0,5s2.2,5,5,5s5-2.2,5-5S7.8,0,5,0%20L5,0z'/><line%20stroke='var(--ion-color-ios-dark-contrast,%20var(--ion-color-dark-contrast,%20%23fff))'%20stroke-miterlimit='10'%20x1='12.6'%20y1='12.6'%20x2='8.2'%20y2='8.2'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-dark .searchbar-ios .searchbar-input {\n  color: var(--ion-color-ios-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  background: var(--ion-color-ios-dark-shade, var(--ion-color-dark-shade, #1e1e1e));\n}\n\n.toolbar-ios-dark .searchbar-ios .searchbar-input::-moz-placeholder {\n  color: var(--ion-color-ios-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-dark .searchbar-ios .searchbar-input:-ms-input-placeholder {\n  color: var(--ion-color-ios-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-dark .searchbar-ios .searchbar-input::-webkit-input-placeholder {\n  text-indent: 0;\n  color: var(--ion-color-ios-dark-contrast, var(--ion-color-dark-contrast, #fff));\n  opacity: 0.5;\n}\n\n.toolbar-ios-dark .searchbar-ios .searchbar-clear-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'><path%20fill='var(--ion-color-ios-dark-contrast,%20var(--ion-color-dark-contrast,%20%23fff))'%20d='M403.1,108.9c-81.2-81.2-212.9-81.2-294.2,0s-81.2,212.9,0,294.2c81.2,81.2,212.9,81.2,294.2,0S484.3,190.1,403.1,108.9z%20M352,340.2L340.2,352l-84.4-84.2l-84,83.8L160,339.8l84-83.8l-84-83.8l11.8-11.8l84,83.8l84.4-84.2l11.8,11.8L267.6,256L352,340.2z'/></svg>\");\n  opacity: .5;\n}\n\n.toolbar-ios-dark .searchbar-ios .searchbar-cancel-button-ios {\n  color: var(--ion-color-ios-dark-contrast, var(--ion-color-dark-contrast, #fff));\n}"; }
    static get styleMode() { return "ios"; }
}

export { Searchbar as IonSearchbar };
