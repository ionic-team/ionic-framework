/*! Built with http://stenciljs.com */

App.defineComponents(

/**** module id ****/
'ion-searchbar',

/**** component modules ****/
function importComponent(exports, h, t, Ionic) {
var Searchbar = (function () {
    function Searchbar() {
        this._isCancelVisible = false;
        this._shouldBlur = true;
        this._shouldAlignLeft = true;
        this.activated = false;
        this.focused = false;
        //   /**
        //    * @output {event} Emitted when the Searchbar input has changed, including when it's cleared.
        //    */
        //   @Output() ionInput: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();
        //   /**
        //    * @output {event} Emitted when the cancel button is clicked.
        //    */
        //   @Output() ionCancel: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();
        //   /**
        //    * @output {event} Emitted when the clear input button is clicked.
        //    */
        //   @Output() ionClear: EventEmitter<UIEvent> = new EventEmitter<UIEvent>();
        /**
         * @input {boolean} If true, enable searchbar animation. Default `false`.
         */
        this.animated = false;
        /**
         * @input {string} Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.
         */
        this.autocomplete = 'off';
        /**
         * @input {string} Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.
         */
        this.autocorrect = 'off';
        /**
         * @input {string} Set the the cancel button text. Default: `"Cancel"`.
         */
        this.cancelButtonText = 'Cancel';
        //   _inputDebouncer: TimeoutDebouncer = new TimeoutDebouncer(0);
        //   /**
        //    * @input {number} How long, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `250`.
        //    */
        //   @Input()
        //   get debounce(): number {
        //     return this._debouncer.wait;
        //   }
        //   set debounce(val: number) {
        //     this._debouncer.wait = val;
        //     this._inputDebouncer.wait = val;
        //   }
        /**
         * @input {number} Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `250`.
         */
        this.debounce = 250;
        /**
         * @input {string} Set the input's placeholder. Default `"Search"`.
         */
        this.placeholder = 'Search';
        /**
         * @input {boolean} If true, show the cancel button. Default `false`.
         */
        this.showCancelButton = false;
        /**
         * @input {boolean} If true, enable spellcheck on the input. Default `false`.
         */
        this.spellcheck = false;
        /**
         * @input {string} Set the type of the input. Values: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, `"url"`. Default `"search"`.
         */
        this.type = 'search';
    }
    Searchbar.prototype["componentDidLoad"] = function () {
        this.positionElements();
    };
    /**
     * @hidden
     * Clears the input field and triggers the control change.
     */
    Searchbar.prototype.clearInput = function (ev) {
        var _this = this;
        Ionic.emit(this, 'ionClear', { detail: { event: ev } });
        // setTimeout() fixes https://github.com/ionic-team/ionic/issues/7527
        // wait for 4 frames
        setTimeout(function () {
            var value = _this.value;
            if (value !== undefined && value !== '') {
                _this.value = '';
                Ionic.emit(_this, 'ionInput', { detail: { event: ev } });
            }
        }, 16 * 4);
        this._shouldBlur = false;
    };
    /**
     * @hidden
     * Clears the input field and tells the input to blur since
     * the clearInput function doesn't want the input to blur
     * then calls the custom cancel function if the user passed one in.
     */
    Searchbar.prototype.cancelSearchbar = function (ev) {
        Ionic.emit(this, 'ionCancel', { detail: { event: ev } });
        this.clearInput(ev);
        this._shouldBlur = true;
        this.activated = false;
    };
    /**
     * @hidden
     * Update the Searchbar input value when the input changes
     */
    Searchbar.prototype.inputChanged = function (ev) {
        this.value = ev.target.value;
        // this._inputDebouncer.debounce(() => {
        //   this.ionInput.emit(ev);
        // });
    };
    /**
     * @hidden
     */
    Searchbar.prototype.inputUpdated = function () {
        // const inputEle = this.$el.querySelector('.searchbar-input') as HTMLInputElement;
        // It is important not to re-assign the value if it is the same, because,
        // otherwise, the caret is moved to the end of the input
        // if (inputEle && inputEle.value !== this.value) {
        //   // inputEle.value = this.value;
        //   this.value = inputEle.value;
        // }
        this.positionElements();
    };
    /**
     * @hidden
     * Sets the Searchbar to not focused and checks if it should align left
     * based on whether there is a value in the searchbar or not.
     */
    Searchbar.prototype.inputBlurred = function () {
        var inputEle = this.$el.querySelector('.searchbar-input');
        // _shouldBlur determines if it should blur
        // if we are clearing the input we still want to stay focused in the input
        if (this._shouldBlur === false) {
            inputEle.focus();
            this._shouldBlur = true;
            Ionic.emit(this, 'ionBlur', { detail: { this: this } });
            this.inputUpdated();
            return;
        }
        this.focused = false;
        this.positionElements();
    };
    /**
     * @hidden
     * Sets the Searchbar to focused and active on input focus.
     */
    Searchbar.prototype.inputFocused = function () {
        this.activated = true;
        this.focused = true;
        Ionic.emit(this, 'ionFocus', { detail: { this: this } });
        this.inputUpdated();
        this.positionElements();
    };
    /**
     * @hidden
     * Positions the input search icon, placeholder, and the cancel button
     * based on the input value and if it is focused. (ios only)
     */
    Searchbar.prototype.positionElements = function () {
        var prevAlignLeft = this._shouldAlignLeft;
        var _shouldAlignLeft = (!this.animated || (this.value && this.value.toString().trim() !== '') || this.focused === true);
        this._shouldAlignLeft = _shouldAlignLeft;
        if (this.mode !== 'ios') {
            return;
        }
        if (prevAlignLeft !== _shouldAlignLeft) {
            this.positionPlaceholder();
        }
        if (this.animated) {
            this.positionCancelButton();
        }
    };
    /**
     * @hidden
     * Positions the input placeholder
     */
    Searchbar.prototype.positionPlaceholder = function () {
        var isRTL = document.documentElement.getAttribute('dir') === 'rtl';
        var inputEle = this.$el.querySelector('.searchbar-input');
        var iconEle = this.$el.querySelector('.searchbar-search-icon');
        if (this._shouldAlignLeft) {
            inputEle.removeAttribute('style');
            iconEle.removeAttribute('style');
        }
        else {
            // Create a dummy span to get the placeholder width
            var tempSpan = document.createElement('span');
            tempSpan.innerHTML = this.placeholder;
            document.body.appendChild(tempSpan);
            // Get the width of the span then remove it
            var textWidth = tempSpan.offsetWidth;
            document.body.removeChild(tempSpan);
            // Calculate the input padding
            var inputLeft = 'calc(50% - ' + (textWidth / 2) + 'px)';
            // Calculate the icon margin
            var iconLeft = 'calc(50% - ' + ((textWidth / 2) + 30) + 'px)';
            // Set the input padding start and icon margin start
            if (isRTL) {
                inputEle.style.paddingRight = inputLeft;
                iconEle.style.marginRight = iconLeft;
            }
            else {
                inputEle.style.paddingLeft = inputLeft;
                iconEle.style.marginLeft = iconLeft;
            }
        }
    };
    /**
     * @hidden
     * Show the iOS Cancel button on focus, hide it offscreen otherwise
     */
    Searchbar.prototype.positionCancelButton = function () {
        var isRTL = document.documentElement.getAttribute('dir') === 'rtl';
        var cancelButton = this.$el.querySelector('.searchbar-ios-cancel');
        var shouldShowCancel = this.focused;
        if (shouldShowCancel !== this._isCancelVisible) {
            var cancelStyle = cancelButton.style;
            this._isCancelVisible = shouldShowCancel;
            if (shouldShowCancel) {
                if (isRTL) {
                    cancelStyle.marginLeft = '0';
                }
                else {
                    cancelStyle.marginRight = '0';
                }
            }
            else {
                var offset = cancelButton.offsetWidth;
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
    };
    Searchbar.prototype.hostData = function () {
        return {
            class: {
                'searchbar-active': this.activated,
                'searchbar-animated': this.animated,
                'searchbar-has-value': (this.value !== undefined && this.value !== ''),
                'searchbar-show-cancel': this.showCancelButton,
                'searchbar-left-aligned': this._shouldAlignLeft,
                'searchbar-has-focus': this.focused
            }
        };
    };
    Searchbar.prototype.render = function () {
        return [
            h("div", { "c": { "searchbar-input-container": true } },
                h("ion-button", { "c": { "searchbar-md-cancel": true }, "o": { "click": this.cancelSearchbar.bind(this), "mousedown": this.cancelSearchbar.bind(this) }, "a": { "mode": "md", "color": "dark" }, "p": { "clear": true } },
                    h("ion-icon", { "a": { "name": "md-arrow-back" } })),
                h("div", { "c": { "searchbar-search-icon": true } }),
                h("input", { "c": { "searchbar-input": true }, "o": { "input": this.inputChanged.bind(this), "blur": this.inputBlurred.bind(this), "focus": this.inputFocused.bind(this) }, "p": { "placeholder": this.placeholder, "type": this.type, "value": this.value, "autocomplete": this.autocomplete, "autocorrect": this.autocorrect, "spellcheck": this.spellcheck } }),
                h("ion-button", { "c": { "searchbar-clear-icon": true }, "o": { "click": this.clearInput.bind(this), "mousedown": this.clearInput.bind(this) }, "p": { "clear": true } })),
            h("ion-button", { "c": { "searchbar-ios-cancel": true }, "o": { "click": this.cancelSearchbar.bind(this), "mousedown": this.cancelSearchbar.bind(this) }, "p": { "tabindex": this.activated ? 1 : -1, "clear": true } }, this.cancelButtonText)
        ];
    };
    return Searchbar;
}());

exports['ION-SEARCHBAR'] = Searchbar;
},


/***************** ion-searchbar *****************/
[
/** ion-searchbar: [0] tag **/
'ION-SEARCHBAR',

/** ion-searchbar: [1] host **/
{"theme":"searchbar"},

/** ion-searchbar: [2] listeners **/
0 /* no listeners */,

/** ion-searchbar: [3] states **/
['activated', 'focused']

]
)