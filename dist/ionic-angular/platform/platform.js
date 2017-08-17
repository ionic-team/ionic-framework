import { EventEmitter } from '@angular/core';
import { getCss, isTextInput } from '../util/dom';
import { QueryParams } from './query-params';
import { removeArrayItem } from '../util/util';
/**
 * \@name Platform
 * \@description
 * The Platform service can be used to get information about your current device.
 * You can get all of the platforms associated with the device using the [platforms](#platforms)
 * method, including whether the app is being viewed from a tablet, if it's
 * on a mobile device or browser, and the exact platform (iOS, Android, etc).
 * You can also get the orientation of the device, if it uses right-to-left
 * language direction, and much much more. With this information you can completely
 * customize your app to fit any device.
 *
 * \@usage
 * ```ts
 * import { Platform } from 'ionic-angular';
 *
 * \@Component({...})
 * export MyPage {
 *   constructor(public plt: Platform) {
 *
 *   }
 * }
 * ```
 * \@demo /docs/demos/src/platform/
 */
var Platform = (function () {
    function Platform() {
        var _this = this;
        this._versions = {};
        this._qp = new QueryParams();
        this._bbActions = [];
        this._pW = 0;
        this._pH = 0;
        this._lW = 0;
        this._lH = 0;
        this._isPortrait = null;
        this._uiEvtOpts = false;
        /**
         * \@internal
         */
        this._platforms = [];
        /**
         * @hidden
         */
        this.backButton = new EventEmitter();
        /**
         * The pause event emits when the native platform puts the application
         * into the background, typically when the user switches to a different
         * application. This event would emit when a Cordova app is put into
         * the background, however, it would not fire on a standard web browser.
         */
        this.pause = new EventEmitter();
        /**
         * The resume event emits when the native platform pulls the application
         * out from the background. This event would emit when a Cordova app comes
         * out from the background, however, it would not fire on a standard web browser.
         */
        this.resume = new EventEmitter();
        /**
         * The resize event emits when the native platform pulls the application
         * out from the background. This event would emit when a Cordova app comes
         * out from the background, however, it would not fire on a standard web browser.
         */
        this.resize = new EventEmitter();
        this._readyPromise = new Promise(function (res) { _this._readyResolve = res; });
        this.backButton.subscribe(function () {
            // the hardware back button event has been fired
            (void 0) /* console.debug */;
            // decide which backbutton action should run
            _this.runBackButtonAction();
        });
    }
    /**
     * @hidden
     * @param {?} win
     * @return {?}
     */
    Platform.prototype.setWindow = function (win) {
        this._win = win;
    };
    /**
     * @hidden
     * @return {?}
     */
    Platform.prototype.win = function () {
        return this._win;
    };
    /**
     * @hidden
     * @param {?} doc
     * @return {?}
     */
    Platform.prototype.setDocument = function (doc) {
        this._doc = doc;
    };
    /**
     * @hidden
     * @return {?}
     */
    Platform.prototype.doc = function () {
        return this._doc;
    };
    /**
     * @hidden
     * @param {?} zone
     * @return {?}
     */
    Platform.prototype.setZone = function (zone) {
        this.zone = zone;
    };
    /**
     * @hidden
     * @param {?} docElement
     * @return {?}
     */
    Platform.prototype.setCssProps = function (docElement) {
        this.Css = getCss(docElement);
    };
    /**
     * \@description
     * Depending on the platform the user is on, `is(platformName)` will
     * return `true` or `false`. Note that the same app can return `true`
     * for more than one platform name. For example, an app running from
     * an iPad would return `true` for the platform names: `mobile`,
     * `ios`, `ipad`, and `tablet`. Additionally, if the app was running
     * from Cordova then `cordova` would be true, and if it was running
     * from a web browser on the iPad then `mobileweb` would be `true`.
     *
     * ```
     * import { Platform } from 'ionic-angular';
     *
     * \@Component({...})
     * export MyPage {
     *   constructor(public plt: Platform) {
     *     if (this.plt.is('ios')) {
     *       // This will only print when on iOS
     *       console.log('I am an iOS device!');
     *     }
     *   }
     * }
     * ```
     *
     * | Platform Name   | Description                        |
     * |-----------------|------------------------------------|
     * | android         | on a device running Android.       |
     * | cordova         | on a device running Cordova.       |
     * | core            | on a desktop device.               |
     * | ios             | on a device running iOS.           |
     * | ipad            | on an iPad device.                 |
     * | iphone          | on an iPhone device.               |
     * | mobile          | on a mobile device.                |
     * | mobileweb       | in a browser on a mobile device.   |
     * | phablet         | on a phablet device.               |
     * | tablet          | on a tablet device.                |
     * | windows         | on a device running Windows.       |
     *
     * @param {?} platformName
     * @return {?}
     */
    Platform.prototype.is = function (platformName) {
        return (this._platforms.indexOf(platformName) > -1);
    };
    /**
     * \@description
     * Depending on what device you are on, `platforms` can return multiple values.
     * Each possible value is a hierarchy of platforms. For example, on an iPhone,
     * it would return `mobile`, `ios`, and `iphone`.
     *
     * ```
     * import { Platform } from 'ionic-angular';
     *
     * \@Component({...})
     * export MyPage {
     *   constructor(public plt: Platform) {
     *     // This will print an array of the current platforms
     *     console.log(this.plt.platforms());
     *   }
     * }
     * ```
     * @return {?}
     */
    Platform.prototype.platforms = function () {
        // get the array of active platforms, which also knows the hierarchy,
        // with the last one the most important
        return this._platforms;
    };
    /**
     * Returns an object containing version information about all of the platforms.
     *
     * ```
     * import { Platform } from 'ionic-angular';
     *
     * \@Component({...})
     * export MyPage {
     *   constructor(public plt: Platform) {
     *     // This will print an object containing
     *     // all of the platforms and their versions
     *     console.log(plt.versions());
     *   }
     * }
     * ```
     *
     * @return {?}
     */
    Platform.prototype.versions = function () {
        // get all the platforms that have a valid parsed version
        return this._versions;
    };
    /**
     * @hidden
     * @return {?}
     */
    Platform.prototype.version = function () {
        for (var /** @type {?} */ platformName in this._versions) {
            if (this._versions[platformName]) {
                return this._versions[platformName];
            }
        }
        return {};
    };
    /**
     * Returns a promise when the platform is ready and native functionality
     * can be called. If the app is running from within a web browser, then
     * the promise will resolve when the DOM is ready. When the app is running
     * from an application engine such as Cordova, then the promise will
     * resolve when Cordova triggers the `deviceready` event.
     *
     * The resolved value is the `readySource`, which states which platform
     * ready was used. For example, when Cordova is ready, the resolved ready
     * source is `cordova`. The default ready source value will be `dom`. The
     * `readySource` is useful if different logic should run depending on the
     * platform the app is running from. For example, only Cordova can execute
     * the status bar plugin, so the web should not run status bar plugin logic.
     *
     * ```
     * import { Component } from '\@angular/core';
     * import { Platform } from 'ionic-angular';
     *
     * \@Component({...})
     * export MyApp {
     *   constructor(public plt: Platform) {
     *     this.plt.ready().then((readySource) => {
     *       console.log('Platform ready from', readySource);
     *       // Platform now ready, execute any required native code
     *     });
     *   }
     * }
     * ```
     * @return {?}
     */
    Platform.prototype.ready = function () {
        return this._readyPromise;
    };
    /**
     * @hidden
     * This should be triggered by the engine when the platform is
     * ready. If there was no custom prepareReady method from the engine,
     * such as Cordova or Electron, then it uses the default DOM ready.
     * @param {?} readySource
     * @return {?}
     */
    Platform.prototype.triggerReady = function (readySource) {
        var _this = this;
        this.zone.run(function () {
            _this._readyResolve(readySource);
        });
    };
    /**
     * @hidden
     * This is the default prepareReady if it's not replaced by an engine,
     * such as Cordova or Electron. If there was no custom prepareReady
     * method from an engine then it uses the method below, which triggers
     * the platform ready on the DOM ready event, and the default resolved
     * value is `dom`.
     * @return {?}
     */
    Platform.prototype.prepareReady = function () {
        var /** @type {?} */ self = this;
        if (self._doc.readyState === 'complete' || self._doc.readyState === 'interactive') {
            self.triggerReady('dom');
        }
        else {
            self._doc.addEventListener('DOMContentLoaded', completed, false);
            self._win.addEventListener('load', completed, false);
        }
        /**
         * @return {?}
         */
        function completed() {
            self._doc.removeEventListener('DOMContentLoaded', completed, false);
            self._win.removeEventListener('load', completed, false);
            self.triggerReady('dom');
        }
    };
    /**
     * Set the app's language direction, which will update the `dir` attribute
     * on the app's root `<html>` element. We recommend the app's `index.html`
     * file already has the correct `dir` attribute value set, such as
     * `<html dir="ltr">` or `<html dir="rtl">`. This method is useful if the
     * direction needs to be dynamically changed per user/session.
     * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
     * @param {?} dir
     * @param {?} updateDocument
     * @return {?}
     */
    Platform.prototype.setDir = function (dir, updateDocument) {
        this._dir = dir;
        this.isRTL = (dir === 'rtl');
        if (updateDocument !== false) {
            this._doc['documentElement'].setAttribute('dir', dir);
        }
    };
    /**
     * Returns app's language direction.
     * We recommend the app's `index.html` file already has the correct `dir`
     * attribute value set, such as `<html dir="ltr">` or `<html dir="rtl">`.
     * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
     * @return {?}
     */
    Platform.prototype.dir = function () {
        return this._dir;
    };
    /**
     * Set the app's language and optionally the country code, which will update
     * the `lang` attribute on the app's root `<html>` element.
     * We recommend the app's `index.html` file already has the correct `lang`
     * attribute value set, such as `<html lang="en">`. This method is useful if
     * the language needs to be dynamically changed per user/session.
     * [W3C: Declaring language in HTML](http://www.w3.org/International/questions/qa-html-language-declarations)
     * @param {?} language
     * @param {?} updateDocument
     * @return {?}
     */
    Platform.prototype.setLang = function (language, updateDocument) {
        this._lang = language;
        if (updateDocument !== false) {
            this._doc['documentElement'].setAttribute('lang', language);
        }
    };
    /**
     * Returns app's language and optional country code.
     * We recommend the app's `index.html` file already has the correct `lang`
     * attribute value set, such as `<html lang="en">`.
     * [W3C: Declaring language in HTML](http://www.w3.org/International/questions/qa-html-language-declarations)
     * @return {?}
     */
    Platform.prototype.lang = function () {
        return this._lang;
    };
    /**
     * @hidden
     * @return {?}
     */
    Platform.prototype.exitApp = function () { };
    /**
     * The back button event is triggered when the user presses the native
     * platform's back button, also referred to as the "hardware" back button.
     * This event is only used within Cordova apps running on Android and
     * Windows platforms. This event is not fired on iOS since iOS doesn't come
     * with a hardware back button in the same sense an Android or Windows device
     * does.
     *
     * Registering a hardware back button action and setting a priority allows
     * apps to control which action should be called when the hardware back
     * button is pressed. This method decides which of the registered back button
     * actions has the highest priority and should be called.
     *
     * if this registered action has the highest priority.
     * the back button action.
     * @param {?} fn
     * @param {?=} priority
     * @return {?}
     */
    Platform.prototype.registerBackButtonAction = function (fn, priority) {
        var _this = this;
        if (priority === void 0) { priority = 0; }
        var /** @type {?} */ action = { fn: fn, priority: priority };
        this._bbActions.push(action);
        // return a function to unregister this back button action
        return function () {
            removeArrayItem(_this._bbActions, action);
        };
    };
    /**
     * @hidden
     * @return {?}
     */
    Platform.prototype.runBackButtonAction = function () {
        // decide which one back button action should run
        var /** @type {?} */ winner = null;
        this._bbActions.forEach(function (action) {
            if (!winner || action.priority >= winner.priority) {
                winner = action;
            }
        });
        // run the winning action if there is one
        winner && winner.fn && winner.fn();
    };
    /**
     * @hidden
     * @param {?} userAgent
     * @return {?}
     */
    Platform.prototype.setUserAgent = function (userAgent) {
        this._ua = userAgent;
    };
    /**
     * @hidden
     * @param {?} url
     * @return {?}
     */
    Platform.prototype.setQueryParams = function (url) {
        this._qp.parseUrl(url);
    };
    /**
     * Get the query string parameter
     * @param {?} key
     * @return {?}
     */
    Platform.prototype.getQueryParam = function (key) {
        return this._qp.get(key);
    };
    /**
     * Get the current url.
     * @return {?}
     */
    Platform.prototype.url = function () {
        return this._win['location']['href'];
    };
    /**
     * @hidden
     * @return {?}
     */
    Platform.prototype.userAgent = function () {
        return this._ua || '';
    };
    /**
     * @hidden
     * @param {?} navigatorPlt
     * @return {?}
     */
    Platform.prototype.setNavigatorPlatform = function (navigatorPlt) {
        this._nPlt = navigatorPlt;
    };
    /**
     * @hidden
     * @return {?}
     */
    Platform.prototype.navigatorPlatform = function () {
        return this._nPlt || '';
    };
    /**
     * Gets the width of the platform's viewport using `window.innerWidth`.
     * Using this method is preferred since the dimension is a cached value,
     * which reduces the chance of multiple and expensive DOM reads.
     * @return {?}
     */
    Platform.prototype.width = function () {
        this._calcDim();
        return this._isPortrait ? this._pW : this._lW;
    };
    /**
     * Gets the height of the platform's viewport using `window.innerHeight`.
     * Using this method is preferred since the dimension is a cached value,
     * which reduces the chance of multiple and expensive DOM reads.
     * @return {?}
     */
    Platform.prototype.height = function () {
        this._calcDim();
        return this._isPortrait ? this._pH : this._lH;
    };
    /**
     * @hidden
     * @param {?} ele
     * @param {?=} pseudoEle
     * @return {?}
     */
    Platform.prototype.getElementComputedStyle = function (ele, pseudoEle) {
        return this._win['getComputedStyle'](ele, pseudoEle);
    };
    /**
     * @hidden
     * @param {?} x
     * @param {?} y
     * @return {?}
     */
    Platform.prototype.getElementFromPoint = function (x, y) {
        return (this._doc['elementFromPoint'](x, y));
    };
    /**
     * @hidden
     * @param {?} ele
     * @return {?}
     */
    Platform.prototype.getElementBoundingClientRect = function (ele) {
        return ele['getBoundingClientRect']();
    };
    /**
     * Returns `true` if the app is in portait mode.
     * @return {?}
     */
    Platform.prototype.isPortrait = function () {
        this._calcDim();
        return this._isPortrait;
    };
    /**
     * Returns `true` if the app is in landscape mode.
     * @return {?}
     */
    Platform.prototype.isLandscape = function () {
        return !this.isPortrait();
    };
    /**
     * @return {?}
     */
    Platform.prototype._calcDim = function () {
        // we're caching window dimensions so that
        // we're not forcing many layouts
        // if _isPortrait is null then that means
        // the dimensions needs to be looked up again
        // this also has to cover an edge case that only
        // happens on iOS 10 (not other versions of iOS)
        // where window.innerWidth is always bigger than
        // window.innerHeight when it is first measured,
        // even when the device is in portrait but
        // the second time it is measured it is correct.
        // Hopefully this check will not be needed in the future
        if (this._isPortrait === null || this._isPortrait === false && this._win['innerWidth'] < this._win['innerHeight']) {
            var /** @type {?} */ win = this._win;
            var /** @type {?} */ innerWidth = win['innerWidth'];
            var /** @type {?} */ innerHeight = win['innerHeight'];
            // we're keeping track of portrait and landscape dimensions
            // separately because the virtual keyboard can really mess
            // up accurate values when the keyboard is up
            if (win.screen.width > 0 && win.screen.height > 0) {
                if (innerWidth < innerHeight) {
                    // the device is in portrait
                    // we have to do fancier checking here
                    // because of the virtual keyboard resizing
                    // the window
                    if (this._pW <= innerWidth) {
                        (void 0) /* console.debug */;
                        this._isPortrait = true;
                        this._pW = innerWidth;
                    }
                    if (this._pH <= innerHeight) {
                        (void 0) /* console.debug */;
                        this._isPortrait = true;
                        this._pH = innerHeight;
                    }
                }
                else {
                    // the device is in landscape
                    if (this._lW !== innerWidth) {
                        (void 0) /* console.debug */;
                        this._isPortrait = false;
                        this._lW = innerWidth;
                    }
                    if (this._lH !== innerHeight) {
                        (void 0) /* console.debug */;
                        this._isPortrait = false;
                        this._lH = innerHeight;
                    }
                }
            }
        }
    };
    /**
     * @hidden
     * This requestAnimationFrame will NOT be wrapped by zone.
     * @param {?} callback
     * @return {?}
     */
    Platform.prototype.raf = function (callback) {
        var /** @type {?} */ win = this._win;
        return win['__zone_symbol__requestAnimationFrame'](callback);
    };
    /**
     * @hidden
     * @param {?} rafId
     * @return {?}
     */
    Platform.prototype.cancelRaf = function (rafId) {
        var /** @type {?} */ win = this._win;
        return win['__zone_symbol__cancelAnimationFrame'](rafId);
    };
    /**
     * @hidden
     * This setTimeout will NOT be wrapped by zone.
     * @param {?} callback
     * @param {?=} timeout
     * @return {?}
     */
    Platform.prototype.timeout = function (callback, timeout) {
        var /** @type {?} */ win = this._win;
        return win['__zone_symbol__setTimeout'](callback, timeout);
    };
    /**
     * @hidden
     * This setTimeout will NOT be wrapped by zone.
     * @param {?} timeoutId
     * @return {?}
     */
    Platform.prototype.cancelTimeout = function (timeoutId) {
        var /** @type {?} */ win = this._win;
        win['__zone_symbol__clearTimeout'](timeoutId);
    };
    /**
     * @hidden
     * Built to use modern event listener options, like "passive".
     * If options are not supported, then just return a boolean which
     * represents "capture". Returns a method to remove the listener.
     * @param {?} ele
     * @param {?} eventName
     * @param {?} callback
     * @param {?} opts
     * @param {?=} unregisterListenersCollection
     * @return {?}
     */
    Platform.prototype.registerListener = function (ele, eventName, callback, opts, unregisterListenersCollection) {
        // use event listener options when supported
        // otherwise it's just a boolean for the "capture" arg
        var /** @type {?} */ listenerOpts = this._uiEvtOpts ? {
            'capture': !!opts.capture,
            'passive': !!opts.passive,
        } : !!opts.capture;
        var /** @type {?} */ unReg;
        if (!opts.zone && ele['__zone_symbol__addEventListener']) {
            // do not wrap this event in zone and we've verified we can use the raw addEventListener
            ele['__zone_symbol__addEventListener'](eventName, callback, listenerOpts);
            unReg = function unregisterListener() {
                ele['__zone_symbol__removeEventListener'](eventName, callback, listenerOpts);
            };
        }
        else {
            // use the native addEventListener, which is wrapped with zone
            ele['addEventListener'](eventName, callback, listenerOpts);
            unReg = function unregisterListener() {
                ele['removeEventListener'](eventName, callback, listenerOpts);
            };
        }
        if (unregisterListenersCollection) {
            unregisterListenersCollection.push(unReg);
        }
        return unReg;
    };
    /**
     * @hidden
     * @param {?} el
     * @param {?} callback
     * @param {?=} zone
     * @return {?}
     */
    Platform.prototype.transitionEnd = function (el, callback, zone) {
        if (zone === void 0) { zone = true; }
        var /** @type {?} */ unRegs = [];
        /**
         * @return {?}
         */
        function unregister() {
            unRegs.forEach(function (unReg) {
                unReg();
            });
        }
        /**
         * @param {?} ev
         * @return {?}
         */
        function onTransitionEnd(ev) {
            if (el === ev.target) {
                unregister();
                callback(ev);
            }
        }
        if (el) {
            this.registerListener(el, 'webkitTransitionEnd', /** @type {?} */ (onTransitionEnd), { zone: zone }, unRegs);
            this.registerListener(el, 'transitionend', /** @type {?} */ (onTransitionEnd), { zone: zone }, unRegs);
        }
        return unregister;
    };
    /**
     * @hidden
     * @param {?} callback
     * @return {?}
     */
    Platform.prototype.windowLoad = function (callback) {
        var /** @type {?} */ win = this._win;
        var /** @type {?} */ doc = this._doc;
        var /** @type {?} */ unreg;
        if (doc.readyState === 'complete') {
            callback(win, doc);
        }
        else {
            unreg = this.registerListener(win, 'load', function () {
                unreg && unreg();
                callback(win, doc);
            }, { zone: false });
        }
    };
    /**
     * @hidden
     * @param {?} ele
     * @return {?}
     */
    Platform.prototype.isActiveElement = function (ele) {
        return !!(ele && (this.getActiveElement() === ele));
    };
    /**
     * @hidden
     * @return {?}
     */
    Platform.prototype.getActiveElement = function () {
        return this._doc['activeElement'];
    };
    /**
     * @hidden
     * @param {?} ele
     * @return {?}
     */
    Platform.prototype.hasFocus = function (ele) {
        return !!((ele && (this.getActiveElement() === ele)) && (ele.parentElement.querySelector(':focus') === ele));
    };
    /**
     * @hidden
     * @return {?}
     */
    Platform.prototype.hasFocusedTextInput = function () {
        var /** @type {?} */ ele = this.getActiveElement();
        if (isTextInput(ele)) {
            return (ele.parentElement.querySelector(':focus') === ele);
        }
        return false;
    };
    /**
     * @hidden
     * @return {?}
     */
    Platform.prototype.focusOutActiveElement = function () {
        var /** @type {?} */ activeElement = this.getActiveElement();
        activeElement && activeElement.blur && activeElement.blur();
    };
    /**
     * @return {?}
     */
    Platform.prototype._initEvents = function () {
        var _this = this;
        // Test via a getter in the options object to see if the passive property is accessed
        try {
            var /** @type {?} */ opts = Object.defineProperty({}, 'passive', {
                get: function () {
                    _this._uiEvtOpts = true;
                }
            });
            this._win.addEventListener('optsTest', null, opts);
        }
        catch (e) { }
        // add the window resize event listener XXms after
        this.timeout(function () {
            var /** @type {?} */ timerId;
            _this.registerListener(_this._win, 'resize', function () {
                clearTimeout(timerId);
                timerId = setTimeout(function () {
                    // setting _isPortrait to null means the
                    // dimensions will need to be looked up again
                    if (_this.hasFocusedTextInput() === false) {
                        _this._isPortrait = null;
                    }
                    _this.zone.run(function () { return _this.resize.emit(); });
                }, 200);
            }, { passive: true, zone: false });
        }, 2000);
    };
    /**
     * @hidden
     * @param {?} platformConfigs
     * @return {?}
     */
    Platform.prototype.setPlatformConfigs = function (platformConfigs) {
        this._registry = platformConfigs || {};
    };
    /**
     * @hidden
     * @param {?} platformName
     * @return {?}
     */
    Platform.prototype.getPlatformConfig = function (platformName) {
        return this._registry[platformName] || {};
    };
    /**
     * @hidden
     * @return {?}
     */
    Platform.prototype.registry = function () {
        return this._registry;
    };
    /**
     * @hidden
     * @param {?} platformName
     * @return {?}
     */
    Platform.prototype.setDefault = function (platformName) {
        this._default = platformName;
    };
    /**
     * @hidden
     * @param {?} queryValue
     * @param {?} queryTestValue
     * @return {?}
     */
    Platform.prototype.testQuery = function (queryValue, queryTestValue) {
        var /** @type {?} */ valueSplit = queryValue.toLowerCase().split(';');
        return valueSplit.indexOf(queryTestValue) > -1;
    };
    /**
     * @hidden
     * @param {?} navigatorPlatformExpression
     * @return {?}
     */
    Platform.prototype.testNavigatorPlatform = function (navigatorPlatformExpression) {
        var /** @type {?} */ rgx = new RegExp(navigatorPlatformExpression, 'i');
        return rgx.test(this._nPlt);
    };
    /**
     * @hidden
     * @param {?} userAgentExpression
     * @return {?}
     */
    Platform.prototype.matchUserAgentVersion = function (userAgentExpression) {
        if (this._ua && userAgentExpression) {
            var /** @type {?} */ val = this._ua.match(userAgentExpression);
            if (val) {
                return {
                    major: val[1],
                    minor: val[2]
                };
            }
        }
    };
    /**
     * @param {?} expression
     * @return {?}
     */
    Platform.prototype.testUserAgent = function (expression) {
        if (this._ua) {
            return this._ua.indexOf(expression) >= 0;
        }
        return false;
    };
    /**
     * @hidden
     * @param {?} queryStringName
     * @param {?=} userAgentAtLeastHas
     * @param {?=} userAgentMustNotHave
     * @return {?}
     */
    Platform.prototype.isPlatformMatch = function (queryStringName, userAgentAtLeastHas, userAgentMustNotHave) {
        if (userAgentMustNotHave === void 0) { userAgentMustNotHave = []; }
        var /** @type {?} */ queryValue = this._qp.get('ionicplatform');
        if (queryValue) {
            return this.testQuery(queryValue, queryStringName);
        }
        userAgentAtLeastHas = userAgentAtLeastHas || [queryStringName];
        var /** @type {?} */ userAgent = this._ua.toLowerCase();
        for (var /** @type {?} */ i = 0; i < userAgentAtLeastHas.length; i++) {
            if (userAgent.indexOf(userAgentAtLeastHas[i]) > -1) {
                for (var /** @type {?} */ j = 0; j < userAgentMustNotHave.length; j++) {
                    if (userAgent.indexOf(userAgentMustNotHave[j]) > -1) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    };
    /**
     * @hidden
     * @return {?}
     */
    Platform.prototype.init = function () {
        this._initEvents();
        var /** @type {?} */ rootPlatformNode;
        var /** @type {?} */ enginePlatformNode;
        // figure out the most specific platform and active engine
        var /** @type {?} */ tmpPlt;
        for (var /** @type {?} */ platformName in this._registry) {
            tmpPlt = this.matchPlatform(platformName);
            if (tmpPlt) {
                // we found a platform match!
                // check if its more specific than the one we already have
                if (tmpPlt.isEngine) {
                    // because it matched then this should be the active engine
                    // you cannot have more than one active engine
                    enginePlatformNode = tmpPlt;
                }
                else if (!rootPlatformNode || tmpPlt.depth > rootPlatformNode.depth) {
                    // only find the root node for platforms that are not engines
                    // set this node as the root since we either don't already
                    // have one, or this one is more specific that the current one
                    rootPlatformNode = tmpPlt;
                }
            }
        }
        if (!rootPlatformNode) {
            rootPlatformNode = new PlatformNode(this._registry, this._default);
        }
        // build a Platform instance filled with the
        // hierarchy of active platforms and settings
        if (rootPlatformNode) {
            // check if we found an engine node (cordova/node-webkit/etc)
            if (enginePlatformNode) {
                // add the engine to the first in the platform hierarchy
                // the original rootPlatformNode now becomes a child
                // of the engineNode, which is not the new root
                enginePlatformNode.child = rootPlatformNode;
                rootPlatformNode.parent = enginePlatformNode;
                rootPlatformNode = enginePlatformNode;
            }
            var /** @type {?} */ platformNode = rootPlatformNode;
            while (platformNode) {
                insertSuperset(this._registry, platformNode);
                platformNode = platformNode.child;
            }
            // make sure the root noot is actually the root
            // incase a node was inserted before the root
            platformNode = rootPlatformNode.parent;
            while (platformNode) {
                rootPlatformNode = platformNode;
                platformNode = platformNode.parent;
            }
            platformNode = rootPlatformNode;
            while (platformNode) {
                platformNode.initialize(this);
                // extra check for ipad pro issue
                // https://forums.developer.apple.com/thread/25948
                if (platformNode.name === 'iphone' && this.navigatorPlatform() === 'iPad') {
                    // this is an ipad pro so push ipad and tablet to platforms
                    // and then return as we are done
                    this._platforms.push('tablet');
                    this._platforms.push('ipad');
                    return;
                }
                // set the array of active platforms with
                // the last one in the array the most important
                this._platforms.push(platformNode.name);
                // get the platforms version if a version parser was provided
                this._versions[platformNode.name] = platformNode.version(this);
                // go to the next platform child
                platformNode = platformNode.child;
            }
        }
        if (this._platforms.indexOf('mobile') > -1 && this._platforms.indexOf('cordova') === -1) {
            this._platforms.push('mobileweb');
        }
    };
    /**
     * @hidden
     * @param {?} platformName
     * @return {?}
     */
    Platform.prototype.matchPlatform = function (platformName) {
        // build a PlatformNode and assign config data to it
        // use it's getRoot method to build up its hierarchy
        // depending on which platforms match
        var /** @type {?} */ platformNode = new PlatformNode(this._registry, platformName);
        var /** @type {?} */ rootNode = platformNode.getRoot(this);
        if (rootNode) {
            rootNode.depth = 0;
            var /** @type {?} */ childPlatform = rootNode.child;
            while (childPlatform) {
                rootNode.depth++;
                childPlatform = childPlatform.child;
            }
        }
        return rootNode;
    };
    return Platform;
}());
export { Platform };
function Platform_tsickle_Closure_declarations() {
    /** @type {?} */
    Platform.prototype._win;
    /** @type {?} */
    Platform.prototype._doc;
    /** @type {?} */
    Platform.prototype._versions;
    /** @type {?} */
    Platform.prototype._dir;
    /** @type {?} */
    Platform.prototype._lang;
    /** @type {?} */
    Platform.prototype._ua;
    /** @type {?} */
    Platform.prototype._qp;
    /** @type {?} */
    Platform.prototype._nPlt;
    /** @type {?} */
    Platform.prototype._readyPromise;
    /** @type {?} */
    Platform.prototype._readyResolve;
    /** @type {?} */
    Platform.prototype._bbActions;
    /** @type {?} */
    Platform.prototype._registry;
    /** @type {?} */
    Platform.prototype._default;
    /** @type {?} */
    Platform.prototype._pW;
    /** @type {?} */
    Platform.prototype._pH;
    /** @type {?} */
    Platform.prototype._lW;
    /** @type {?} */
    Platform.prototype._lH;
    /** @type {?} */
    Platform.prototype._isPortrait;
    /** @type {?} */
    Platform.prototype._uiEvtOpts;
    /**
     * @hidden
     * @type {?}
     */
    Platform.prototype.zone;
    /**
     * \@internal
     * @type {?}
     */
    Platform.prototype.Css;
    /**
     * \@internal
     * @type {?}
     */
    Platform.prototype._platforms;
    /**
     * Returns if this app is using right-to-left language direction or not.
     * We recommend the app's `index.html` file already has the correct `dir`
     * attribute value set, such as `<html dir="ltr">` or `<html dir="rtl">`.
     * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
     * @type {?}
     */
    Platform.prototype.isRTL;
    /**
     * @hidden
     * @type {?}
     */
    Platform.prototype.backButton;
    /**
     * The pause event emits when the native platform puts the application
     * into the background, typically when the user switches to a different
     * application. This event would emit when a Cordova app is put into
     * the background, however, it would not fire on a standard web browser.
     * @type {?}
     */
    Platform.prototype.pause;
    /**
     * The resume event emits when the native platform pulls the application
     * out from the background. This event would emit when a Cordova app comes
     * out from the background, however, it would not fire on a standard web browser.
     * @type {?}
     */
    Platform.prototype.resume;
    /**
     * The resize event emits when the native platform pulls the application
     * out from the background. This event would emit when a Cordova app comes
     * out from the background, however, it would not fire on a standard web browser.
     * @type {?}
     */
    Platform.prototype.resize;
}
/**
 * @param {?} registry
 * @param {?} platformNode
 * @return {?}
 */
function insertSuperset(registry, platformNode) {
    var /** @type {?} */ supersetPlaformName = platformNode.superset();
    if (supersetPlaformName) {
        // add a platform in between two exist platforms
        // so we can build the correct hierarchy of active platforms
        var /** @type {?} */ supersetPlatform = new PlatformNode(registry, supersetPlaformName);
        supersetPlatform.parent = platformNode.parent;
        supersetPlatform.child = platformNode;
        if (supersetPlatform.parent) {
            supersetPlatform.parent.child = supersetPlatform;
        }
        platformNode.parent = supersetPlatform;
    }
}
/**
 * @hidden
 */
var PlatformNode = (function () {
    /**
     * @param {?} registry
     * @param {?} platformName
     */
    function PlatformNode(registry, platformName) {
        this.registry = registry;
        this.c = registry[platformName];
        this.name = platformName;
        this.isEngine = this.c.isEngine;
    }
    /**
     * @return {?}
     */
    PlatformNode.prototype.settings = function () {
        return this.c.settings || {};
    };
    /**
     * @return {?}
     */
    PlatformNode.prototype.superset = function () {
        return this.c.superset;
    };
    /**
     * @param {?} p
     * @return {?}
     */
    PlatformNode.prototype.isMatch = function (p) {
        return this.c.isMatch && this.c.isMatch(p) || false;
    };
    /**
     * @param {?} plt
     * @return {?}
     */
    PlatformNode.prototype.initialize = function (plt) {
        this.c.initialize && this.c.initialize(plt);
    };
    /**
     * @param {?} plt
     * @return {?}
     */
    PlatformNode.prototype.version = function (plt) {
        if (this.c.versionParser) {
            var /** @type {?} */ v = this.c.versionParser(plt);
            if (v) {
                var /** @type {?} */ str = v.major + '.' + v.minor;
                return {
                    str: str,
                    num: parseFloat(str),
                    major: parseInt(v.major, 10),
                    minor: parseInt(v.minor, 10)
                };
            }
        }
    };
    /**
     * @param {?} plt
     * @return {?}
     */
    PlatformNode.prototype.getRoot = function (plt) {
        if (this.isMatch(plt)) {
            var /** @type {?} */ parents = this.getSubsetParents(this.name);
            if (!parents.length) {
                return this;
            }
            var /** @type {?} */ platformNode = null;
            var /** @type {?} */ rootPlatformNode = null;
            for (var /** @type {?} */ i = 0; i < parents.length; i++) {
                platformNode = new PlatformNode(this.registry, parents[i]);
                platformNode.child = this;
                rootPlatformNode = platformNode.getRoot(plt);
                if (rootPlatformNode) {
                    this.parent = platformNode;
                    return rootPlatformNode;
                }
            }
        }
        return null;
    };
    /**
     * @param {?} subsetPlatformName
     * @return {?}
     */
    PlatformNode.prototype.getSubsetParents = function (subsetPlatformName) {
        var /** @type {?} */ parentPlatformNames = [];
        var /** @type {?} */ pltConfig = null;
        for (var /** @type {?} */ platformName in this.registry) {
            pltConfig = this.registry[platformName];
            if (pltConfig.subsets && pltConfig.subsets.indexOf(subsetPlatformName) > -1) {
                parentPlatformNames.push(platformName);
            }
        }
        return parentPlatformNames;
    };
    return PlatformNode;
}());
function PlatformNode_tsickle_Closure_declarations() {
    /** @type {?} */
    PlatformNode.prototype.c;
    /** @type {?} */
    PlatformNode.prototype.parent;
    /** @type {?} */
    PlatformNode.prototype.child;
    /** @type {?} */
    PlatformNode.prototype.name;
    /** @type {?} */
    PlatformNode.prototype.isEngine;
    /** @type {?} */
    PlatformNode.prototype.depth;
    /** @type {?} */
    PlatformNode.prototype.registry;
}
/**
 * @hidden
 * @param {?} doc
 * @param {?} platformConfigs
 * @param {?} zone
 * @return {?}
 */
export function setupPlatform(doc, platformConfigs, zone) {
    var /** @type {?} */ plt = new Platform();
    plt.setDefault('core');
    plt.setPlatformConfigs(platformConfigs);
    plt.setZone(zone);
    // set values from "document"
    var /** @type {?} */ docElement = doc.documentElement;
    plt.setDocument(doc);
    var /** @type {?} */ dir = docElement.dir;
    plt.setDir(dir === 'rtl' ? 'rtl' : 'ltr', !dir);
    plt.setLang(docElement.lang, false);
    // set css properties
    plt.setCssProps(docElement);
    // set values from "window"
    var /** @type {?} */ win = doc.defaultView;
    plt.setWindow(win);
    plt.setNavigatorPlatform(win.navigator.platform);
    plt.setUserAgent(win.navigator.userAgent);
    // set location values
    plt.setQueryParams(win.location.href);
    plt.init();
    // add the platform obj to the window
    ((win))['Ionic'] = ((win))['Ionic'] || {};
    ((win))['Ionic']['platform'] = plt;
    return plt;
}
//# sourceMappingURL=platform.js.map