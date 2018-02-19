/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Refresher {
    constructor() {
        this.appliedStyles = false;
        this.didStart = false;
        this.progress = 0;
        this.scrollEl = null;
        /**
         * The current state which the refresher is in. The refresher's states include:
         *
         * - `inactive` - The refresher is not being pulled down or refreshing and is currently hidden.
         * - `pulling` - The user is actively pulling down the refresher, but has not reached the point yet that if the user lets go, it'll refresh.
         * - `cancelling` - The user pulled down the refresher and let go, but did not pull down far enough to kick off the `refreshing` state. After letting go, the refresher is in the `cancelling` state while it is closing, and will go back to the `inactive` state once closed.
         * - `ready` - The user has pulled down the refresher far enough that if they let go, it'll begin the `refreshing` state.
         * - `refreshing` - The refresher is actively waiting on the async operation to end. Once the refresh handler calls `complete()` it will begin the `completing` state.
         * - `completing` - The `refreshing` state has finished and the refresher is in the process of closing itself. Once closed, the refresher will go back to the `inactive` state.
         */
        this.state = 1 /* Inactive */;
        /**
         * The minimum distance the user must pull down until the
         * refresher will go into the `refreshing` state. Defaults to `60`.
         */
        this.pullMin = 60;
        /**
         * The maximum distance of the pull until the refresher
         * will automatically go into the `refreshing` state.
         * Defaults to the result of `pullMin + 60`.
         */
        this.pullMax = this.pullMin + 60;
        // TODO: NEVER USED
        /**
         * Time it takes to close the refresher. Defaults to `280ms`.
         */
        this.closeDuration = '280ms';
        /**
         * Time it takes the refresher to to snap back to the `refreshing` state. Defaults to `280ms`.
         */
        this.snapbackDuration = '280ms';
        /**
         * If true, the refresher will be hidden. Defaults to `true`.
         */
        this.disabled = true;
        this.gestureConfig = {
            'canStart': this.canStart.bind(this),
            'onStart': this.onStart.bind(this),
            'onMove': this.onMove.bind(this),
            'onEnd': this.onEnd.bind(this),
            'gestureName': 'refresher',
            'gesturePriority': 10,
            'type': 'pan',
            'passive': false,
            'direction': 'y',
            'threshold': 0,
            'attachTo': 'body'
        };
    }
    componentDidLoad() {
        if (this.el.getAttribute('slot') !== 'fixed') {
            console.error('Make sure you use: <ion-refresher slot="fixed">');
            return;
        }
        const parentElement = this.el.parentElement;
        if (!parentElement) {
            console.error('ion-refresher is not attached');
            return;
        }
        this.scrollEl = parentElement.querySelector('ion-scroll');
        if (!this.scrollEl) {
            console.error('ion-refresher didn\'t attached, make sure if parent is a ion-content');
        }
    }
    componentDidUnload() {
        this.scrollEl = null;
    }
    /**
     * Call `complete()` when your async operation has completed.
     * For example, the `refreshing` state is while the app is performing
     * an asynchronous operation, such as receiving more data from an
     * AJAX request. Once the data has been received, you then call this
     * method to signify that the refreshing has completed and to close
     * the refresher. This method also changes the refresher's state from
     * `refreshing` to `completing`.
     */
    complete() {
        this.close(32 /* Completing */, '120ms');
    }
    /**
     * Changes the refresher's state from `refreshing` to `cancelling`.
     */
    cancel() {
        this.close(16 /* Cancelling */, '');
    }
    /**
     * A number representing how far down the user has pulled.
     * The number `0` represents the user hasn't pulled down at all. The
     * number `1`, and anything greater than `1`, represents that the user
     * has pulled far enough down that when they let go then the refresh will
     * happen. If they let go and the number is less than `1`, then the
     * refresh will not happen, and the content will return to it's original
     * position.
     */
    getProgress() {
        return this.progress;
    }
    canStart() {
        if (!this.scrollEl) {
            return false;
        }
        if (this.state !== 1 /* Inactive */) {
            return false;
        }
        // if the scrollTop is greater than zero then it's
        // not possible to pull the content down yet
        if (this.scrollEl.scrollTop > 0) {
            return false;
        }
        return true;
    }
    onStart() {
        this.progress = 0;
        this.state = 1 /* Inactive */;
    }
    onMove(detail) {
        if (!this.scrollEl) {
            return 0;
        }
        // this method can get called like a bazillion times per second,
        // so it's built to be as efficient as possible, and does its
        // best to do any DOM read/writes only when absolutely necessary
        // if multitouch then get out immediately
        const ev = detail.event;
        if (ev.touches && ev.touches.length > 1) {
            return 1;
        }
        // do nothing if it's actively refreshing
        // or it's in the process of closing
        // or this was never a startY
        if (this.state & 56 /* _BUSY_ */) {
            return 2;
        }
        const deltaY = detail.deltaY;
        // don't bother if they're scrolling up
        // and have not already started dragging
        if (deltaY <= 0) {
            // the current Y is higher than the starting Y
            // so they scrolled up enough to be ignored
            this.progress = 0;
            this.state = 1 /* Inactive */;
            if (this.appliedStyles) {
                // reset the styles only if they were applied
                this.setCss(0, '', false, '');
                return 5;
            }
            return 6;
        }
        if (this.state === 1 /* Inactive */) {
            // this refresh is not already actively pulling down
            // get the content's scrollTop
            const scrollHostScrollTop = this.scrollEl.scrollTop;
            // if the scrollTop is greater than zero then it's
            // not possible to pull the content down yet
            if (scrollHostScrollTop > 0) {
                this.progress = 0;
                return 7;
            }
            // content scrolled all the way to the top, and dragging down
            this.state = 2 /* Pulling */;
        }
        // prevent native scroll events
        ev.preventDefault();
        // the refresher is actively pulling at this point
        // move the scroll element within the content element
        this.setCss(deltaY, '0ms', true, '');
        if (!deltaY) {
            // don't continue if there's no delta yet
            this.progress = 0;
            return 8;
        }
        const pullMin = this.pullMin;
        // set pull progress
        this.progress = deltaY / pullMin;
        // emit "start" if it hasn't started yet
        if (!this.didStart) {
            this.didStart = true;
            this.ionStart.emit(this);
        }
        // emit "pulling" on every move
        this.ionPull.emit(this);
        // do nothing if the delta is less than the pull threshold
        if (deltaY < pullMin) {
            // ensure it stays in the pulling state, cuz its not ready yet
            this.state = 2 /* Pulling */;
            return 2;
        }
        if (deltaY > this.pullMax) {
            // they pulled farther than the max, so kick off the refresh
            this.beginRefresh();
            return 3;
        }
        // pulled farther than the pull min!!
        // it is now in the `ready` state!!
        // if they let go then it'll refresh, kerpow!!
        this.state = 4 /* Ready */;
        return 4;
    }
    onEnd() {
        // only run in a zone when absolutely necessary
        if (this.state === 4 /* Ready */) {
            // they pulled down far enough, so it's ready to refresh
            this.beginRefresh();
        }
        else if (this.state === 2 /* Pulling */) {
            // they were pulling down, but didn't pull down far enough
            // set the content back to it's original location
            // and close the refresher
            // set that the refresh is actively cancelling
            this.cancel();
        }
    }
    beginRefresh() {
        // assumes we're already back in a zone
        // they pulled down far enough, so it's ready to refresh
        this.state = 8 /* Refreshing */;
        // place the content in a hangout position while it thinks
        this.setCss(this.pullMin, this.snapbackDuration, true, '');
        // emit "refresh" because it was pulled down far enough
        // and they let go to begin refreshing
        this.ionRefresh.emit(this);
    }
    close(state, delay) {
        // create fallback timer incase something goes wrong with transitionEnd event
        setTimeout(() => {
            this.state = 1 /* Inactive */;
            this.progress = 0;
            this.didStart = false;
            this.setCss(0, '0ms', false, '');
        }, 600);
        // reset set the styles on the scroll element
        // set that the refresh is actively cancelling/completing
        this.state = state;
        this.setCss(0, '', true, delay);
        // TODO: stop gesture
    }
    setCss(y, duration, overflowVisible, delay) {
        this.appliedStyles = (y > 0);
        this.dom.write(() => {
            const style = this.scrollEl.style;
            style.transform = ((y > 0) ? 'translateY(' + y + 'px) translateZ(0px)' : 'translateZ(0px)');
            style.transitionDuration = duration;
            style.transitionDelay = delay;
            style.overflow = (overflowVisible ? 'hidden' : '');
        });
    }
    hostData() {
        return {
            class: {
                'refresher-active': this.state !== 1 /* Inactive */,
                'refresher-pulling': this.state === 2 /* Pulling */,
                'refresher-ready': this.state === 4 /* Ready */,
                'refresher-refreshing': this.state === 8 /* Refreshing */,
                'refresher-cancelling': this.state === 16 /* Cancelling */,
                'refresher-completing': this.state === 32 /* Completing */
            }
        };
    }
    render() {
        return h("ion-gesture", Object.assign({}, this.gestureConfig, { disabled: this.disabled }),
            h("slot", null));
    }
    static get is() { return "ion-refresher"; }
    static get host() { return { "theme": "refresher" }; }
    static get properties() { return { "cancel": { "method": true }, "closeDuration": { "type": String, "attr": "close-duration" }, "complete": { "method": true }, "disabled": { "type": Boolean, "attr": "disabled" }, "dom": { "context": "dom" }, "el": { "elementRef": true }, "getProgress": { "method": true }, "pullMax": { "type": "Any", "attr": "pull-max" }, "pullMin": { "type": Number, "attr": "pull-min" }, "snapbackDuration": { "type": String, "attr": "snapback-duration" }, "state": { "state": true } }; }
    static get events() { return [{ "name": "ionRefresh", "method": "ionRefresh", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionPull", "method": "ionPull", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionStart", "method": "ionStart", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-refresher {\n  left: 0;\n  top: 0;\n  position: absolute;\n  top: 0;\n  z-index: 0;\n  display: none;\n  width: 100%;\n  height: 60px;\n}\n\nion-refresher.refresher-active {\n  display: block;\n}\n\nion-refresher-content {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  height: 100%;\n}\n\n.refresher-pulling,\n.refresher-refreshing {\n  display: none;\n  width: 100%;\n}\n\n.refresher-pulling-icon,\n.refresher-refreshing-icon {\n  text-align: center;\n  transform-origin: center;\n  font-size: 30px;\n  transition: 200ms;\n}\n\n.refresher-pulling-text,\n.refresher-refreshing-text {\n  text-align: center;\n  font-size: 16px;\n}\n\n.refresher-pulling ion-refresher-content .refresher-pulling {\n  display: block;\n}\n\n.refresher-ready ion-refresher-content .refresher-pulling {\n  display: block;\n}\n\n.refresher-ready ion-refresher-content .refresher-pulling-icon {\n  transform: rotate(180deg);\n}\n\n.refresher-refreshing ion-refresher-content .refresher-refreshing {\n  display: block;\n}\n\n.refresher-cancelling ion-refresher-content .refresher-pulling {\n  display: block;\n}\n\n.refresher-cancelling ion-refresher-content .refresher-pulling-icon {\n  transform: scale(0);\n}\n\n.refresher-completing ion-refresher-content .refresher-refreshing {\n  display: block;\n}\n\n.refresher-completing ion-refresher-content .refresher-refreshing-icon {\n  transform: scale(0);\n}\n\n.refresher-ios .refresher-pulling-icon,\n.refresher-ios .refresher-refreshing-icon {\n  color: var(--ion-text-ios-color, var(--ion-text-color, #000));\n}\n\n.refresher-ios .refresher-pulling-text,\n.refresher-ios .refresher-refreshing-text {\n  color: var(--ion-text-ios-color, var(--ion-text-color, #000));\n}\n\n.refresher-ios .refresher-refreshing .spinner-ios line,\n.refresher-ios .refresher-refreshing .spinner-ios-small line,\n.refresher-ios .refresher-refreshing .spinner-crescent circle {\n  stroke: var(--ion-text-ios-color, var(--ion-text-color, #000));\n}\n\n.refresher-ios .refresher-refreshing .spinner-bubbles circle,\n.refresher-ios .refresher-refreshing .spinner-circles circle,\n.refresher-ios .refresher-refreshing .spinner-dots circle {\n  fill: var(--ion-text-ios-color, var(--ion-text-color, #000));\n}"; }
    static get styleMode() { return "ios"; }
}

export { Refresher as IonRefresher };
