import { removeArrayItem } from '../../util/util';
/**
 * \@name MenuController
 * \@description
 * The MenuController is a provider which makes it easy to control a [Menu](../../Menu/Menu/).
 * Its methods can be used to display the menu, enable the menu, toggle the menu, and more.
 * The controller will grab a reference to the menu by the `side`, `id`, or, if neither
 * of these are passed to it, it will grab the first menu it finds.
 *
 *
 * \@usage
 *
 * Add a basic menu component to start with. See the [Menu](../../Menu/Menu/) API docs
 * for more information on adding menu components.
 *
 * ```html
 * <ion-menu [content]="mycontent">
 *   <ion-content>
 *     <ion-list>
 *     ...
 *     </ion-list>
 *   </ion-content>
 * </ion-menu>
 *
 * <ion-nav #mycontent [root]="rootPage"></ion-nav>
 * ```
 *
 * To call the controller methods, inject the `MenuController` provider
 * into the page. Then, create some methods for opening, closing, and
 * toggling the menu.
 *
 * ```ts
 * import { Component } from '\@angular/core';
 * import { MenuController } from 'ionic-angular';
 *
 * \@Component({...})
 * export class MyPage {
 *
 *  constructor(public menuCtrl: MenuController) {
 *
 *  }
 *
 *  openMenu() {
 *    this.menuCtrl.open();
 *  }
 *
 *  closeMenu() {
 *    this.menuCtrl.close();
 *  }
 *
 *  toggleMenu() {
 *    this.menuCtrl.toggle();
 *  }
 *
 * }
 * ```
 *
 * Since only one menu exists, the `MenuController` will grab the
 * correct menu and call the correct method for each.
 *
 *
 * ### Multiple Menus on Different Sides
 *
 * For applications with both a left and right menu, the desired menu can be
 * grabbed by passing the `side` of the menu. If nothing is passed, it will
 * default to the `"left"` menu.
 *
 * ```html
 * <ion-menu side="left" [content]="mycontent">...</ion-menu>
 * <ion-menu side="right" [content]="mycontent">...</ion-menu>
 * <ion-nav #mycontent [root]="rootPage"></ion-nav>
 * ```
 *
 * ```ts
 *  toggleLeftMenu() {
 *    this.menuCtrl.toggle();
 *  }
 *
 *  toggleRightMenu() {
 *    this.menuCtrl.toggle('right');
 *  }
 * ```
 *
 *
 * ### Multiple Menus on the Same Side
 *
 * An application can have multiple menus on the same side. In order to determine
 * the menu to control, an `id` should be passed. In the example below, the menu
 * with the `authenticated` id will be enabled, and the menu with the `unauthenticated`
 * id will be disabled.
 *
 * ```html
 * <ion-menu id="authenticated" side="left" [content]="mycontent">...</ion-menu>
 * <ion-menu id="unauthenticated" side="left" [content]="mycontent">...</ion-menu>
 * <ion-nav #mycontent [root]="rootPage"></ion-nav>
 * ```
 *
 * ```ts
 *  enableAuthenticatedMenu() {
 *    this.menuCtrl.enable(true, 'authenticated');
 *    this.menuCtrl.enable(false, 'unauthenticated');
 *  }
 * ```
 *
 * Note: if an app only has one menu, there is no reason to pass an `id`.
 *
 *
 * \@demo /docs/demos/src/menu/
 *
 * @see {\@link /docs/components#menus Menu Component Docs}
 * @see {\@link ../Menu Menu API Docs}
 *
 */
