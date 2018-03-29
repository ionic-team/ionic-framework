import { Component, Method, Prop } from '@stencil/core';
import { Animation, AnimationBuilder, Menu } from '../../index';

import MenuOverlayAnimation from './animations/overlay';
import MenuPushAnimation from './animations/push';
import MenuRevealAnimation from './animations/reveal';

@Component({
  tag: 'ion-menu-controller'
})
export class MenuController {

  private menus: Menu[] = [];
  private menuAnimations = new Map<string, AnimationBuilder>();

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: HTMLIonAnimationControllerElement;

  constructor() {
    this.registerAnimation('reveal', MenuRevealAnimation);
    this.registerAnimation('push', MenuPushAnimation);
    this.registerAnimation('overlay', MenuOverlayAnimation);
  }

  /**
   * Programatically open the Menu.
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {Promise} returns a promise when the menu is fully opened
   */
  @Method()
  open(menuId?: string): Promise<boolean> {
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
  @Method()
  close(menuId?: string): Promise<boolean> {
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
  @Method()
  toggle(menuId?: string): Promise<boolean> {
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
  @Method()
  enable(shouldEnable: boolean, menuId?: string): HTMLIonMenuElement {
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
  @Method()
  swipeEnable(shouldEnable: boolean, menuId?: string): HTMLIonMenuElement {
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
  @Method()
  isOpen(menuId?: string): boolean {
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
  @Method()
  isEnabled(menuId?: string): boolean {
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
  @Method()
  get(menuId?: string): HTMLIonMenuElement {
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

    } else if (menuId) {
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
  @Method()
  getOpen(): HTMLIonMenuElement {
    return this.find(m => m.isOpen());
  }

  /**
   * @return {Array<HTMLIonMenuElement>}  Returns an array of all menu instances.
   */
  @Method()
  getMenus(): HTMLIonMenuElement[] {
    return this.menus.map(menu => menu.el);
  }

  /**
   * @hidden
   * @return {boolean} if any menu is currently animating
   */
  @Method()
  isAnimating(): boolean {
    return this.menus.some(menu => menu.isAnimating);
  }

  /**
   * @hidden
   */
  @Method()
  _register(menu: Menu) {
    if (this.menus.indexOf(menu) < 0) {
      this.menus.push(menu);
    }
  }

  /**
   * @hidden
   */
  @Method()
  _unregister(menu: Menu) {
    const index = this.menus.indexOf(menu);
    if (index > -1) {
      this.menus.splice(index, 1);
    }
  }

  /**
   * @hidden
   */
  @Method()
  _setActiveMenu(menu: Menu) {
    // if this menu should be enabled
    // then find all the other menus on this same side
    // and automatically disable other same side menus
    const side = menu.side;
    this.menus
      .filter(m => m.side === side && m !== menu)
      .forEach(m => m.disabled = true);
  }

  /**
   * @hidden
   */
  @Method()
  _setOpen(menu: Menu, shouldOpen: boolean, animated: boolean): Promise<boolean> {
    if (this.isAnimating()) {
      return Promise.resolve(false);
    }
    if (shouldOpen) {
      const openedMenu = this.getOpen();
      if (openedMenu && menu.el !== openedMenu) {
        openedMenu.setOpen(false, false);
      }
    }
    return menu._setOpen(shouldOpen, animated);
  }

  /**
   * @hidden
   */
  @Method()
  createAnimation(type: string, menuCmp: Menu): Promise<Animation> {
    const animationBuilder = this.menuAnimations.get(type);
    if (!animationBuilder) {
      return Promise.reject('animation not registered');
    }
    return this.animationCtrl.create(animationBuilder, null, menuCmp);
  }

  @Method()
  registerAnimation(name: string, animation: AnimationBuilder) {
    this.menuAnimations.set(name, animation);
  }

  private find(predicate: (menu: Menu) => boolean): HTMLIonMenuElement {
    const instance = this.menus.find(predicate);
    if (instance) {
      return instance.el;
    }
    return null;
  }

}

export { MenuOverlayAnimation, MenuPushAnimation, MenuRevealAnimation };
