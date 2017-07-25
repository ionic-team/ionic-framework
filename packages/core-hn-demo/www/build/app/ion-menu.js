/*! Built with http://stenciljs.com */

App.defineComponents(

/**** module id ****/
'ion-menu',

/**** component modules ****/
function importComponent(exports, h, t, Ionic) {
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @hidden
 * Menu Type
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */
var MenuType = (function () {
    function MenuType() {
        this.ani = new Ionic.Animation();
        this.ani
            .easing('cubic-bezier(0.0, 0.0, 0.2, 1)')
            .easingReverse('cubic-bezier(0.4, 0.0, 0.6, 1)')
            .duration(280);
    }
    MenuType.prototype.setOpen = function (shouldOpen, animated, done) {
        var ani = this.ani
            .onFinish(done, { oneTimeCallback: true, clearExistingCallacks: true })
            .reverse(!shouldOpen);
        if (animated) {
            ani.play();
        }
        else {
            ani.syncPlay();
        }
    };
    MenuType.prototype.setProgressStart = function (isOpen) {
        this.isOpening = !isOpen;
        // the cloned animation should not use an easing curve during seek
        this.ani
            .reverse(isOpen)
            .progressStart();
    };
    MenuType.prototype.setProgessStep = function (stepValue) {
        // adjust progress value depending if it opening or closing
        this.ani.progressStep(stepValue);
    };
    MenuType.prototype.setProgressEnd = function (shouldComplete, currentStepValue, velocity, done) {
        var _this = this;
        var isOpen = (this.isOpening && shouldComplete);
        if (!this.isOpening && !shouldComplete) {
            isOpen = true;
        }
        var ani = this.ani;
        ani.onFinish(function () {
            _this.isOpening = false;
            done(isOpen);
        }, true);
        var factor = 1 - Math.min(Math.abs(velocity) / 4, 0.7);
        var dur = ani.getDuration() * factor;
        ani.progressEnd(shouldComplete, currentStepValue, dur);
    };
    MenuType.prototype.destroy = function () {
        this.ani.destroy();
        this.ani = null;
    };
    return MenuType;
}());
/**
 * @hidden
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
var MenuRevealType = (function (_super) {
    __extends(MenuRevealType, _super);
    function MenuRevealType(menu) {
        var _this = _super.call(this) || this;
        var openedX = (menu.width() * (menu.isRightSide ? -1 : 1)) + 'px';
        var contentOpen = new Ionic.Animation(menu.getContentElement());
        contentOpen.fromTo('translateX', '0px', openedX);
        _this.ani.add(contentOpen);
        return _this;
    }
    return MenuRevealType;
}(MenuType));
/**
 * @hidden
 * Menu Push Type
 * The content slides over to reveal the menu underneath.
 * The menu itself also slides over to reveal its bad self.
 */
var MenuPushType = (function (_super) {
    __extends(MenuPushType, _super);
    function MenuPushType(menu) {
        var _this = _super.call(this) || this;
        var contentOpenedX, menuClosedX, menuOpenedX;
        var width = menu.width();
        if (menu.isRightSide) {
            // right side
            contentOpenedX = -width + 'px';
            menuClosedX = width + 'px';
            menuOpenedX = '0px';
        }
        else {
            contentOpenedX = width + 'px';
            menuOpenedX = '0px';
            menuClosedX = -width + 'px';
        }
        var menuAni = new Ionic.Animation(menu.getMenuElement());
        menuAni.fromTo('translateX', menuClosedX, menuOpenedX);
        _this.ani.add(menuAni);
        var contentApi = new Ionic.Animation(menu.getContentElement());
        contentApi.fromTo('translateX', '0px', contentOpenedX);
        _this.ani.add(contentApi);
        return _this;
    }
    return MenuPushType;
}(MenuType));
/**
 * @hidden
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
var MenuOverlayType = (function (_super) {
    __extends(MenuOverlayType, _super);
    function MenuOverlayType(menu) {
        var _this = _super.call(this) || this;
        var closedX, openedX;
        var width = menu.width();
        if (menu.isRightSide) {
            // right side
            closedX = 8 + width + 'px';
            openedX = '0px';
        }
        else {
            // left side
            closedX = -(8 + width) + 'px';
            openedX = '0px';
        }
        var menuAni = new Ionic.Animation(menu.getMenuElement());
        menuAni.fromTo('translateX', closedX, openedX);
        _this.ani.add(menuAni);
        var backdropApi = new Ionic.Animation(menu.getBackdropElement());
        backdropApi.fromTo('opacity', 0.01, 0.35);
        _this.ani.add(backdropApi);
        return _this;
    }
    return MenuOverlayType;
}(MenuType));

var MenuController = (function () {
    function MenuController() {
        this._menus = [];
        this._menuTypes = {};
        this.registerType('reveal', MenuRevealType);
        this.registerType('push', MenuPushType);
        this.registerType('overlay', MenuOverlayType);
    }
    /**
     * Programatically open the Menu.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {Promise} returns a promise when the menu is fully opened
     */
    MenuController.prototype.open = function (menuId) {
        var menu = this.get(menuId);
        if (menu && !this.isAnimating()) {
            var openedMenu = this.getOpen();
            if (openedMenu && menu !== openedMenu) {
                openedMenu.setOpen(false, false);
            }
            return menu.open();
        }
        return Promise.resolve(false);
    };
    /**
     * Programatically close the Menu. If no `menuId` is given as the first
     * argument then it'll close any menu which is open. If a `menuId`
     * is given then it'll close that exact menu.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {Promise} returns a promise when the menu is fully closed
     */
    MenuController.prototype.close = function (menuId) {
        var menu;
        if (menuId) {
            // find the menu by its id
            menu = this.get(menuId);
        }
        else {
            // find the menu that is open
            menu = this.getOpen();
        }
        if (menu) {
            // close the menu
            return menu.close();
        }
        return Promise.resolve(false);
    };
    /**
     * Toggle the menu. If it's closed, it will open, and if opened, it
     * will close.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {Promise} returns a promise when the menu has been toggled
     */
    MenuController.prototype.toggle = function (menuId) {
        var menu = this.get(menuId);
        if (menu && !this.isAnimating()) {
            var openedMenu = this.getOpen();
            if (openedMenu && menu !== openedMenu) {
                openedMenu.setOpen(false, false);
            }
            return menu.toggle();
        }
        return Promise.resolve(false);
    };
    /**
     * Used to enable or disable a menu. For example, there could be multiple
     * left menus, but only one of them should be able to be opened at the same
     * time. If there are multiple menus on the same side, then enabling one menu
     * will also automatically disable all the others that are on the same side.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
     */
    MenuController.prototype.enable = function (shouldEnable, menuId) {
        var menu = this.get(menuId);
        return (menu && menu.enable(shouldEnable)) || null;
    };
    /**
     * Used to enable or disable the ability to swipe open the menu.
     * @param {boolean} shouldEnable  True if it should be swipe-able, false if not.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
     */
    MenuController.prototype.swipeEnable = function (shouldEnable, menuId) {
        var menu = this.get(menuId);
        return (menu && menu.swipeEnable(shouldEnable)) || null;
    };
    /**
     * @param {string} [menuId] Optionally get the menu by its id, or side.
     * @return {boolean} Returns true if the specified menu is currently open, otherwise false.
     * If the menuId is not specified, it returns true if ANY menu is currenly open.
     */
    MenuController.prototype.isOpen = function (menuId) {
        if (menuId) {
            var menu = this.get(menuId);
            return menu && menu.isOpen || false;
        }
        else {
            return !!this.getOpen();
        }
    };
    /**
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {boolean} Returns true if the menu is currently enabled, otherwise false.
     */
    MenuController.prototype.isEnabled = function (menuId) {
        var menu = this.get(menuId);
        return menu && menu.enabled || false;
    };
    /**
     * Used to get a menu instance. If a `menuId` is not provided then it'll
     * return the first menu found. If a `menuId` is `left` or `right`, then
     * it'll return the enabled menu on that side. Otherwise, if a `menuId` is
     * provided, then it'll try to find the menu using the menu's `id`
     * property. If a menu is not found then it'll return `null`.
     * @param {string} [menuId]  Optionally get the menu by its id, or side.
     * @return {Menu} Returns the instance of the menu if found, otherwise `null`.
     */
    MenuController.prototype.get = function (menuId) {
        var menu;
        if (menuId === 'left' || menuId === 'right') {
            // there could be more than one menu on the same side
            // so first try to get the enabled one
            menu = this._menus.find(function (m) { return m.side === menuId && m.enabled; });
            if (menu) {
                return menu;
            }
            // didn't find a menu side that is enabled
            // so try to get the first menu side found
            return this._menus.find(function (m) { return m.side === menuId; }) || null;
        }
        else if (menuId) {
            // the menuId was not left or right
            // so try to get the menu by its "id"
            return this._menus.find(function (m) { return m.id === menuId; }) || null;
        }
        // return the first enabled menu
        menu = this._menus.find(function (m) { return m.enabled; });
        if (menu) {
            return menu;
        }
        // get the first menu in the array, if one exists
        return (this._menus.length ? this._menus[0] : null);
    };
    /**
     * @return {Menu} Returns the instance of the menu already opened, otherwise `null`.
     */
    MenuController.prototype.getOpen = function () {
        return this._menus.find(function (m) { return m.isOpen; });
    };
    /**
     * @return {Array<Menu>}  Returns an array of all menu instances.
     */
    MenuController.prototype.getMenus = function () {
        return this._menus;
    };
    /**
     * @hidden
     * @return {boolean} if any menu is currently animating
     */
    MenuController.prototype.isAnimating = function () {
        return this._menus.some(function (menu) { return menu.isAnimating; });
    };
    /**
     * @hidden
     */
    MenuController.prototype._register = function (menu) {
        if (this._menus.indexOf(menu) < 0) {
            this._menus.push(menu);
        }
    };
    /**
     * @hidden
     */
    MenuController.prototype._unregister = function (menu) {
        var index = this._menus.indexOf(menu);
        if (index > -1) {
            this._menus.splice(index, 1);
        }
    };
    /**
     * @hidden
     */
    MenuController.prototype._setActiveMenu = function (menu) {
        // if this menu should be enabled
        // then find all the other menus on this same side
        // and automatically disable other same side menus
        var side = menu.side;
        this._menus
            .filter(function (m) { return m.side === side && m !== menu; })
            .map(function (m) { return m.enable(false); });
    };
    /**
     * @hidden
     */
    MenuController.prototype.registerType = function (name, cls) {
        this._menuTypes[name] = cls;
    };
    /**
     * @hidden
     */
    MenuController.prototype.create = function (type, menuCmp) {
        return new this._menuTypes[type](menuCmp);
    };
    return MenuController;
}());

