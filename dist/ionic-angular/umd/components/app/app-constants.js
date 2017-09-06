(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PORTAL_DEFAULT = 1;
    exports.PORTAL_MODAL = 2;
    exports.PORTAL_LOADING = 3;
    exports.PORTAL_TOAST = 4;
});
//# sourceMappingURL=app-constants.js.map