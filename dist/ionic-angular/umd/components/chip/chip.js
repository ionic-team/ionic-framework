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
        define(["require", "exports", "@angular/core", "../../config/config", "../ion"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var ion_1 = require("../ion");
    /**
     * \@name Chip
     * \@module ionic
     * \@description
     * Chips represent complex entities in small blocks, such as a contact.
     *
     *
     * \@usage
     *
     * ```html
     * <ion-chip>
     *   <ion-label>Default</ion-label>
     * </ion-chip>
     *
     * <ion-chip>
     *   <ion-label color="secondary">Secondary Label</ion-label>
     * </ion-chip>
     *
     * <ion-chip color="secondary">
     *   <ion-label color="dark">Secondary w/ Dark label</ion-label>
     * </ion-chip>
     *
     * <ion-chip color="danger">
     *   <ion-label>Danger</ion-label>
     * </ion-chip>
     *
     * <ion-chip>
     *   <ion-icon name="pin"></ion-icon>
     *   <ion-label>Default</ion-label>
     * </ion-chip>
     *
     * <ion-chip>
     *   <ion-icon name="heart" color="dark"></ion-icon>
     *   <ion-label>Default</ion-label>
     * </ion-chip>
     *
     * <ion-chip>
     *   <ion-avatar>
     *     <img src="assets/img/my-img.png">
     *   </ion-avatar>
     *   <ion-label>Default</ion-label>
     * </ion-chip>
     * ```
     *
     *
     * \@advanced
     *
     * ```html
     * <ion-chip #chip1>
     *   <ion-label>Default</ion-label>
     *   <button ion-button clear color="light" (click)="delete(chip1)">
     *     <ion-icon name="close-circle"></ion-icon>
     *   </button>
     * </ion-chip>
     *
     * <ion-chip #chip2>
     *   <ion-icon name="pin" color="primary"></ion-icon>
     *   <ion-label>With Icon</ion-label>
     *   <button ion-button (click)="delete(chip2)">
     *     <ion-icon name="close"></ion-icon>
     *   </button>
     * </ion-chip>
     *
     * <ion-chip #chip3>
     *   <ion-avatar>
     *     <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
     *   </ion-avatar>
     *   <ion-label>With Avatar</ion-label>
     *   <button ion-button clear color="dark" (click)="delete(chip3)">
     *     <ion-icon name="close-circle"></ion-icon>
     *   </button>
     * </ion-chip>
     * ```
     *
     * ```ts
     * \@Component({
     *   templateUrl: 'main.html'
     * })
     * class E2EPage {
     *   delete(chip: Element) {
     *     chip.remove();
     *   }
     * }
     * ```
     *
     * \@demo /docs/demos/src/chip/
     *
     */
    var Chip = (function (_super) {
        __extends(Chip, _super);
        /**
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         */
        function Chip(config, elementRef, renderer) {
            return _super.call(this, config, elementRef, renderer, 'chip') || this;
        }
        return Chip;
    }(ion_1.Ion));
    Chip.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-chip'
                },] },
    ];
    /**
     * @nocollapse
     */
    Chip.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
    ]; };
    exports.Chip = Chip;
    function Chip_tsickle_Closure_declarations() {
        /** @type {?} */
        Chip.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Chip.ctorParameters;
    }
});
//# sourceMappingURL=chip.js.map