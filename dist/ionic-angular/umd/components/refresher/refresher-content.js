(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../config/config", "./refresher"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var refresher_1 = require("./refresher");
    /**
     * @hidden
     */
    var RefresherContent = (function () {
        /**
         * @param {?} r
         * @param {?} _config
         */
        function RefresherContent(r, _config) {
            this.r = r;
            this._config = _config;
        }
        /**
         * @hidden
         * @return {?}
         */
        RefresherContent.prototype.ngOnInit = function () {
            if (!this.pullingIcon) {
                this.pullingIcon = this._config.get('ionPullIcon', 'arrow-down');
            }
            if (!this.refreshingSpinner) {
                this.refreshingSpinner = this._config.get('ionRefreshingSpinner', this._config.get('spinner', 'ios'));
            }
        };
        return RefresherContent;
    }());
    RefresherContent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-refresher-content',
                    template: '<div class="refresher-pulling">' +
                        '<div class="refresher-pulling-icon" *ngIf="pullingIcon">' +
                        '<ion-icon [name]="pullingIcon"></ion-icon>' +
                        '</div>' +
                        '<div class="refresher-pulling-text" [innerHTML]="pullingText" *ngIf="pullingText"></div>' +
                        '</div>' +
                        '<div class="refresher-refreshing">' +
                        '<div class="refresher-refreshing-icon">' +
                        '<ion-spinner [name]="refreshingSpinner"></ion-spinner>' +
                        '</div>' +
                        '<div class="refresher-refreshing-text" [innerHTML]="refreshingText" *ngIf="refreshingText"></div>' +
                        '</div>',
                    host: {
                        '[attr.state]': 'r.state'
                    },
                    encapsulation: core_1.ViewEncapsulation.None,
                },] },
    ];
    /**
     * @nocollapse
     */
    RefresherContent.ctorParameters = function () { return [
        { type: refresher_1.Refresher, },
        { type: config_1.Config, },
    ]; };
    RefresherContent.propDecorators = {
        'pullingIcon': [{ type: core_1.Input },],
        'pullingText': [{ type: core_1.Input },],
        'refreshingSpinner': [{ type: core_1.Input },],
        'refreshingText': [{ type: core_1.Input },],
    };
    exports.RefresherContent = RefresherContent;
    function RefresherContent_tsickle_Closure_declarations() {
        /** @type {?} */
        RefresherContent.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        RefresherContent.ctorParameters;
        /** @type {?} */
        RefresherContent.propDecorators;
        /**
         * \@input {string} a static icon to display when you begin to pull down
         * @type {?}
         */
        RefresherContent.prototype.pullingIcon;
        /**
         * \@input {string} the text you want to display when you begin to pull down
         * @type {?}
         */
        RefresherContent.prototype.pullingText;
        /**
         * \@input {string} An animated SVG spinner that shows when refreshing begins
         * @type {?}
         */
        RefresherContent.prototype.refreshingSpinner;
        /**
         * \@input {string} the text you want to display when performing a refresh
         * @type {?}
         */
        RefresherContent.prototype.refreshingText;
        /** @type {?} */
        RefresherContent.prototype.r;
        /** @type {?} */
        RefresherContent.prototype._config;
    }
});
//# sourceMappingURL=refresher-content.js.map