var MenuController = (function () {
    function MenuController() {
        this._menus = [];
    }
    /**
     * Programatically open the Menu.
     * @param {?=} menuId
     * @return {?}
     */
    MenuController.prototype.open = function (menuId) {
        var /** @type {?} */ menu = this.get(menuId);
        if (menu && !this.isAnimating()) {
            var /** @type {?} */ openedMenu = this.getOpen();
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
     * @param {?=} menuId
     * @return {?}
     */
    MenuController.prototype.close = function (menuId) {
        var /** @type {?} */ menu;
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
     * @param {?=} menuId
     * @return {?}
     */
    MenuController.prototype.toggle = function (menuId) {
        var /** @type {?} */ menu = this.get(menuId);
        if (menu && !this.isAnimating()) {
            var /** @type {?} */ openedMenu = this.getOpen();
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
     * @param {?} shouldEnable
     * @param {?=} menuId
     * @return {?}
     */
    MenuController.prototype.enable = function (shouldEnable, menuId) {
        var /** @type {?} */ menu = this.get(menuId);
        if (menu) {
            return menu.enable(shouldEnable);
        }
    };
    /**
     * Used to enable or disable the ability to swipe open the menu.
     * @param {?} shouldEnable
     * @param {?=} menuId
     * @return {?}
     */
    MenuController.prototype.swipeEnable = function (shouldEnable, menuId) {
        var /** @type {?} */ menu = this.get(menuId);
        if (menu) {
            return menu.swipeEnable(shouldEnable);
        }
    };
    /**
     * If the menuId is not specified, it returns true if ANY menu is currenly open.
     * @param {?=} menuId
     * @return {?}
     */
    MenuController.prototype.isOpen = function (menuId) {
        if (menuId) {
            var /** @type {?} */ menu = this.get(menuId);
            return menu && menu.isOpen || false;
        }
        else {
            return !!this.getOpen();
        }
    };
    /**
     * @param {?=} menuId
     * @return {?}
     */
    MenuController.prototype.isEnabled = function (menuId) {
        var /** @type {?} */ menu = this.get(menuId);
        return menu && menu.enabled || false;
    };
    /**
     * Used to get a menu instance. If a `menuId` is not provided then it'll
     * return the first menu found. If a `menuId` is `left` or `right`, then
     * it'll return the enabled menu on that side. Otherwise, if a `menuId` is
     * provided, then it'll try to find the menu using the menu's `id`
     * property. If a menu is not found then it'll return `null`.
     * @param {?=} menuId
     * @return {?}
     */
    MenuController.prototype.get = function (menuId) {
        var /** @type {?} */ menu;
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
     * @return {?}
     */
    MenuController.prototype.getOpen = function () {
        return this._menus.find(function (m) { return m.isOpen; });
    };
    /**
     * @return {?}
     */
    MenuController.prototype.getMenus = function () {
        return this._menus;
    };
    /**
     * @hidden
     * @return {?}
     */
    MenuController.prototype.isAnimating = function () {
        return this._menus.some(function (menu) { return menu.isAnimating(); });
    };
    /**
     * @hidden
     * @param {?} menu
     * @return {?}
     */
    MenuController.prototype._register = function (menu) {
        (void 0) /* assert */;
        this._menus.push(menu);
    };
    /**
     * @hidden
     * @param {?} menu
     * @return {?}
     */
    MenuController.prototype._unregister = function (menu) {
        (void 0) /* assert */;
        removeArrayItem(this._menus, menu);
    };
    /**
     * @hidden
     * @param {?} menu
     * @return {?}
     */
    MenuController.prototype._setActiveMenu = function (menu) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        // if this menu should be enabled
        // then find all the other menus on this same side
        // and automatically disable other same side menus
        var /** @type {?} */ side = menu.side;
        this._menus
            .filter(function (m) { return m.side === side && m !== menu; })
            .map(function (m) { return m.enable(false); });
    };
    /**
     * @hidden
     * @param {?} name
     * @param {?} cls
     * @return {?}
     */
    MenuController.registerType = function (name, cls) {
        menuTypes[name] = cls;
    };
    /**
     * @hidden
     * @param {?} type
     * @param {?} menuCmp
     * @param {?} plt
     * @return {?}
     */
    MenuController.create = function (type, menuCmp, plt) {
        return new menuTypes[type](menuCmp, plt);
    };
    return MenuController;
}());
export { MenuController };
function MenuController_tsickle_Closure_declarations() {
    /** @type {?} */
    MenuController.prototype._menus;
}
var /** @type {?} */ menuTypes = {};
//# sourceMappingURL=menu-controller.js.map