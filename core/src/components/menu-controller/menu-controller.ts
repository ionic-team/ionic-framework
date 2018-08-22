import { Build, Component, Method, Prop } from '@stencil/core';

import { Animation, AnimationBuilder, MenuI } from '../../interface';

import { menuOverlayAnimation } from './animations/overlay';
import { menuPushAnimation } from './animations/push';
import { menuRevealAnimation } from './animations/reveal';

@Component({
  tag: 'ion-menu-controller',
  styleUrl: 'menu-controller.scss'
})
export class MenuController {
  private menus: MenuI[] = [];
  private menuAnimations = new Map<string, AnimationBuilder>();

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl!: HTMLIonAnimationControllerElement;

  constructor() {
    this.registerAnimation('reveal', menuRevealAnimation);
    this.registerAnimation('push', menuPushAnimation);
    this.registerAnimation('overlay', menuOverlayAnimation);
  }

  /**
   * Open the menu.
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
   * Close the menu. If no menu is specified, then it will close any menu
   * that is open. If a menu is specified, it will close that menu.
   */
  @Method()
  close(menuId?: string): Promise<boolean> {
    const menu = menuId ? this.get(menuId) : this.getOpen();
    if (menu) {
      return menu.close();
    }
    return Promise.resolve(false);
  }

  /**
   * Toggle the menu. If it's closed, it will open, and if opened, it
   * will close.
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
   */
  @Method()
  enable(shouldEnable: boolean, menuId?: string): HTMLIonMenuElement | null {
    const menu = this.get(menuId);
    if (menu) {
      menu.disabled = !shouldEnable;
    }
    return menu;
  }

  /**
   * Used to enable or disable the ability to swipe open the menu.
   */
  @Method()
  swipeGesture(shouldEnable: boolean, menuId?: string): HTMLIonMenuElement | null {
    const menu = this.get(menuId);
    if (menu) {
      menu.swipeGesture = shouldEnable;
    }
    return menu;
  }

  /**
   * Returns true if the specified menu is open. If the menu is not specified, it
   * will return true if any menu is currently open.
   */
  @Method()
  isOpen(menuId?: string): boolean {
    if (menuId) {
      const menu = this.get(menuId);
      return (menu && menu.isOpen()) || false;
    }
    return !!this.getOpen();
  }

  /**
   * Returns true if the specified menu is enabled.
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
   * Used to get a menu instance. If a menu is not provided then it will
   * return the first menu found. If the specified menu is `left` or `right`, then
   * it will return the enabled menu on that side. Otherwise, it will try to find
   * the menu using the menu's `id` property. If a menu is not found then it will
   * return `null`.
   */
  @Method()
  get(menuId?: string): HTMLIonMenuElement | null {
    if (Build.isDev) {
      if (menuId === 'left') {
        console.error('menu.side=left is deprecated, use "start" instead');
        return null;
      }
      if (menuId === 'right') {
        console.error('menu.side=right is deprecated, use "end" instead');
        return null;
      }
    }
    if (menuId === 'start' || menuId === 'end') {
      // there could be more than one menu on the same side
      // so first try to get the enabled one
      const menuRef = this.find(m => m.side === menuId && !m.disabled);
      if (menuRef) {
        return menuRef;
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
    return this.menus.length > 0 ? this.menus[0].el : null;
  }

  /**
   * Returns the instance of the menu already opened, otherwise `null`.
   */
  @Method()
  getOpen(): HTMLIonMenuElement | null {
    return this.find(m => m.isOpen());
  }

  /**
   * Returns an array of all menu instances.
   */
  @Method()
  getMenus(): HTMLIonMenuElement[] {
    return this.menus.map(menu => menu.el);
  }

  /**
   * Returns true if any menu is currently animating.
   */
  @Method()
  isAnimating(): boolean {
    return this.menus.some(menu => menu.isAnimating);
  }

  @Method()
  _register(menu: MenuI) {
    if (this.menus.indexOf(menu) < 0) {
      this.menus.push(menu);
    }
  }

  @Method()
  _unregister(menu: MenuI) {
    const index = this.menus.indexOf(menu);
    if (index > -1) {
      this.menus.splice(index, 1);
    }
  }

  @Method()
  _setActiveMenu(menu: MenuI) {
    // if this menu should be enabled
    // then find all the other menus on this same side
    // and automatically disable other same side menus
    const side = menu.side;
    this.menus
      .filter(m => m.side === side && m !== menu)
      .forEach(m => (m.disabled = true));
  }

  @Method()
  _setOpen(menu: MenuI, shouldOpen: boolean, animated: boolean): Promise<boolean> {
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

  @Method()
  createAnimation(type: string, menuCmp: MenuI): Promise<Animation> {
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

  private find(predicate: (menu: MenuI) => boolean): HTMLIonMenuElement | null {
    const instance = this.menus.find(predicate);
    if (instance) {
      return instance.el;
    }
    return null;
  }
}
