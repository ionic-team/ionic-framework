/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class CordovaPlatform {
    constructor() {
        this.readyPromise = new Promise(resolve => this.readyResolve = resolve);
    }
    ready() {
        return this.readyPromise;
    }
    deviceReadyHandler() {
        this.readyResolve();
    }
    exitCordovaApp() {
        // this is lifted directly from Ionic 3
        const app = window.navigator.app;
        if (app && app.exitApp) {
            app.exitApp();
        }
    }
    static get is() { return "ion-cordova-platform"; }
    static get properties() { return { "exitCordovaApp": { "method": true }, "ready": { "method": true } }; }
}

function isCordova() {
    const win = window;
    return !!(win[CORDOVA] || win[PHONEGAP_CAMELCASE] || win[PHONEGAP] || win[CAPACITOR]);
}




const CORDOVA = 'cordova';










const PHONEGAP = 'phonegap';
const PHONEGAP_CAMELCASE = 'PhoneGap';
const CAPACITOR = 'Capacitor';

class Platform {
    /**
     * Depending on the platform the user is on, `is(platformName)` will
     * return `true` or `false`. Note that the same app can return `true`
     * for more than one platform name. For example, an app running from
     * an iPad would return `true` for the platform names: `mobile`,
     * `ios`, `ipad`, and `tablet`. Additionally, if the app was running
     * from Cordova then `cordova` would be true, and if it was running
     * from a web browser on the iPad then `mobileweb` would be `true`.
     *
     * *
     * ```
     * import { Platform } from 'ionic-angular';
     *
     * @Component({...})
     * export MyPage {
     *   constructor(public platform: Platform) {
     *     if (this.platform.is('ios')) {
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
    is(platformName) {
        for (const platform of this._platforms) {
            if (platform.name === platformName) {
                return true;
            }
        }
        return false;
    }
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
     *   constructor(public platform: Platform) {
     *     // This will print an array of the current platforms
     *     console.log(this.platform.platforms());
     *   }
     * }
     * ```
     */
    platforms() {
        return this._platforms.map(platform => platform.name);
    }
    versions() {
        return this._platforms;
    }
    /**
     * Returns whether the device is in landscape orientation
     */
    isLandscape() {
        return !this.isPortrait();
    }
    /**
     * Returns whether the device is in portration orientation
     */
    isPortrait() {
        return window.matchMedia('(orientation: portrait)').matches;
    }
    ready() {
        // revisit this later on
        if (isCordova()) {
            const cordovaPlatform = this.el.querySelector('ion-cordova-plaform');
            return cordovaPlatform.componentOnReady().then(() => {
                return cordovaPlatform.ready();
            });
        }
        return Promise.resolve();
    }
    getQueryParam(param) {
        return this.readQueryParam(window.location.href, param);
    }
    render() {
        return [
            h("ion-cordova-platform", null)
        ];
    }
    static get is() { return "ion-platform"; }
    static get properties() { return { "_platforms": { "context": "platforms" }, "el": { "elementRef": true }, "getQueryParam": { "method": true }, "is": { "method": true }, "isLandscape": { "method": true }, "isPortrait": { "method": true }, "platforms": { "method": true }, "readQueryParam": { "context": "readQueryParam" }, "ready": { "method": true }, "versions": { "method": true } }; }
}

export { CordovaPlatform as IonCordovaPlatform, Platform as IonPlatform };
