/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { assert, checkEdgeSide, isRightSide } from './chunk1.js';

class Menu {
    constructor() {
        this.isPane = false;
        this._isOpen = false;
        this.lastOnEnd = 0;
        this.isAnimating = false;
        this.width = null;
        this.isRightSide = false;
        /**
         * The display type of the menu. Default varies based on the mode,
         * see the `menuType` in the [config](../../config/Config). Available options:
         * `"overlay"`, `"reveal"`, `"push"`.
         */
        this.type = 'overlay';
        /**
         * If true, the menu is disabled. Default `false`.
         */
        this.disabled = false;
        /**
         * Which side of the view the menu should be placed. Default `"start"`.
         */
        this.side = 'start';
        /**
         * If true, swiping the menu is enabled. Default `true`.
         */
        this.swipeEnabled = true;
        /**
         * If true, the menu will persist on child pages.
         */
        this.persistent = false;
        this.maxEdgeStart = 50;
    }
    typeChanged(type, oldType) {
        const contentEl = this.contentEl;
        if (contentEl && oldType) {
            contentEl.classList.remove(`menu-content-${oldType}`);
            contentEl.classList.add(`menu-content-${type}`);
            contentEl.removeAttribute('style');
        }
        if (this.menuInnerEl) {
            // Remove effects of previous animations
            this.menuInnerEl.removeAttribute('style');
        }
        this.animation = null;
    }
    disabledChanged(disabled) {
        this.updateState();
        this.ionMenuDisable.emit({ disabled });
    }
    sideChanged() {
        this.isRightSide = isRightSide(this.side);
    }
    swipeEnabledChanged() {
        this.updateState();
    }
    componentWillLoad() {
        return this.lazyMenuCtrl.componentOnReady().then(menu => {
            this.menuCtrl = menu;
        });
    }
    componentDidLoad() {
        assert(!!this.menuCtrl, 'menucontroller was not initialized');
        const el = this.el;
        const contentQuery = (this.contentId)
            ? '#' + this.contentId
            : '[main]';
        const parent = el.parentElement;
        const content = this.contentEl = parent.querySelector(contentQuery);
        if (!content || !content.tagName) {
            // requires content element
            return console.error('Menu: must have a "content" element to listen for drag events on.');
        }
        // add menu's content classes
        content.classList.add('menu-content');
        this.typeChanged(this.type, null);
        this.sideChanged();
        let isEnabled = !this.disabled;
        if (isEnabled === true || typeof isEnabled === 'undefined') {
            const menus = this.menuCtrl.getMenus();
            isEnabled = !menus.some(m => {
                return m.side === this.side && !m.disabled;
            });
        }
        // register this menu with the app's menu controller
        this.menuCtrl._register(this);
        // mask it as enabled / disabled
        this.disabled = !isEnabled;
    }
    componentDidUnload() {
        this.menuCtrl._unregister(this);
        this.animation && this.animation.destroy();
        this.menuCtrl = this.animation = null;
        this.contentEl = this.backdropEl = this.menuInnerEl = null;
    }
    splitPaneChanged(ev) {
        this.isPane = ev.target.isPane(this.el);
        this.updateState();
    }
    onBackdropClick(ev) {
        const el = ev.target;
        if (!el.closest('.menu-inner') && this.lastOnEnd < (ev.timeStamp - 100)) {
            ev.preventDefault();
            ev.stopPropagation();
            this.close();
        }
    }
    isOpen() {
        return this._isOpen;
    }
    open(animated = true) {
        return this.setOpen(true, animated);
    }
    close(animated = true) {
        return this.setOpen(false, animated);
    }
    toggle(animated = true) {
        return this.setOpen(!this._isOpen, animated);
    }
    setOpen(shouldOpen, animated = true) {
        return this.menuCtrl._setOpen(this, shouldOpen, animated);
    }
    _setOpen(shouldOpen, animated = true) {
        // If the menu is disabled or it is currenly being animated, let's do nothing
        if (!this.isActive() || this.isAnimating || (shouldOpen === this._isOpen)) {
            return Promise.resolve(this._isOpen);
        }
        this.beforeAnimation();
        return this.loadAnimation()
            .then(() => this.startAnimation(shouldOpen, animated))
            .then(() => this.afterAnimation(shouldOpen));
    }
    isActive() {
        return !this.disabled && !this.isPane;
    }
    loadAnimation() {
        // Menu swipe animation takes the menu's inner width as parameter,
        // If `offsetWidth` changes, we need to create a new animation.
        const width = this.menuInnerEl.offsetWidth;
        if (width === this.width && this.animation !== null) {
            return Promise.resolve();
        }
        // Destroy existing animation
        this.animation && this.animation.destroy();
        this.animation = null;
        this.width = width;
        // Create new animation
        return this.menuCtrl.createAnimation(this.type, this).then(ani => {
            this.animation = ani;
        });
    }
    startAnimation(shouldOpen, animated) {
        let done;
        const promise = new Promise(resolve => done = resolve);
        const ani = this.animation
            .onFinish(done, { oneTimeCallback: true, clearExistingCallacks: true })
            .reverse(!shouldOpen);
        if (animated) {
            ani.play();
        }
        else {
            ani.syncPlay();
        }
        return promise;
    }
    canSwipe() {
        return this.swipeEnabled &&
            !this.isAnimating &&
            this.isActive();
    }
    canStart(detail) {
        if (!this.canSwipe()) {
            return false;
        }
        if (this._isOpen) {
            return true;
        }
        else if (this.menuCtrl.getOpen()) {
            return false;
        }
        return checkEdgeSide(detail.currentX, this.isRightSide, this.maxEdgeStart);
    }
    onWillStart() {
        this.beforeAnimation();
        return this.loadAnimation();
    }
    onDragStart() {
        assert(!!this.animation, '_type is undefined');
        if (!this.isAnimating) {
            assert(false, 'isAnimating has to be true');
            return;
        }
        // the cloned animation should not use an easing curve during seek
        this.animation
            .reverse(this._isOpen)
            .progressStart();
    }
    onDragMove(detail) {
        assert(!!this.animation, '_type is undefined');
        if (!this.isAnimating) {
            assert(false, 'isAnimating has to be true');
            return;
        }
        const delta = computeDelta(detail.deltaX, this._isOpen, this.isRightSide);
        const stepValue = delta / this.width;
        this.animation.progressStep(stepValue);
    }
    onDragEnd(detail) {
        assert(!!this.animation, '_type is undefined');
        if (!this.isAnimating) {
            assert(false, 'isAnimating has to be true');
            return;
        }
        const isOpen = this._isOpen;
        const isRightSide = this.isRightSide;
        const delta = computeDelta(detail.deltaX, isOpen, isRightSide);
        const width = this.width;
        const stepValue = delta / width;
        const velocity = detail.velocityX;
        const z = width / 2.0;
        const shouldCompleteRight = (velocity >= 0)
            && (velocity > 0.2 || detail.deltaX > z);
        const shouldCompleteLeft = (velocity <= 0)
            && (velocity < -0.2 || detail.deltaX < -z);
        const shouldComplete = (isOpen)
            ? isRightSide ? shouldCompleteRight : shouldCompleteLeft
            : isRightSide ? shouldCompleteLeft : shouldCompleteRight;
        let shouldOpen = (!isOpen && shouldComplete);
        if (isOpen && !shouldComplete) {
            shouldOpen = true;
        }
        const missing = shouldComplete ? 1 - stepValue : stepValue;
        const missingDistance = missing * width;
        let realDur = 0;
        if (missingDistance > 5) {
            const dur = missingDistance / Math.abs(velocity);
            realDur = Math.min(dur, 300);
        }
        this.lastOnEnd = detail.timeStamp;
        this.animation
            .onFinish(() => this.afterAnimation(shouldOpen), { clearExistingCallacks: true })
            .progressEnd(shouldComplete, stepValue, realDur);
    }
    beforeAnimation() {
        assert(!this.isAnimating, '_before() should not be called while animating');
        // this places the menu into the correct location before it animates in
        // this css class doesn't actually kick off any animations
        this.el.classList.add(SHOW_MENU);
        this.backdropEl.classList.add(SHOW_BACKDROP);
        this.isAnimating = true;
    }
    afterAnimation(isOpen) {
        assert(this.isAnimating, '_before() should be called while animating');
        // TODO: this._app.setEnabled(false, 100);
        // keep opening/closing the menu disabled for a touch more yet
        // only add listeners/css if it's enabled and isOpen
        // and only remove listeners/css if it's not open
        // emit opened/closed events
        this._isOpen = isOpen;
        this.isAnimating = false;
        // add/remove backdrop click listeners
        this.enableListener(this, 'body:click', isOpen);
        if (isOpen) {
            // disable swipe to go back gesture
            this.gestureBlocker = GESTURE_BLOCKER;
            // add css class
            this.contentEl.classList.add(MENU_CONTENT_OPEN);
            // emit open event
            this.ionOpen.emit({ menu: this.el });
        }
        else {
            // enable swipe to go back gesture
            this.gestureBlocker = null;
            // remove css classes
            this.el.classList.remove(SHOW_MENU);
            this.contentEl.classList.remove(MENU_CONTENT_OPEN);
            this.backdropEl.classList.remove(SHOW_BACKDROP);
            // emit close event
            this.ionClose.emit({ menu: this.el });
        }
        return isOpen;
    }
    updateState() {
        const isActive = this.isActive();
        // Close menu inmediately
        if (!isActive && this._isOpen) {
            // close if this menu is open, and should not be enabled
            this.forceClosing();
        }
        if (!this.disabled && this.menuCtrl) {
            this.menuCtrl._setActiveMenu(this);
        }
        assert(!this.isAnimating, 'can not be animating');
    }
    forceClosing() {
        assert(this._isOpen, 'menu cannot be closed');
        this.isAnimating = true;
        this.startAnimation(false, false);
        this.afterAnimation(false);
    }
    hostData() {
        const isRightSide = this.isRightSide;
        return {
            role: 'complementary',
            class: {
                [`menu-type-${this.type}`]: true,
                'menu-enabled': !this.disabled,
                'menu-side-right': isRightSide,
                'menu-side-left': !isRightSide,
            }
        };
    }
    render() {
        return ([
            h("div", { class: 'menu-inner page-inner', ref: el => this.menuInnerEl = el },
                h("slot", null)),
            h("ion-backdrop", { class: 'menu-backdrop', ref: el => this.backdropEl = el }),
            h("ion-gesture", Object.assign({}, {
                'canStart': this.canStart.bind(this),
                'onWillStart': this.onWillStart.bind(this),
                'onStart': this.onDragStart.bind(this),
                'onMove': this.onDragMove.bind(this),
                'onEnd': this.onDragEnd.bind(this),
                'maxEdgeStart': this.maxEdgeStart,
                'edge': this.side,
                'disabled': !this.isActive() || !this.swipeEnabled,
                'gestureName': 'menu-swipe',
                'gesturePriority': 10,
                'type': 'pan',
                'direction': 'x',
                'threshold': 10,
                'attachTo': 'body',
                'disableScroll': true,
                'block': this.gestureBlocker
            }))
        ]);
    }
    static get is() { return "ion-menu"; }
    static get host() { return { "theme": "menu" }; }
    static get properties() { return { "close": { "method": true }, "config": { "context": "config" }, "contentId": { "type": String, "attr": "content-id" }, "disabled": { "type": Boolean, "attr": "disabled", "mutable": true, "watchCallbacks": ["disabledChanged"] }, "el": { "elementRef": true }, "enableListener": { "context": "enableListener" }, "isActive": { "method": true }, "isOpen": { "method": true }, "isRightSide": { "state": true }, "lazyMenuCtrl": { "connect": "ion-menu-controller" }, "maxEdgeStart": { "type": Number, "attr": "max-edge-start" }, "menuId": { "type": String, "attr": "menu-id" }, "open": { "method": true }, "persistent": { "type": Boolean, "attr": "persistent" }, "setOpen": { "method": true }, "side": { "type": "Any", "attr": "side", "watchCallbacks": ["sideChanged"] }, "swipeEnabled": { "type": Boolean, "attr": "swipe-enabled", "watchCallbacks": ["swipeEnabledChanged"] }, "toggle": { "method": true }, "type": { "type": String, "attr": "type", "mutable": true, "watchCallbacks": ["typeChanged"] } }; }
    static get events() { return [{ "name": "ionDrag", "method": "ionDrag", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionOpen", "method": "ionOpen", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionClose", "method": "ionClose", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionMenuDisable", "method": "ionMenuDisable", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-menu {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n  display: none;\n  contain: strict;\n}\n\nion-menu.show-menu {\n  display: block;\n}\n\n.menu-inner {\n  left: 0;\n  right: auto;\n  top: 0;\n  bottom: 0;\n  transform: translate3d(-9999px,  0,  0);\n  position: absolute;\n  display: block;\n  width: 304px;\n  height: 100%;\n  contain: strict;\n}\n\n.menu-side-left > .menu-inner {\n  right: auto;\n  left: 0;\n}\n\n.menu-side-right > .menu-inner {\n  right: 0;\n  left: auto;\n}\n\nion-menu ion-backdrop {\n  z-index: -1;\n  display: none;\n  opacity: .01;\n}\n\n.menu-content {\n  transform: translate3d(0,  0,  0);\n}\n\n.menu-content-open {\n  cursor: pointer;\n  touch-action: manipulation;\n}\n\n.menu-content-open ion-pane,\n.menu-content-open .ion-pane,\n.menu-content-open ion-content,\n.menu-content-open .toolbar {\n  pointer-events: none;\n}\n\n\@media (max-width: 340px) {\n  .menu-inner {\n    width: 264px;\n  }\n}\n\nion-menu.menu-type-reveal {\n  z-index: 0;\n}\n\nion-menu.menu-type-reveal.show-menu .menu-inner {\n  transform: translate3d(0,  0,  0);\n}\n\nion-menu.menu-type-overlay {\n  z-index: 80;\n}\n\nion-menu.menu-type-overlay .show-backdrop {\n  display: block;\n  cursor: pointer;\n}\n\n.menu-ios .menu-inner {\n  background: var(--ion-background-ios-color, var(--ion-background-color, #fff));\n}\n\n.app-ios .menu-content-reveal {\n  box-shadow: -8px 0 42px rgba(0, 0, 0, 0.08);\n}\n\n.app-ios .menu-type-push {\n  z-index: 80;\n}\n\n.app-ios .menu-type-push .show-backdrop {\n  display: block;\n}"; }
    static get styleMode() { return "ios"; }
}
function computeDelta(deltaX, isOpen, isRightSide) {
    return Math.max(0, (isOpen !== isRightSide) ? -deltaX : deltaX);
}
const SHOW_MENU = 'show-menu';
const SHOW_BACKDROP = 'show-backdrop';
const MENU_CONTENT_OPEN = 'menu-content-open';
const GESTURE_BLOCKER = 'goback-swipe';

/**
 * baseAnimation
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */
function baseAnimation(Animation) {
    // https://material.io/guidelines/motion/movement.html#movement-movement-in-out-of-screen-bounds
    // https://material.io/guidelines/motion/duration-easing.html#duration-easing-natural-easing-curves
    // "Apply the sharp curve to items temporarily leaving the screen that may return
    // from the same exit point. When they return, use the deceleration curve. On mobile,
    // this transition typically occurs over 300ms" -- MD Motion Guide
    return Promise.resolve(new Animation()
        .easing('cubic-bezier(0.0, 0.0, 0.2, 1)') // Deceleration curve (Entering the screen)
        .easingReverse('cubic-bezier(0.4, 0.0, 0.6, 1)') // Sharp curve (Temporarily leaving the screen)
        .duration(300));
}

const BOX_SHADOW_WIDTH = 8;
/**
 * @hidden
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
function MenuOverlayAnimation (Animation, _, menu) {
    let closedX, openedX;
    const width = menu.width + BOX_SHADOW_WIDTH;
    if (menu.isRightSide) {
        // right side
        closedX = width + 'px';
        openedX = '0px';
    }
    else {
        // left side
        closedX = -width + 'px';
        openedX = '0px';
    }
    const menuAni = new Animation()
        .addElement(menu.menuInnerEl)
        .fromTo('translateX', closedX, openedX);
    const backdropAni = new Animation()
        .addElement(menu.backdropEl)
        .fromTo('opacity', 0.01, 0.3);
    return baseAnimation(Animation).then(animation => {
        return animation.add(menuAni)
            .add(backdropAni);
    });
}

/**
 * @hidden
 * Menu Push Type
 * The content slides over to reveal the menu underneath.
 * The menu itself also slides over to reveal its bad self.
 */
function MenuPushAnimation (Animation, _, menu) {
    let contentOpenedX, menuClosedX;
    const width = menu.width;
    if (menu.isRightSide) {
        contentOpenedX = -width + 'px';
        menuClosedX = width + 'px';
    }
    else {
        contentOpenedX = width + 'px';
        menuClosedX = -width + 'px';
    }
    const menuAni = new Animation()
        .addElement(menu.menuInnerEl)
        .fromTo('translateX', menuClosedX, '0px');
    const contentAni = new Animation()
        .addElement(menu.contentEl)
        .fromTo('translateX', '0px', contentOpenedX);
    const backdropAni = new Animation()
        .addElement(menu.backdropEl)
        .fromTo('opacity', 0.01, 0.2);
    return baseAnimation(Animation).then((animation) => {
        return animation.add(menuAni)
            .add(backdropAni)
            .add(contentAni);
    });
}

/**
 * @hidden
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
function MenuRevealAnimation (Animation, _, menu) {
    const openedX = (menu.width * (menu.isRightSide ? -1 : 1)) + 'px';
    const contentOpen = new Animation()
        .addElement(menu.contentEl)
        .fromTo('translateX', '0px', openedX);
    return baseAnimation(Animation).then(animation => {
        return animation.add(contentOpen);
    });
}

class MenuController {
    constructor() {
        this.menus = [];
        this.menuAnimations = new Map();
        this.registerAnimation('reveal', MenuRevealAnimation);
        this.registerAnimation('push', MenuPushAnimation);
        this.registerAnimation('overlay', MenuOverlayAnimation);
    }
    /**
     * Programatically open the Menu.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {Promise} returns a promise when the menu is fully opened
     */
    open(menuId) {
        const menu = this.get(menuId);
        if (menu) {
            return menu.open();
        }
        return Promise.resolve(false);
    }
    /**
     * Programatically close the Menu. If no `menuId` is given as the first
     * argument then it'll close any menu which is open. If a `menuId`
     * is given then it'll close that exact menu.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {Promise} returns a promise when the menu is fully closed
     */
    close(menuId) {
        const menu = (menuId)
            ? this.get(menuId)
            : this.getOpen();
        if (menu) {
            return menu.close();
        }
        return Promise.resolve(false);
    }
    /**
     * Toggle the menu. If it's closed, it will open, and if opened, it
     * will close.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {Promise} returns a promise when the menu has been toggled
     */
    toggle(menuId) {
        const menu = this.get(menuId);
        if (menu) {
            return menu.toggle();
        }
        return Promise.resolve(false);
    }
    /**
     * Used to enable or disable a menu. For example, there could be multiple
     * left menus, but only one of them should be able to be opened at the same
     * time. If there are multiple menus on the same side, then enabling one menu
     * will also automatically disable all the others that are on the same side.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {HTMLIonMenuElement}  Returns the instance of the menu, which is useful for chaining.
     */
    enable(shouldEnable, menuId) {
        const menu = this.get(menuId);
        if (menu) {
            menu.disabled = !shouldEnable;
        }
        return menu;
    }
    /**
     * Used to enable or disable the ability to swipe open the menu.
     * @param {boolean} shouldEnable  True if it should be swipe-able, false if not.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {HTMLIonMenuElement}  Returns the instance of the menu, which is useful for chaining.
     */
    swipeEnable(shouldEnable, menuId) {
        const menu = this.get(menuId);
        if (menu) {
            menu.swipeEnabled = shouldEnable;
        }
        return menu;
    }
    /**
     * @param {string} [menuId] Optionally get the menu by its id, or side.
     * @return {boolean} Returns true if the specified menu is currently open, otherwise false.
     * If the menuId is not specified, it returns true if ANY menu is currenly open.
     */
    isOpen(menuId) {
        if (menuId) {
            const menu = this.get(menuId);
            return menu && menu.isOpen() || false;
        }
        return !!this.getOpen();
    }
    /**
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {boolean} Returns true if the menu is currently enabled, otherwise false.
     */
    isEnabled(menuId) {
        const menu = this.get(menuId);
        if (menu) {
            return !menu.disabled;
        }
        return false;
    }
    /**
     * Used to get a menu instance. If a `menuId` is not provided then it'll
     * return the first menu found. If a `menuId` is `left` or `right`, then
     * it'll return the enabled menu on that side. Otherwise, if a `menuId` is
     * provided, then it'll try to find the menu using the menu's `id`
     * property. If a menu is not found then it'll return `null`.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {HTMLIonMenuElement} Returns the instance of the menu if found, otherwise `null`.
     */
    get(menuId) {
        if (menuId === 'left' || menuId === 'right') {
            // there could be more than one menu on the same side
            // so first try to get the enabled one
            const menu = this.find(m => m.side === menuId && !m.disabled);
            if (menu) {
                return menu;
            }
            // didn't find a menu side that is enabled
            // so try to get the first menu side found
            return this.find(m => m.side === menuId) || null;
        }
        else if (menuId) {
            // the menuId was not left or right
            // so try to get the menu by its "id"
            return this.find(m => m.menuId === menuId) || null;
        }
        // return the first enabled menu
        const menu = this.find(m => !m.disabled);
        if (menu) {
            return menu;
        }
        // get the first menu in the array, if one exists
        return (this.menus.length > 0 ? this.menus[0].el : null);
    }
    /**
     * @return {Menu} Returns the instance of the menu already opened, otherwise `null`.
     */
    getOpen() {
        return this.find(m => m.isOpen());
    }
    /**
     * @return {Array<HTMLIonMenuElement>}  Returns an array of all menu instances.
     */
    getMenus() {
        return this.menus.map(menu => menu.el);
    }
    /**
     * @hidden
     * @return {boolean} if any menu is currently animating
     */
    isAnimating() {
        return this.menus.some(menu => menu.isAnimating);
    }
    /**
     * @hidden
     */
    _register(menu) {
        if (this.menus.indexOf(menu) < 0) {
            this.menus.push(menu);
        }
    }
    /**
     * @hidden
     */
    _unregister(menu) {
        const index = this.menus.indexOf(menu);
        if (index > -1) {
            this.menus.splice(index, 1);
        }
    }
    /**
     * @hidden
     */
    _setActiveMenu(menu) {
        // if this menu should be enabled
        // then find all the other menus on this same side
        // and automatically disable other same side menus
        const side = menu.side;
        this.menus
            .filter(m => m.side === side && m !== menu)
            .map(m => m.disabled = true);
    }
    /**
     * @hidden
     */
    _setOpen(menu, shouldOpen, animated) {
        if (this.isAnimating()) {
            return Promise.resolve(false);
        }
        if (shouldOpen) {
            const openedMenu = this.getOpen();
            if (openedMenu && menu !== openedMenu) {
                openedMenu.setOpen(false, false);
            }
        }
        return menu._setOpen(shouldOpen, animated);
    }
    /**
     * @hidden
     */
    createAnimation(type, menuCmp) {
        const animationBuilder = this.menuAnimations.get(type);
        if (!animationBuilder) {
            return Promise.reject('animation not registered');
        }
        return this.animationCtrl.create(animationBuilder, null, menuCmp);
    }
    registerAnimation(name, animation) {
        this.menuAnimations.set(name, animation);
    }
    find(predicate) {
        const instance = this.menus.find(predicate);
        if (instance) {
            return instance.el;
        }
        return null;
    }
    static get is() { return "ion-menu-controller"; }
    static get properties() { return { "_register": { "method": true }, "_setActiveMenu": { "method": true }, "_setOpen": { "method": true }, "_unregister": { "method": true }, "animationCtrl": { "connect": "ion-animation-controller" }, "close": { "method": true }, "createAnimation": { "method": true }, "enable": { "method": true }, "get": { "method": true }, "getMenus": { "method": true }, "getOpen": { "method": true }, "isAnimating": { "method": true }, "isEnabled": { "method": true }, "isOpen": { "method": true }, "open": { "method": true }, "swipeEnable": { "method": true }, "toggle": { "method": true } }; }
}

export { Menu as IonMenu, MenuController as IonMenuController };
