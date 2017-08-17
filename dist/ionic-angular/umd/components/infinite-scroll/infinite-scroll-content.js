(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../config/config", "./infinite-scroll"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var infinite_scroll_1 = require("./infinite-scroll");
    /**
     * @hidden
     */
    var InfiniteScrollContent = (function () {
        /**
         * @param {?} inf
         * @param {?} _config
         */
        function InfiniteScrollContent(inf, _config) {
            this.inf = inf;
            this._config = _config;
        }
        /**
         * @hidden
         * @return {?}
         */
        InfiniteScrollContent.prototype.ngOnInit = function () {
            if (!this.loadingSpinner) {
                this.loadingSpinner = this._config.get('infiniteLoadingSpinner', this._config.get('spinner', 'ios'));
            }
        };
        return InfiniteScrollContent;
    }());
    InfiniteScrollContent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-infinite-scroll-content',
                    template: '<div class="infinite-loading">' +
                        '<div class="infinite-loading-spinner" *ngIf="loadingSpinner">' +
                        '<ion-spinner [name]="loadingSpinner"></ion-spinner>' +
                        '</div>' +
                        '<div class="infinite-loading-text" [innerHTML]="loadingText" *ngIf="loadingText"></div>' +
                        '</div>',
                    host: {
                        '[attr.state]': 'inf.state'
                    },
                    encapsulation: core_1.ViewEncapsulation.None,
                },] },
    ];
    /**
     * @nocollapse
     */
    InfiniteScrollContent.ctorParameters = function () { return [
        { type: infinite_scroll_1.InfiniteScroll, },
        { type: config_1.Config, },
    ]; };
    InfiniteScrollContent.propDecorators = {
        'loadingSpinner': [{ type: core_1.Input },],
        'loadingText': [{ type: core_1.Input },],
    };
    exports.InfiniteScrollContent = InfiniteScrollContent;
    function InfiniteScrollContent_tsickle_Closure_declarations() {
        /** @type {?} */
        InfiniteScrollContent.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        InfiniteScrollContent.ctorParameters;
        /** @type {?} */
        InfiniteScrollContent.propDecorators;
        /**
         * \@input {string} An animated SVG spinner that shows while loading.
         * @type {?}
         */
        InfiniteScrollContent.prototype.loadingSpinner;
        /**
         * \@input {string} Optional text to display while loading.
         * @type {?}
         */
        InfiniteScrollContent.prototype.loadingText;
        /** @type {?} */
        InfiniteScrollContent.prototype.inf;
        /** @type {?} */
        InfiniteScrollContent.prototype._config;
    }
});
//# sourceMappingURL=infinite-scroll-content.js.map