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
     * \@name Thumbnail
     * \@module ionic
     * \@description
     * A Thumbnail is a component that creates a squared image for an item.
     * Thumbnails can be place on the left or right side of an item with the `item-start` or `item-end` directive.
     * @see {\@link /docs/components/#thumbnail-list Thumbnail Component Docs}
     */
    var Thumbnail = (function () {
        function Thumbnail() {
        }
        return Thumbnail;
    }());
    Thumbnail.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-thumbnail'
                },] },
    ];
    /**
     * @nocollapse
     */
    Thumbnail.ctorParameters = function () { return []; };
    exports.Thumbnail = Thumbnail;
    function Thumbnail_tsickle_Closure_declarations() {
        /** @type {?} */
        Thumbnail.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Thumbnail.ctorParameters;
    }
});
//# sourceMappingURL=thumbnail.js.map