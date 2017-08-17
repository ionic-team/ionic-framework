import { EventEmitter, NgZone } from '@angular/core';
export declare type DocumentDirection = 'ltr' | 'rtl';
/**
 * @name Platform
 * @description
 * The Platform service can be used to get information about your current device.
 * You can get all of the platforms associated with the device using the [platforms](#platforms)
 * method, including whether the app is being viewed from a tablet, if it's
 * on a mobile device or browser, and the exact platform (iOS, Android, etc).
 * You can also get the orientation of the device, if it uses right-to-left
 * language direction, and much much more. With this information you can completely
 * customize your app to fit any device.
 *
 * @usage
 * ```ts
 * import { Platform } from 'ionic-angular';
 *
 * @Component({...})
 * export MyPage {
 *   constructor(public plt: Platform) {
 *
 *   }
 * }
 * ```
 * @demo /docs/demos/src/platform/
 */
export declare class Platform {
    private _win;
    private _doc;
    private _versions;
    private _dir;
    private _lang;
    private _ua;
    private _qp;
    private _nPlt;
    private _readyPromise;
    private _readyResolve;
    private _bbActions;
    private _registry;
    private _default;
    private _pW;
    private _pH;
    private _lW;
    private _lH;
    private _isPortrait;
    private _uiEvtOpts;
    /** @hidden */
    zone: NgZone;
    /** @internal */
    Css: {
        transform?: string;
        transition?: string;
        transitionDuration?: string;
        transitionDelay?: string;
        transitionTimingFn?: string;
        transitionStart?: string;
        transitionEnd?: string;
        transformOrigin?: string;
        animationDelay?: string;
    };
    /** @internal */
    _platforms: string[];
    constructor();
    /**
     * @hidden
     */
    setWindow(win: Window): void;
    /**
     * @hidden
     */
    win(): Window;
    /**
     * @hidden
     */
    setDocument(doc: HTMLDocument): void;
    /**
     * @hidden
     */
    doc(): HTMLDocument;
    /**
     * @hidden
     */
    setZone(zone: NgZone): void;
    /**
     * @hidden
     */
    setCssProps(docElement: HTMLElement): void;
    /**
     * @returns {boolean} returns true/false based on platform.
     * @description
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
     * @Component({...})
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
     * @param {string} platformName
     */
    is(platformName: string): boolean;
    /**
     * @returns {array} the array of platforms
     * @description
     * Depending on what device you are on, `platforms` can return multiple values.
     * Each possible value is a hierarchy of platforms. For example, on an iPhone,
     * it would return `mobile`, `ios`, and `iphone`.
     *
     * ```
     * import { Platform } from 'ionic-angular';
     *
     * @Component({...})
     * export MyPage {
     *   constructor(public plt: Platform) {
     *     // This will print an array of the current platforms
     *     console.log(this.plt.platforms());
     *   }
     * }
     * ```
     */
    platforms(): Array<string>;
    /**
     * Returns an object containing version information about all of the platforms.
     *
     * ```
     * import { Platform } from 'ionic-angular';
     *
     * @Component({...})
     * export MyPage {
     *   constructor(public plt: Platform) {
     *     // This will print an object containing
     *     // all of the platforms and their versions
     *     console.log(plt.versions());
     *   }
     * }
     * ```
     *
     * @returns {object} An object containing all of the platforms and their versions.
     */
    versions(): {
        [name: string]: PlatformVersion;
    };
    /**
     * @hidden
     */
    version(): PlatformVersion;
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
     * import { Component } from '@angular/core';
     * import { Platform } from 'ionic-angular';
     *
     * @Component({...})
     * export MyApp {
     *   constructor(public plt: Platform) {
     *     this.plt.ready().then((readySource) => {
     *       console.log('Platform ready from', readySource);
     *       // Platform now ready, execute any required native code
     *     });
     *   }
     * }
     * ```
     * @returns {promise}
     */
    ready(): Promise<string>;
    /**
     * @hidden
     * This should be triggered by the engine when the platform is
     * ready. If there was no custom prepareReady method from the engine,
     * such as Cordova or Electron, then it uses the default DOM ready.
     */
    triggerReady(readySource: string): void;
    /**
     * @hidden
     * This is the default prepareReady if it's not replaced by an engine,
     * such as Cordova or Electron. If there was no custom prepareReady
     * method from an engine then it uses the method below, which triggers
     * the platform ready on the DOM ready event, and the default resolved
     * value is `dom`.
     */
    prepareReady(): void;
    /**
     * Set the app's language direction, which will update the `dir` attribute
     * on the app's root `<html>` element. We recommend the app's `index.html`
     * file already has the correct `dir` attribute value set, such as
     * `<html dir="ltr">` or `<html dir="rtl">`. This method is useful if the
     * direction needs to be dynamically changed per user/session.
     * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
     * @param {DocumentDirection} dir  Examples: `rtl`, `ltr`
     * @param {boolean} updateDocument
     */
    setDir(dir: DocumentDirection, updateDocument: boolean): void;
    /**
     * Returns app's language direction.
     * We recommend the app's `index.html` file already has the correct `dir`
     * attribute value set, such as `<html dir="ltr">` or `<html dir="rtl">`.
     * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
     * @returns {DocumentDirection}
     */
    dir(): DocumentDirection;
    /**
     * Returns if this app is using right-to-left language direction or not.
     * We recommend the app's `index.html` file already has the correct `dir`
     * attribute value set, such as `<html dir="ltr">` or `<html dir="rtl">`.
     * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
     * @returns {boolean}
     */
    isRTL: boolean;
    /**
     * Set the app's language and optionally the country code, which will update
     * the `lang` attribute on the app's root `<html>` element.
     * We recommend the app's `index.html` file already has the correct `lang`
     * attribute value set, such as `<html lang="en">`. This method is useful if
     * the language needs to be dynamically changed per user/session.
     * [W3C: Declaring language in HTML](http://www.w3.org/International/questions/qa-html-language-declarations)
     * @param {string} language  Examples: `en-US`, `en-GB`, `ar`, `de`, `zh`, `es-MX`
     * @param {boolean} updateDocument  Specifies whether the `lang` attribute of `<html>` should be updated
     */
    setLang(language: string, updateDocument: boolean): void;
    /**
     * Returns app's language and optional country code.
     * We recommend the app's `index.html` file already has the correct `lang`
     * attribute value set, such as `<html lang="en">`.
     * [W3C: Declaring language in HTML](http://www.w3.org/International/questions/qa-html-language-declarations)
     * @returns {string}
     */
    lang(): string;
    /**
     * @hidden
     */
    exitApp(): void;
    /**
     * @hidden
     */
    backButton: EventEmitter<Event>;
    /**
     * The pause event emits when the native platform puts the application
     * into the background, typically when the user switches to a different
     * application. This event would emit when a Cordova app is put into
     * the background, however, it would not fire on a standard web browser.
     */
    pause: EventEmitter<Event>;
    /**
     * The resume event emits when the native platform pulls the application
     * out from the background. This event would emit when a Cordova app comes
     * out from the background, however, it would not fire on a standard web browser.
     */
    resume: EventEmitter<Event>;
    /**
     * The resize event emits when the native platform pulls the application
     * out from the background. This event would emit when a Cordova app comes
     * out from the background, however, it would not fire on a standard web browser.
     */
    resize: EventEmitter<Event>;
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
     * @param {Function} fn Called when the back button is pressed,
     * if this registered action has the highest priority.
     * @param {number} priority Set the priority for this action. Only the highest priority will execute. Defaults to `0`.
     * @returns {Function} A function that, when called, will unregister
     * the back button action.
     */
    registerBackButtonAction(fn: Function, priority?: number): Function;
    /**
     * @hidden
     */
    runBackButtonAction(): void;
    /**
     * @hidden
     */
    setUserAgent(userAgent: string): void;
    /**
     * @hidden
     */
    setQueryParams(url: string): void;
    /**
     * Get the query string parameter
     */
    getQueryParam(key: string): any;
    /**
     * Get the current url.
     */
    url(): string;
    /**
     * @hidden
     */
    userAgent(): string;
    /**
     * @hidden
     */
    setNavigatorPlatform(navigatorPlt: string): void;
    /**
     * @hidden
     */
    navigatorPlatform(): string;
    /**
     * Gets the width of the platform's viewport using `window.innerWidth`.
     * Using this method is preferred since the dimension is a cached value,
     * which reduces the chance of multiple and expensive DOM reads.
     */
    width(): number;
    /**
     * Gets the height of the platform's viewport using `window.innerHeight`.
     * Using this method is preferred since the dimension is a cached value,
     * which reduces the chance of multiple and expensive DOM reads.
     */
    height(): number;
    /**
     * @hidden
     */
    getElementComputedStyle(ele: HTMLElement, pseudoEle?: string): CSSStyleDeclaration;
    /**
     * @hidden
     */
    getElementFromPoint(x: number, y: number): HTMLElement;
    /**
     * @hidden
     */
    getElementBoundingClientRect(ele: HTMLElement): ClientRect;
    /**
     * Returns `true` if the app is in portait mode.
     */
    isPortrait(): boolean;
    /**
     * Returns `true` if the app is in landscape mode.
     */
    isLandscape(): boolean;
    private _calcDim();
    /**
     * @hidden
     * This requestAnimationFrame will NOT be wrapped by zone.
     */
    raf(callback: {
        (timeStamp?: number): void;
    } | Function): number;
    /**
     * @hidden
     */
    cancelRaf(rafId: number): any;
    /**
     * @hidden
     * This setTimeout will NOT be wrapped by zone.
     */
    timeout(callback: Function, timeout?: number): number;
    /**
     * @hidden
     * This setTimeout will NOT be wrapped by zone.
     */
    cancelTimeout(timeoutId: number): void;
    /**
     * @hidden
     * Built to use modern event listener options, like "passive".
     * If options are not supported, then just return a boolean which
     * represents "capture". Returns a method to remove the listener.
     */
    registerListener(ele: any, eventName: string, callback: {
        (ev?: UIEvent): void;
    }, opts: EventListenerOptions, unregisterListenersCollection?: Function[]): Function;
    /**
     * @hidden
     */
    transitionEnd(el: HTMLElement, callback: {
        (ev?: TransitionEvent): void;
    }, zone?: boolean): () => void;
    /**
     * @hidden
     */
    windowLoad(callback: Function): void;
    /**
     * @hidden
     */
    isActiveElement(ele: HTMLElement): boolean;
    /**
     * @hidden
     */
    getActiveElement(): Element;
    /**
     * @hidden
     */
    hasFocus(ele: HTMLElement): boolean;
    /**
     * @hidden
     */
    hasFocusedTextInput(): boolean;
    /**
     * @hidden
     */
    focusOutActiveElement(): void;
    private _initEvents();
    /**
     * @hidden
     */
    setPlatformConfigs(platformConfigs: {
        [key: string]: PlatformConfig;
    }): void;
    /**
     * @hidden
     */
    getPlatformConfig(platformName: string): PlatformConfig;
    /**
     * @hidden
     */
    registry(): {
        [name: string]: PlatformConfig;
    };
    /**
     * @hidden
     */
    setDefault(platformName: string): void;
    /**
     * @hidden
     */
    testQuery(queryValue: string, queryTestValue: string): boolean;
    /**
     * @hidden
     */
    testNavigatorPlatform(navigatorPlatformExpression: string): boolean;
    /**
     * @hidden
     */
    matchUserAgentVersion(userAgentExpression: RegExp): any;
    testUserAgent(expression: string): boolean;
    /**
     * @hidden
     */
    isPlatformMatch(queryStringName: string, userAgentAtLeastHas?: string[], userAgentMustNotHave?: string[]): boolean;
    /** @hidden */
    init(): void;
    /**
     * @hidden
     */
    private matchPlatform(platformName);
}
export interface PlatformConfig {
    isEngine?: boolean;
    initialize?: Function;
    isMatch?: Function;
    superset?: string;
    subsets?: string[];
    settings?: any;
    versionParser?: any;
}
export interface PlatformVersion {
    str?: string;
    num?: number;
    major?: number;
    minor?: number;
}
export interface EventListenerOptions {
    capture?: boolean;
    passive?: boolean;
    zone?: boolean;
}
/**
 * @hidden
 */
export declare function setupPlatform(doc: HTMLDocument, platformConfigs: {
    [key: string]: PlatformConfig;
}, zone: NgZone): Platform;
