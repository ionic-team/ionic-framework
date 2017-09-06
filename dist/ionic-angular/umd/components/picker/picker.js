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
        define(["require", "exports", "@angular/core", "../../util/util", "./picker-component", "./picker-transitions", "../../navigation/view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var util_1 = require("../../util/util");
    var picker_component_1 = require("./picker-component");
    var picker_transitions_1 = require("./picker-transitions");
    var view_controller_1 = require("../../navigation/view-controller");
    /**
     * @hidden
     */
    var Picker = (function (_super) {
        __extends(Picker, _super);
        /**
         * @param {?} app
         * @param {?=} opts
         * @param {?=} config
         */
        function Picker(app, opts, config) {
            if (opts === void 0) { opts = {}; }
            var _this = this;
            if (!opts) {
                opts = {};
            }
            opts.columns = opts.columns || [];
            opts.buttons = opts.buttons || [];
            opts.enableBackdropDismiss = util_1.isPresent(opts.enableBackdropDismiss) ? Boolean(opts.enableBackdropDismiss) : true;
            _this = _super.call(this, picker_component_1.PickerCmp, opts, null) || this;
            _this._app = app;
            _this.isOverlay = true;
            _this.ionChange = new core_1.EventEmitter();
            config.setTransition('picker-slide-in', picker_transitions_1.PickerSlideIn);
            config.setTransition('picker-slide-out', picker_transitions_1.PickerSlideOut);
            return _this;
        }
        /**
         * @hidden
         * @param {?} direction
         * @return {?}
         */
        Picker.prototype.getTransitionName = function (direction) {
            var /** @type {?} */ key = (direction === 'back' ? 'pickerLeave' : 'pickerEnter');
            return this._nav && this._nav.config.get(key);
        };
        /**
         * @param {?} button
         * @return {?}
         */
        Picker.prototype.addButton = function (button) {
            this.data.buttons.push(button);
        };
        /**
         * @param {?} column
         * @return {?}
         */
        Picker.prototype.addColumn = function (column) {
            this.data.columns.push(column);
        };
        /**
         * @return {?}
         */
        Picker.prototype.getColumns = function () {
            return this.data.columns;
        };
        /**
         * @param {?} name
         * @return {?}
         */
        Picker.prototype.getColumn = function (name) {
            return this.getColumns().find(function (column) { return column.name === name; });
        };
        /**
         * @return {?}
         */
        Picker.prototype.refresh = function () {
            (void 0) /* assert */;
            (void 0) /* assert */;
            this._cmp && this._cmp.instance.refresh && this._cmp.instance.refresh();
        };
        /**
         * @param {?} cssClass
         * @return {?}
         */
        Picker.prototype.setCssClass = function (cssClass) {
            this.data.cssClass = cssClass;
        };
        /**
         * Present the picker instance.
         *
         * @param {?=} navOptions
         * @return {?}
         */
        Picker.prototype.present = function (navOptions) {
            if (navOptions === void 0) { navOptions = {}; }
            return this._app.present(this, navOptions);
        };
        return Picker;
    }(view_controller_1.ViewController));
    Picker.propDecorators = {
        'ionChange': [{ type: core_1.Output },],
    };
    exports.Picker = Picker;
    function Picker_tsickle_Closure_declarations() {
        /** @type {?} */
        Picker.propDecorators;
        /** @type {?} */
        Picker.prototype._app;
        /** @type {?} */
        Picker.prototype.ionChange;
    }
});
//# sourceMappingURL=picker.js.map