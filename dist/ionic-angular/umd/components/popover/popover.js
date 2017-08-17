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
        define(["require", "exports", "../../navigation/overlay-proxy", "./popover-impl"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var overlay_proxy_1 = require("../../navigation/overlay-proxy");
    var popover_impl_1 = require("./popover-impl");
    /**
     * @hidden
     */
    var Popover = (function (_super) {
        __extends(Popover, _super);
        /**
         * @param {?} app
         * @param {?} component
         * @param {?} data
         * @param {?=} opts
         * @param {?=} config
         * @param {?=} deepLinker
         */
        function Popover(app, component, data, opts, config, deepLinker) {
            if (opts === void 0) { opts = {}; }
            var _this = _super.call(this, app, component, config, deepLinker) || this;
            _this.data = data;
            _this.opts = opts;
            _this.isOverlay = true;
            return _this;
        }
        /**
         * @return {?}
         */
        Popover.prototype.getImplementation = function () {
            return new popover_impl_1.PopoverImpl(this._app, this._component, this.data, this.opts, this._config);
        };
        return Popover;
    }(overlay_proxy_1.OverlayProxy));
    exports.Popover = Popover;
    function Popover_tsickle_Closure_declarations() {
        /** @type {?} */
        Popover.prototype.isOverlay;
        /** @type {?} */
        Popover.prototype.data;
        /** @type {?} */
        Popover.prototype.opts;
    }
});
//# sourceMappingURL=popover.js.map