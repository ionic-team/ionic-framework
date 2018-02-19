/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class InfiniteScroll {
    constructor() {
        this.thrPx = 0;
        this.thrPc = 0;
        this.scrollEl = null;
        this.didFire = false;
        this.isBusy = false;
        this.init = false;
        this.isLoading = false;
        /**
         * The threshold distance from the bottom
         * of the content to call the `infinite` output event when scrolled.
         * The threshold value can be either a percent, or
         * in pixels. For example, use the value of `10%` for the `infinite`
         * output event to get called when the user has scrolled 10%
         * from the bottom of the page. Use the value `100px` when the
         * scroll is within 100 pixels from the bottom of the page.
         * Defaults to `15%`.
         */
        this.threshold = '15%';
        /**
         * If true, the infinite scroll will be hidden and scroll event listeners
         * will be removed.
         *
         * Call `enable(false)` to disable the infinite scroll from actively
         * trying to receive new data while scrolling. This method is useful
         * when it is known that there is no more data that can be added, and
         * the infinite scroll is no longer needed.
         */
        this.disabled = false;
        /**
         * The position of the infinite scroll element.
         * The value can be either `top` or `bottom`.
         * Defaults to `bottom`.
         */
        this.position = "bottom" /* Bottom */;
    }
    thresholdChanged(val) {
        if (val.lastIndexOf('%') > -1) {
            this.thrPx = 0;
            this.thrPc = (parseFloat(val) / 100);
        }
        else {
            this.thrPx = parseFloat(val);
            this.thrPc = 0;
        }
    }
    disabledChanged(val) {
        this.enableScrollEvents(!val);
    }
    componentWillLoad() {
        const scrollEl = this.el.closest('ion-scroll');
        return scrollEl.componentOnReady().then((el) => {
            this.scrollEl = el;
        });
    }
    componentDidLoad() {
        if (this.init) {
            console.warn('instance was already initialized');
            return;
        }
        this.init = true;
        this.thresholdChanged(this.threshold);
        this.enableScrollEvents(!this.disabled);
        if (this.position === "top" /* Top */) {
            this.dom.write(() => this.scrollEl && this.scrollEl.scrollToBottom(0));
        }
    }
    componentDidUnload() {
        this.scrollEl = null;
    }
    onScroll(ev) {
        const scrollEl = this.scrollEl;
        const detail = ev.detail;
        if (!scrollEl || !this.canStart()) {
            return 1;
        }
        const infiniteHeight = this.el.offsetHeight;
        if (!infiniteHeight) {
            // if there is no height of this element then do nothing
            return 2;
        }
        const scrollTop = detail.scrollTop;
        const scrollHeight = scrollEl.scrollHeight;
        const height = scrollEl.offsetHeight;
        const threshold = this.thrPc ? (height * this.thrPc) : this.thrPx;
        const distanceFromInfinite = (this.position === "bottom" /* Bottom */)
            ? scrollHeight - infiniteHeight - scrollTop - threshold - height
            : scrollTop - infiniteHeight - threshold;
        if (distanceFromInfinite < 0) {
            if (!this.didFire) {
                this.isLoading = true;
                this.didFire = true;
                this.ionInfinite.emit(this);
                return 3;
            }
        }
        else {
            this.didFire = false;
        }
        return 4;
    }
    /**
     * Call `complete()` within the `infinite` output event handler when
     * your async operation has completed. For example, the `loading`
     * state is while the app is performing an asynchronous operation,
     * such as receiving more data from an AJAX request to add more items
     * to a data list. Once the data has been received and UI updated, you
     * then call this method to signify that the loading has completed.
     * This method will change the infinite scroll's state from `loading`
     * to `enabled`.
     */
    complete() {
        const scrollEl = this.scrollEl;
        if (!this.isLoading || !scrollEl) {
            return;
        }
        this.isLoading = false;
        if (this.position === "top" /* Top */) {
            /**
             * New content is being added at the top, but the scrollTop position stays the same,
             * which causes a scroll jump visually. This algorithm makes sure to prevent this.
             * (Frame 1)
             *    - complete() is called, but the UI hasn't had time to update yet.
             *    - Save the current content dimensions.
             *    - Wait for the next frame using _dom.read, so the UI will be updated.
             * (Frame 2)
             *    - Read the new content dimensions.
             *    - Calculate the height difference and the new scroll position.
             *    - Delay the scroll position change until other possible dom reads are done using _dom.write to be performant.
             * (Still frame 2, if I'm correct)
             *    - Change the scroll position (= visually maintain the scroll position).
             *    - Change the state to re-enable the InfiniteScroll.
             *    - This should be after changing the scroll position, or it could
             *    cause the InfiniteScroll to be triggered again immediately.
             * (Frame 3)
             *    Done.
             */
            this.isBusy = true;
            // ******** DOM READ ****************
            // Save the current content dimensions before the UI updates
            const prev = scrollEl.scrollHeight - scrollEl.scrollTop;
            // ******** DOM READ ****************
            this.dom.read(() => {
                // UI has updated, save the new content dimensions
                const scrollHeight = scrollEl.scrollHeight;
                // New content was added on top, so the scroll position should be changed immediately to prevent it from jumping around
                const newScrollTop = scrollHeight - prev;
                // ******** DOM WRITE ****************
                this.dom.write(() => {
                    scrollEl.scrollTop = newScrollTop;
                    this.isBusy = false;
                });
            });
        }
    }
    /**
     * Pass a promise inside `waitFor()` within the `infinite` output event handler in order to
     * change state of infiniteScroll to "complete"
     */
    waitFor(action) {
        const enable = this.complete.bind(this);
        action.then(enable, enable);
    }
    canStart() {
        return (!this.disabled &&
            !this.isBusy &&
            !!this.scrollEl &&
            !this.isLoading);
    }
    enableScrollEvents(shouldListen) {
        if (this.scrollEl) {
            if (shouldListen) {
                this.scrollEl.scrollEvents = true;
            }
            this.enableListener(this, 'ionScroll', shouldListen, this.scrollEl);
        }
    }
    hostData() {
        return {
            class: {
                'infinite-scroll-loading': this.isLoading,
                'infinite-scroll-enabled': !this.disabled
            }
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-infinite-scroll"; }
    static get properties() { return { "complete": { "method": true }, "disabled": { "type": Boolean, "attr": "disabled", "watchCallbacks": ["disabledChanged"] }, "dom": { "context": "dom" }, "el": { "elementRef": true }, "enableListener": { "context": "enableListener" }, "isLoading": { "state": true }, "position": { "type": String, "attr": "position" }, "threshold": { "type": String, "attr": "threshold", "watchCallbacks": ["thresholdChanged"] }, "waitFor": { "method": true } }; }
    static get events() { return [{ "name": "ionInfinite", "method": "ionInfinite", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-infinite-scroll {\n  display: none;\n  width: 100%;\n}\n\n.infinite-scroll-enabled {\n  display: block;\n}"; }
}

export { InfiniteScroll as IonInfiniteScroll };
