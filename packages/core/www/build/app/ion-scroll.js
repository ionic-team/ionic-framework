/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { GestureController } from './chunk5.js';

class Scroll {
    constructor() {
        this.positions = [];
        this.queued = false;
        this.isScrolling = false;
        this.detail = {};
        this.scrollEvents = false;
    }
    scrollChanged(enabled) {
        this.enableListener(this, 'scroll', enabled);
    }
    componentDidLoad() {
        if (this.isServer) {
            return;
        }
        const gestureCtrl = Ionic.gesture = Ionic.gesture || new GestureController();
        this.gesture = gestureCtrl.createGesture('scroll', 100, false);
        this.app = this.el.closest('ion-app');
        this.scrollChanged(this.scrollEvents);
    }
    componentDidUnload() {
        this.gesture && this.gesture.destroy();
        this.gesture = this.detail = this.detail.event = null;
    }
    // Native Scroll *************************
    onNativeScroll() {
        if (!this.queued) {
            this.queued = true;
            this.dom.read(timeStamp => {
                this.queued = false;
                this.onScroll(timeStamp);
            });
        }
    }
    scrollToTop(duration) {
        return this.scrollToPoint(0, 0, duration);
    }
    scrollToBottom(duration) {
        const y = (this.el)
            ? this.el.scrollHeight - this.el.clientHeight
            : 0;
        return this.scrollToPoint(0, y, duration);
    }
    scrollToPoint(x, y, duration, done) {
        // scroll animation loop w/ easing
        // credit https://gist.github.com/dezinezync/5487119
        let promise;
        if (done === undefined) {
            // only create a promise if a done callback wasn't provided
            // done can be a null, which avoids any functions
            promise = new Promise(resolve => {
                done = resolve;
            });
        }
        const self = this;
        const el = self.el;
        if (!el) {
            // invalid element
            done();
            return promise;
        }
        if (duration < 32) {
            el.scrollTop = y;
            el.scrollLeft = x;
            done();
            return promise;
        }
        const fromY = el.scrollTop;
        const fromX = el.scrollLeft;
        const maxAttempts = (duration / 16) + 100;
        let startTime;
        let attempts = 0;
        let stopScroll = false;
        // scroll loop
        function step(timeStamp) {
            attempts++;
            if (!self.el || stopScroll || attempts > maxAttempts) {
                self.isScrolling = false;
                el.style.transform = el.style.webkitTransform = '';
                done();
                return;
            }
            let time = Math.min(1, ((timeStamp - startTime) / duration));
            // where .5 would be 50% of time on a linear scale easedT gives a
            // fraction based on the easing method
            const easedT = (--time) * time * time + 1;
            if (fromY !== y) {
                el.scrollTop = (easedT * (y - fromY)) + fromY;
            }
            if (fromX !== x) {
                el.scrollLeft = Math.floor((easedT * (x - fromX)) + fromX);
            }
            if (easedT < 1) {
                // do not use DomController here
                // must use nativeRaf in order to fire in the next frame
                self.dom.raf(step);
            }
            else {
                stopScroll = true;
                self.isScrolling = false;
                el.style.transform = el.style.webkitTransform = '';
                done();
            }
        }
        // start scroll loop
        self.isScrolling = true;
        // chill out for a frame first
        this.dom.write(() => {
            this.dom.write(timeStamp => {
                startTime = timeStamp;
                step(timeStamp);
            });
        });
        return promise;
    }
    onScroll(timeStamp) {
        const detail = this.detail;
        const positions = this.positions;
        const el = this.el;
        if (this.app) {
            this.app.setScrolling();
        }
        detail.timeStamp = timeStamp;
        // get the current scrollTop
        // ******** DOM READ ****************
        detail.scrollTop = el.scrollTop;
        // get the current scrollLeft
        // ******** DOM READ ****************
        detail.scrollLeft = el.scrollLeft;
        if (!this.isScrolling) {
            // currently not scrolling, so this is a scroll start
            this.isScrolling = true;
            // remember the start positions
            detail.startY = detail.scrollTop;
            detail.startX = detail.scrollLeft;
            // new scroll, so do some resets
            detail.velocityY = detail.velocityX = detail.deltaY = detail.deltaX = positions.length = 0;
            // emit only on the first scroll event
            if (this.onionScrollStart) {
                this.onionScrollStart(detail);
            }
            this.ionScrollStart.emit(detail);
        }
        detail.deltaY = (detail.scrollTop - detail.startY);
        detail.deltaX = (detail.scrollLeft - detail.startX);
        // actively scrolling
        positions.push(detail.scrollTop, detail.scrollLeft, detail.timeStamp);
        // move pointer to position measured 100ms ago
        const timeRange = timeStamp - 100;
        let startPos = positions.length - 1;
        while (startPos > 0 && positions[startPos] > timeRange) {
            startPos -= 3;
        }
        if (startPos > 3) {
            // compute relative movement between these two points
            const frequency = 1 / (positions[startPos] - timeStamp);
            const movedY = positions[startPos - 1] - detail.scrollLeft;
            const movedX = positions[startPos - 2] - detail.scrollTop;
            // based on XXms compute the movement to apply for each render step
            // velocity = space/time = s*(1/t) = s*frequency
            detail.velocityX = movedX * frequency;
            detail.velocityY = movedY * frequency;
        }
        else {
            detail.velocityX = 0;
            detail.velocityY = 0;
        }
        clearTimeout(this.tmr);
        this.tmr = setTimeout(() => {
            // haven't scrolled in a while, so it's a scrollend
            this.isScrolling = false;
            this.dom.read(timeStamp => {
                if (!this.isScrolling) {
                    this.onEnd(timeStamp);
                }
            });
        }, 80);
        // emit on each scroll event
        if (this.onionScroll) {
            this.onionScroll(detail);
        }
        else {
            this.ionScroll.emit(detail);
        }
    }
    onEnd(timeStamp) {
        const detail = this.detail;
        detail.timeStamp = timeStamp;
        // emit that the scroll has ended
        if (this.onionScrollEnd) {
            this.onionScrollEnd(detail);
        }
        this.ionScrollEnd.emit(detail);
    }
    render() {
        return (
        // scroll-inner is used to keep custom user padding
        h("div", { class: 'scroll-inner' },
            h("slot", null)));
    }
    static get is() { return "ion-scroll"; }
    static get properties() { return { "config": { "context": "config" }, "dom": { "context": "dom" }, "el": { "elementRef": true }, "enableListener": { "context": "enableListener" }, "isServer": { "context": "isServer" }, "onionScroll": { "type": "Any", "attr": "onion-scroll" }, "onionScrollEnd": { "type": "Any", "attr": "onion-scroll-end" }, "onionScrollStart": { "type": "Any", "attr": "onion-scroll-start" }, "scrollEvents": { "type": Boolean, "attr": "scroll-events", "watchCallbacks": ["scrollChanged"] }, "scrollToBottom": { "method": true }, "scrollToPoint": { "method": true }, "scrollToTop": { "method": true } }; }
    static get events() { return [{ "name": "ionScrollStart", "method": "ionScrollStart", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionScroll", "method": "ionScroll", "bubbles": false, "cancelable": true, "composed": true }, { "name": "ionScrollEnd", "method": "ionScrollEnd", "bubbles": true, "cancelable": true, "composed": true }]; }
}

export { Scroll as IonScroll };