var Menu = (function () {
    function Menu() {
        this._init = false;
        this._isPane = false;
        /**
         * @hidden
         */
        this.isOpen = false;
        /**
         * @hidden
         */
        this.isAnimating = false;
        /**
         * @hidden
         */
        this.isRightSide = false;
        /**
         * @input {string} Which side of the view the menu should be placed. Default `"start"`.
         */
        this.side = 'start';
        /**
         * @input {boolean} If true, the menu will persist on child pages.
         */
        this.persistent = false;
        // get or create the MenuController singleton
        this._ctrl = Ionic.controllers.menu = (Ionic.controllers.menu || new MenuController());
    }
    Menu.prototype.swipeEnabledChange = function (isEnabled) {
        this.swipeEnable(isEnabled);
    };
    /**
     * @hidden
     */
    Menu.prototype["componentDidLoad"] = function () {
        var _this = this;
        this._backdropElm = this.$el.querySelector('.menu-backdrop');
        this._init = true;
        if (this.content) {
            if ((this.content).tagName) {
                this._cntElm = this.content;
            }
            else if (typeof this.content === 'string') {
                this._cntElm = document.querySelector(this.content);
            }
        }
        if (!this._cntElm || !this._cntElm.tagName) {
            // requires content element
            return console.error('Menu: must have a "content" element to listen for drag events on.');
        }
        // add menu's content classes
        this._cntElm.classList.add('menu-content');
        this._cntElm.classList.add('menu-content-' + this.type);
        var isEnabled = this.enabled;
        if (isEnabled === true || typeof isEnabled === 'undefined') {
            // check if more than one menu is on the same side
            isEnabled = !this._ctrl.getMenus().some(function (m) {
                return m.side === _this.side && m.enabled;
            });
        }
        // register this menu with the app's menu controller
        this._ctrl._register(this);
        // mask it as enabled / disabled
        this.enable(isEnabled);
    };
    Menu.prototype.hostData = function () {
        return {
            attrs: {
                'role': 'navigation',
                'side': this.side,
                'type': this.type
            },
            class: {
                'menu-enabled': this.enabled
            }
        };
    };
    Menu.prototype.render = function () {
        // normalize the "type"
        if (!this.type) {
            this.type = Ionic.config.get('menuType', 'overlay');
        }
        return [
            h("div", { "c": { "menu-inner": true } },
                h(0, 0)),
            h("ion-gesture", { "p": { "gestureName": 'menu-swipe', "gesturePriority": 10, "type": 'pan', "direction": 'x', "threshold": 5, "attachTo": 'body', "disableScroll": true, "block": this._activeBlock }, "c": { "menu-backdrop": true } })
        ];
    };
    /**
     * @hidden
     */
    Menu.prototype.onBackdropClick = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this._ctrl.close();
    };
    /**
     * @hidden
     */
    Menu.prototype._getType = function () {
        if (!this._type) {
            this._type = this._ctrl.create(this.type, this);
            if (Ionic.config.getBoolean('animate') === false) {
                this._type.ani.duration(0);
            }
        }
        return this._type;
    };
    /**
     * @hidden
     */
    Menu.prototype.setOpen = function (shouldOpen, animated) {
        var _this = this;
        if (animated === void 0) { animated = true; }
        // If the menu is disabled or it is currenly being animated, let's do nothing
        if ((shouldOpen === this.isOpen) || !this._canOpen() || this.isAnimating) {
            return Promise.resolve(this.isOpen);
        }
        return new Promise(function (resolve) {
            _this._before();
            _this._getType().setOpen(shouldOpen, animated, function () {
                _this._after(shouldOpen);
                resolve(_this.isOpen);
            });
        });
    };
    Menu.prototype._forceClosing = function () {
        var _this = this;
        this.isAnimating = true;
        this._getType().setOpen(false, false, function () {
            _this._after(false);
        });
    };
    /**
     * @hidden
     */
    Menu.prototype.canSwipe = function () {
        return this.swipeEnabled &&
            !this.isAnimating &&
            this._canOpen();
        // TODO: && this._app.isEnabled();
    };
    Menu.prototype._swipeBeforeStart = function () {
        if (!this.canSwipe()) {
            return;
        }
        this._before();
    };
    Menu.prototype._swipeStart = function () {
        if (!this.isAnimating) {
            return;
        }
        this._getType().setProgressStart(this.isOpen);
    };
    Menu.prototype._swipeProgress = function (stepValue) {
        if (!this.isAnimating) {
            return;
        }
        this._getType().setProgessStep(stepValue);
        Ionic.emit(this, 'ionDrag', { detail: { menu: this } });
    };
    Menu.prototype._swipeEnd = function (shouldCompleteLeft, shouldCompleteRight, stepValue, velocity) {
        var _this = this;
        if (!this.isAnimating) {
            return;
        }
        // user has finished dragging the menu
        var isRightSide = this.isRightSide;
        var opening = !this.isOpen;
        var shouldComplete = (opening)
            ? isRightSide ? shouldCompleteLeft : shouldCompleteRight
            : isRightSide ? shouldCompleteRight : shouldCompleteLeft;
        this._getType().setProgressEnd(shouldComplete, stepValue, velocity, function (isOpen) {
            console.debug('menu, swipeEnd', _this.side);
            _this._after(isOpen);
        });
    };
    Menu.prototype._before = function () {
        // this places the menu into the correct location before it animates in
        // this css class doesn't actually kick off any animations
        this.$el.classList.add('show-menu');
        this._backdropElm.classList.add('show-backdrop');
        this.resize();
        // TODO: this._keyboard.close();
        this.isAnimating = true;
    };
    Menu.prototype._after = function (isOpen) {
        // TODO: this._app.setEnabled(false, 100);
        var _this = this;
        // keep opening/closing the menu disabled for a touch more yet
        // only add listeners/css if it's enabled and isOpen
        // and only remove listeners/css if it's not open
        // emit opened/closed events
        this.isOpen = isOpen;
        this.isAnimating = false;
        // add/remove backdrop click listeners
        this._backdropClick(isOpen);
        if (isOpen) {
            // disable swipe to go back gesture
            this._activeBlock = GESTURE_BLOCKER;
            // add css class
            Core.dom.write(function () {
                _this._cntElm.classList.add('menu-content-open');
            });
            // emit open event
            Ionic.emit(this, 'ionOpen', { detail: { menu: this } });
        }
        else {
            // enable swipe to go back gesture
            this._activeBlock = null;
            // remove css classes
            Core.dom.write(function () {
                _this._cntElm.classList.remove('menu-content-open');
                _this._cntElm.classList.remove('show-menu');
                _this._backdropElm.classList.remove('show-menu');
            });
            // emit close event
            Ionic.emit(this, 'ionClose', { detail: { menu: this } });
        }
    };
    /**
     * @hidden
     */
    Menu.prototype.open = function () {
        return this.setOpen(true);
    };
    /**
     * @hidden
     */
    Menu.prototype.close = function () {
        return this.setOpen(false);
    };
    /**
     * @hidden
     */
    Menu.prototype.resize = function () {
        // TODO
        // const content: Content | Nav = this.menuContent
        //   ? this.menuContent
        //   : this.menuNav;
        // content && content.resize();
    };
    /**
     * @hidden
     */
    Menu.prototype.toggle = function () {
        return this.setOpen(!this.isOpen);
    };
    Menu.prototype._canOpen = function () {
        return this.enabled && !this._isPane;
    };
    /**
     * @hidden
     */
    Menu.prototype._updateState = function () {
        var canOpen = this._canOpen();
        // Close menu inmediately
        if (!canOpen && this.isOpen) {
            // close if this menu is open, and should not be enabled
            this._forceClosing();
        }
        if (this.enabled && this._ctrl) {
            this._ctrl._setActiveMenu(this);
        }
        if (!this._init) {
            return;
        }
        // TODO
        // const gesture = this._gesture;
        // // only listen/unlisten if the menu has initialized
        // if (canOpen && this.swipeEnabled && !gesture.isListening) {
        //   // should listen, but is not currently listening
        //   console.debug('menu, gesture listen', this.side);
        //   gesture.listen();
        // } else if (gesture.isListening && (!canOpen || !this.swipeEnabled)) {
        //   // should not listen, but is currently listening
        //   console.debug('menu, gesture unlisten', this.side);
        //   gesture.unlisten();
        // }
        if (this.isOpen || (this._isPane && this.enabled)) {
            this.resize();
        }
    };
    /**
     * @hidden
     */
    Menu.prototype.enable = function (shouldEnable) {
        this.enabled = shouldEnable;
        this._updateState();
        return this;
    };
    /**
     * @internal
     */
    Menu.prototype.initPane = function () {
        return false;
    };
    /**
     * @internal
     */
    Menu.prototype.paneChanged = function (isPane) {
        this._isPane = isPane;
        this._updateState();
    };
    /**
     * @hidden
     */
    Menu.prototype.swipeEnable = function (shouldEnable) {
        this.swipeEnabled = shouldEnable;
        this._updateState();
        return this;
    };
    /**
     * @hidden
     */
    Menu.prototype.getMenuElement = function () {
        return this.$el.querySelector('.menu-inner');
    };
    /**
     * @hidden
     */
    Menu.prototype.getContentElement = function () {
        return this._cntElm;
    };
    /**
     * @hidden
     */
    Menu.prototype.getBackdropElement = function () {
        return this._backdropElm;
    };
    /**
     * @hidden
     */
    Menu.prototype.width = function () {
        return this.getMenuElement().offsetWidth;
    };
    /**
     * @hidden
     */
    Menu.prototype.getMenuController = function () {
        return this._ctrl;
    };
    Menu.prototype._backdropClick = function (shouldAdd) {
        var onBackdropClick = this.onBackdropClick.bind(this);
        if (shouldAdd && !this._unregBdClick) {
            this._unregBdClick = Ionic.listener.add(this._cntElm, 'click', onBackdropClick, { capture: true });
            this._unregCntClick = Ionic.listener.add(this._cntElm, 'click', onBackdropClick, { capture: true });
        }
        else if (!shouldAdd && this._unregBdClick) {
            this._unregBdClick();
            this._unregCntClick();
            this._unregBdClick = this._unregCntClick = null;
        }
    };
    /**
     * @hidden
     */
    Menu.prototype["componentDidunload"] = function () {
        this._backdropClick(false);
        this._ctrl._unregister(this);
        this._type && this._type.destroy();
        this._ctrl = this._type = this._cntElm = this._backdropElm = null;
    };
    return Menu;
}());
var GESTURE_BLOCKER = 'goback-swipe';

exports['ION-MENU'] = Menu;
},


/***************** ion-menu *****************/
[
/** ion-menu: [0] tag **/
'ION-MENU',

/** ion-menu: [1] host **/
{"theme":"menu"},

/** ion-menu: [2] listeners **/
0 /* no listeners */,

/** ion-menu: [3] states **/
0 /* no states */,

/** ion-menu: [4] propWillChanges **/
0 /* no prop will change methods */,

/** ion-menu: [5] propDidChanges **/
[
  [
    /*****  ion-menu prop did change [0] ***** /
    /* [0] prop name **/ 'swipeEnabled',
    /* [1] call fn *****/ 'swipeEnabledChange'
  ]
]

]
)