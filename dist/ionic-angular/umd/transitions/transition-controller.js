(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../config/config", "../util/util", "../platform/platform"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../config/config");
    var util_1 = require("../util/util");
    var platform_1 = require("../platform/platform");
    /**
     * @hidden
     */
    var TransitionController = (function () {
        /**
         * @param {?} plt
         * @param {?} _config
         */
        function TransitionController(plt, _config) {
            this.plt = plt;
            this._config = _config;
            this._ids = 0;
            this._trns = {};
        }
        /**
         * @param {?} nav
         * @return {?}
         */
        TransitionController.prototype.getRootTrnsId = function (nav) {
            nav = (nav.parent);
            while (nav) {
                if (util_1.isPresent(nav._trnsId)) {
                    return nav._trnsId;
                }
                nav = nav.parent;
            }
            return null;
        };
        /**
         * @return {?}
         */
        TransitionController.prototype.nextId = function () {
            return this._ids++;
        };
        /**
         * @param {?} trnsId
         * @param {?} enteringView
         * @param {?} leavingView
         * @param {?} opts
         * @return {?}
         */
        TransitionController.prototype.get = function (trnsId, enteringView, leavingView, opts) {
            var /** @type {?} */ TransitionClass = this._config.getTransition(opts.animation);
            if (!TransitionClass) {
                // didn't find a transition animation, default to ios-transition
                TransitionClass = this._config.getTransition('ios-transition');
            }
            var /** @type {?} */ trns = new TransitionClass(this.plt, enteringView, leavingView, opts);
            trns.trnsId = trnsId;
            if (!this._trns[trnsId]) {
                // we haven't created the root transition yet
                this._trns[trnsId] = trns;
            }
            else {
                // we already have a root transition created
                // add this new transition as a child to the root
                this._trns[trnsId].add(trns);
            }
            return trns;
        };
        /**
         * @param {?} trnsId
         * @return {?}
         */
        TransitionController.prototype.destroy = function (trnsId) {
            var /** @type {?} */ trans = this._trns[trnsId];
            if (trans) {
                trans.destroy();
                delete this._trns[trnsId];
            }
        };
        return TransitionController;
    }());
    TransitionController.decorators = [
        { type: core_1.Injectable },
    ];
    /**
     * @nocollapse
     */
    TransitionController.ctorParameters = function () { return [
        { type: platform_1.Platform, },
        { type: config_1.Config, },
    ]; };
    exports.TransitionController = TransitionController;
    function TransitionController_tsickle_Closure_declarations() {
        /** @type {?} */
        TransitionController.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        TransitionController.ctorParameters;
        /** @type {?} */
        TransitionController.prototype._ids;
        /** @type {?} */
        TransitionController.prototype._trns;
        /** @type {?} */
        TransitionController.prototype.plt;
        /** @type {?} */
        TransitionController.prototype._config;
    }
});
//# sourceMappingURL=transition-controller.js.map