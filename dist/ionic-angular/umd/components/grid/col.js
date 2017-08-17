(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    /**
     * \@name Col
     * \@module ionic
     * \@description
     *
     * Columns are cellular components of the [grid](../Grid) system and go inside of a [row](../Row).
     * They will expand to fill their row. All content within a grid should go inside of a column.
     *
     * ## Column attributes
     *
     * By default, columns will stretch to fill the entire height of the row.
     * There are several attributes that can be added to a column to customize this behavior.
     *
     * | Property              | Description                                                                                                 |
     * |-----------------------|-------------------------------------------------------------------------------------------------------------|
     * | align-self-start      | Adds `align-self: flex-start`. The column will be vertically aligned at the top.                            |
     * | align-self-center     | Adds `align-self: center`. The column will be vertically aligned in the center.                             |
     * | align-self-end        | Adds `align-self: flex-end`. The column will be vertically aligned at the bottom.                           |
     * | align-self-stretch    | Adds `align-self: stretch`. The column will be stretched to take up the entire height of the row.           |
     * | align-self-baseline   | Adds `align-self: baseline`. The column will be vertically aligned at its baseline.                         |
     *
     *
     */
    var Col = (function () {
        function Col() {
        }
        return Col;
    }());
    Col.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-col, [ion-col]',
                    host: {
                        'class': 'col'
                    }
                },] },
    ];
    /**
     * @nocollapse
     */
    Col.ctorParameters = function () { return []; };
    exports.Col = Col;
    function Col_tsickle_Closure_declarations() {
        /** @type {?} */
        Col.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Col.ctorParameters;
    }
});
//# sourceMappingURL=col.js.map