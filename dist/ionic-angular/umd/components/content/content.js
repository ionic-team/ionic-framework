var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../app/app", "../../config/config", "../../platform/dom-controller", "../ion", "../../navigation/nav-util", "../../util/util", "../../platform/keyboard", "../../navigation/nav-controller", "../../platform/platform", "../../util/scroll-view", "../../navigation/view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var app_1 = require("../app/app");
    var config_1 = require("../../config/config");
    var dom_controller_1 = require("../../platform/dom-controller");
    var ion_1 = require("../ion");
    var nav_util_1 = require("../../navigation/nav-util");
    var util_1 = require("../../util/util");
    var keyboard_1 = require("../../platform/keyboard");
    var nav_controller_1 = require("../../navigation/nav-controller");
    var platform_1 = require("../../platform/platform");
    var scroll_view_1 = require("../../util/scroll-view");
    var view_controller_1 = require("../../navigation/view-controller");
    var EventEmitterProxy = (function (_super) {
        __extends(EventEmitterProxy, _super);
        function EventEmitterProxy() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @param {?=} generatorOrNext
         * @param {?=} error
         * @param {?=} complete
         * @return {?}
         */
        EventEmitterProxy.prototype.subscribe = function (generatorOrNext, error, complete) {
            this.onSubscribe();
            return _super.prototype.subscribe.call(this, generatorOrNext, error, complete);
        };
        return EventEmitterProxy;
    }(core_1.EventEmitter));
    exports.EventEmitterProxy = EventEmitterProxy;
    function EventEmitterProxy_tsickle_Closure_declarations() {
        /** @type {?} */
        EventEmitterProxy.prototype.onSubscribe;
    }
    /**
     * \@name Content
     * \@description
     * The Content component provides an easy to use content area with
     * some useful methods to control the scrollable area. There should
     * only be one content in a single view component. If additional scrollable
     * elements are need, use [ionScroll](../../scroll/Scroll).
     *
     *
     * The content area can also implement pull-to-refresh with the
     * [Refresher](../../refresher/Refresher) component.
     *
     * \@usage
     * ```html
     * <ion-content>
     *   Add your content here!
     * </ion-content>
     * ```
     *
     * To get a reference to the content component from a Page's logic,
     * you can use Angular's `\@ViewChild` annotation:
     *
     * ```ts
     * import { Component, ViewChild } from '\@angular/core';
     * import { Content } from 'ionic-angular';
     *
     * \@Component({...})
     * export class MyPage{
     *   \@ViewChild(Content) content: Content;
     *
     *   scrollToTop() {
     *     this.content.scrollToTop();
     *   }
     * }
     * ```
     *
     * \@advanced
     *
     * ### Scroll Events
     *
     * Scroll events happen outside of Angular's Zones. This is for performance reasons. So
     * if you're trying to bind a value to any scroll event, it will need to be wrapped in
     * a `zone.run()`
     *
     * ```ts
     * import { Component, NgZone } from '\@angular/core';
     * \@Component({
     *   template: `
     *     <ion-header>
     *       <ion-navbar>
     *         <ion-title>{{scrollAmount}}</ion-title>
     *       </ion-navbar>
     *     </ion-header>
     *     <ion-content (ionScroll)="scrollHandler($event)">
     *        <p> Some realllllllly long content </p>
     *     </ion-content>
     * `})
     * class E2EPage {
     *  public scrollAmount = 0;
     *  constructor( public zone: NgZone){}
     *  scrollHandler(event) {
     *    console.log(`ScrollEvent: ${event}`)
     *    this.zone.run(()=>{
     *      // since scrollAmount is data-binded,
     *      // the update needs to happen in zone
     *      this.scrollAmount++
     *    })
     *  }
     * }
     * ```
     *
     * This goes for any scroll event, not just `ionScroll`.
     *
     * ### Resizing the content
     *
     * If the height of `ion-header`, `ion-footer` or `ion-tabbar`
     * changes dynamically, `content.resize()` has to be called in order to update the
     * layout of `Content`.
     *
     *
     * ```ts
     * \@Component({
     *   template: `
     *     <ion-header>
     *       <ion-navbar>
     *         <ion-title>Main Navbar</ion-title>
     *       </ion-navbar>
     *       <ion-toolbar *ngIf="showToolbar">
     *         <ion-title>Dynamic Toolbar</ion-title>
     *       </ion-toolbar>
     *     </ion-header>
     *     <ion-content>
     *       <button ion-button (click)="toggleToolbar()">Toggle Toolbar</button>
     *     </ion-content>
     * `})
     *
     * class E2EPage {
     *   \@ViewChild(Content) content: Content;
     *   showToolbar: boolean = false;
     *
     *   toggleToolbar() {
     *     this.showToolbar = !this.showToolbar;
     *     this.content.resize();
     *   }
     * }
     * ```
     *
     *
     * Scroll to a specific position
     *
     * ```ts
     * import { Component, ViewChild } from '\@angular/core';
     * import { Content } from 'ionic-angular';
     *
     * \@Component({
     *   template: `<ion-content>
     *                <button ion-button (click)="scrollTo()">Down 500px</button>
     *              </ion-content>`
     * )}
     * export class MyPage{
     *   \@ViewChild(Content) content: Content;
     *
     *   scrollTo() {
     *     // set the scrollLeft to 0px, and scrollTop to 500px
     *     // the scroll duration should take 200ms
     *     this.content.scrollTo(0, 500, 200);
     *   }
     * }
     * ```
     *
     */
    var Content = (function (_super) {
        __extends(Content, _super);
        /**
         * @param {?} config
         * @param {?} _plt
         * @param {?} _dom
         * @param {?} elementRef
         * @param {?} renderer
         * @param {?} _app
         * @param {?} _keyboard
         * @param {?} _zone
         * @param {?} viewCtrl
         * @param {?} navCtrl
         */
        function Content(config, _plt, _dom, elementRef, renderer, _app, _keyboard, _zone, viewCtrl, navCtrl) {
            var _this = _super.call(this, config, elementRef, renderer, 'content') || this;
            _this._plt = _plt;
            _this._dom = _dom;
            _this._app = _app;
            _this._keyboard = _keyboard;
            _this._zone = _zone;
            /**
             * \@internal
             */
            _this._scrollPadding = 0;
            /**
             * \@internal
             */
            _this._inputPolling = false;
            /**
             * \@internal
             */
            _this._hasRefresher = false;
            /**
             * \@internal
             */
            _this._imgs = [];
            /**
             * \@internal
             */
            _this._scrollDownOnLoad = false;
            /**
             * \@output {ScrollEvent} Emitted when the scrolling first starts.
             */
            _this.ionScrollStart = new EventEmitterProxy();
            /**
             * \@output {ScrollEvent} Emitted on every scroll event.
             */
            _this.ionScroll = new EventEmitterProxy();
            /**
             * \@output {ScrollEvent} Emitted when scrolling ends.
             */
            _this.ionScrollEnd = new EventEmitterProxy();
            var enableScrollListener = function () { return _this._scroll.enableEvents(); };
            _this.ionScroll.onSubscribe = enableScrollListener;
            _this.ionScrollStart.onSubscribe = enableScrollListener;
            _this.ionScrollEnd.onSubscribe = enableScrollListener;
            _this.statusbarPadding = config.getBoolean('statusbarPadding', false);
            _this._imgReqBfr = config.getNumber('imgRequestBuffer', 1400);
            _this._imgRndBfr = config.getNumber('imgRenderBuffer', 400);
            _this._imgVelMax = config.getNumber('imgVelocityMax', 3);
            _this._scroll = new scroll_view_1.ScrollView(_app, _plt, _dom);
            while (navCtrl) {
                if (nav_util_1.isTabs(navCtrl)) {
                    _this._tabs = navCtrl;
                    break;
                }
                navCtrl = navCtrl.parent;
            }
            if (viewCtrl) {
                // content has a view controller
                viewCtrl._setIONContent(_this);
                viewCtrl._setIONContentRef(elementRef);
                _this._viewCtrlReadSub = viewCtrl.readReady.subscribe(function () {
                    _this._viewCtrlReadSub.unsubscribe();
                    _this._readDimensions();
                });
                _this._viewCtrlWriteSub = viewCtrl.writeReady.subscribe(function () {
                    _this._viewCtrlWriteSub.unsubscribe();
                    _this._writeDimensions();
                });
            }
            else {
                // content does not have a view controller
                _dom.read(_this._readDimensions.bind(_this));
                _dom.write(_this._writeDimensions.bind(_this));
            }
            return _this;
        }
        Object.defineProperty(Content.prototype, "contentHeight", {
            /**
             * Content height of the viewable area. This does not include content
             * which is outside the overflow area, or content area which is under
             * headers and footers. Read-only.
             *
             * @return {?}
             */
            get: function () {
                return this._scroll.ev.contentHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Content.prototype, "contentWidth", {
            /**
             * Content width including content which is not visible on the screen
             * due to overflow. Read-only.
             *
             * @return {?}
             */
            get: function () {
                return this._scroll.ev.contentWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Content.prototype, "scrollHeight", {
            /**
             * Content height including content which is not visible on the screen
             * due to overflow. Read-only.
             *
             * @return {?}
             */
            get: function () {
                return this._scroll.ev.scrollHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Content.prototype, "scrollWidth", {
            /**
             * Content width including content which is not visible due to
             * overflow. Read-only.
             *
             * @return {?}
             */
            get: function () {
                return this._scroll.ev.scrollWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Content.prototype, "scrollTop", {
            /**
             * The distance of the content's top to its topmost visible content.
             *
             * @return {?}
             */
            get: function () {
                return this._scroll.ev.scrollTop;
            },
            /**
             * @param {?} top
             * @return {?}
             */
            set: function (top) {
                this._scroll.setTop(top);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Content.prototype, "scrollLeft", {
            /**
             * The distance of the content's left to its leftmost visible content.
             *
             * @return {?}
             */
            get: function () {
                return this._scroll.ev.scrollLeft;
            },
            /**
             * @param {?} top
             * @return {?}
             */
            set: function (top) {
                this._scroll.setLeft(top);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Content.prototype, "isScrolling", {
            /**
             * If the content is actively scrolling or not.
             *
             * @return {?}
             */
            get: function () {
                return this._scroll.isScrolling;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Content.prototype, "directionY", {
            /**
             * The current, or last known, vertical scroll direction. Possible
             * string values include `down` and `up`.
             *
             * @return {?}
             */
            get: function () {
                return this._scroll.ev.directionY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Content.prototype, "directionX", {
            /**
             * The current, or last known, horizontal scroll direction. Possible
             * string values include `right` and `left`.
             *
             * @return {?}
             */
            get: function () {
                return this._scroll.ev.directionX;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @hidden
         * @return {?}
         */
        Content.prototype.ngAfterViewInit = function () {
            var _this = this;
            (void 0) /* assert */;
            (void 0) /* assert */;
            var /** @type {?} */ scroll = this._scroll;
            scroll.ev.fixedElement = this.getFixedElement();
            scroll.ev.scrollElement = this.getScrollElement();
            // subscribe to the scroll start
            scroll.onScrollStart = function (ev) {
                _this.ionScrollStart.emit(ev);
            };
            // subscribe to every scroll move
            scroll.onScroll = function (ev) {
                // emit to all of our other friends things be scrolling
                _this.ionScroll.emit(ev);
                _this.imgsUpdate();
            };
            // subscribe to the scroll end
            scroll.onScrollEnd = function (ev) {
                _this.ionScrollEnd.emit(ev);
                _this.imgsUpdate();
            };
        };
        /**
         * @hidden
         * @return {?}
         */
        Content.prototype.enableJsScroll = function () {
            this._scroll.enableJsScroll(this._cTop, this._cBottom);
        };
        /**
         * @hidden
         * @return {?}
         */
        Content.prototype.ngOnDestroy = function () {
            this._scLsn && this._scLsn();
            this._viewCtrlReadSub && this._viewCtrlReadSub.unsubscribe();
            this._viewCtrlWriteSub && this._viewCtrlWriteSub.unsubscribe();
            this._viewCtrlReadSub = this._viewCtrlWriteSub = null;
            this._scroll && this._scroll.destroy();
            this._footerEle = this._scLsn = this._scroll = null;
        };
        /**
         * @hidden
         * @return {?}
         */
        Content.prototype.getScrollElement = function () {
            return this._scrollContent.nativeElement;
        };
        /**
         * @return {?}
         */
        Content.prototype.getFixedElement = function () {
            return this._fixedContent.nativeElement;
        };
        /**
         * @hidden
         * @param {?} callback
         * @return {?}
         */
        Content.prototype.onScrollElementTransitionEnd = function (callback) {
            this._plt.transitionEnd(this.getScrollElement(), callback);
        };
        /**
         * Scroll to the specified position.
         *
         * @param {?} x
         * @param {?} y
         * @param {?=} duration
         * @param {?=} done
         * @return {?}
         */
        Content.prototype.scrollTo = function (x, y, duration, done) {
            if (duration === void 0) { duration = 300; }
            (void 0) /* console.debug */;
            return this._scroll.scrollTo(x, y, duration, done);
        };
        /**
         * Scroll to the top of the content component.
         *
         * @param {?=} duration
         * @return {?}
         */
        Content.prototype.scrollToTop = function (duration) {
            if (duration === void 0) { duration = 300; }
            (void 0) /* console.debug */;
            return this._scroll.scrollToTop(duration);
        };
        /**
         * Scroll to the bottom of the content component.
         *
         * @param {?=} duration
         * @return {?}
         */
        Content.prototype.scrollToBottom = function (duration) {
            if (duration === void 0) { duration = 300; }
            (void 0) /* console.debug */;
            return this._scroll.scrollToBottom(duration);
        };
        Object.defineProperty(Content.prototype, "fullscreen", {
            /**
             * \@input {boolean} If true, the content will scroll behind the headers
             * and footers. This effect can easily be seen by setting the toolbar
             * to transparent.
             * @return {?}
             */
            get: function () {
                return this._fullscreen;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._fullscreen = util_1.isTrueProperty(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Content.prototype, "scrollDownOnLoad", {
            /**
             * \@input {boolean} If true, the content will scroll down on load.
             * @return {?}
             */
            get: function () {
                return this._scrollDownOnLoad;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._scrollDownOnLoad = util_1.isTrueProperty(val);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} img
         * @return {?}
         */
        Content.prototype.addImg = function (img) {
            this._imgs.push(img);
        };
        /**
         * @hidden
         * @param {?} img
         * @return {?}
         */
        Content.prototype.removeImg = function (img) {
            util_1.removeArrayItem(this._imgs, img);
        };
        /**
         * @hidden
         * DOM WRITE
         * @param {?} prop
         * @param {?} val
         * @return {?}
         */
        Content.prototype.setScrollElementStyle = function (prop, val) {
            var /** @type {?} */ scrollEle = this.getScrollElement();
            if (scrollEle) {
                this._dom.write(function () {
                    ((scrollEle.style))[prop] = val;
                });
            }
        };
        /**
         * Returns the content and scroll elements' dimensions.
         * {number} dimensions.contentHeight  content offsetHeight
         * {number} dimensions.contentTop  content offsetTop
         * {number} dimensions.contentBottom  content offsetTop+offsetHeight
         * {number} dimensions.contentWidth  content offsetWidth
         * {number} dimensions.contentLeft  content offsetLeft
         * {number} dimensions.contentRight  content offsetLeft + offsetWidth
         * {number} dimensions.scrollHeight  scroll scrollHeight
         * {number} dimensions.scrollTop  scroll scrollTop
         * {number} dimensions.scrollBottom  scroll scrollTop + scrollHeight
         * {number} dimensions.scrollWidth  scroll scrollWidth
         * {number} dimensions.scrollLeft  scroll scrollLeft
         * {number} dimensions.scrollRight  scroll scrollLeft + scrollWidth
         * @return {?}
         */
        Content.prototype.getContentDimensions = function () {
            var /** @type {?} */ scrollEle = this.getScrollElement();
            var /** @type {?} */ parentElement = scrollEle.parentElement;
            return {
                contentHeight: parentElement.offsetHeight - this._cTop - this._cBottom,
                contentTop: this._cTop,
                contentBottom: this._cBottom,
                contentWidth: parentElement.offsetWidth,
                contentLeft: parentElement.offsetLeft,
                scrollHeight: scrollEle.scrollHeight,
                scrollTop: scrollEle.scrollTop,
                scrollWidth: scrollEle.scrollWidth,
                scrollLeft: scrollEle.scrollLeft,
            };
        };
        /**
         * @hidden
         * DOM WRITE
         * Adds padding to the bottom of the scroll element when the keyboard is open
         * so content below the keyboard can be scrolled into view.
         * @param {?} newPadding
         * @return {?}
         */
        Content.prototype.addScrollPadding = function (newPadding) {
            (void 0) /* assert */;
            if (newPadding > this._scrollPadding) {
                (void 0) /* console.debug */;
                this._scrollPadding = newPadding;
                var /** @type {?} */ scrollEle = this.getScrollElement();
                if (scrollEle) {
                    this._dom.write(function () {
                        scrollEle.style.paddingBottom = (newPadding > 0) ? newPadding + 'px' : '';
                    });
                }
            }
        };
        /**
         * @hidden
         * DOM WRITE
         * @return {?}
         */
        Content.prototype.clearScrollPaddingFocusOut = function () {
            var _this = this;
            if (!this._inputPolling) {
                (void 0) /* console.debug */;
                this._inputPolling = true;
                this._keyboard.onClose(function () {
                    (void 0) /* console.debug */;
                    _this._inputPolling = false;
                    _this._scrollPadding = -1;
                    _this.addScrollPadding(0);
                }, 200, 3000);
            }
        };
        /**
         * Tell the content to recalculate its dimensions. This should be called
         * after dynamically adding/removing headers, footers, or tabs.
         * @return {?}
         */
        Content.prototype.resize = function () {
            this._dom.read(this._readDimensions.bind(this));
            this._dom.write(this._writeDimensions.bind(this));
        };
        /**
         * @hidden
         * DOM READ
         * @return {?}
         */
        Content.prototype._readDimensions = function () {
            var /** @type {?} */ cachePaddingTop = this._pTop;
            var /** @type {?} */ cachePaddingRight = this._pRight;
            var /** @type {?} */ cachePaddingBottom = this._pBottom;
            var /** @type {?} */ cachePaddingLeft = this._pLeft;
            var /** @type {?} */ cacheHeaderHeight = this._hdrHeight;
            var /** @type {?} */ cacheFooterHeight = this._ftrHeight;
            var /** @type {?} */ cacheTabsPlacement = this._tabsPlacement;
            var /** @type {?} */ tabsTop = 0;
            var /** @type {?} */ scrollEvent;
            this._pTop = 0;
            this._pRight = 0;
            this._pBottom = 0;
            this._pLeft = 0;
            this._hdrHeight = 0;
            this._ftrHeight = 0;
            this._tabsPlacement = null;
            this._tTop = 0;
            this._fTop = 0;
            this._fBottom = 0;
            // In certain cases this._scroll is undefined
            // if that is the case then we should just return
            if (!this._scroll) {
                return;
            }
            scrollEvent = this._scroll.ev;
            var /** @type {?} */ ele = this.getNativeElement();
            if (!ele) {
                (void 0) /* assert */;
                return;
            }
            var /** @type {?} */ computedStyle;
            var /** @type {?} */ tagName;
            var /** @type {?} */ parentEle = ele.parentElement;
            var /** @type {?} */ children = parentEle.children;
            for (var /** @type {?} */ i = children.length - 1; i >= 0; i--) {
                ele = (children[i]);
                tagName = ele.tagName;
                if (tagName === 'ION-CONTENT') {
                    scrollEvent.contentElement = ele;
                    if (this._fullscreen) {
                        // ******** DOM READ ****************
                        computedStyle = getComputedStyle(ele);
                        this._pTop = parsePxUnit(computedStyle.paddingTop);
                        this._pBottom = parsePxUnit(computedStyle.paddingBottom);
                        this._pRight = parsePxUnit(computedStyle.paddingRight);
                        this._pLeft = parsePxUnit(computedStyle.paddingLeft);
                    }
                }
                else if (tagName === 'ION-HEADER') {
                    scrollEvent.headerElement = ele;
                    // ******** DOM READ ****************
                    this._hdrHeight = ele.clientHeight;
                }
                else if (tagName === 'ION-FOOTER') {
                    scrollEvent.footerElement = ele;
                    // ******** DOM READ ****************
                    this._ftrHeight = ele.clientHeight;
                    this._footerEle = ele;
                }
            }
            ele = parentEle;
            var /** @type {?} */ tabbarEle;
            while (ele && ele.tagName !== 'ION-MODAL' && !ele.classList.contains('tab-subpage')) {
                if (ele.tagName === 'ION-TABS') {
                    tabbarEle = (ele.firstElementChild);
                    // ******** DOM READ ****************
                    this._tabbarHeight = tabbarEle.clientHeight;
                    if (this._tabsPlacement === null) {
                        // this is the first tabbar found, remember it's position
                        this._tabsPlacement = ele.getAttribute('tabsplacement');
                    }
                }
                ele = ele.parentElement;
            }
            // Tabs top
            if (this._tabs && this._tabsPlacement === 'top') {
                this._tTop = this._hdrHeight;
                tabsTop = this._tabs._top;
            }
            // Toolbar height
            this._cTop = this._hdrHeight;
            this._cBottom = this._ftrHeight;
            // Tabs height
            if (this._tabsPlacement === 'top') {
                this._cTop += this._tabbarHeight;
            }
            else if (this._tabsPlacement === 'bottom') {
                this._cBottom += this._tabbarHeight;
            }
            // Refresher uses a border which should be hidden unless pulled
            if (this._hasRefresher) {
                this._cTop -= 1;
            }
            // Fixed content shouldn't include content padding
            this._fTop = this._cTop;
            this._fBottom = this._cBottom;
            // Handle fullscreen viewport (padding vs margin)
            if (this._fullscreen) {
                this._cTop += this._pTop;
                this._cBottom += this._pBottom;
            }
            // ******** DOM READ ****************
            var /** @type {?} */ contentDimensions = this.getContentDimensions();
            scrollEvent.scrollHeight = contentDimensions.scrollHeight;
            scrollEvent.scrollWidth = contentDimensions.scrollWidth;
            scrollEvent.contentHeight = contentDimensions.contentHeight;
            scrollEvent.contentWidth = contentDimensions.contentWidth;
            scrollEvent.contentTop = contentDimensions.contentTop;
            scrollEvent.contentBottom = contentDimensions.contentBottom;
            this._dirty = (cachePaddingTop !== this._pTop ||
                cachePaddingBottom !== this._pBottom ||
                cachePaddingLeft !== this._pLeft ||
                cachePaddingRight !== this._pRight ||
                cacheHeaderHeight !== this._hdrHeight ||
                cacheFooterHeight !== this._ftrHeight ||
                cacheTabsPlacement !== this._tabsPlacement ||
                tabsTop !== this._tTop ||
                this._cTop !== this.contentTop ||
                this._cBottom !== this.contentBottom);
            this._scroll.init(this.getScrollElement(), this._cTop, this._cBottom);
            // initial imgs refresh
            this.imgsUpdate();
        };
        /**
         * @hidden
         * DOM WRITE
         * @return {?}
         */
        Content.prototype._writeDimensions = function () {
            if (!this._dirty) {
                (void 0) /* console.debug */;
                return;
            }
            var /** @type {?} */ scrollEle = this.getScrollElement();
            if (!scrollEle) {
                (void 0) /* assert */;
                return;
            }
            var /** @type {?} */ fixedEle = this.getFixedElement();
            if (!fixedEle) {
                (void 0) /* assert */;
                return;
            }
            // Tabs height
            if (this._tabsPlacement === 'bottom' && this._cBottom > 0 && this._footerEle) {
                var /** @type {?} */ footerPos = this._cBottom - this._ftrHeight;
                (void 0) /* assert */;
                // ******** DOM WRITE ****************
                this._footerEle.style.bottom = cssFormat(footerPos);
            }
            // Handle fullscreen viewport (padding vs margin)
            var /** @type {?} */ topProperty = 'marginTop';
            var /** @type {?} */ bottomProperty = 'marginBottom';
            var /** @type {?} */ fixedTop = this._fTop;
            var /** @type {?} */ fixedBottom = this._fBottom;
            if (this._fullscreen) {
                (void 0) /* assert */;
                (void 0) /* assert */;
                // adjust the content with padding, allowing content to scroll under headers/footers
                // however, on iOS you cannot control the margins of the scrollbar (last tested iOS9.2)
                // only add inline padding styles if the computed padding value, which would
                // have come from the app's css, is different than the new padding value
                topProperty = 'paddingTop';
                bottomProperty = 'paddingBottom';
            }
            // Only update top margin if value changed
            if (this._cTop !== this.contentTop) {
                (void 0) /* assert */;
                (void 0) /* assert */;
                // ******** DOM WRITE ****************
                ((scrollEle.style))[topProperty] = cssFormat(this._cTop);
                // ******** DOM WRITE ****************
                fixedEle.style.marginTop = cssFormat(fixedTop);
                this.contentTop = this._cTop;
            }
            // Only update bottom margin if value changed
            if (this._cBottom !== this.contentBottom) {
                (void 0) /* assert */;
                (void 0) /* assert */;
                // ******** DOM WRITE ****************
                ((scrollEle.style))[bottomProperty] = cssFormat(this._cBottom);
                // ******** DOM WRITE ****************
                fixedEle.style.marginBottom = cssFormat(fixedBottom);
                this.contentBottom = this._cBottom;
            }
            if (this._tabsPlacement !== null && this._tabs) {
                // set the position of the tabbar
                if (this._tabsPlacement === 'top') {
                    // ******** DOM WRITE ****************
                    this._tabs.setTabbarPosition(this._tTop, -1);
                }
                else {
                    (void 0) /* assert */;
                    // ******** DOM WRITE ****************
                    this._tabs.setTabbarPosition(-1, 0);
                }
            }
            // Scroll the page all the way down after setting dimensions
            if (this._scrollDownOnLoad) {
                this.scrollToBottom(0);
                this._scrollDownOnLoad = false;
            }
        };
        /**
         * @hidden
         * @return {?}
         */
        Content.prototype.imgsUpdate = function () {
            if (this._scroll.initialized && this._imgs.length && this.isImgsUpdatable()) {
                updateImgs(this._imgs, this.scrollTop, this.contentHeight, this.directionY, this._imgReqBfr, this._imgRndBfr);
            }
        };
        /**
         * @hidden
         * @return {?}
         */
        Content.prototype.isImgsUpdatable = function () {
            // an image is only "updatable" if the content isn't scrolling too fast
            // if scroll speed is above the maximum velocity, then let current
            // requests finish, but do not start new requets or render anything
            // if scroll speed is below the maximum velocity, then it's ok
            // to start new requests and render images
            return Math.abs(this._scroll.ev.velocityY) < this._imgVelMax;
        };
        return Content;
    }(ion_1.Ion));
    Content.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-content',
                    template: '<div class="fixed-content" #fixedContent>' +
                        '<ng-content select="[ion-fixed],ion-fab"></ng-content>' +
                        '</div>' +
                        '<div class="scroll-content" #scrollContent>' +
                        '<ng-content></ng-content>' +
                        '</div>' +
                        '<ng-content select="ion-refresher"></ng-content>',
                    host: {
                        '[class.statusbar-padding]': 'statusbarPadding',
                        '[class.has-refresher]': '_hasRefresher'
                    },
                    changeDetection: core_1.ChangeDetectionStrategy.OnPush,
                    encapsulation: core_1.ViewEncapsulation.None
                },] },
    ];
    /**
     * @nocollapse
     */
    Content.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: platform_1.Platform, },
        { type: dom_controller_1.DomController, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: app_1.App, },
        { type: keyboard_1.Keyboard, },
        { type: core_1.NgZone, },
        { type: view_controller_1.ViewController, decorators: [{ type: core_1.Optional },] },
        { type: nav_controller_1.NavController, decorators: [{ type: core_1.Optional },] },
    ]; };
    Content.propDecorators = {
        '_fixedContent': [{ type: core_1.ViewChild, args: ['fixedContent', { read: core_1.ElementRef },] },],
        '_scrollContent': [{ type: core_1.ViewChild, args: ['scrollContent', { read: core_1.ElementRef },] },],
        'ionScrollStart': [{ type: core_1.Output },],
        'ionScroll': [{ type: core_1.Output },],
        'ionScrollEnd': [{ type: core_1.Output },],
        'fullscreen': [{ type: core_1.Input },],
        'scrollDownOnLoad': [{ type: core_1.Input },],
    };
    exports.Content = Content;
    function Content_tsickle_Closure_declarations() {
        /** @type {?} */
        Content.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Content.ctorParameters;
        /** @type {?} */
        Content.propDecorators;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._cTop;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._cBottom;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._pTop;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._pRight;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._pBottom;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._pLeft;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._scrollPadding;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._hdrHeight;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._ftrHeight;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._tabs;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._tabbarHeight;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._tabsPlacement;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._tTop;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._fTop;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._fBottom;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._inputPolling;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._scroll;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._scLsn;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._fullscreen;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._hasRefresher;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._footerEle;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._dirty;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._imgs;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._viewCtrlReadSub;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._viewCtrlWriteSub;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._scrollDownOnLoad;
        /** @type {?} */
        Content.prototype._imgReqBfr;
        /** @type {?} */
        Content.prototype._imgRndBfr;
        /** @type {?} */
        Content.prototype._imgVelMax;
        /**
         * @hidden
         * @type {?}
         */
        Content.prototype.statusbarPadding;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._fixedContent;
        /**
         * \@internal
         * @type {?}
         */
        Content.prototype._scrollContent;
        /**
         * A number representing how many pixels the top of the content has been
         * adjusted, which could be by either padding or margin. This adjustment
         * is to account for the space needed for the header.
         *
         * @type {?}
         */
        Content.prototype.contentTop;
        /**
         * A number representing how many pixels the bottom of the content has been
         * adjusted, which could be by either padding or margin. This adjustment
         * is to account for the space needed for the footer.
         *
         * @type {?}
         */
        Content.prototype.contentBottom;
        /**
         * \@output {ScrollEvent} Emitted when the scrolling first starts.
         * @type {?}
         */
        Content.prototype.ionScrollStart;
        /**
         * \@output {ScrollEvent} Emitted on every scroll event.
         * @type {?}
         */
        Content.prototype.ionScroll;
        /**
         * \@output {ScrollEvent} Emitted when scrolling ends.
         * @type {?}
         */
        Content.prototype.ionScrollEnd;
        /** @type {?} */
        Content.prototype._plt;
        /** @type {?} */
        Content.prototype._dom;
        /** @type {?} */
        Content.prototype._app;
        /** @type {?} */
        Content.prototype._keyboard;
        /** @type {?} */
        Content.prototype._zone;
    }
    /**
     * @param {?} imgs
     * @param {?} viewableTop
     * @param {?} contentHeight
     * @param {?} scrollDirectionY
     * @param {?} requestableBuffer
     * @param {?} renderableBuffer
     * @return {?}
     */
    function updateImgs(imgs, viewableTop, contentHeight, scrollDirectionY, requestableBuffer, renderableBuffer) {
        // ok, so it's time to see which images, if any, should be requested and rendered
        // ultimately, if we're scrolling fast then don't bother requesting or rendering
        // when scrolling is done, then it needs to do a check to see which images are
        // important to request and render, and which image requests should be aborted.
        // Additionally, images which are not near the viewable area should not be
        // rendered at all in order to save browser resources.
        var /** @type {?} */ viewableBottom = (viewableTop + contentHeight);
        var /** @type {?} */ priority1 = [];
        var /** @type {?} */ priority2 = [];
        var /** @type {?} */ img;
        // all images should be paused
        for (var /** @type {?} */ i = 0, /** @type {?} */ ilen = imgs.length; i < ilen; i++) {
            img = imgs[i];
            if (scrollDirectionY === 'up') {
                // scrolling up
                if (img.top < viewableBottom && img.bottom > viewableTop - renderableBuffer) {
                    // scrolling up, img is within viewable area
                    // or about to be viewable area
                    img.canRequest = img.canRender = true;
                    priority1.push(img);
                    continue;
                }
                if (img.bottom <= viewableTop && img.bottom > viewableTop - requestableBuffer) {
                    // scrolling up, img is within requestable area
                    img.canRequest = true;
                    img.canRender = false;
                    priority2.push(img);
                    continue;
                }
                if (img.top >= viewableBottom && img.top < viewableBottom + renderableBuffer) {
                    // scrolling up, img below viewable area
                    // but it's still within renderable area
                    // don't allow a reset
                    img.canRequest = img.canRender = false;
                    continue;
                }
            }
            else {
                // scrolling down
                if (img.bottom > viewableTop && img.top < viewableBottom + renderableBuffer) {
                    // scrolling down, img is within viewable area
                    // or about to be viewable area
                    img.canRequest = img.canRender = true;
                    priority1.push(img);
                    continue;
                }
                if (img.top >= viewableBottom && img.top < viewableBottom + requestableBuffer) {
                    // scrolling down, img is within requestable area
                    img.canRequest = true;
                    img.canRender = false;
                    priority2.push(img);
                    continue;
                }
                if (img.bottom <= viewableTop && img.bottom > viewableTop - renderableBuffer) {
                    // scrolling down, img above viewable area
                    // but it's still within renderable area
                    // don't allow a reset
                    img.canRequest = img.canRender = false;
                    continue;
                }
            }
            img.canRequest = img.canRender = false;
            img.reset();
        }
        // update all imgs which are viewable
        priority1.sort(sortTopToBottom).forEach(function (i) { return i.update(); });
        if (scrollDirectionY === 'up') {
            // scrolling up
            priority2.sort(sortTopToBottom).reverse().forEach(function (i) { return i.update(); });
        }
        else {
            // scrolling down
            priority2.sort(sortTopToBottom).forEach(function (i) { return i.update(); });
        }
    }
    exports.updateImgs = updateImgs;
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    function sortTopToBottom(a, b) {
        if (a.top < b.top) {
            return -1;
        }
        if (a.top > b.top) {
            return 1;
        }
        return 0;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    function parsePxUnit(val) {
        return (val.indexOf('px') > 0) ? parseInt(val, 10) : 0;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    function cssFormat(val) {
        return (val > 0 ? val + 'px' : '');
    }
});
//# sourceMappingURL=content.js.map