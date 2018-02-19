/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { isDef, assert, normalizeUrl, focusOutActiveElement, isNumber, isParentTab } from './chunk1.js';
import { DomFrameworkDelegate } from './chunk3.js';

var State;
(function (State) {
    State[State["New"] = 0] = "New";
    State[State["INITIALIZED"] = 1] = "INITIALIZED";
    State[State["ATTACHED"] = 2] = "ATTACHED";
    State[State["DESTROYED"] = 3] = "DESTROYED";
})(State || (State = {}));
const STATE_NEW = 1;
const STATE_INITIALIZED = 2;
const STATE_ATTACHED = 3;
const STATE_DESTROYED = 4;
const INIT_ZINDEX = 100;

const DIRECTION_BACK = 'back';
const DIRECTION_FORWARD = 'forward';



let NAV_ID_START = 1000;
let VIEW_ID_START = 2000;
let transitionIds = 0;
const activeTransitions = new Map();
function isViewController(object) {
    return !!(object && object.didLoad && object.willUnload);
}
function setZIndex(nav, enteringView, leavingView, direction) {
    if (enteringView) {
        leavingView = leavingView || nav.getPrevious(enteringView);
        if (leavingView && isDef(leavingView.zIndex)) {
            if (direction === DIRECTION_BACK) {
                updateZIndex(enteringView, leavingView.zIndex - 1);
            }
            else {
                updateZIndex(enteringView, leavingView.zIndex + 1);
            }
        }
        else {
            // TODO - fix typing
            updateZIndex(enteringView, INIT_ZINDEX + nav.zIndexOffset);
        }
    }
}
function updateZIndex(viewController, newZIndex) {
    if (newZIndex !== viewController.zIndex) {
        viewController.zIndex = newZIndex;
        viewController.element.style.zIndex = '' + newZIndex;
    }
}
function toggleHidden(element, shouldBeHidden) {
    element.hidden = shouldBeHidden;
}
function canNavGoBack(nav, view) {
    if (!nav) {
        return false;
    }
    return !!nav.getPrevious(view);
}
function transitionFactory(animation) {
    animation.registerTransitionStart = (callback) => {
        animation.transitionStartFunction = callback;
    };
    animation.start = function () {
        this.transitionStartFunction && this.transitionStartFunction();
        this.transitionStartFunction = null;
        transitionStartImpl(animation);
    };
    animation.originalDestroy = animation.destroy;
    animation.destroy = function () {
        transitionDestroyImpl(animation);
    };
    return animation;
}
function transitionStartImpl(transition) {
    transition.transitionStartFunction && transition.transitionStartFunction();
    transition.transitionStartFunction = null;
    transition.parent && transition.parent.start();
}
function transitionDestroyImpl(transition) {
    transition.originalDestroy();
    transition.parent = transition.enteringView = transition.leavingView = transition.transitionStartFunction = null;
}
function getParentTransitionId(nav) {
    nav = nav.parent;
    while (nav) {
        const transitionId = nav.transitionId;
        if (isDef(transitionId)) {
            return transitionId;
        }
        nav = nav.parent;
    }
    return -1;
}
function getNextTransitionId() {
    return transitionIds++;
}
function destroyTransition(transitionId) {
    const transition = activeTransitions.get(transitionId);
    if (transition) {
        transition.destroy();
        activeTransitions.delete(transitionId);
    }
}
function getHydratedTransition(name, config, transitionId, emptyTransition, enteringView, leavingView, opts, defaultTransitionFactory) {
    // Let makes sure everything is hydrated and ready to animate
    const componentReadyPromise = [];
    if (enteringView && enteringView.element.componentOnReady) {
        componentReadyPromise.push(enteringView.element.componentOnReady());
    }
    if (leavingView && leavingView.element.componentOnReady) {
        componentReadyPromise.push(leavingView.element.componentOnReady());
    }
    const transitionFactory = config.get(name) || defaultTransitionFactory;
    return Promise.all(componentReadyPromise)
        .then(() => transitionFactory(emptyTransition, enteringView, leavingView, opts))
        .then((hydratedTransition) => {
        hydratedTransition.transitionId = transitionId;
        if (!activeTransitions.has(transitionId)) {
            // sweet, this is the root transition
            activeTransitions.set(transitionId, hydratedTransition);
        }
        else {
            // we've got a parent transition going
            // just append this transition to the existing one
            activeTransitions.get(transitionId).add(hydratedTransition);
        }
        return hydratedTransition;
    });
}


function getFirstView(nav) {
    return nav.views && nav.views.length ? nav.views[0] : null;
}
function getLastView(nav) {
    return nav.views && nav.views.length ? nav.views[nav.views.length - 1] : null;
}

function getViews(nav) {
    return nav.views ? nav.views : [];
}
function getActiveImpl(nav) {
    return nav.views && nav.views.length > 0 ? nav.views[nav.views.length - 1] : null;
}
function getPreviousImpl(nav, viewController) {
    if (!viewController) {
        viewController = nav.getActive();
    }
    return nav.views[nav.views.indexOf(viewController) - 1];
}
function getNextNavId() {
    return navControllerIds++;
}
let navControllerIds = NAV_ID_START;

class ViewController {
    constructor(component, data, fromExternalRouter, url) {
        this.component = component;
        initializeNewViewController(this, data, fromExternalRouter, url);
    }
    /**
     * Dismiss the current viewController
     * @param {any} [data] Data that you want to return when the viewController is dismissed.
     * @param {any} [role ]
     * @param {NavOptions} navOptions Options for the dismiss navigation.
     * @returns {any} data Returns the data passed in, if any.
     */
    dismiss(data, role, navOptions = {}) {
        this.dismissProxy = {};
        return dismiss(this.nav, this.dismissProxy, data, role, navOptions);
    }
    willLeave(unload) {
        willLeaveImpl(unload, this);
    }
    didLeave() {
        didLeaveImpl(this);
    }
    willEnter() {
        callLifeCycleFunction(this.instance, 'ionViewWillEnter');
    }
    didEnter() {
        didEnterImpl(this);
    }
    willLoad() {
        willLoadImpl(this);
    }
    didLoad() {
        didLoadImpl(this);
    }
    willUnload() {
        willUnloadImpl(this);
    }
    destroy(delegate) {
        return destroy(this, delegate);
    }
    getTransitionName(_direction) {
        // TODO
        return '';
    }
}

function dismiss(navCtrl, dismissProxy, data, role, navOptions = {}) {
    if (!navCtrl) {
        assert(this._state === STATE_DESTROYED, 'ViewController does not have a valid _nav');
        return Promise.resolve(false);
    }
    if (this.overlay && !navOptions.minClickBlockDuration) {
        // This is a Modal being dismissed so we need
        // to add the minClickBlockDuration option
        // for UIWebView
        navOptions.minClickBlockDuration = 400;
    }
    dismissProxy.data = data;
    dismissProxy.role = role;
    const options = Object.assign({}, this._leavingOpts, navOptions);
    return navCtrl.removeView(this, options).then(() => data);
}
function destroy(viewController, delegate) {
    assert(viewController.state !== STATE_DESTROYED, 'view state must be attached');
    return delegate ? delegate.removeViewFromDom(viewController.nav.element, viewController.element) : Promise.resolve().then(() => {
        if (viewController.component) {
            // TODO - consider removing classes and styles as thats what we do in ionic-angular
        }
        viewController.id = viewController.data = viewController.element = viewController.instance = viewController.nav = viewController.dismissProxy = null;
        viewController.state = STATE_DESTROYED;
    });
}
function callLifeCycleFunction(instance, functionName) {
    instance && instance[functionName] && instance[functionName]();
}
function willLeaveImpl(unload, viewController) {
    callLifeCycleFunction(viewController.instance, 'ionViewWillLeave');
    if (unload && viewController.onWillDismiss) {
        viewController.onWillDismiss(this.dismissProxy.data, this.dismissProxy.proxy);
        viewController.onWillDismiss = null;
    }
}
function didLeaveImpl(viewController) {
    callLifeCycleFunction(viewController.instance, 'ionViewDidLeave');
    // TODO, maybe need to do something framework specific here... figure this out later
    // for example, disconnecting from change detection
}

