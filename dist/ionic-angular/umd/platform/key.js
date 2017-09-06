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
    exports.KEY_LEFT = 37;
    exports.KEY_UP = 38;
    exports.KEY_RIGHT = 39;
    exports.KEY_DOWN = 40;
    exports.KEY_ENTER = 13;
    exports.KEY_ESCAPE = 27;
    exports.KEY_SPACE = 32;
    exports.KEY_TAB = 9;
});
//# sourceMappingURL=key.js.map