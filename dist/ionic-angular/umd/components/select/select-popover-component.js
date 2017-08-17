(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../navigation/nav-params", "../../navigation/view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var nav_params_1 = require("../../navigation/nav-params");
    var view_controller_1 = require("../../navigation/view-controller");
    /**
     * @hidden
     */
    var SelectPopover = (function () {
        /**
         * @param {?} navParams
         * @param {?} viewController
         */
        function SelectPopover(navParams, viewController) {
            this.navParams = navParams;
            this.viewController = viewController;
        }
        Object.defineProperty(SelectPopover.prototype, "value", {
            /**
             * @return {?}
             */
            get: function () {
                var /** @type {?} */ checkedOption = this.options.find(function (option) { return option.checked; });
                return checkedOption ? checkedOption.value : undefined;
            },
            /**
             * @param {?} value
             * @return {?}
             */
            set: function (value) {
                var /** @type {?} */ checkedOption = this.options.find(function (option) { return option.value === value; });
                if (checkedOption && checkedOption.handler) {
                    checkedOption.handler();
                }
                this.viewController.dismiss(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        SelectPopover.prototype.ngOnInit = function () {
            this.options = this.navParams.data.options;
        };
        return SelectPopover;
    }());
    SelectPopover.decorators = [
        { type: core_1.Component, args: [{
                    template: "\n    <ion-list radio-group [(ngModel)]=\"value\">\n      <ion-item *ngFor=\"let option of options\">\n        <ion-label>{{option.text}}</ion-label>\n        <ion-radio [checked]=\"option.checked\" [value]=\"option.value\" [disabled]=\"option.disabled\"></ion-radio>\n      </ion-item>\n    </ion-list>\n  "
                },] },
    ];
    /**
     * @nocollapse
     */
    SelectPopover.ctorParameters = function () { return [
        { type: nav_params_1.NavParams, },
        { type: view_controller_1.ViewController, },
    ]; };
    exports.SelectPopover = SelectPopover;
    function SelectPopover_tsickle_Closure_declarations() {
        /** @type {?} */
        SelectPopover.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        SelectPopover.ctorParameters;
        /** @type {?} */
        SelectPopover.prototype.options;
        /** @type {?} */
        SelectPopover.prototype.navParams;
        /** @type {?} */
        SelectPopover.prototype.viewController;
    }
});
//# sourceMappingURL=select-popover-component.js.map