function didEnterImpl(viewController) {
    assert(viewController.state === STATE_ATTACHED, 'view state must be ATTACHED');
    // TODO - navbar didEnter here
    callLifeCycleFunction(viewController.instance, 'ionViewDidEnter');
}
function willLoadImpl(viewController) {
    assert(viewController.state === STATE_INITIALIZED, 'view state must be INITIALIZED');
    callLifeCycleFunction(viewController.instance, 'ionViewWillLoad');
}
function willUnloadImpl(viewController) {
    callLifeCycleFunction(viewController.instance, 'ionViewWillUnLoad');
    viewController.onDidDismiss && viewController.onDidDismiss(viewController.dismissProxy.data, viewController.dismissProxy.role);
    viewController.onDidDismiss = viewController.dismissProxy = null;
}
function didLoadImpl(viewController) {
    assert(viewController.state === STATE_ATTACHED, 'view state must be ATTACHED');
    callLifeCycleFunction(viewController.instance, 'ionViewDidLoad');
}
function initializeNewViewController(viewController, data, fromExternalRouter, url) {
    viewController.timestamp = Date.now();
    viewController.state = STATE_NEW;
    viewController.data = data || {};
    viewController.fromExternalRouter = fromExternalRouter;
    viewController.url = url && normalizeUrl(url);
}

class DomRouterDelegate {
    pushUrlState(urlSegment, stateObject = null, title = '') {
        history.pushState(stateObject, title, urlSegment);
        return Promise.resolve();
    }
    popUrlState() {
        history.back();
        return Promise.resolve();
    }
}

const DURATION = 500;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
const OPACITY = 'opacity';
const TRANSFORM = 'transform';
const TRANSLATEX = 'translateX';
const CENTER = '0%';
const OFF_OPACITY = 0.8;
const SHOW_BACK_BTN_CSS = 'show-back-button';
function buildIOSTransition(rootTransition, enteringView, leavingView, opts) {
    // Cool we're all hydrated, and can do deep selector
    rootTransition.enteringView = enteringView;
    rootTransition.leavingView = leavingView;
    const isRTL = document.dir === 'rtl';
    const OFF_RIGHT = isRTL ? '-99.5%' : '99.5%';
    const OFF_LEFT = isRTL ? '33%' : '-33%';
    rootTransition.duration(isDef(opts.duration) ? opts.duration : DURATION);
    rootTransition.easing(isDef(opts.easing) ? opts.easing : EASING);
    rootTransition.addElement(enteringView.element);
    rootTransition.beforeRemoveClass('hide-page');
    if (leavingView) {
        const navEl = leavingView.element.closest('ion-nav');
        if (navEl) {
            const navDecor = rootTransition.create();
            navDecor.addElement(navEl).duringAddClass('show-decor');
            rootTransition.add(navDecor);
        }
    }
    const backDirection = (opts.direction === 'back');
    // setting up enter view
    if (enteringView) {
        const contentEl = enteringView.element.querySelector('ion-content');
        const headerEls = enteringView.element.querySelectorAll('ion-header > *:not(ion-toolbar),ion-footer > *');
        const enteringToolBarEle = enteringView.element.querySelector('ion-toolbar');
        const enteringContent = rootTransition.create();
        if (!contentEl && !enteringToolBarEle && headerEls.length === 0) {
            enteringContent.addElement(enteringView.element.querySelector('ion-page,ion-nav,ion-tabs'));
        }
        else {
            enteringContent.addElement(contentEl);
            enteringContent.addElement(headerEls);
        }
        rootTransition.add(enteringContent);
        if (backDirection) {
            enteringContent
                .beforeClearStyles([OPACITY])
                .fromTo(TRANSLATEX, OFF_LEFT, CENTER, true)
                .fromTo(OPACITY, OFF_OPACITY, 1, true);
        }
        else {
            // entering content, forward direction
            enteringContent
                .beforeClearStyles([OPACITY])
                .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
        }
        if (enteringToolBarEle) {
            const enteringToolBar = rootTransition.create();
            enteringToolBar.addElement(enteringToolBarEle);
            rootTransition.add(enteringToolBar);
            const enteringTitle = rootTransition.create();
            enteringTitle.addElement(enteringToolBarEle.querySelector('ion-title'));
            const enteringToolBarItems = rootTransition.create();
            enteringToolBarItems.addElement(enteringToolBarEle.querySelectorAll('ion-buttons,[menuToggle]'));
            const enteringToolBarBg = rootTransition.create();
            enteringToolBarBg.addElement(enteringToolBarEle.querySelector('.toolbar-background'));
            const enteringBackButton = rootTransition.create();
            enteringBackButton.addElement(enteringToolBarEle.querySelector('.back-button'));
            enteringToolBar
                .add(enteringTitle)
                .add(enteringToolBarItems)
                .add(enteringToolBarBg)
                .add(enteringBackButton);
            enteringTitle.fromTo(OPACITY, 0.01, 1, true);
            enteringToolBarItems.fromTo(OPACITY, 0.01, 1, true);
            if (backDirection) {
                enteringTitle.fromTo(TRANSLATEX, OFF_LEFT, CENTER, true);
                if (canNavGoBack(enteringView.nav, enteringView)) {
                    // back direction, entering page has a back button
                    enteringBackButton.beforeAddClass(SHOW_BACK_BTN_CSS).fromTo(OPACITY, 0.01, 1, true);
                }
            }
            else {
                // entering toolbar, forward direction
                enteringTitle.fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
                enteringToolBarBg
                    .beforeClearStyles([OPACITY])
                    .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
                if (canNavGoBack(enteringView.nav, enteringView)) {
                    // forward direction, entering page has a back button
                    enteringBackButton
                        .beforeAddClass(SHOW_BACK_BTN_CSS)
                        .fromTo(OPACITY, 0.01, 1, true);
                    const enteringBackBtnText = rootTransition.create();
                    enteringBackBtnText.addElement(enteringToolBarEle.querySelector('.back-button .button-text'));
                    enteringBackBtnText.fromTo(TRANSLATEX, (isRTL ? '-100px' : '100px'), '0px');
                    enteringToolBar.add(enteringBackBtnText);
                }
                else {
                    enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
                }
            }
        }
    }
    // setup leaving view
    if (leavingView) {
        const leavingContent = rootTransition.create();
        leavingContent.addElement(leavingView.element.querySelector('ion-content'));
        leavingContent.addElement(leavingView.element.querySelectorAll('ion-header > *:not(ion-toolbar),ion-footer > *'));
        rootTransition.add(leavingContent);
        if (backDirection) {
            // leaving content, back direction
            leavingContent
                .beforeClearStyles([OPACITY])
                .fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));
        }
        else {
            // leaving content, forward direction
            leavingContent
                .fromTo(TRANSLATEX, CENTER, OFF_LEFT, true)
                .fromTo(OPACITY, 1, OFF_OPACITY, true);
        }
        const leavingToolBarEle = leavingView.element.querySelector('ion-toolbar');
        if (leavingToolBarEle) {
            const leavingToolBar = rootTransition.create();
            leavingToolBar.addElement(leavingToolBarEle);
            const leavingTitle = rootTransition.create();
            leavingTitle.addElement(leavingToolBarEle.querySelector('ion-title'));
            const leavingToolBarItems = rootTransition.create();
            leavingToolBarItems.addElement(leavingToolBarEle.querySelectorAll('ion-buttons,[menuToggle]'));
            const leavingToolBarBg = rootTransition.create();
            leavingToolBarBg.addElement(leavingToolBarEle.querySelector('.toolbar-background'));
            const leavingBackButton = rootTransition.create();
            leavingBackButton.addElement(leavingToolBarEle.querySelector('.back-button'));
            leavingToolBar
                .add(leavingTitle)
                .add(leavingToolBarItems)
                .add(leavingBackButton)
                .add(leavingToolBarBg);
            rootTransition.add(leavingToolBar);
            // fade out leaving toolbar items
            leavingBackButton.fromTo(OPACITY, 0.99, 0, true);
            leavingTitle.fromTo(OPACITY, 0.99, 0, true);
            leavingToolBarItems.fromTo(OPACITY, 0.99, 0, true);
            if (backDirection) {
                // leaving toolbar, back direction
                leavingTitle.fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));
                // leaving toolbar, back direction, and there's no entering toolbar
                // should just slide out, no fading out
                leavingToolBarBg
                    .beforeClearStyles([OPACITY])
                    .fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));
                const leavingBackBtnText = rootTransition.create();
                leavingBackBtnText.addElement(leavingToolBarEle.querySelector('.back-button .button-text'));
                leavingBackBtnText.fromTo(TRANSLATEX, CENTER, (isRTL ? -300 : 300) + 'px');
                leavingToolBar.add(leavingBackBtnText);
            }
            else {
                // leaving toolbar, forward direction
                leavingTitle
                    .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
                    .afterClearStyles([TRANSFORM]);
                leavingBackButton.afterClearStyles([OPACITY]);
                leavingTitle.afterClearStyles([OPACITY]);
                leavingToolBarItems.afterClearStyles([OPACITY]);
            }
        }
    }
    // Return the rootTransition promise
    return Promise.resolve(rootTransition);
}

