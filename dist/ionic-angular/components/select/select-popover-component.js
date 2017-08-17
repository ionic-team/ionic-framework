import { Component } from '@angular/core';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
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
export { SelectPopover };
SelectPopover.decorators = [
    { type: Component, args: [{
                template: "\n    <ion-list radio-group [(ngModel)]=\"value\">\n      <ion-item *ngFor=\"let option of options\">\n        <ion-label>{{option.text}}</ion-label>\n        <ion-radio [checked]=\"option.checked\" [value]=\"option.value\" [disabled]=\"option.disabled\"></ion-radio>\n      </ion-item>\n    </ion-list>\n  "
            },] },
];
/**
 * @nocollapse
 */
SelectPopover.ctorParameters = function () { return [
    { type: NavParams, },
    { type: ViewController, },
]; };
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
//# sourceMappingURL=select-popover-component.js.map