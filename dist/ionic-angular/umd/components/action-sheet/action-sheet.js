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
        define(["require", "exports", "./action-sheet-component", "./action-sheet-transitions", "../../util/util", "../../navigation/view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var action_sheet_component_1 = require("./action-sheet-component");
    var action_sheet_transitions_1 = require("./action-sheet-transitions");
    var util_1 = require("../../util/util");
    var view_controller_1 = require("../../navigation/view-controller");
    /**
     * @hidden
     */
    var ActionSheet = (function (_super) {
        __extends(ActionSheet, _super);
        /**
         * @param {?} app
         * @param {?} opts
         * @param {?} config
         */
        function ActionSheet(app, opts, config) {
            var _this = this;
            opts.buttons = opts.buttons || [];
            opts.enableBackdropDismiss = util_1.isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
            _this = _super.call(this, action_sheet_component_1.ActionSheetCmp, opts, null) || this;
            _this._app = app;
            _this.isOverlay = true;
            config.setTransition('action-sheet-slide-in', action_sheet_transitions_1.ActionSheetSlideIn);
            config.setTransition('action-sheet-slide-out', action_sheet_transitions_1.ActionSheetSlideOut);
            config.setTransition('action-sheet-md-slide-in', action_sheet_transitions_1.ActionSheetMdSlideIn);
            config.setTransition('action-sheet-md-slide-out', action_sheet_transitions_1.ActionSheetMdSlideOut);
            config.setTransition('action-sheet-wp-slide-in', action_sheet_transitions_1.ActionSheetWpSlideIn);
            config.setTransition('action-sheet-wp-slide-out', action_sheet_transitions_1.ActionSheetWpSlideOut);
            return _this;
        }
        /**
         * @hidden
         * @param {?} direction
         * @return {?}
         */
        ActionSheet.prototype.getTransitionName = function (direction) {
            var /** @type {?} */ key = 'actionSheet' + (direction === 'back' ? 'Leave' : 'Enter');
            return this._nav && this._nav.config.get(key);
        };
        /**
         * @param {?} title
         * @return {?}
         */
        ActionSheet.prototype.setTitle = function (title) {
            this.data.title = title;
            return this;
        };
        /**
         * @param {?} subTitle
         * @return {?}
         */
        ActionSheet.prototype.setSubTitle = function (subTitle) {
            this.data.subTitle = subTitle;
            return this;
        };
        /**
         * @param {?} button
         * @return {?}
         */
        ActionSheet.prototype.addButton = function (button) {
            this.data.buttons.push(button);
            return this;
        };
        /**
         * Present the action sheet instance.
         *
         * @param {?=} navOptions
         * @return {?}
         */
        ActionSheet.prototype.present = function (navOptions) {
            if (navOptions === void 0) { navOptions = {}; }
            navOptions.minClickBlockDuration = navOptions.minClickBlockDuration || 400;
            return this._app.present(this, navOptions);
        };
        return ActionSheet;
    }(view_controller_1.ViewController));
    exports.ActionSheet = ActionSheet;
    function ActionSheet_tsickle_Closure_declarations() {
        /** @type {?} */
        ActionSheet.prototype._app;
    }
});
//# sourceMappingURL=action-sheet.js.map