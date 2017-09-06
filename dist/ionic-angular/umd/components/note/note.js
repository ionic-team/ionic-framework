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
     * \@name Note
     * \@module ionic
     * \@description
     * A note is detailed item in an ion-item. It creates greyed out element that can be on the left or right side of an item.
     * \@usage
     *
     * ```html
     * <ion-content>
     *   <ion-list>
     *     <ion-item>
     *       <ion-note item-start>
     *         Left Note
     *       </ion-note>
     *       My Item
     *       <ion-note item-end>
     *         Right Note
     *       </ion-note>
     *     </ion-item>
     *   </ion-list>
     * </ion-content>
     * ```
     * {\@link /docs/api/components/api/components/item/item ion-item}
     */
    var Note = (function (_super) {
        __extends(Note, _super);
        /**
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         */
        function Note(config, elementRef, renderer) {
            return _super.call(this, config, elementRef, renderer, 'note') || this;
        }
        return Note;
    }(ion_1.Ion));
    Note.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-note'
                },] },
    ];
    /**
     * @nocollapse
     */
    Note.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
    ]; };
    exports.Note = Note;
    function Note_tsickle_Closure_declarations() {
        /** @type {?} */
        Note.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Note.ctorParameters;
    }
});
//# sourceMappingURL=note.js.map