const TRANSLATEY = 'translateY';
const OFF_BOTTOM = '40px';
const CENTER$1 = '0px';
const SHOW_BACK_BTN_CSS$1 = 'show-back-button';
function buildMdTransition(rootTransition, enteringView, leavingView, opts) {
    rootTransition.enteringView = enteringView;
    rootTransition.leavingView = leavingView;
    const ionPageElement = getIonPageElement(enteringView.element);
    rootTransition.addElement(ionPageElement);
    rootTransition.beforeRemoveClass('hide-page');
    const backDirection = (opts.direction === 'back');
    if (enteringView) {
        // animate the component itself
        if (backDirection) {
            rootTransition.duration(isDef(opts.duration) ? opts.duration : 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
        }
        else {
            rootTransition.duration(isDef(opts.duration) ? opts.duration : 280).easing('cubic-bezier(0.36,0.66,0.04,1)');
            rootTransition
                .fromTo(TRANSLATEY, OFF_BOTTOM, CENTER$1, true)
                .fromTo('opacity', 0.01, 1, true);
        }
        // Animate toolbar if it's there
        const enteringToolbarEle = ionPageElement.querySelector('ion-toolbar');
        if (enteringToolbarEle) {
            const enteringToolBar = rootTransition.create();
            enteringToolBar.addElement(enteringToolbarEle);
            rootTransition.add(enteringToolBar);
            const enteringBackButton = rootTransition.create();
            enteringBackButton.addElement(enteringToolbarEle.querySelector('.back-button'));
            rootTransition.add(enteringBackButton);
            if (canNavGoBack(enteringView.nav, enteringView)) {
                enteringBackButton.beforeAddClass(SHOW_BACK_BTN_CSS$1);
            }
            else {
                enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS$1);
            }
        }
    }
    // setup leaving view
    if (leavingView && backDirection) {
        // leaving content
        rootTransition.duration(opts.duration || 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
        const leavingPage = rootTransition.create();
        leavingPage.addElement(getIonPageElement(leavingView.element));
        rootTransition.add(leavingPage.fromTo(TRANSLATEY, CENTER$1, OFF_BOTTOM).fromTo('opacity', 1, 0));
    }
    return Promise.resolve(rootTransition);
}
function getIonPageElement(element) {
    if (element.tagName.toLowerCase() === 'ion-page') {
        return element;
    }
    const ionPage = element.querySelector('ion-page');
    if (ionPage) {
        return ionPage;
    }
    const ionNav = element.querySelector('ion-nav');
    if (ionNav) {
        return ionNav;
    }
    const ionTabs = element.querySelector('ion-tabs');
    if (ionTabs) {
        return ionTabs;
    }
    // idk, return the original element so at least something animates and we don't have a null pointer
    return element;
}

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const transitionQueue = new Map();
const allTransitionsCompleteHandlerQueue = new Map();
/* it is very important to keep this class in sync with ./nav-interface interface */
class Nav {
    constructor() {
        this.useRouter = false;
        this.navId = getNextNavId();
        this.routes = [];
        this.parent = null;
        this.views = [];
        this.transitioning = false;
        this.destroyed = false;
        this.transitionId = NOT_TRANSITIONING_TRANSITION_ID;
        this.initialized = false;
        this.urlExternalNavMap = new Map();
        this.useUrls = false;
        this.lazy = false;
        this.swipeBackEnabled = true;
        this.navId = getNextNavId();
    }
    componentDidLoad() {
        return componentDidLoadImpl(this);
    }
    updateRootComponent() {
        if (this.initialized) {
            return this.setRoot(this.root);
        }
        return Promise.resolve(null);
    }
    getViews() {
        return getViews(this);
    }
    push(component, data, opts, escapeHatch = getDefaultEscapeHatch()) {
        return pushImpl(this, component, data, opts, escapeHatch);
    }
    pop(opts, escapeHatch = getDefaultEscapeHatch()) {
        return popImpl(this, opts, escapeHatch);
    }
    setRoot(component, data, opts, escapeHatch = getDefaultEscapeHatch()) {
        return setRootImpl(this, component, data, opts, escapeHatch);
    }
    insert(insertIndex, page, params, opts, escapeHatch = getDefaultEscapeHatch()) {
        return insertImpl(this, insertIndex, page, params, opts, escapeHatch);
    }
    insertPages(insertIndex, insertPages, opts, escapeHatch = getDefaultEscapeHatch()) {
        return insertPagesImpl(this, insertIndex, insertPages, opts, escapeHatch);
    }
    popToRoot(opts, escapeHatch = getDefaultEscapeHatch()) {
        return popToRootImpl(this, opts, escapeHatch);
    }
    popTo(indexOrViewCtrl, opts, escapeHatch = getDefaultEscapeHatch()) {
        return popToImpl(this, indexOrViewCtrl, opts, escapeHatch);
    }
    removeIndex(startIndex, removeCount, opts, escapeHatch = getDefaultEscapeHatch()) {
        return removeImpl(this, startIndex, removeCount, opts, escapeHatch);
    }
    removeView(viewController, opts, escapeHatch = getDefaultEscapeHatch()) {
        return removeViewImpl(this, viewController, opts, escapeHatch);
    }
    setPages(componentDataPairs, opts, escapeHatch = getDefaultEscapeHatch()) {
        return setPagesImpl(this, componentDataPairs, opts, escapeHatch);
    }
    getActive() {
        return getActiveImpl(this);
    }
    getPrevious(view) {
        return getPreviousImpl(this, view);
    }
    canGoBack() {
        return canGoBackImpl(this);
    }
    first() {
        return getFirstView(this);
    }
    last() {
        return getLastView(this);
    }
    setRouteId(id, _ = {}, direction) {
        const active = this.getActive();
        if (active && active.component === id) {
            return Promise.resolve(false);
        }
        if (direction === 1) {
            return this.push(id).then(() => true);
        }
        else if (direction === -1 && this._canGoBack(id)) {
            return this.pop().then(() => true);
        }
        return this.setRoot(id).then(() => true);
    }
    _canGoBack(id) {
        if (!this.canGoBack()) {
            return false;
        }
        const view = this.views[this.views.length - 1];
        return view.component === id;
    }
    getRouteId() {
        const element = this.getContentElement();
        if (element) {
            return element.tagName;
        }
        return null;
    }
    getContentElement() {
        const active = getActiveImpl(this);
        if (active) {
            return active.element;
        }
        return null;
    }
    getChildNavs() {
        return this.childNavs || [];
    }
    isTransitioning() {
        return this.transitionId >= 0;
    }
    getId() {
        return this.navId;
    }
    setParent(parent) {
        this.parent = parent;
    }
    onAllTransitionsComplete() {
        return allTransitionsCompleteImpl(this);
    }
    reconcileFromExternalRouter(component, data = {}, escapeHatch, isTopLevel) {
        return reconcileFromExternalRouterImpl(this, component, data, escapeHatch, isTopLevel);
    }
    activateFromTab() {
        return activateFromTabImpl(this);
    }
    canSwipeBack() {
        return (this.swipeBackEnabled &&
            // this.childNavs.length === 0 &&
            !this.isTransitioning() &&
            // this._app.isEnabled() &&
            this.canGoBack());
    }
    swipeBackStart() {
        // default the direction to "back";
        const opts = {
            direction: DIRECTION_BACK,
            progressAnimation: true
        };
        return popImpl(this, opts, {});
    }
    swipeBackProgress(detail) {
        if (!this.sbTrns) {
            return;
        }
        // continue to disable the app while actively dragging
        // this._app.setEnabled(false, ACTIVE_TRANSITION_DEFAULT);
        // this.setTransitioning(true);
        const delta = detail.deltaX;
        const stepValue = delta / window.innerWidth;
        // set the transition animation's progress
        this.sbTrns.progressStep(stepValue);
    }
    swipeBackEnd(detail) {
        if (!this.sbTrns) {
            return;
        }
        // the swipe back gesture has ended
        const delta = detail.deltaX;
        const width = window.innerWidth;
        const stepValue = delta / width;
        const velocity = detail.velocityX;
        const z = width / 2.0;
        const shouldComplete = (velocity >= 0)
            && (velocity > 0.2 || detail.deltaX > z);
        const missing = shouldComplete ? 1 - stepValue : stepValue;
        const missingDistance = missing * width;
        let realDur = 0;
        if (missingDistance > 5) {
            const dur = missingDistance / Math.abs(velocity);
            realDur = Math.min(dur, 300);
        }
        this.sbTrns.progressEnd(shouldComplete, stepValue, realDur);
    }
    navInitialized(event) {
        navInitializedImpl(this, event);
    }
    render() {
        const dom = [];
        if (this.swipeBackEnabled) {
            dom.push(h("ion-gesture", { canStart: this.canSwipeBack.bind(this), onStart: this.swipeBackStart.bind(this), onMove: this.swipeBackProgress.bind(this), onEnd: this.swipeBackEnd.bind(this), gestureName: 'goback-swipe', gesturePriority: 10, type: 'pan', direction: 'x', threshold: 10, attachTo: 'body' }));
        }
        if (this.mode === 'ios') {
            dom.push(h("div", { class: 'nav-decor' }));
        }
        dom.push(h("slot", null));
        return dom;
    }
    static get is() { return "ion-nav"; }
    static get properties() { return { "activateFromTab": { "method": true }, "animationCtrl": { "connect": "ion-animation-controller" }, "canGoBack": { "method": true }, "config": { "context": "config" }, "delegate": { "type": "Any", "attr": "delegate" }, "element": { "elementRef": true }, "first": { "method": true }, "getActive": { "method": true }, "getChildNavs": { "method": true }, "getContentElement": { "method": true }, "getId": { "method": true }, "getPrevious": { "method": true }, "getRouteId": { "method": true }, "getViews": { "method": true }, "insert": { "method": true }, "insertPages": { "method": true }, "isTransitioning": { "method": true }, "last": { "method": true }, "lazy": { "type": Boolean, "attr": "lazy" }, "mode": { "type": String, "attr": "mode" }, "onAllTransitionsComplete": { "method": true }, "pop": { "method": true }, "popTo": { "method": true }, "popToRoot": { "method": true }, "push": { "method": true }, "reconcileFromExternalRouter": { "method": true }, "removeIndex": { "method": true }, "removeView": { "method": true }, "root": { "type": "Any", "attr": "root", "watchCallbacks": ["updateRootComponent"] }, "routerDelegate": { "type": "Any", "attr": "router-delegate" }, "setPages": { "method": true }, "setParent": { "method": true }, "setRoot": { "method": true }, "setRouteId": { "method": true }, "swipeBackEnabled": { "type": Boolean, "attr": "swipe-back-enabled" }, "useUrls": { "type": Boolean, "attr": "use-urls" } }; }
    static get events() { return [{ "name": "navInit", "method": "navInit", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionNavChanged", "method": "ionNavChanged", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return ".hide,\n[hidden],\ntemplate {\n  display: none !important;\n}\n\n.sticky {\n  position: sticky;\n  top: 0;\n}\n\n.click-block {\n  display: none;\n}\n\n.click-block-enabled {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  transform: translate3d(0,  -100%,  0) translateY(1px);\n  position: absolute;\n  z-index: 99999;\n  display: block;\n  opacity: 0;\n  contain: strict;\n}\n\n.click-block-active {\n  transform: translate3d(0,  0,  0);\n}\n\nion-nav {\n  top: 0;\n  position: absolute;\n  z-index: 0;\n  width: 100%;\n  height: 100%;\n  contain: layout size style;\n}\n\n.ion-page {\n  top: 0;\n  position: absolute;\n  z-index: 0;\n  width: 100%;\n  height: 100%;\n  contain: layout size style;\n}\n\n.nav-decor {\n  display: none;\n}\n\n.show-decor > .nav-decor {\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 0;\n  display: block;\n  width: 100%;\n  height: 100%;\n  background: #000;\n  pointer-events: none;\n}"; }
}
function componentDidLoadImpl(nav) {
    if (nav.initialized) {
        return;
    }
    nav.initialized = true;
    nav.navInit.emit();
    if (!nav.useRouter) {
        if (nav.root && !nav.lazy) {
            nav.setRoot(nav.root);
        }
    }
}
function pushImpl(nav, component, data, opts, escapeHatch) {
    return __awaiter(this, void 0, void 0, function* () {
        const animation = yield hydrateAnimationController(nav.animationCtrl);
        return push(nav, nav.delegate, animation, component, data, opts, escapeHatch).then((navResult) => {
            return navResult;
        });
    });
}
function popImpl(nav, opts, escapeHatch) {
    return __awaiter(this, void 0, void 0, function* () {
        const animation = yield hydrateAnimationController(nav.animationCtrl);
        return pop(nav, nav.delegate, animation, opts, escapeHatch).then((navResult) => {
            return navResult;
        });
    });
}
function setRootImpl(nav, component, data, opts, escapeHatch) {
    return __awaiter(this, void 0, void 0, function* () {
        const animation = yield hydrateAnimationController(nav.animationCtrl);
        return setRoot(nav, nav.delegate, animation, component, data, opts, escapeHatch).then((navResult) => {
            return navResult;
        });
    });
}
function insertImpl(nav, insertIndex, page, params, opts, escapeHatch) {
    return __awaiter(this, void 0, void 0, function* () {
        const animation = yield hydrateAnimationController(nav.animationCtrl);
        return insert(nav, nav.delegate, animation, insertIndex, page, params, opts, escapeHatch);
    });
}
function insertPagesImpl(nav, insertIndex, pagesToInsert, opts, escapeHatch) {
    return __awaiter(this, void 0, void 0, function* () {
        const animation = yield hydrateAnimationController(nav.animationCtrl);
        return insertPages(nav, nav.delegate, animation, insertIndex, pagesToInsert, opts, escapeHatch);
    });
}
function popToRootImpl(nav, opts, escapeHatch) {
    return __awaiter(this, void 0, void 0, function* () {
        const animation = yield hydrateAnimationController(nav.animationCtrl);
        return popToRoot(nav, nav.delegate, animation, opts, escapeHatch);
    });
}
function popToImpl(nav, indexOrViewCtrl, opts, escapeHatch) {
    return __awaiter(this, void 0, void 0, function* () {
        const animation = yield hydrateAnimationController(nav.animationCtrl);
        return popTo(nav, nav.delegate, animation, indexOrViewCtrl, opts, escapeHatch);
    });
}
function removeImpl(nav, startIndex, removeCount, opts, escapeHatch) {
    return __awaiter(this, void 0, void 0, function* () {
        const animation = yield hydrateAnimationController(nav.animationCtrl);
        return remove(nav, nav.delegate, animation, startIndex, removeCount, opts, escapeHatch);
    });
}
function removeViewImpl(nav, viewController, opts, escapeHatch) {
    return __awaiter(this, void 0, void 0, function* () {
        const animation = yield hydrateAnimationController(nav.animationCtrl);
        return removeView(nav, nav.delegate, animation, viewController, opts, escapeHatch);
    });
}
function setPagesImpl(nav, componentDataPairs, opts, escapeHatch) {
    return __awaiter(this, void 0, void 0, function* () {
        const animation = yield hydrateAnimationController(nav.animationCtrl);
        return setPages(nav, nav.delegate, animation, componentDataPairs, opts, escapeHatch, null);
    });
}
function canGoBackImpl(nav) {
    return nav.views && nav.views.length > 1;
}
function navInitializedImpl(potentialParent, event) {
    if (potentialParent.element !== event.target) {
        // set the parent on the child nav that dispatched the event
        event.target.setParent(potentialParent);
        if (!potentialParent.childNavs) {
            potentialParent.childNavs = [];
        }
        potentialParent.childNavs.push(event.detail);
        // kill the event so it doesn't propagate further
        event.stopPropagation();
    }
}
function hydrateAnimationController(animationController) {
    return animationController.create();
}
// public api
function push(nav, delegate, animation, component, data, opts, escapeHatch) {
    return preprocessTransaction({
        component: component,
        insertStart: -1,
        insertViews: [{ component, data }],
        opts,
        nav,
        delegate,
        id: nav.navId,
        animation,
        escapeHatch,
        method: PUSH
    });
}
function insert(nav, delegate, animation, insertIndex, component, data, opts, escapeHatch) {
    return preprocessTransaction({
        component: component,
        insertStart: insertIndex,
        insertViews: [{ component, data }],
        opts,
        nav,
        delegate,
        id: nav.navId,
        animation,
        escapeHatch,
        method: 'insert'
    });
}
function insertPages(nav, delegate, animation, insertIndex, insertPages, opts, escapeHatch) {
    return preprocessTransaction({
        component: null,
        insertStart: insertIndex,
        insertViews: insertPages,
        opts,
        nav,
        delegate,
        id: nav.navId,
        animation,
        escapeHatch,
        method: 'insertPages'
    });
}
function pop(nav, delegate, animation, opts, escapeHatch) {
    return preprocessTransaction({
        component: null,
        removeStart: -1,
        removeCount: 1,
        opts,
        nav,
        delegate,
        id: nav.navId,
        animation,
        escapeHatch,
        method: POP
    });
}
function popToRoot(nav, delegate, animation, opts, escapeHatch) {
    return preprocessTransaction({
        component: null,
        removeStart: 1,
        removeCount: -1,
        opts,
        nav,
        delegate,
        id: nav.navId,
        animation,
        escapeHatch,
        method: 'popToRoot'
    });
}
function popTo(nav, delegate, animation, indexOrViewCtrl, opts, escapeHatch) {
    const config = {
        component: null,
        removeStart: -1,
        removeCount: -1,
        opts,
        nav,
        delegate,
        id: nav.navId,
        animation,
        escapeHatch,
        method: 'popTo'
    };
    if (isViewController(indexOrViewCtrl)) {
        config.removeView = indexOrViewCtrl;
        config.removeStart = 1;
    }
    else if (isNumber(indexOrViewCtrl)) {
        config.removeStart = indexOrViewCtrl + 1;
    }
    return preprocessTransaction(config);
}
function remove(nav, delegate, animation, startIndex, removeCount = 1, opts, escapeHatch) {
    return preprocessTransaction({
        component: null,
        removeStart: startIndex,
        removeCount: removeCount,
        opts,
        nav,
        delegate,
        id: nav.navId,
        animation,
        escapeHatch,
        method: 'remove'
    });
}
function removeView(nav, delegate, animation, viewController, opts, escapeHatch) {
    return preprocessTransaction({
        component: null,
        removeView: viewController,
        removeStart: 0,
        removeCount: 1,
        opts,
        nav,
        delegate,
        id: nav.navId,
        animation,
        escapeHatch,
        method: 'removeView'
    });
}
function setRoot(nav, delegate, animation, component, data, opts, escapeHatch) {
    return setPages(nav, delegate, animation, [{ component, data }], opts, escapeHatch, SET_ROOT);
}
function setPages(nav, delegate, animation, componentDataPairs, opts, escapeHatch, methodName) {
    if (!isDef(opts)) {
        opts = {};
    }
    if (opts.animate !== true) {
        opts.animate = false;
    }
    return preprocessTransaction({
        component: componentDataPairs.length === 1 ? componentDataPairs[0].component : null,
        insertStart: 0,
        insertViews: componentDataPairs,
        removeStart: 0,
        removeCount: -1,
        opts,
        nav,
        delegate,
        id: nav.navId,
        animation,
        escapeHatch,
        method: methodName ? methodName : 'setPages'
    });
}
function preprocessTransaction(ti) {
    if (isUrl(ti.component)) {
        if (ti.method === PUSH || ti.method === POP || ti.method === SET_ROOT) {
            return navigateToUrl(ti.nav, normalizeUrl(ti.component), ti.method);
        }
        else {
            return Promise.reject(new Error('only push, pop, and setRoot methods support urls'));
        }
    }
    const response = checkIfPopRedirectRequired(ti);
    if (response.required) {
        return navigateToUrl(ti.nav, response.url, POP);
    }
    return queueTransaction(ti);
}
function isUrl(component) {
    return typeof component === 'string' && component.charAt(0) === '/';
}
function navigateToUrl(nav, url, _method) {
    if (!nav.routerDelegate) {
        nav.routerDelegate = new DomRouterDelegate();
    }
    return nav.routerDelegate.pushUrlState(url);
}
function activateFromTabImpl(nav) {
    return nav.onAllTransitionsComplete().then(() => {
        // if there is not a view set and it's not transitioning,
        // go ahead and set the root
        if (nav.getViews().length === 0 && !nav.isTransitioning()) {
            return nav.setRoot(nav.root);
        }
        // okay, we have a view here, and it's almost certainly the correct view
        // so what we need to do is update the browsers url to match what's in the top view
        const viewController = nav.getActive();
        return viewController && viewController.url ? navigateToUrl(nav, viewController.url, null) : Promise.resolve();
    });
}
function queueTransaction(ti) {
    const promise = new Promise((resolve, reject) => {
        ti.resolve = resolve;
        ti.reject = reject;
    });
    if (!ti.delegate) {
        ti.delegate = new DomFrameworkDelegate();
    }
    // Normalize empty
    if (ti.insertViews && ti.insertViews.length === 0) {
        ti.insertViews = undefined;
    }
    // Normalize empty
    if (ti.insertViews && ti.insertViews.length === 0) {
        ti.insertViews = undefined;
    }
    // Enqueue transition instruction
    addToQueue(ti);
    // if there isn't a transition already happening
    // then this will kick off this transition
    nextTransaction(ti.nav);
    return promise;
}
function nextTransaction(nav) {
    if (nav.transitioning) {
        return Promise.resolve();
    }
    const topTransaction = getTopTransaction(nav.navId);
    if (!topTransaction) {
        // cool, there are no transitions going for this nav
        processAllTransitionCompleteQueue(nav.navId);
        return Promise.resolve();
    }
    return doNav(nav, topTransaction);
}
function checkIfPopRedirectRequired(ti) {
    if (ti.method === POP) {
        if (ti.escapeHatch.fromExternalRouter) {
            // if the pop method is called from a router, that means the redirect already happened
            // so just do a normal pop because the url is in a good place. Basically, the router is telling us to
            // pop
            return {
                required: false
            };
        }
        // check if we need to redirect to a url for the pop operation
        const popToIndex = ti.nav.views.length - 2;
        if (popToIndex >= 0) {
            const viewController = ti.nav.views[popToIndex];
            return {
                required: viewController.fromExternalRouter,
                url: viewController.url
            };
        }
    }
    return {
        required: false,
    };
}
function processAllTransitionCompleteQueue(navId) {
    const queue = allTransitionsCompleteHandlerQueue.get(navId) || [];
    for (const callback of queue) {
        callback();
    }
    allTransitionsCompleteHandlerQueue.set(navId, []);
}
function allTransitionsCompleteImpl(nav) {
    return new Promise((resolve) => {
        const queue = transitionQueue.get(nav.navId) || [];
        if (queue.length) {
            // there are pending transitions, so queue it up and we'll be notified when it's done
            const handlers = allTransitionsCompleteHandlerQueue.get(nav.navId) || [];
            handlers.push(resolve);
            return allTransitionsCompleteHandlerQueue.set(nav.navId, handlers);
        }
        // there are no pending transitions, so just resolve right away
        return resolve();
    });
}
function doNav(nav, ti) {
    let enteringView;
    let leavingView;
    return initializeViewBeforeTransition(ti).then(([_enteringView, _leavingView]) => {
        enteringView = _enteringView;
        leavingView = _leavingView;
        return attachViewToDom(nav, enteringView, ti);
    }).then(() => {
        return loadViewAndTransition(nav, enteringView, leavingView, ti);
    }).then(() => {
        nav.ionNavChanged.emit({ isPop: ti.method === 'pop' });
        return successfullyTransitioned(ti);
    }).catch((err) => {
        return transitionFailed(err, ti);
    });
}
function successfullyTransitioned(ti) {
    const queue = getQueue(ti.id);
    if (!queue) {
        // TODO, make throw error in the future
        return fireError(new Error('Queue is null, the nav must have been destroyed'), ti);
    }
    ti.nav.initialized = true;
    ti.nav.transitionId = NOT_TRANSITIONING_TRANSITION_ID;
    ti.nav.transitioning = false;
    // TODO - check if it's a swipe back
    // kick off next transition for this nav I guess
    nextTransaction(ti.nav);
    ti.resolve({
        successful: true,
        mountingData: ti.mountingData
    });
}
function transitionFailed(error, ti) {
    const queue = getQueue(ti.nav.navId);
    if (!queue) {
        // TODO, make throw error in the future
        return fireError(new Error('Queue is null, the nav must have been destroyed'), ti);
    }
    ti.nav.transitionId = null;
    resetQueue(ti.nav.navId);
    ti.nav.transitioning = false;
    // TODO - check if it's a swipe back
    // kick off next transition for this nav I guess
    nextTransaction(ti.nav);
    fireError(error, ti);
}
function fireError(error, ti) {
    if (ti.reject && !ti.nav.destroyed) {
        ti.reject(error);
    }
    else {
        ti.resolve({
            successful: false,
            mountingData: ti.mountingData
        });
    }
}
function loadViewAndTransition(nav, enteringView, leavingView, ti) {
    if (!ti.requiresTransition) {
        // transition is not required, so we are already done!
        // they're inserting/removing the views somewhere in the middle or
        // beginning, so visually nothing needs to animate/transition
        // resolve immediately because there's no animation that's happening
        return Promise.resolve();
    }
    const transitionId = getParentTransitionId(nav);
    nav.transitionId = transitionId >= 0 ? transitionId : getNextTransitionId();
    // create the transition options
    const animationOpts = {
        animation: ti.opts.animation,
        direction: ti.opts.direction,
        duration: (ti.opts.animate === false ? 0 : ti.opts.duration),
        easing: ti.opts.easing,
        isRTL: false,
        ev: ti.opts.event,
    };
    const emptyTransition = transitionFactory(ti.animation);
    return getHydratedTransition(animationOpts.animation, nav.config, nav.transitionId, emptyTransition, enteringView, leavingView, animationOpts, getDefaultTransition(nav.config))
        .then((transition) => {
        if (nav.sbTrns) {
            nav.sbTrns.destroy();
            nav.sbTrns = null;
        }
        // it's a swipe to go back transition
        if (transition.isRoot() && ti.opts.progressAnimation) {
            nav.sbTrns = transition;
        }
        transition.start();
        return executeAsyncTransition(nav, transition, enteringView, leavingView, ti.delegate, ti.opts, ti.nav.config.getBoolean('animate'));
    });
}
function executeAsyncTransition(nav, transition, enteringView, leavingView, delegate, opts, configShouldAnimate) {
    assert(nav.transitioning, 'must be transitioning');
    nav.transitionId = NOT_TRANSITIONING_TRANSITION_ID;
    setZIndex(nav, enteringView, leavingView, opts.direction);
    // always ensure the entering view is viewable
    // ******** DOM WRITE ****************
    // TODO, figure out where we want to read this data from
    enteringView && toggleHidden(enteringView.element, false);
    // always ensure the leaving view is viewable
    // ******** DOM WRITE ****************
    leavingView && toggleHidden(leavingView.element, false);
    const isFirstPage = !nav.initialized && nav.views.length === 1;
    const shouldNotAnimate = isFirstPage;
    if (configShouldAnimate || shouldNotAnimate) {
        opts.animate = false;
    }
    if (opts.animate === false) {
        // if it was somehow set to not animation, then make the duration zero
        transition.duration(0);
    }
    transition.beforeAddRead(() => {
        fireViewWillLifecycles(enteringView, leavingView);
    });
    // get the set duration of this transition
    const duration = transition.getDuration();
    // create a callback for when the animation is done
    const transitionCompletePromise = new Promise(resolve => {
        transition.onFinish(resolve);
    });
    if (transition.isRoot()) {
        if (duration > DISABLE_APP_MINIMUM_DURATION && opts.disableApp !== false) {
            // if this transition has a duration and this is the root transition
            // then set that the app is actively disabled
            // this._app.setEnabled(false, duration + ACTIVE_TRANSITION_OFFSET, opts.minClickBlockDuration);
        }
        else {
            console.debug('transition is running but app has not been disabled');
        }
        if (opts.progressAnimation) {
            // this is a swipe to go back, just get the transition progress ready
            // kick off the swipe animation start
            transition.progressStart();
        }
        else {
            // only the top level transition should actually start "play"
            // kick it off and let it play through
            // ******** DOM WRITE ****************
            transition.play();
        }
    }
    return transitionCompletePromise.then(() => {
        return transitionFinish(nav, transition, delegate, opts);
    });
}
function transitionFinish(nav, transition, delegate, opts) {
    let promise = null;
    if (transition.hasCompleted) {
        transition.enteringView && transition.enteringView.didEnter();
        transition.leavingView && transition.leavingView.didLeave();
        promise = cleanUpView(nav, delegate, transition.enteringView);
    }
    else {
        promise = cleanUpView(nav, delegate, transition.leavingView);
    }
    return promise.then(() => {
        if (transition.isRoot()) {
            destroyTransition(transition.transitionId);
            // TODO - enable app
            nav.transitioning = false;
            // TODO - navChange on the deep linker used to be called here
            if (opts.keyboardClose !== false) {
                focusOutActiveElement();
            }
        }
    });
}
function cleanUpView(nav, delegate, activeViewController) {
    if (nav.destroyed) {
        return Promise.resolve();
    }
    const activeIndex = nav.views.indexOf(activeViewController);
    const promises = [];
    for (let i = nav.views.length - 1; i >= 0; i--) {
        const inactiveViewController = nav.views[i];
        if (i > activeIndex) {
            // this view comes after the active view
            inactiveViewController.willUnload();
            promises.push(destroyView(nav, delegate, inactiveViewController));
        }
        else if (i < activeIndex) {
            // this view comes before the active view
            // and it is not a portal then ensure it is hidden
            toggleHidden(inactiveViewController.element, true);
        }
        // TODO - review existing z index code!
    }
    return Promise.all(promises);
}
function fireViewWillLifecycles(enteringView, leavingView) {
    leavingView && leavingView.willLeave(!enteringView);
    enteringView && enteringView.willEnter();
}
function attachViewToDom(nav, enteringView, ti) {
    if (enteringView && enteringView.state === STATE_NEW) {
        return ti.delegate.attachViewToDom(nav.element, enteringView.component, enteringView.data, [], ti.escapeHatch).then((mountingData) => {
            ti.mountingData = mountingData;
            Object.assign(enteringView, mountingData);
            enteringView.state = STATE_ATTACHED;
        })
            .then(() => waitForNewlyAttachedViewElementsToHydate(enteringView.element));
    }
    // it's in the wrong state, so don't attach and just return
    return Promise.resolve();
}
function waitForNewlyAttachedViewElementsToHydate(element) {
    // the element may or may not be a Stencil element
    // so check if it has an `<ion-nav>`, `<ion-header>`, and `<ion-content>` for
    // hydration
    const promises = [];
    if (element.componentOnReady) {
        // it's a stencil element
        promises.push(element.componentOnReady());
    }
    const navs = element.querySelectorAll('ion-nav');
    for (let i = 0; i < navs.length; i++) {
        const nav = navs.item(i);
        promises.push(nav.componentOnReady());
    }
    // check for headers
    const headers = element.querySelectorAll('ion-header');
    for (let i = 0; i < headers.length; i++) {
        const header = headers.item(i);
        promises.push(header.componentOnReady());
    }
    // check for contents
    const contents = element.querySelectorAll('ion-content');
    for (let i = 0; i < contents.length; i++) {
        const content = contents.item(i);
        promises.push(content.componentOnReady());
    }
    // check for back buttons
    const backButtons = element.querySelectorAll('ion-back-button');
    for (let i = 0; i < backButtons.length; i++) {
        const backButton = backButtons.item(i);
        promises.push(backButton.componentOnReady());
    }
    return Promise.all(promises);
}
function initializeViewBeforeTransition(ti) {
    let leavingView = null;
    let enteringView = null;
    return startTransaction(ti).then(() => {
        const viewControllers = convertComponentToViewController(ti);
        ti.viewControllers = viewControllers;
        leavingView = ti.nav.getActive();
        enteringView = getEnteringView(ti, ti.nav, leavingView);
        if (!leavingView && !enteringView) {
            return Promise.reject(new Error('No views in the stack to remove'));
        }
        // mark state as initialized
        // enteringView.state = STATE_INITIALIZED;
        ti.requiresTransition = (ti.enteringRequiresTransition || ti.leavingRequiresTransition) && enteringView !== leavingView;
        return testIfViewsCanLeaveAndEnter(enteringView, leavingView, ti);
    }).then(() => {
        return updateNavStacks(enteringView, leavingView, ti);
    }).then(() => {
        return [enteringView, leavingView];
    });
}
function updateNavStacks(enteringView, leavingView, ti) {
    return Promise.resolve().then(() => {
        assert(!!(leavingView || enteringView), 'Both leavingView and enteringView are null');
        assert(!!ti.resolve, 'resolve must be valid');
        assert(!!ti.reject, 'reject must be valid');
        const destroyQueue = [];
        ti.opts = ti.opts || {};
        if (isDef(ti.removeStart)) {
            assert(ti.removeStart >= 0, 'removeStart can not be negative');
            assert(ti.removeStart >= 0, 'removeCount can not be negative');
            for (let i = 0; i < ti.removeCount; i++) {
                const view = ti.nav.views[i + ti.removeStart];
                if (view && view !== enteringView && view !== leavingView) {
                    destroyQueue.push(view);
                }
            }
            ti.opts.direction = ti.opts.direction || DIRECTION_BACK;
        }
        const finalBalance = ti.nav.views.length + (ti.insertViews ? ti.insertViews.length : 0) - (ti.removeCount ? ti.removeCount : 0);
        assert(finalBalance >= 0, 'final balance can not be negative');
        if (finalBalance === 0) {
            console.warn(`You can't remove all the pages in the navigation stack. nav.pop() is probably called too many times.`);
            throw new Error('Navigation stack needs at least one root page');
        }
        // At this point the transition can not be rejected, any throw should be an error
        // there are views to insert
        if (ti.viewControllers) {
            // manually set the new view's id if an id was passed in the options
            if (isDef(ti.opts.id)) {
                enteringView.id = ti.opts.id;
            }
            // add the views to the stack
            for (let i = 0; i < ti.viewControllers.length; i++) {
                insertViewIntoNav(ti.nav, ti.viewControllers[i], ti.insertStart + i);
            }
            if (ti.enteringRequiresTransition) {
                // default to forward if not already set
                ti.opts.direction = ti.opts.direction || DIRECTION_FORWARD;
            }
        }
        // if the views to be removed are in the beginning or middle
        // and there is not a view that needs to visually transition out
        // then just destroy them and don't transition anything
        // batch all of lifecycles together
        if (destroyQueue && destroyQueue.length) {
            // TODO, figure out how the zone stuff should work in angular
            for (const view of destroyQueue) {
                view.willLeave(true);
                view.didLeave();
                view.willUnload();
            }
            const destroyQueuePromises = [];
            for (const viewController of destroyQueue) {
                destroyQueuePromises.push(destroyView(ti.nav, ti.delegate, viewController));
            }
            return Promise.all(destroyQueuePromises);
        }
        return null;
    }).then(() => {
        // set which animation it should use if it wasn't set yet
        if (ti.requiresTransition && !ti.opts.animation) {
            ti.opts.animation = isDef(ti.removeStart)
                ? (leavingView || enteringView).getTransitionName(ti.opts.direction)
                : (enteringView || leavingView).getTransitionName(ti.opts.direction);
        }
    });
}
function destroyView(nav, delegate, viewController) {
    return viewController.destroy(delegate).then(() => {
        return removeViewFromList(nav, viewController);
    });
}
function removeViewFromList(nav, viewController) {
    assert(viewController.state === STATE_ATTACHED || viewController.state === STATE_DESTROYED, 'view state should be loaded or destroyed');
    const index = nav.views.indexOf(viewController);
    assert(index > -1, 'view must be part of the stack');
    if (index >= 0) {
        nav.views.splice(index, 1);
    }
}
function insertViewIntoNav(nav, view, index) {
    const existingIndex = nav.views.indexOf(view);
    if (existingIndex > -1) {
        // this view is already in the stack!!
        // move it to its new location
        assert(view.nav === nav, 'view is not part of the nav');
        nav.views.splice(index, 0, nav.views.splice(existingIndex, 1)[0]);
    }
    else {
        assert(!view.nav, 'nav is used');
        // this is a new view to add to the stack
        // create the new entering view
        view.nav = nav;
        // give this inserted view an ID
        viewIds++;
        if (!view.id) {
            view.id = `${nav.navId}-${viewIds}`;
        }
        // insert the entering view into the correct index in the stack
        nav.views.splice(index, 0, view);
    }
}
function testIfViewsCanLeaveAndEnter(enteringView, leavingView, ti) {
    if (!ti.requiresTransition) {
        return Promise.resolve();
    }
    const promises = [];
    if (leavingView) {
        promises.push(lifeCycleTest(leavingView, 'Leave'));
    }
    if (enteringView) {
        promises.push(lifeCycleTest(enteringView, 'Enter'));
    }
    if (promises.length === 0) {
        return Promise.resolve();
    }
    // darn, async promises, gotta wait for them to resolve
    return Promise.all(promises).then((values) => {
        if (values.some(result => result === false)) {
            ti.reject = null;
            throw new Error('canEnter/Leave returned false');
        }
    });
}
function lifeCycleTest(viewController, enterOrLeave) {
    const methodName = `ionViewCan${enterOrLeave}`;
    if (viewController.instance && viewController.instance[methodName]) {
        try {
            const result = viewController.instance[methodName];
            if (result instanceof Promise) {
                return result;
            }
            return Promise.resolve(result !== false);
        }
        catch (e) {
            return Promise.reject(new Error(`Unexpected error when calling ${methodName}: ${e.message}`));
        }
    }
    return Promise.resolve(true);
}
function startTransaction(ti) {
    const viewsLength = ti.nav.views ? ti.nav.views.length : 0;
    if (isDef(ti.removeView)) {
        assert(isDef(ti.removeStart), 'removeView needs removeStart');
        assert(isDef(ti.removeCount), 'removeView needs removeCount');
        const index = ti.nav.views.indexOf(ti.removeView());
        if (index < 0) {
            return Promise.reject(new Error('The removeView was not found'));
        }
        ti.removeStart += index;
    }
    if (isDef(ti.removeStart)) {
        if (ti.removeStart < 0) {
            ti.removeStart = (viewsLength - 1);
        }
        if (ti.removeCount < 0) {
            ti.removeCount = (viewsLength - ti.removeStart);
        }
        ti.leavingRequiresTransition = (ti.removeCount > 0) && ((ti.removeStart + ti.removeCount) === viewsLength);
    }
    if (isDef(ti.insertViews)) {
        // allow -1 to be passed in to auto push it on the end
        // and clean up the index if it's larger then the size of the stack
        if (ti.insertStart < 0 || ti.insertStart > viewsLength) {
            ti.insertStart = viewsLength;
        }
        ti.enteringRequiresTransition = (ti.insertStart === viewsLength);
    }
    ti.nav.transitioning = true;
    return Promise.resolve();
}
function getEnteringView(ti, nav, leavingView) {
    if (ti.viewControllers && ti.viewControllers.length) {
        // grab the very last view of the views to be inserted
        // and initialize it as the new entering view
        return ti.viewControllers[ti.viewControllers.length - 1];
    }
    if (isDef(ti.removeStart)) {
        const removeEnd = ti.removeStart + ti.removeCount;
        for (let i = nav.views.length - 1; i >= 0; i--) {
            if ((i < ti.removeStart || i >= removeEnd) && nav.views[i] !== leavingView) {
                return nav.views[i];
            }
        }
    }
    return null;
}
function convertViewsToViewControllers(pairs, escapeHatch) {
    return pairs.filter(pair => !!pair)
        .map(pair => {
        const applyEscapeHatch = pair === pairs[pairs.length - 1];
        return new ViewController(pair.component, pair.data, applyEscapeHatch ? escapeHatch.fromExternalRouter : false, applyEscapeHatch ? escapeHatch.url : null);
    });
}
function convertComponentToViewController(ti) {
    if (ti.insertViews) {
        assert(ti.insertViews.length > 0, 'length can not be zero');
        const viewControllers = convertViewsToViewControllers(ti.insertViews, ti.escapeHatch);
        assert(ti.insertViews.length === viewControllers.length, 'lengths does not match');
        if (viewControllers.length === 0) {
            throw new Error('No views to insert');
        }
        for (const viewController of viewControllers) {
            if (viewController.nav && viewController.nav.navId !== ti.id) {
                throw new Error('The view has already inserted into a different nav');
            }
            if (viewController.state === STATE_DESTROYED) {
                throw new Error('The view has already been destroyed');
            }
        }
        return viewControllers;
    }
    return [];
}
function addToQueue(ti) {
    const list = transitionQueue.get(ti.id) || [];
    list.push(ti);
    transitionQueue.set(ti.id, list);
}
function getQueue(id) {
    return transitionQueue.get(id) || [];
}
function resetQueue(id) {
    transitionQueue.set(id, []);
}
function getTopTransaction(id) {
    const queue = getQueue(id);
    if (!queue.length) {
        return null;
    }
    const tmp = queue.concat();
    const toReturn = tmp.shift();
    transitionQueue.set(id, tmp);
    return toReturn;
}
function getDefaultTransition(config) {
    return config.get('mode') === 'md' ? buildMdTransition : buildIOSTransition;
}
let viewIds = VIEW_ID_START;
const DISABLE_APP_MINIMUM_DURATION = 64;
const NOT_TRANSITIONING_TRANSITION_ID = -1;
function getDefaultEscapeHatch() {
    return {
        fromExternalRouter: false,
    };
}
function reconcileFromExternalRouterImpl(nav, component, data = {}, escapeHatch, isTopLevel) {
    // check if the nav has an `<ion-tab>` as a parent
    if (isParentTab(nav.element)) {
        // check if the tab is selected
        return updateTab(nav, component, data, escapeHatch, isTopLevel);
    }
    else {
        return updateNav(nav, component, data, escapeHatch, isTopLevel);
    }
}
function updateTab(nav, component, data, escapeHatch, isTopLevel) {
    const tab = nav.element.parentElement;
    // yeah yeah, I know this is kind of ugly but oh well, I know the internal structure of <ion-tabs>
    const tabs = tab.parentElement.parentElement;
    return isTabSelected(tabs, tab).then((isSelected) => {
        if (!isSelected) {
            const promise = updateNav(nav, component, data, escapeHatch, isTopLevel);
            const app = document.querySelector('ion-app');
            return app.componentOnReady().then(() => {
                app.setExternalNavPromise(promise);
                // okay, the tab is not selected, so we need to do a "switch" transition
                // basically, we should update the nav, and then swap the tabs
                return promise.then((navResult) => {
                    return tabs.select(tab).then(() => {
                        return navResult;
                    });
                });
            });
        }
        // okay cool, the tab is already selected, so we want to see a transition
        return updateNav(nav, component, data, escapeHatch, isTopLevel);
    });
}
function isTabSelected(tabsElement, tabElement) {
    const promises = [];
    promises.push(tabsElement.componentOnReady());
    promises.push(tabElement.componentOnReady());
    return Promise.all(promises).then(() => {
        return tabsElement.getSelected() === tabElement;
    });
}
function updateNav(nav, component, data, escapeHatch, isTopLevel) {
    // check if the component is the top view
    const activeViews = nav.getViews();
    if (activeViews.length === 0) {
        // there isn't a view in the stack, so push one
        return nav.setRoot(component, data, {}, escapeHatch);
    }
    const currentView = activeViews[activeViews.length - 1];
    if (currentView.component === component) {
        // the top view is already the component being activated, so there is no change needed
        return Promise.resolve(null);
    }
    // check if the component is the previous view, if so, pop back to it
    if (activeViews.length > 1) {
        // there's at least two views in the stack
        const previousView = activeViews[activeViews.length - 2];
        if (previousView.component === component) {
            // cool, we match the previous view, so pop it
            return nav.pop(null, escapeHatch);
        }
    }
    // check if the component is already in the stack of views, in which case we pop back to it
    for (const view of activeViews) {
        if (view.component === component) {
            // cool, we found the match, pop back to that bad boy
            return nav.popTo(view, null, escapeHatch);
        }
    }
    // it's the top level nav, and it's not one of those other behaviors, so do a push so the user gets a chill animation
    return nav.push(component, data, { animate: isTopLevel }, escapeHatch);
}
const POP = 'pop';
const PUSH = 'push';
const SET_ROOT = 'setRoot';

export { Nav as IonNav };
