(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./dom"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dom_1 = require("./dom");
    var ScrollView = (function () {
        /**
         * @param {?} _app
         * @param {?} _plt
         * @param {?} _dom
         */
        function ScrollView(_app, _plt, _dom) {
            this._app = _app;
            this._plt = _plt;
            this._dom = _dom;
            this.isScrolling = false;
            this.initialized = false;
            this._eventsEnabled = false;
            this._t = 0;
            this._l = 0;
            this.ev = {
                timeStamp: 0,
                scrollTop: 0,
                scrollLeft: 0,
                scrollHeight: 0,
                scrollWidth: 0,
                contentHeight: 0,
                contentWidth: 0,
                contentTop: 0,
                contentBottom: 0,
                startY: 0,
                startX: 0,
                deltaY: 0,
                deltaX: 0,
                velocityY: 0,
                velocityX: 0,
                directionY: 'down',
                directionX: null,
                domWrite: _dom.write.bind(_dom)
            };
        }
        /**
         * @param {?} ele
         * @param {?} contentTop
         * @param {?} contentBottom
         * @return {?}
         */
        ScrollView.prototype.init = function (ele, contentTop, contentBottom) {
            (void 0) /* assert */;
            this._el = ele;
            if (!this.initialized) {
                this.initialized = true;
                if (this._js) {
                    this.enableJsScroll(contentTop, contentBottom);
                }
                else {
                    this.enableNativeScrolling();
                }
            }
        };
        /**
         * @return {?}
         */
        ScrollView.prototype.enableEvents = function () {
            this._eventsEnabled = true;
        };
        /**
         * @param {?} isScrolling
         * @param {?} ev
         * @return {?}
         */
        ScrollView.prototype.setScrolling = function (isScrolling, ev) {
            if (this.isScrolling) {
                if (isScrolling) {
                    this.onScroll && this.onScroll(ev);
                }
                else {
                    this.isScrolling = false;
                    this.onScrollEnd && this.onScrollEnd(ev);
                }
            }
            else if (isScrolling) {
                this.isScrolling = true;
                this.onScrollStart && this.onScrollStart(ev);
            }
        };
        /**
         * @return {?}
         */
        ScrollView.prototype.enableNativeScrolling = function () {
            (void 0) /* assert */;
            (void 0) /* assert */;
            (void 0) /* assert */;
            this._js = false;
            if (!this._el) {
                return;
            }
            (void 0) /* console.debug */;
            var /** @type {?} */ self = this;
            var /** @type {?} */ ev = self.ev;
            var /** @type {?} */ positions = [];
            /**
             * @param {?} scrollEvent
             * @return {?}
             */
            function scrollCallback(scrollEvent) {
                // remind the app that it's currently scrolling
                self._app.setScrolling();
                // if events are disabled, we do nothing
                if (!self._eventsEnabled) {
                    return;
                }
                ev.timeStamp = scrollEvent.timeStamp;
                // Event.timeStamp is 0 in firefox
                if (!ev.timeStamp) {
                    ev.timeStamp = Date.now();
                }
                // get the current scrollTop
                // ******** DOM READ ****************
                ev.scrollTop = self.getTop();
                // get the current scrollLeft
                // ******** DOM READ ****************
                ev.scrollLeft = self.getLeft();
                if (!self.isScrolling) {
                    // remember the start positions
                    ev.startY = ev.scrollTop;
                    ev.startX = ev.scrollLeft;
                    // new scroll, so do some resets
                    ev.velocityY = ev.velocityX = 0;
                    ev.deltaY = ev.deltaX = 0;
                    positions.length = 0;
                }
                // actively scrolling
                positions.push(ev.scrollTop, ev.scrollLeft, ev.timeStamp);
                if (positions.length > 3) {
                    // we've gotten at least 2 scroll events so far
                    ev.deltaY = (ev.scrollTop - ev.startY);
                    ev.deltaX = (ev.scrollLeft - ev.startX);
                    var /** @type {?} */ endPos = (positions.length - 1);
                    var /** @type {?} */ startPos = endPos;
                    var /** @type {?} */ timeRange = (ev.timeStamp - 100);
                    // move pointer to position measured 100ms ago
                    for (var /** @type {?} */ i = endPos; i > 0 && positions[i] > timeRange; i -= 3) {
                        startPos = i;
                    }
                    if (startPos !== endPos) {
                        // compute relative movement between these two points
                        var /** @type {?} */ movedTop = (positions[startPos - 2] - positions[endPos - 2]);
                        var /** @type {?} */ movedLeft = (positions[startPos - 1] - positions[endPos - 1]);
                        var /** @type {?} */ factor = FRAME_MS / (positions[endPos] - positions[startPos]);
                        // based on XXms compute the movement to apply for each render step
                        ev.velocityY = movedTop * factor;
                        ev.velocityX = movedLeft * factor;
                        // figure out which direction we're scrolling
                        ev.directionY = (movedTop > 0 ? 'up' : 'down');
                        ev.directionX = (movedLeft > 0 ? 'left' : 'right');
                    }
                }
                /**
                 * @return {?}
                 */
                function scrollEnd() {
                    // reset velocity, do not reset the directions or deltas
                    ev.velocityY = ev.velocityX = 0;
                    // emit that the scroll has ended
                    self.setScrolling(false, ev);
                    self._endTmr = null;
                }
                // emit on each scroll event
                self.setScrolling(true, ev);
                // debounce for a moment after the last scroll event
                self._dom.cancel(self._endTmr);
                self._endTmr = self._dom.read(scrollEnd, SCROLL_END_DEBOUNCE_MS);
            }
            // clear out any existing listeners (just to be safe)
            self._lsn && self._lsn();
            // assign the raw scroll listener
            // note that it does not have a wrapping requestAnimationFrame on purpose
            // a scroll event callback will always be right before the raf callback
            // so there's little to no value of using raf here since it'll all ways immediately
            // call the raf if it was set within the scroll event, so this will save us some time
            self._lsn = self._plt.registerListener(self._el, 'scroll', scrollCallback, EVENT_OPTS);
        };
        /**
         * @hidden
         * JS Scrolling has been provided only as a temporary solution
         * until iOS apps can take advantage of scroll events at all times.
         * The goal is to eventually remove JS scrolling entirely. When we
         * no longer have to worry about iOS not firing scroll events during
         * inertia then this can be burned to the ground. iOS's more modern
         * WKWebView does not have this issue, only UIWebView does.
         * @param {?} contentTop
         * @param {?} contentBottom
         * @return {?}
         */
        ScrollView.prototype.enableJsScroll = function (contentTop, contentBottom) {
            var /** @type {?} */ self = this;
            self._js = true;
            var /** @type {?} */ ele = self._el;
            if (!ele) {
                return;
            }
            (void 0) /* console.debug */;
            var /** @type {?} */ ev = self.ev;
            var /** @type {?} */ positions = [];
            var /** @type {?} */ rafCancel;
            var /** @type {?} */ max;
            /**
             * @return {?}
             */
            function setMax() {
                if (!max) {
                    // ******** DOM READ ****************
                    max = ele.scrollHeight - ele.parentElement.offsetHeight + contentTop + contentBottom;
                }
            }
            /**
             * @param {?} timeStamp
             * @return {?}
             */
            function jsScrollDecelerate(timeStamp) {
                ev.timeStamp = timeStamp;
                (void 0) /* console.debug */;
                if (ev.velocityY) {
                    ev.velocityY *= DECELERATION_FRICTION;
                    // update top with updated velocity
                    // clamp top within scroll limits
                    // ******** DOM READ ****************
                    setMax();
                    self._t = Math.min(Math.max(self._t + ev.velocityY, 0), max);
                    ev.scrollTop = self._t;
                    // emit on each scroll event
                    self.onScroll(ev);
                    self._dom.write(function () {
                        // ******** DOM WRITE ****************
                        self.setTop(self._t);
                        if (self._t > 0 && self._t < max && Math.abs(ev.velocityY) > MIN_VELOCITY_CONTINUE_DECELERATION) {
                            rafCancel = self._dom.read(function (rafTimeStamp) {
                                jsScrollDecelerate(rafTimeStamp);
                            });
                        }
                        else {
                            // haven't scrolled in a while, so it's a scrollend
                            self.isScrolling = false;
                            // reset velocity, do not reset the directions or deltas
                            ev.velocityY = ev.velocityX = 0;
                            // emit that the scroll has ended
                            self.onScrollEnd(ev);
                        }
                    });
                }
            }
            /**
             * @param {?} touchEvent
             * @return {?}
             */
            function jsScrollTouchStart(touchEvent) {
                positions.length = 0;
                max = null;
                self._dom.cancel(rafCancel);
                positions.push(dom_1.pointerCoord(touchEvent).y, touchEvent.timeStamp);
            }
            /**
             * @param {?} touchEvent
             * @return {?}
             */
            function jsScrollTouchMove(touchEvent) {
                if (!positions.length) {
                    return;
                }
                ev.timeStamp = touchEvent.timeStamp;
                var /** @type {?} */ y = dom_1.pointerCoord(touchEvent).y;
                // ******** DOM READ ****************
                setMax();
                self._t -= (y - positions[positions.length - 2]);
                self._t = Math.min(Math.max(self._t, 0), max);
                positions.push(y, ev.timeStamp);
                if (!self.isScrolling) {
                    // remember the start position
                    ev.startY = self._t;
                    // new scroll, so do some resets
                    ev.velocityY = ev.deltaY = 0;
                    self.isScrolling = true;
                    // emit only on the first scroll event
                    self.onScrollStart(ev);
                }
                self._dom.write(function () {
                    // ******** DOM WRITE ****************
                    self.setTop(self._t);
                });
            }
            /**
             * @param {?} touchEvent
             * @return {?}
             */
            function jsScrollTouchEnd(touchEvent) {
                // figure out what the scroll position was about 100ms ago
                self._dom.cancel(rafCancel);
                if (!positions.length && self.isScrolling) {
                    self.isScrolling = false;
                    ev.velocityY = ev.velocityX = 0;
                    self.onScrollEnd(ev);
                    return;
                }
                var /** @type {?} */ y = dom_1.pointerCoord(touchEvent).y;
                positions.push(y, touchEvent.timeStamp);
                var /** @type {?} */ endPos = (positions.length - 1);
                var /** @type {?} */ startPos = endPos;
                var /** @type {?} */ timeRange = (touchEvent.timeStamp - 100);
                // move pointer to position measured 100ms ago
                for (var /** @type {?} */ i = endPos; i > 0 && positions[i] > timeRange; i -= 2) {
                    startPos = i;
                }
                if (startPos !== endPos) {
                    // compute relative movement between these two points
                    var /** @type {?} */ timeOffset = (positions[endPos] - positions[startPos]);
                    var /** @type {?} */ movedTop = (positions[startPos - 1] - positions[endPos - 1]);
                    // based on XXms compute the movement to apply for each render step
                    ev.velocityY = ((movedTop / timeOffset) * FRAME_MS);
                    // verify that we have enough velocity to start deceleration
                    if (Math.abs(ev.velocityY) > MIN_VELOCITY_START_DECELERATION) {
                        // ******** DOM READ ****************
                        setMax();
                        rafCancel = self._dom.read(function (rafTimeStamp) {
                            jsScrollDecelerate(rafTimeStamp);
                        });
                    }
                }
                else {
                    self.isScrolling = false;
                    ev.velocityY = 0;
                    self.onScrollEnd(ev);
                }
                positions.length = 0;
            }
            var /** @type {?} */ plt = self._plt;
            var /** @type {?} */ unRegStart = plt.registerListener(ele, 'touchstart', jsScrollTouchStart, EVENT_OPTS);
            var /** @type {?} */ unRegMove = plt.registerListener(ele, 'touchmove', jsScrollTouchMove, EVENT_OPTS);
            var /** @type {?} */ unRegEnd = plt.registerListener(ele, 'touchend', jsScrollTouchEnd, EVENT_OPTS);
            ele.parentElement.classList.add('js-scroll');
            // stop listening for actual scroll events
            self._lsn && self._lsn();
            // create an unregister for all of these events
            self._lsn = function () {
                unRegStart();
                unRegMove();
                unRegEnd();
                ele.parentElement.classList.remove('js-scroll');
            };
        };
        /**
         * DOM READ
         * @return {?}
         */
        ScrollView.prototype.getTop = function () {
            if (this._js) {
                return this._t;
            }
            return this._t = this._el.scrollTop;
        };
        /**
         * DOM READ
         * @return {?}
         */
        ScrollView.prototype.getLeft = function () {
            if (this._js) {
                return 0;
            }
            return this._l = this._el.scrollLeft;
        };
        /**
         * DOM WRITE
         * @param {?} top
         * @return {?}
         */
        ScrollView.prototype.setTop = function (top) {
            this._t = top;
            if (this._js) {
                ((this._el.style))[this._plt.Css.transform] = "translate3d(" + this._l * -1 + "px," + top * -1 + "px,0px)";
            }
            else {
                this._el.scrollTop = top;
            }
        };
        /**
         * DOM WRITE
         * @param {?} left
         * @return {?}
         */
        ScrollView.prototype.setLeft = function (left) {
            this._l = left;
            if (this._js) {
                ((this._el.style))[this._plt.Css.transform] = "translate3d(" + left * -1 + "px," + this._t * -1 + "px,0px)";
            }
            else {
                this._el.scrollLeft = left;
            }
        };
        /**
         * @param {?} x
         * @param {?} y
         * @param {?} duration
         * @param {?=} done
         * @return {?}
         */
        ScrollView.prototype.scrollTo = function (x, y, duration, done) {
            // scroll animation loop w/ easing
            // credit https://gist.github.com/dezinezync/5487119
            var /** @type {?} */ promise;
            if (done === undefined) {
                // only create a promise if a done callback wasn't provided
                // done can be a null, which avoids any functions
                promise = new Promise(function (resolve) {
                    done = resolve;
                });
            }
            var /** @type {?} */ self = this;
            var /** @type {?} */ el = self._el;
            if (!el) {
                // invalid element
                done();
                return promise;
            }
            if (duration < 32) {
                self.setTop(y);
                self.setLeft(x);
                done();
                return promise;
            }
            var /** @type {?} */ fromY = el.scrollTop;
            var /** @type {?} */ fromX = el.scrollLeft;
            var /** @type {?} */ maxAttempts = (duration / 16) + 100;
            var /** @type {?} */ transform = self._plt.Css.transform;
            var /** @type {?} */ startTime;
            var /** @type {?} */ attempts = 0;
            var /** @type {?} */ stopScroll = false;
            /**
             * @param {?} timeStamp
             * @return {?}
             */
            function step(timeStamp) {
                attempts++;
                if (!self._el || stopScroll || attempts > maxAttempts) {
                    self.setScrolling(false, null);
                    ((el.style))[transform] = '';
                    done();
                    return;
                }
                var /** @type {?} */ time = Math.min(1, ((timeStamp - startTime) / duration));
                // where .5 would be 50% of time on a linear scale easedT gives a
                // fraction based on the easing method
                var /** @type {?} */ easedT = (--time) * time * time + 1;
                if (fromY !== y) {
                    self.setTop((easedT * (y - fromY)) + fromY);
                }
                if (fromX !== x) {
                    self.setLeft(Math.floor((easedT * (x - fromX)) + fromX));
                }
                if (easedT < 1) {
                    // do not use DomController here
                    // must use nativeRaf in order to fire in the next frame
                    self._plt.raf(step);
                }
                else {
                    stopScroll = true;
                    self.setScrolling(false, null);
                    ((el.style))[transform] = '';
                    done();
                }
            }
            // start scroll loop
            self.setScrolling(true, null);
            self.isScrolling = true;
            // chill out for a frame first
            self._dom.write(function (timeStamp) {
                startTime = timeStamp;
                step(timeStamp);
            }, 16);
            return promise;
        };
        /**
         * @param {?} duration
         * @return {?}
         */
        ScrollView.prototype.scrollToTop = function (duration) {
            return this.scrollTo(0, 0, duration);
        };
        /**
         * @param {?} duration
         * @return {?}
         */
        ScrollView.prototype.scrollToBottom = function (duration) {
            var /** @type {?} */ y = 0;
            if (this._el) {
                y = this._el.scrollHeight - this._el.clientHeight;
            }
            return this.scrollTo(0, y, duration);
        };
        /**
         * @return {?}
         */
        ScrollView.prototype.stop = function () {
            this.setScrolling(false, null);
        };
        /**
         * @hidden
         * @return {?}
         */
        ScrollView.prototype.destroy = function () {
            this.stop();
            this._endTmr && this._dom.cancel(this._endTmr);
            this._lsn && this._lsn();
            var /** @type {?} */ ev = this.ev;
            ev.domWrite = ev.contentElement = ev.fixedElement = ev.scrollElement = ev.headerElement = null;
            this._lsn = this._el = this._dom = this.ev = ev = null;
            this.onScrollStart = this.onScroll = this.onScrollEnd = null;
        };
        return ScrollView;
    }());
    exports.ScrollView = ScrollView;
    function ScrollView_tsickle_Closure_declarations() {
        /** @type {?} */
        ScrollView.prototype.ev;
        /** @type {?} */
        ScrollView.prototype.isScrolling;
        /** @type {?} */
        ScrollView.prototype.onScrollStart;
        /** @type {?} */
        ScrollView.prototype.onScroll;
        /** @type {?} */
        ScrollView.prototype.onScrollEnd;
        /** @type {?} */
        ScrollView.prototype.initialized;
        /** @type {?} */
        ScrollView.prototype._el;
        /** @type {?} */
        ScrollView.prototype._eventsEnabled;
        /** @type {?} */
        ScrollView.prototype._js;
        /** @type {?} */
        ScrollView.prototype._t;
        /** @type {?} */
        ScrollView.prototype._l;
        /** @type {?} */
        ScrollView.prototype._lsn;
        /** @type {?} */
        ScrollView.prototype._endTmr;
        /** @type {?} */
        ScrollView.prototype._app;
        /** @type {?} */
        ScrollView.prototype._plt;
        /** @type {?} */
        ScrollView.prototype._dom;
    }
    var /** @type {?} */ SCROLL_END_DEBOUNCE_MS = 80;
    var /** @type {?} */ MIN_VELOCITY_START_DECELERATION = 4;
    var /** @type {?} */ MIN_VELOCITY_CONTINUE_DECELERATION = 0.12;
    var /** @type {?} */ DECELERATION_FRICTION = 0.97;
    var /** @type {?} */ FRAME_MS = (1000 / 60);
    var /** @type {?} */ EVENT_OPTS = {
        passive: true,
        zone: false
    };
});
//# sourceMappingURL=scroll-view.js.map