/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { getOrAppendElement, domControllerAsync, now, pointerCoordX, pointerCoordY } from './chunk1.js';
import { GestureController } from './chunk5.js';

const rootNavs = new Map();
const ACTIVE_SCROLLING_TIME = 100;
let backButtonActions = [];
class App {
    constructor() {
        this.scrollTime = 0;
        this.hoverCSS = false;
        this.useRouter = false;
        this.externalNavPromise = null;
        this.externalNavOccuring = false;
    }
    /**
     * Returns the promise set by an external navigation system
     * This API is not meant for public usage and could
     * change at any time
     */
    getExternalNavPromise() {
        return this.externalNavPromise;
    }
    /**
     * Updates the Promise set by an external navigation system
     * This API is not meant for public usage and could
     * change at any time
     */
    setExternalNavPromise(value) {
        this.externalNavPromise = value;
    }
    /**
     * Returns whether an external navigation event is occuring
     * This API is not meant for public usage and could
     * change at any time
     */
    getExternalNavOccuring() {
        return this.externalNavOccuring;
    }
    /**
     * Updates whether an external navigation event is occuring
     * This API is not meant for public usage and could
     * change at any time
     */
    updateExternalNavOccuring(status) {
        this.externalNavOccuring = status;
    }
    componentWillLoad() {
        this.modeCode = this.config.get('mode');
        this.useRouter = this.config.getBoolean('useRouter', false);
        this.hoverCSS = this.config.getBoolean('hoverCSS', false);
    }
    registerRootNav(event) {
        rootNavs.set(event.target.getId(), event.target);
    }
    /**
     * Returns an array of top level Navs
     */
    getRootNavs() {
        const navs = [];
        rootNavs.forEach((rootNav) => {
            navs.push(rootNav);
        });
        return navs;
    }
    /**
     * Returns whether the application is enabled or not
     */
    isEnabled() {
        return true;
    }
    /**
     * Boolean if the app is actively scrolling or not.
     * @return {boolean} returns true or false
     */
    isScrolling() {
        const scrollTime = this.scrollTime;
        if (scrollTime === 0) {
            return false;
        }
        if (scrollTime < Date.now()) {
            this.scrollTime = 0;
            return false;
        }
        return true;
    }
    setScrolling() {
        this.scrollTime = Date.now() + ACTIVE_SCROLLING_TIME;
    }
    getTopNavs(rootNavId = -1) {
        return getTopNavsImpl(rootNavId);
    }
    getNavByIdOrName(nameOrId) {
        const navs = Array.from(rootNavs.values());
        for (const navContainer of navs) {
            const match = getNavByIdOrNameImpl(navContainer, nameOrId);
            if (match) {
                return match;
            }
        }
        return null;
    }
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
    registerBackButtonAction(fn, priority = 0) {
        const newAction = {
            fn,
            priority
        };
        backButtonActions.push(newAction);
        return () => {
            backButtonActions = backButtonActions.filter(bbAction => bbAction !== newAction);
        };
    }
    hardwareBackButtonPressed() {
        // okay cool, we need to execute the user's custom method if they have one
        const actionToExecute = backButtonActions.reduce((previous, current) => {
            if (current.priority >= previous.priority) {
                return current;
            }
            return previous;
        });
        actionToExecute && actionToExecute.fn && actionToExecute.fn();
        // okay great, we've done the user action, now do the default actions
        // check if menu exists and is open
        return checkIfMenuIsOpen().then((done) => {
            if (!done) {
                // we need to check if there is an action-sheet, alert, loading, picker, popover or toast open
                // if so, just return and don't do anything
                // Why? I have no idea, but that is the existing behavior in Ionic 3
                return checkIfNotModalOverlayIsOpen();
            }
            return done;
        }).then((done) => {
            if (!done) {
                // if there's a modal open, close that instead
                return closeModalIfOpen();
            }
            return done;
        }).then((done) => {
            // okay cool, it's time to pop a nav if possible
            if (!done) {
                return popEligibleView();
            }
            return done;
        }).then((done) => {
            if (!done) {
                // okay, we didn't find a nav that we can pop, so we should just exit the app
                // since each platform exits differently, just delegate it to the platform to
                // figure out how to exit
                return this.exitApp.emit();
            }
            return Promise.resolve();
        });
    }
    appResume() {
        return null;
    }
    appPaused() {
        return null;
    }
    hostData() {
        return {
            class: {
                [this.modeCode]: true,
                'enable-hover': this.hoverCSS
            }
        };
    }
    render() {
        const isDevice = true;
        return [
            isDevice && h("ion-tap-click", null),
            isDevice && h("ion-status-tap", null),
            h("ion-platform", null),
            h("slot", null)
        ];
    }
    static get is() { return "ion-app"; }
    static get host() { return { "theme": "app" }; }
    static get properties() { return { "config": { "context": "config" }, "element": { "elementRef": true }, "getExternalNavOccuring": { "method": true }, "getExternalNavPromise": { "method": true }, "getNavByIdOrName": { "method": true }, "getRootNavs": { "method": true }, "getTopNavs": { "method": true }, "hoverCSS": { "state": true }, "isEnabled": { "method": true }, "isScrolling": { "method": true }, "modeCode": { "state": true }, "registerBackButtonAction": { "method": true }, "setExternalNavPromise": { "method": true }, "setScrolling": { "method": true }, "updateExternalNavOccuring": { "method": true }, "useRouter": { "state": true } }; }
    static get events() { return [{ "name": "exitApp", "method": "exitApp", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "audio,\ncanvas,\nprogress,\nvideo {\n  vertical-align: baseline;\n}\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\nb,\nstrong {\n  font-weight: bold;\n}\n\nimg {\n  max-width: 100%;\n  border: 0;\n}\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\nfigure {\n  margin: 1em 40px;\n}\n\nhr {\n  height: 1px;\n  border-width: 0;\n  box-sizing: content-box;\n}\n\npre {\n  overflow: auto;\n}\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\n\nlabel,\ninput,\nselect,\ntextarea {\n  font-family: inherit;\n  line-height: normal;\n}\n\ntextarea {\n  overflow: auto;\n  height: auto;\n  font: inherit;\n  color: inherit;\n}\n\ntextarea::placeholder {\n  padding-left: 2px;\n}\n\nform,\ninput,\noptgroup,\nselect {\n  margin: 0;\n  font: inherit;\n  color: inherit;\n}\n\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  cursor: pointer;\n  -webkit-appearance: button;\n}\n\na,\na div,\na span,\na ion-icon,\na ion-label,\nbutton,\nbutton div,\nbutton span,\nbutton ion-icon,\nbutton ion-label,\n[tappable],\n[tappable] div,\n[tappable] span,\n[tappable] ion-icon,\n[tappable] ion-label,\ninput,\ntextarea {\n  touch-action: manipulation;\n}\n\na ion-label,\nbutton ion-label {\n  pointer-events: none;\n}\n\nbutton {\n  border: 0;\n  border-radius: 0;\n  font-family: inherit;\n  font-style: inherit;\n  font-variant: inherit;\n  line-height: 1;\n  text-transform: none;\n  cursor: pointer;\n  -webkit-appearance: button;\n}\n\n[tappable] {\n  cursor: pointer;\n}\n\na[disabled],\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default;\n}\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  padding: 0;\n  box-sizing: border-box;\n}\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\ntd,\nth {\n  padding: 0;\n}\n\n.hide,\n[hidden],\ntemplate {\n  display: none !important;\n}\n\n.sticky {\n  position: sticky;\n  top: 0;\n}\n\n.click-block {\n  display: none;\n}\n\n.click-block-enabled {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  transform: translate3d(0,  -100%,  0) translateY(1px);\n  position: absolute;\n  z-index: 99999;\n  display: block;\n  opacity: 0;\n  contain: strict;\n}\n\n.click-block-active {\n  transform: translate3d(0,  0,  0);\n}\n\n* {\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nhtml {\n  width: 100%;\n  height: 100%;\n  text-size-adjust: 100%;\n}\n\nbody {\n  margin: 0;\n  padding: 0;\n  position: fixed;\n  overflow: hidden;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  max-height: 100%;\n  text-rendering: optimizeLegibility;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  -webkit-user-drag: none;\n  -ms-content-zooming: none;\n  touch-action: manipulation;\n  word-wrap: break-word;\n  text-size-adjust: none;\n  user-select: none;\n}\n\na {\n  background-color: transparent;\n}\n\n.enable-hover a:not(.button):hover {\n  opacity: .7;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  margin-top: 16px;\n  margin-bottom: 10px;\n  font-weight: 500;\n  line-height: 1.2;\n}\n\n[padding] h1:first-child,\n[padding] h2:first-child,\n[padding] h3:first-child,\n[padding] h4:first-child,\n[padding] h5:first-child,\n[padding] h6:first-child {\n  margin-top: -3px;\n}\n\nh1 + h2,\nh1 + h3,\nh2 + h3 {\n  margin-top: -3px;\n}\n\nh1 {\n  margin-top: 20px;\n  font-size: 26px;\n}\n\nh2 {\n  margin-top: 18px;\n  font-size: 24px;\n}\n\nh3 {\n  font-size: 22px;\n}\n\nh4 {\n  font-size: 20px;\n}\n\nh5 {\n  font-size: 18px;\n}\n\nh6 {\n  font-size: 16px;\n}\n\nsmall {\n  font-size: 75%;\n}\n\nsub,\nsup {\n  position: relative;\n  font-size: 75%;\n  line-height: 0;\n  vertical-align: baseline;\n}\n\nsup {\n  top: -.5em;\n}\n\nsub {\n  bottom: -.25em;\n}\n\nion-app {\n  top: 0;\n  position: absolute;\n  z-index: 0;\n  width: 100%;\n  height: 100%;\n  contain: layout size style;\n}\n\n.ion-page,\n.page-inner {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n\n.hide-page {\n  opacity: 0;\n}\n\nion-route,\nion-route-controller,\nion-animation-controller,\nion-nav-controller,\nion-menu-controller,\nion-action-sheet-controller,\nion-alert-controller,\nion-loading-controller,\nion-modal-controller,\nion-picker-controller,\nion-toast-controller,\n[app-viewport],\n[overlay-portal],\n[nav-viewport],\n[tab-portal] {\n  display: none;\n}\n\n[text-center] {\n  text-align: center !important;\n}\n\n[text-justify] {\n  text-align: justify !important;\n}\n\n[text-start] {\n  text-align: left;\n  text-align: start !important;\n}\n\n[text-end] {\n  text-align: right;\n  text-align: end !important;\n}\n\n[text-left] {\n  text-align: left !important;\n}\n\n[text-right] {\n  text-align: right !important;\n}\n\n[text-nowrap] {\n  white-space: nowrap !important;\n}\n\n[text-wrap] {\n  white-space: normal !important;\n}\n\n\@media (min-width: 576px) {\n  [text-sm-center] {\n    text-align: center !important;\n  }\n  [text-sm-justify] {\n    text-align: justify !important;\n  }\n  [text-sm-start] {\n    text-align: left;\n    text-align: start !important;\n  }\n  [text-sm-end] {\n    text-align: right;\n    text-align: end !important;\n  }\n  [text-sm-left] {\n    text-align: left !important;\n  }\n  [text-sm-right] {\n    text-align: right !important;\n  }\n  [text-sm-nowrap] {\n    white-space: nowrap !important;\n  }\n  [text-sm-wrap] {\n    white-space: normal !important;\n  }\n}\n\n\@media (min-width: 768px) {\n  [text-md-center] {\n    text-align: center !important;\n  }\n  [text-md-justify] {\n    text-align: justify !important;\n  }\n  [text-md-start] {\n    text-align: left;\n    text-align: start !important;\n  }\n  [text-md-end] {\n    text-align: right;\n    text-align: end !important;\n  }\n  [text-md-left] {\n    text-align: left !important;\n  }\n  [text-md-right] {\n    text-align: right !important;\n  }\n  [text-md-nowrap] {\n    white-space: nowrap !important;\n  }\n  [text-md-wrap] {\n    white-space: normal !important;\n  }\n}\n\n\@media (min-width: 992px) {\n  [text-lg-center] {\n    text-align: center !important;\n  }\n  [text-lg-justify] {\n    text-align: justify !important;\n  }\n  [text-lg-start] {\n    text-align: left;\n    text-align: start !important;\n  }\n  [text-lg-end] {\n    text-align: right;\n    text-align: end !important;\n  }\n  [text-lg-left] {\n    text-align: left !important;\n  }\n  [text-lg-right] {\n    text-align: right !important;\n  }\n  [text-lg-nowrap] {\n    white-space: nowrap !important;\n  }\n  [text-lg-wrap] {\n    white-space: normal !important;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [text-xl-center] {\n    text-align: center !important;\n  }\n  [text-xl-justify] {\n    text-align: justify !important;\n  }\n  [text-xl-start] {\n    text-align: left;\n    text-align: start !important;\n  }\n  [text-xl-end] {\n    text-align: right;\n    text-align: end !important;\n  }\n  [text-xl-left] {\n    text-align: left !important;\n  }\n  [text-xl-right] {\n    text-align: right !important;\n  }\n  [text-xl-nowrap] {\n    white-space: nowrap !important;\n  }\n  [text-xl-wrap] {\n    white-space: normal !important;\n  }\n}\n\n[text-uppercase] {\n  text-transform: uppercase !important;\n}\n\n[text-lowercase] {\n  text-transform: lowercase !important;\n}\n\n[text-capitalize] {\n  text-transform: capitalize !important;\n}\n\n\@media (min-width: 576px) {\n  [text-sm-uppercase] {\n    text-transform: uppercase !important;\n  }\n  [text-sm-lowercase] {\n    text-transform: lowercase !important;\n  }\n  [text-sm-capitalize] {\n    text-transform: capitalize !important;\n  }\n}\n\n\@media (min-width: 768px) {\n  [text-md-uppercase] {\n    text-transform: uppercase !important;\n  }\n  [text-md-lowercase] {\n    text-transform: lowercase !important;\n  }\n  [text-md-capitalize] {\n    text-transform: capitalize !important;\n  }\n}\n\n\@media (min-width: 992px) {\n  [text-lg-uppercase] {\n    text-transform: uppercase !important;\n  }\n  [text-lg-lowercase] {\n    text-transform: lowercase !important;\n  }\n  [text-lg-capitalize] {\n    text-transform: capitalize !important;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [text-xl-uppercase] {\n    text-transform: uppercase !important;\n  }\n  [text-xl-lowercase] {\n    text-transform: lowercase !important;\n  }\n  [text-xl-capitalize] {\n    text-transform: capitalize !important;\n  }\n}\n\n[float-left] {\n  float: left !important;\n}\n\n[float-right] {\n  float: right !important;\n}\n\n[float-start] {\n  float: left !important;\n}\n\n[float-end] {\n  float: right !important;\n}\n\n\@media (min-width: 576px) {\n  [float-sm-left] {\n    float: left !important;\n  }\n  [float-sm-right] {\n    float: right !important;\n  }\n  [float-sm-start] {\n    float: left !important;\n  }\n  [float-sm-end] {\n    float: right !important;\n  }\n}\n\n\@media (min-width: 768px) {\n  [float-md-left] {\n    float: left !important;\n  }\n  [float-md-right] {\n    float: right !important;\n  }\n  [float-md-start] {\n    float: left !important;\n  }\n  [float-md-end] {\n    float: right !important;\n  }\n}\n\n\@media (min-width: 992px) {\n  [float-lg-left] {\n    float: left !important;\n  }\n  [float-lg-right] {\n    float: right !important;\n  }\n  [float-lg-start] {\n    float: left !important;\n  }\n  [float-lg-end] {\n    float: right !important;\n  }\n}\n\n\@media (min-width: 1200px) {\n  [float-xl-left] {\n    float: left !important;\n  }\n  [float-xl-right] {\n    float: right !important;\n  }\n  [float-xl-start] {\n    float: left !important;\n  }\n  [float-xl-end] {\n    float: right !important;\n  }\n}\n\n.app-md {\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n  font-size: 14px;\n  background-color: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}\n\n.app-md ion-tabs ion-tabbar:not(.placement-top) {\n  padding-bottom: calc(constant(safe-area-inset-bottom) + 0);\n  padding-bottom: calc(env(safe-area-inset-bottom) + 0);\n  height: calc(56px + constant(safe-area-inset-bottom));\n  height: calc(56px + env(safe-area-inset-bottom));\n}\n\n.app-md ion-footer .toolbar:last-child {\n  padding-bottom: calc(constant(safe-area-inset-bottom) + 4px);\n  padding-bottom: calc(env(safe-area-inset-bottom) + 4px);\n  min-height: calc(56px + constant(safe-area-inset-bottom));\n  min-height: calc(56px + env(safe-area-inset-bottom));\n}\n\n.app-md .ion-page > .toolbar.statusbar-padding:first-child,\n.app-md .ion-page > ion-header > .toolbar.statusbar-padding:first-child,\n.app-md ion-tab ion-nav .ion-page > ion-header > .toolbar.statusbar-padding:first-child,\n.app-md ion-menu > .menu-inner > .toolbar.statusbar-padding:first-child,\n.app-md ion-menu > .menu-inner > ion-header > .toolbar.statusbar-padding:first-child {\n  padding-top: calc(20px + 4px);\n  padding-top: calc(constant(safe-area-inset-top) + 4px);\n  padding-top: calc(env(safe-area-inset-top) + 4px);\n  min-height: calc(56px + 20px);\n  min-height: calc(56px + constant(safe-area-inset-top));\n  min-height: calc(56px + env(safe-area-inset-top));\n}\n\n.app-md .ion-page > ion-content.statusbar-padding:first-child .scroll-content,\n.app-md .ion-page > ion-header > ion-content.statusbar-padding:first-child .scroll-content,\n.app-md ion-tab ion-nav .ion-page > ion-header > ion-content.statusbar-padding:first-child .scroll-content,\n.app-md ion-menu > .menu-inner > ion-content.statusbar-padding:first-child .scroll-content,\n.app-md ion-menu > .menu-inner > ion-header > ion-content.statusbar-padding:first-child .scroll-content {\n  padding-top: 20px;\n  padding-top: calc(constant(safe-area-inset-top) + 0px);\n  padding-top: calc(env(safe-area-inset-top) + 0px);\n}\n\n.app-md .ion-page > ion-content.statusbar-padding:first-child[padding] .scroll-content,\n.app-md .ion-page > ion-content.statusbar-padding:first-child[padding-top] .scroll-content,\n.app-md .ion-page > ion-header > ion-content.statusbar-padding:first-child[padding] .scroll-content,\n.app-md .ion-page > ion-header > ion-content.statusbar-padding:first-child[padding-top] .scroll-content,\n.app-md ion-tab ion-nav .ion-page > ion-header > ion-content.statusbar-padding:first-child[padding] .scroll-content,\n.app-md ion-tab ion-nav .ion-page > ion-header > ion-content.statusbar-padding:first-child[padding-top] .scroll-content,\n.app-md ion-menu > .menu-inner > ion-content.statusbar-padding:first-child[padding] .scroll-content,\n.app-md ion-menu > .menu-inner > ion-content.statusbar-padding:first-child[padding-top] .scroll-content,\n.app-md ion-menu > .menu-inner > ion-header > ion-content.statusbar-padding:first-child[padding] .scroll-content,\n.app-md ion-menu > .menu-inner > ion-header > ion-content.statusbar-padding:first-child[padding-top] .scroll-content {\n  padding-top: calc(16px + 20px);\n  padding-top: calc(constant(safe-area-inset-top) + 0px);\n  padding-top: calc(env(safe-area-inset-top) + 0px);\n}\n\na {\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}"; }
    static get styleMode() { return "md"; }
}
function getTopNavsImpl(rootNavId = -1) {
    if (!rootNavs.size) {
        return [];
    }
    if (rootNavId !== -1) {
        return findTopNavs(rootNavs.get(rootNavId));
    }
    if (rootNavs.size === 1) {
        return findTopNavs(rootNavs.values().next().value);
    }
    // fallback to just using all root navs
    let activeNavs = [];
    rootNavs.forEach(nav => {
        activeNavs = activeNavs.concat(findTopNavs(nav));
    });
    return activeNavs;
}
function findTopNavs(nav) {
    let containers = [];
    const childNavs = nav.getChildNavs();
    if (!childNavs || !childNavs.length) {
        containers.push(nav);
    }
    else {
        childNavs.forEach(childNav => {
            const topNavs = findTopNavs(childNav);
            containers = containers.concat(topNavs);
        });
    }
    return containers;
}
function getNavByIdOrNameImpl(nav, id) {
    if (nav.navId === id || nav.name === id) {
        return nav;
    }
    for (const child of nav.getChildNavs()) {
        const tmp = getNavByIdOrNameImpl(child, id);
        if (tmp) {
            return tmp;
        }
    }
    return null;
}
function getHydratedController(tagName) {
    const controller = getOrAppendElement(tagName);
    return controller.componentOnReady();
}
function checkIfMenuIsOpen() {
    return getHydratedController('ion-menu-controller').then((menuController) => {
        if (menuController.isOpen()) {
            return menuController.close().then(() => {
                return true;
            });
        }
        return false;
    });
}
function checkIfNotModalOverlayIsOpen() {
    const promises = [];
    promises.push(checkIfOverlayExists('ion-action-sheet-controller'));
    promises.push(checkIfOverlayExists('ion-alert-controller'));
    promises.push(checkIfOverlayExists('ion-loading-controller'));
    promises.push(checkIfOverlayExists('ion-picker-controller'));
    promises.push(checkIfOverlayExists('ion-popover-controller'));
    promises.push(checkIfOverlayExists('ion-toast-controller'));
    return Promise.all(promises).then((results) => {
        return results.every((value) => !!value);
    });
}
function checkIfOverlayExists(tagName) {
    const overlayControllerElement = document.querySelector(tagName);
    if (!overlayControllerElement) {
        return Promise.resolve(false);
    }
    return overlayControllerElement.componentOnReady().then(() => {
        return !!(overlayControllerElement.getTop());
    });
}
function closeModalIfOpen() {
    return getHydratedController('ion-modal-controller').then((modalController) => {
        if (modalController.getTop()) {
            return modalController.dismiss().then(() => {
                return true;
            });
        }
        return false;
    });
}
function popEligibleView() {
    let navToPop = null;
    let mostRecentVC = null;
    rootNavs.forEach(nav => {
        const topNavs = getTopNavsImpl(nav.navId);
        const poppableNavs = topNavs.map(topNav => getPoppableNav(topNav)).filter(nav => !!nav).filter(nav => !!nav.last());
        poppableNavs.forEach(poppable => {
            const topViewController = poppable.last();
            if (!mostRecentVC || topViewController.timestamp >= mostRecentVC.timestamp) {
                mostRecentVC = topViewController;
                navToPop = poppable;
            }
        });
    });
    if (navToPop) {
        return navToPop.pop().then(() => {
            return true;
        });
    }
    return Promise.resolve(false);
}
function getPoppableNav(nav) {
    if (!nav) {
        return null;
    }
    // to be a poppable nav, a nav must a top view, plus a view that we can pop back to
    if (nav.getViews.length > 1) {
        return nav;
    }
    return getPoppableNav(nav.parent);
}

class StatusTap {
    constructor() {
        this.duration = 300;
    }
    statusTap() {
        return this.tap();
    }
    mockTap() {
        return this.tap();
    }
    tap() {
        return domControllerAsync(this.dom.read, () => {
            const width = window.innerWidth;
            const height = window.innerWidth;
            const el = document.elementFromPoint(width / 2, height / 2);
            if (!el) {
                return null;
            }
            return el.closest('ion-scroll');
        }).then(([scroll]) => {
            return scroll.componentOnReady();
        }).then((scroll) => {
            return domControllerAsync(this.dom.write, () => {
                return scroll.scrollToTop(this.duration);
            });
        });
    }
    static get is() { return "ion-status-tap"; }
    static get properties() { return { "dom": { "context": "dom" }, "duration": { "type": Number, "attr": "duration" }, "mockTap": { "method": true } }; }
}

class TapClick {
    constructor() {
        this.lastTouch = -MOUSE_WAIT * 10;
        this.lastActivated = 0;
        this.clearDefers = new WeakMap();
    }
    componentDidLoad() {
        if (this.isServer) {
            return;
        }
        this.gestureCtrl = Ionic.gesture = Ionic.gesture || new GestureController();
        this.app = this.el.closest('ion-app');
    }
    onBodyClick(ev) {
        if (this.shouldCancel()) {
            debugger;
            ev.preventDefault();
            ev.stopPropagation();
        }
    }
    // Touch Events
    onTouchStart(ev) {
        this.lastTouch = now(ev);
        this.pointerDown(ev);
    }
    onTouchCancel(ev) {
        this.lastTouch = now(ev);
        this.pointerUp(ev);
    }
    onTouchEnd(ev) {
        this.lastTouch = now(ev);
        this.pointerUp(ev);
    }
    onMouseDown(ev) {
        const t = now(ev) - MOUSE_WAIT;
        if (this.lastTouch < t) {
            this.pointerDown(ev);
        }
    }
    onMouseUp(ev) {
        const t = now(ev) - MOUSE_WAIT;
        if (this.lastTouch < t) {
            this.pointerUp(ev);
        }
    }
    scrollStarted() {
        clearTimeout(this.activeDefer);
        if (this.activatableEle) {
            this.removeActivated(false);
            this.activatableEle = null;
        }
    }
    pointerDown(ev) {
        if (this.activatableEle) {
            return;
        }
        if (!this.shouldCancel()) {
            this.setActivatedElement(getActivatableTarget(ev.target), ev);
        }
    }
    pointerUp(ev) {
        this.setActivatedElement(null, ev);
    }
    setActivatedElement(el, ev) {
        // do nothing
        const activatableEle = this.activatableEle;
        if (el && el === activatableEle) {
            return;
        }
        clearTimeout(this.activeDefer);
        this.activeDefer = null;
        const eventX = pointerCoordX(ev);
        const eventY = pointerCoordY(ev);
        // unactivate selected
        if (activatableEle) {
            if (this.clearDefers.has(activatableEle)) {
                throw new Error('internal error');
            }
            if (!activatableEle.classList.contains(ACTIVATED)) {
                this.addActivated(activatableEle, eventX, eventY);
            }
            this.removeActivated(true);
        }
        // activate
        if (el) {
            const deferId = this.clearDefers.get(el);
            if (deferId) {
                clearTimeout(deferId);
                this.clearDefers.delete(el);
            }
            el.classList.remove(ACTIVATED);
            this.activeDefer = setTimeout(() => {
                this.addActivated(el, eventX, eventY);
                this.activeDefer = null;
            }, ADD_ACTIVATED_DEFERS);
        }
        this.activatableEle = el;
    }
    addActivated(el, x, y) {
        this.lastActivated = Date.now();
        el.classList.add(ACTIVATED);
        const event = new CustomEvent('ionActivated', {
            bubbles: false,
            detail: { x, y }
        });
        el.dispatchEvent(event);
    }
    removeActivated(smooth) {
        const activatableEle = this.activatableEle;
        if (!activatableEle) {
            return;
        }
        const time = CLEAR_STATE_DEFERS - Date.now() + this.lastActivated;
        if (smooth && time > 0) {
            const deferId = setTimeout(() => {
                activatableEle.classList.remove(ACTIVATED);
                this.clearDefers.delete(activatableEle);
            }, CLEAR_STATE_DEFERS);
            this.clearDefers.set(activatableEle, deferId);
        }
        else {
            activatableEle.classList.remove(ACTIVATED);
        }
    }
    shouldCancel() {
        if (!this.app.isEnabled()) {
            console.debug('click prevent: appDisabled');
            return true;
        }
        if (this.gestureCtrl.isCaptured()) {
            console.debug('click prevent: tap-click (gesture is captured)');
            return true;
        }
        return false;
    }
    static get is() { return "ion-tap-click"; }
    static get properties() { return { "el": { "elementRef": true }, "enableListener": { "context": "enableListener" }, "isServer": { "context": "isServer" } }; }
}
function getActivatableTarget(el) {
    return el.closest('a,button,[tappable]');
}
const ACTIVATED = 'activated';
const ADD_ACTIVATED_DEFERS = 200;
const CLEAR_STATE_DEFERS = 200;
const MOUSE_WAIT = 2500;

export { App as IonApp, StatusTap as IonStatusTap, TapClick as IonTapClick };
