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
    exports.PICKER_OPT_SELECTED = 'picker-opt-selected';
    exports.DECELERATION_FRICTION = 0.97;
    exports.FRAME_MS = (1000 / 60);
    exports.MAX_PICKER_SPEED = 60;
});
//# sourceMappingURL=picker-options.js.map