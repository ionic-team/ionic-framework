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
    exports.MODE_IOS = {
        activator: 'highlight',
        actionSheetEnter: 'action-sheet-slide-in',
        actionSheetLeave: 'action-sheet-slide-out',
        alertEnter: 'alert-pop-in',
        alertLeave: 'alert-pop-out',
        backButtonText: 'Back',
        backButtonIcon: 'ios-arrow-back',
        iconMode: 'ios',
        loadingEnter: 'loading-pop-in',
        loadingLeave: 'loading-pop-out',
        menuType: 'reveal',
        modalEnter: 'modal-slide-in',
        modalLeave: 'modal-slide-out',
        pageTransition: 'ios-transition',
        pickerEnter: 'picker-slide-in',
        pickerLeave: 'picker-slide-out',
        pickerRotateFactor: -0.46,
        pickerScaleFactor: 1,
        popoverEnter: 'popover-pop-in',
        popoverLeave: 'popover-pop-out',
        spinner: 'ios',
        tabsHighlight: false,
        tabsPlacement: 'bottom',
        tabsHideOnSubPages: false,
        toastEnter: 'toast-slide-in',
        toastLeave: 'toast-slide-out',
    };
    exports.MODE_MD = {
        activator: 'ripple',
        actionSheetEnter: 'action-sheet-md-slide-in',
        actionSheetLeave: 'action-sheet-md-slide-out',
        alertEnter: 'alert-md-pop-in',
        alertLeave: 'alert-md-pop-out',
        backButtonText: '',
        backButtonIcon: 'md-arrow-back',
        iconMode: 'md',
        loadingEnter: 'loading-md-pop-in',
        loadingLeave: 'loading-md-pop-out',
        menuType: 'overlay',
        modalEnter: 'modal-md-slide-in',
        modalLeave: 'modal-md-slide-out',
        pageTransition: 'md-transition',
        pickerEnter: 'picker-slide-in',
        pickerLeave: 'picker-slide-out',
        pickerRotateFactor: 0,
        pickerScaleFactor: 0.81,
        popoverEnter: 'popover-md-pop-in',
        popoverLeave: 'popover-md-pop-out',
        spinner: 'crescent',
        tabsHighlight: false,
        tabsPlacement: 'bottom',
        tabsHideOnSubPages: false,
        toastEnter: 'toast-md-slide-in',
        toastLeave: 'toast-md-slide-out',
    };
    exports.MODE_WP = {
        activator: 'highlight',
        actionSheetEnter: 'action-sheet-wp-slide-in',
        actionSheetLeave: 'action-sheet-wp-slide-out',
        alertEnter: 'alert-wp-pop-in',
        alertLeave: 'alert-wp-pop-out',
        backButtonText: '',
        backButtonIcon: 'ios-arrow-back',
        iconMode: 'ios',
        loadingEnter: 'loading-wp-pop-in',
        loadingLeave: 'loading-wp-pop-out',
        menuType: 'overlay',
        modalEnter: 'modal-md-slide-in',
        modalLeave: 'modal-md-slide-out',
        pageTransition: 'wp-transition',
        pickerEnter: 'picker-slide-in',
        pickerLeave: 'picker-slide-out',
        pickerRotateFactor: 0,
        pickerScaleFactor: 0.81,
        popoverEnter: 'popover-md-pop-in',
        popoverLeave: 'popover-md-pop-out',
        spinner: 'circles',
        tabsHighlight: false,
        tabsPlacement: 'top',
        tabsHideOnSubPages: true,
        toastEnter: 'toast-wp-slide-in',
        toastLeave: 'toast-wp-slide-out',
    };
    /**
     * @param {?} config
     * @return {?}
     */
    function registerModeConfigs(config) {
        return function () {
            // iOS Mode Settings
            config.setModeConfig('ios', exports.MODE_IOS);
            // Material Design Mode Settings
            config.setModeConfig('md', exports.MODE_MD);
            // Windows Mode Settings
            config.setModeConfig('wp', exports.MODE_WP);
        };
    }
    exports.registerModeConfigs = registerModeConfigs;
});
//# sourceMappingURL=mode-registry.js.map