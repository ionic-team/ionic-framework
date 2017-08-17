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
    /**
     * @param {?} plt
     * @return {?}
     */
    function isCordova(plt) {
        var /** @type {?} */ win = plt.win();
        return !!(win['cordova'] || win['PhoneGap'] || win['phonegap']);
    }
    exports.isCordova = isCordova;
    /**
     * @param {?} plt
     * @return {?}
     */
    function isElectron(plt) {
        return plt.testUserAgent('Electron');
    }
    exports.isElectron = isElectron;
    /**
     * @param {?} plt
     * @return {?}
     */
    function isIos(plt) {
        // shortcut function to be reused internally
        // checks navigator.platform to see if it's an actual iOS device
        // this does not use the user-agent string because it is often spoofed
        // an actual iPad will return true, a chrome dev tools iPad will return false
        return plt.testNavigatorPlatform('iphone|ipad|ipod');
    }
    exports.isIos = isIos;
    /**
     * @param {?} plt
     * @return {?}
     */
    function isSafari(plt) {
        return plt.testUserAgent('Safari');
    }
    exports.isSafari = isSafari;
    /**
     * @param {?} plt
     * @return {?}
     */
    function isWKWebView(plt) {
        return isIos(plt) && !!((plt.win()))['webkit'];
    }
    exports.isWKWebView = isWKWebView;
    /**
     * @param {?} plt
     * @return {?}
     */
    function isIosUIWebView(plt) {
        return isIos(plt) && !isWKWebView(plt) && !isSafari(plt);
    }
    exports.isIosUIWebView = isIosUIWebView;
});
//# sourceMappingURL=platform-utils.js.map