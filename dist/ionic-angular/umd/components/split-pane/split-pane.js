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
        define(["require", "exports", "@angular/core", "../ion", "../../util/util", "../../config/config", "../../platform/platform"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var ion_1 = require("../ion");
    var util_1 = require("../../util/util");
    var config_1 = require("../../config/config");
    var platform_1 = require("../../platform/platform");
    var /** @type {?} */ QUERY = {
        xs: '(min-width: 0px)',
        sm: '(min-width: 576px)',
        md: '(min-width: 768px)',
        lg: '(min-width: 992px)',
        xl: '(min-width: 1200px)',
        never: ''
    };
    /**
     * @hidden
     * @abstract
     */
    var RootNode = (function () {
        function RootNode() {
        }
        /**
         * @abstract
         * @return {?}
         */
        RootNode.prototype.getElementRef = function () { };
        /**
         * @abstract
         * @return {?}
         */
        RootNode.prototype.initPane = function () { };
        /**
         * @abstract
         * @param {?} visible
         * @return {?}
         */
        RootNode.prototype.paneChanged = function (visible) { };
        return RootNode;
    }());
    exports.RootNode = RootNode;
    /**
     * \@name SplitPane
     *
     * \@description
     * SplitPane is a component that makes it possible to create multi-view layout.
     * Similar to iPad apps, SplitPane allows UI elements, like Menus, to be
     * displayed as the viewport increases.
     *
     * If the devices screen size is below a certain size, the SplitPane will
     * collapse and the menu will become hidden again. This is especially useful when
     * creating an app that will be served over a browser or deployed through the app
     * store to phones and tablets.
     *
     * \@usage
     * To use SplitPane, simply add the component around your root component.
     * In this example, we'll be using a sidemenu layout, similar to what is
     * provided from the sidemenu starter template.
     *
     *  ```html
     *  <ion-split-pane>
     *    <!--  our side menu  -->
     *    <ion-menu [content]="content">
     *      <ion-header>
     *        <ion-toolbar>
     *          <ion-title>Menu</ion-title>
     *        </ion-toolbar>
     *      </ion-header>
     *    </ion-menu>
     *
     *    <!-- the main content -->
     *    <ion-nav [root]="root" main #content></ion-nav>
     *  </ion-split-pane>
     *  ```
     *
     *  Here, SplitPane will look for the element with the `main` attribute and make
     *  that the central component on larger screens. The `main` component can be any
     *  Ionic component (`ion-nav` or `ion-tabs`) except `ion-menu`.
     *
     *  ### Setting breakpoints
     *
     *  By default, SplitPane will expand when the screen is larger than 768px.
     *  If you want to customize this, use the `when` input. The `when` input can
     *  accept any valid media query, as it uses `matchMedia()` underneath.
     *
     *  ```
     *  <ion-split-pane when="(min-width: 475px)">
     *
     *    <!--  our side menu  -->
     *    <ion-menu [content]="content">
     *    ....
     *    </ion-menu>
     *
     *    <!-- the main content -->
     *    <ion-nav [root]="root" main #content></ion-nav>
     *  </ion-split-pane>
     *  ```
     *
     *  SplitPane also provides some predefined media queries that can be used.
     *
     *  ```html
     *  <!-- could be "xs", "sm", "md", "lg", or "xl" -->
     *  <ion-split-pane when="lg">
     *  ...
     *  </ion-split-pane>
     *  ```
     *
     *
     *  | Size | Value                 | Description                                                           |
     *  |------|-----------------------|-----------------------------------------------------------------------|
     *  | `xs` | `(min-width: 0px)`    | Show the split-pane when the min-width is 0px (meaning, always)       |
     *  | `sm` | `(min-width: 576px)`  | Show the split-pane when the min-width is 576px                       |
     *  | `md` | `(min-width: 768px)`  | Show the split-pane when the min-width is 768px (default break point) |
     *  | `lg` | `(min-width: 992px)`  | Show the split-pane when the min-width is 992px                       |
     *  | `xl` | `(min-width: 1200px)` | Show the split-pane when the min-width is 1200px                      |
     *
     *  You can also pass in boolean values that will trigger SplitPane when the value
     *  or expression evaluates to true.
     *
     *
     *  ```html
     *  <ion-split-pane [when]="isLarge">
     *  ...
     *  </ion-split-pane>
     *  ```
     *
     *  ```ts
     *  class MyClass {
     *    public isLarge = false;
     *    constructor(){}
     *  }
     *  ```
     *
     *  Or
     *
     *  ```html
     *  <ion-split-pane [when]="shouldShow()">
     *  ...
     *  </ion-split-pane>
     *  ```
     *
     *  ```ts
     *  class MyClass {
     *    constructor(){}
     *    shouldShow(){
     *      if(conditionA){
     *        return true
     *      } else {
     *        return false
     *      }
     *    }
     *  }
     *  ```
     *
     */
    var SplitPane = (function (_super) {
        __extends(SplitPane, _super);
        /**
         * @param {?} _zone
         * @param {?} _plt
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         */
        function SplitPane(_zone, _plt, config, elementRef, renderer) {
            var _this = _super.call(this, config, elementRef, renderer, 'split-pane') || this;
            _this._zone = _zone;
            _this._plt = _plt;
            _this._init = false;
            _this._visible = false;
            _this._isEnabled = true;
            _this._mediaQuery = QUERY['md'];
            /**
             * @hidden
             */
            _this.sideContent = null;
            /**
             * @hidden
             */
            _this.mainContent = null;
            /**
             * \@output {any} Expression to be called when the split-pane visibility has changed
             */
            _this.ionChange = new core_1.EventEmitter();
            return _this;
        }
        Object.defineProperty(SplitPane.prototype, "_setchildren", {
            /**
             * @hidden
             * @param {?} query
             * @return {?}
             */
            set: function (query) {
                var _this = this;
                var /** @type {?} */ children = this._children = query.filter((function (child) { return child !== _this; }));
                children.forEach(function (child) {
                    var /** @type {?} */ isMain = child.initPane();
                    _this._setPaneCSSClass(child.getElementRef(), isMain);
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitPane.prototype, "when", {
            /**
             * @return {?}
             */
            get: function () {
                return this._mediaQuery;
            },
            /**
             * \@input {string | boolean} When the split-pane should be shown.
             * Can be a CSS media query expression, or a shortcut expression.
             * Can also be a boolean expression.
             * @param {?} query
             * @return {?}
             */
            set: function (query) {
                if (typeof query === 'boolean') {
                    this._mediaQuery = query;
                }
                else {
                    var /** @type {?} */ defaultQuery = QUERY[query];
                    this._mediaQuery = (defaultQuery)
                        ? defaultQuery
                        : query;
                }
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitPane.prototype, "enabled", {
            /**
             * @return {?}
             */
            get: function () {
                return this._isEnabled;
            },
            /**
             * \@input {boolean} If `false`, the split-pane is disabled, ie. the side pane will
             * never be displayed. Default `true`.
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._isEnabled = util_1.isTrueProperty(val);
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @hidden
         * @param {?} node
         * @param {?} isMain
         * @param {?} callback
         * @return {?}
         */
        SplitPane.prototype._register = function (node, isMain, callback) {
            if (this.getElementRef().nativeElement !== node.getElementRef().nativeElement.parentNode) {
                return false;
            }
            this._setPaneCSSClass(node.getElementRef(), isMain);
            if (callback) {
                this.ionChange.subscribe(callback);
            }
            if (isMain) {
                if (this.mainContent) {
                    console.error('split pane: main content was already set');
                }
                this.mainContent = node;
            }
            return true;
        };
        /**
         * @hidden
         * @return {?}
         */
        SplitPane.prototype.ngAfterViewInit = function () {
            this._init = true;
            this._update();
        };
        /**
         * @hidden
         * @return {?}
         */
        SplitPane.prototype._update = function () {
            var _this = this;
            if (!this._init) {
                return;
            }
            // Unlisten
            this._rmListener && this._rmListener();
            this._rmListener = null;
            // Check if the split-pane is disabled
            if (!this._isEnabled) {
                this._setVisible(false);
                return;
            }
            var /** @type {?} */ query = this._mediaQuery;
            if (typeof query === 'boolean') {
                this._setVisible(query);
                return;
            }
            if (query && query.length > 0) {
                // Listen
                var /** @type {?} */ callback_1 = function (query) { return _this._setVisible(query.matches); };
                var /** @type {?} */ mediaList_1 = this._plt.win().matchMedia(query);
                mediaList_1.addListener(callback_1);
                this._setVisible(mediaList_1.matches);
                this._rmListener = function () {
                    mediaList_1.removeListener(callback_1);
                };
            }
            else {
                this._setVisible(false);
            }
        };
        /**
         * @hidden
         * @return {?}
         */
        SplitPane.prototype._updateChildren = function () {
            this.mainContent = null;
            this.sideContent = null;
            var /** @type {?} */ visible = this._visible;
            this._children.forEach(function (child) { return child.paneChanged && child.paneChanged(visible); });
        };
        /**
         * @hidden
         * @param {?} visible
         * @return {?}
         */
        SplitPane.prototype._setVisible = function (visible) {
            var _this = this;
            if (this._visible === visible) {
                return;
            }
            this._visible = visible;
            this.setElementClass('split-pane-visible', visible);
            this._updateChildren();
            this._zone.run(function () {
                _this.ionChange.emit(_this);
            });
        };
        /**
         * @hidden
         * @return {?}
         */
        SplitPane.prototype.isVisible = function () {
            return this._visible;
        };
        /**
         * @hidden
         * @param {?} className
         * @param {?} add
         * @return {?}
         */
        SplitPane.prototype.setElementClass = function (className, add) {
            this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
        };
        /**
         * @hidden
         * @param {?} elementRef
         * @param {?} isMain
         * @return {?}
         */
        SplitPane.prototype._setPaneCSSClass = function (elementRef, isMain) {
            var /** @type {?} */ ele = elementRef.nativeElement;
            this._renderer.setElementClass(ele, 'split-pane-main', isMain);
            this._renderer.setElementClass(ele, 'split-pane-side', !isMain);
        };
        /**
         * @hidden
         * @return {?}
         */
        SplitPane.prototype.ngOnDestroy = function () {
            (void 0) /* assert */;
            this._rmListener && this._rmListener();
            this._rmListener = null;
        };
        /**
         * @hidden
         * @return {?}
         */
        SplitPane.prototype.initPane = function () {
            return true;
        };
        return SplitPane;
    }(ion_1.Ion));
    SplitPane.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-split-pane',
                    providers: [{ provide: RootNode, useExisting: core_1.forwardRef(function () { return SplitPane; }) }]
                },] },
    ];
    /**
     * @nocollapse
     */
    SplitPane.ctorParameters = function () { return [
        { type: core_1.NgZone, },
        { type: platform_1.Platform, },
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
    ]; };
    SplitPane.propDecorators = {
        '_setchildren': [{ type: core_1.ContentChildren, args: [RootNode, { descendants: false },] },],
        'when': [{ type: core_1.Input },],
        'enabled': [{ type: core_1.Input },],
        'ionChange': [{ type: core_1.Output },],
    };
    exports.SplitPane = SplitPane;
    function SplitPane_tsickle_Closure_declarations() {
        /** @type {?} */
        SplitPane.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        SplitPane.ctorParameters;
        /** @type {?} */
        SplitPane.propDecorators;
        /** @type {?} */
        SplitPane.prototype._init;
        /** @type {?} */
        SplitPane.prototype._visible;
        /** @type {?} */
        SplitPane.prototype._isEnabled;
        /** @type {?} */
        SplitPane.prototype._rmListener;
        /** @type {?} */
        SplitPane.prototype._mediaQuery;
        /** @type {?} */
        SplitPane.prototype._children;
        /**
         * @hidden
         * @type {?}
         */
        SplitPane.prototype.sideContent;
        /**
         * @hidden
         * @type {?}
         */
        SplitPane.prototype.mainContent;
        /**
         * \@output {any} Expression to be called when the split-pane visibility has changed
         * @type {?}
         */
        SplitPane.prototype.ionChange;
        /** @type {?} */
        SplitPane.prototype._zone;
        /** @type {?} */
        SplitPane.prototype._plt;
    }
});
//# sourceMappingURL=split-pane.js.map