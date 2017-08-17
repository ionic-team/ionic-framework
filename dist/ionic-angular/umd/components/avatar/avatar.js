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
     * \@name Avatar
     * \@module ionic
     * \@description
     * An Avatar is a component that creates a circular image for an item.
     * Avatars can be placed on the left or right side of an item with the `item-start` or `item-end` directive.
     * @see {\@link /docs/components/#avatar-list Avatar Component Docs}
     */
    var Avatar = (function () {
        function Avatar() {
        }
        return Avatar;
    }());
    Avatar.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-avatar'
                },] },
    ];
    /**
     * @nocollapse
     */
    Avatar.ctorParameters = function () { return []; };
    exports.Avatar = Avatar;
    function Avatar_tsickle_Closure_declarations() {
        /** @type {?} */
        Avatar.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Avatar.ctorParameters;
    }
});
//# sourceMappingURL=avatar.js.map