/**
 * @param {?} plt
 * @return {?}
 */
export function isCordova(plt) {
    var /** @type {?} */ win = plt.win();
    return !!(win['cordova'] || win['PhoneGap'] || win['phonegap']);
}
/**
 * @param {?} plt
 * @return {?}
 */
export function isElectron(plt) {
    return plt.testUserAgent('Electron');
}
/**
 * @param {?} plt
 * @return {?}
 */
export function isIos(plt) {
    // shortcut function to be reused internally
    // checks navigator.platform to see if it's an actual iOS device
    // this does not use the user-agent string because it is often spoofed
    // an actual iPad will return true, a chrome dev tools iPad will return false
    return plt.testNavigatorPlatform('iphone|ipad|ipod');
}
/**
 * @param {?} plt
 * @return {?}
 */
export function isSafari(plt) {
    return plt.testUserAgent('Safari');
}
/**
 * @param {?} plt
 * @return {?}
 */
export function isWKWebView(plt) {
    return isIos(plt) && !!((plt.win()))['webkit'];
}
/**
 * @param {?} plt
 * @return {?}
 */
export function isIosUIWebView(plt) {
    return isIos(plt) && !isWKWebView(plt) && !isSafari(plt);
}
//# sourceMappingURL=platform-utils.js.map