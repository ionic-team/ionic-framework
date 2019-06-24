import { Build, Component, Method } from '@stencil/core';

import { config } from '../../global/config';
import { Animation, AnimationBuilder, MenuControllerI, MenuI } from '../../interface';

import { menuOverlayAnimation } from './animations/overlay';
import { menuPushAnimation } from './animations/push';
import { menuRevealAnimation } from './animations/reveal';

@Component({
  tag: 'ion-menu-controller',
  styleUrl: 'menu-controller.scss'
})
export class MenuController implements MenuControllerI {

  private menus: MenuI[] = [];
  private menuAnimations = new Map<string, AnimationBuilder>();

  constructor() {
    this.registerAnimation('reveal', menuRevealAnimation);
    this.registerAnimation('push', menuPushAnimation);
    this.registerAnimation('overlay', menuOverlayAnimation);
  }

  /**
   * Open the menu. If a menu is not provided then it will open the first
   * menu found. If the specified menu is `start` or `end`, then it will open
   * the enabled menu on that side. Otherwise, it will try to find the menu
   * using the menu's `id` property. If a menu is not found then it will
   * return `false`.
   *
   * @param menu The menuId or side of the menu to open.
   */
  @Method()
  async open(menu?: string | null): Promise<boolean> {
    const menuEl = await this.get(menu);
    if (menuEl) {
      return menuEl.open();
    }
    return false;
  }

  /**
   * Close the menu. If a menu is specified, it will close that menu.
   * If no menu is specified, then it will close any menu that is open.
   * If it does not find any open menus, it will return `false`.
   *
   * @param menu The menuId or side of the menu to close.
   */
  @Method()
  async close(menu?: string | null): Promise<boolean> {
    const menuEl = await (menu !== undefined ? this.get(menu) : this.getOpen());
    if (menuEl !== undefined) {
      return menuEl.close();
    }
    return false;
  }

  /**
   * Toggle the menu open or closed. If the menu is already open, it will try to
   * close the menu, otherwise it will try to open it. Returns `false` if
   * a menu is not found.
   *
   * @param menu The menuId or side of the menu to toggle.
   */
  @Method()
  async toggle(menu?: string | null): Promise<boolean> {
    const menuEl = await this.get(menu);
    if (menuEl) {
      return menuEl.toggle();
    }
    return false;
  }

  /**
   * Enable or disable a menu. Disabling a menu will not allow gestures
   * for that menu or any calls to open it. This is useful when there are
   * multiple menus on the same side and only one of them should be allowed
   * to open. Enabling a menu will automatically disable all other menus
   * on that side.
   *
   * @param enable If `true`, the menu should be enabled.
   * @param menu The menuId or side of the menu to enable or disable.
   */
  @Method()
  async enable(enable: boolean, menu?: string | null): Promise<HTMLIonMenuElement | undefined> {
    const menuEl = await this.get(menu);
    if (menuEl) {
      menuEl.disabled = !enable;
    }
    return menuEl;
  }

  /**
   * Enable or disable the ability to swipe open the menu.
   *
   * @param enable If `true`, the menu swipe gesture should be enabled.
   * @param menu The menuId or side of the menu to enable or disable the swipe gesture on.
   */
  @Method()
  async swipeGesture(enable: boolean, menu?: string | null): Promise<HTMLIonMenuElement | undefined> {
    const menuEl = await this.get(menu);
    if (menuEl) {
      menuEl.swipeGesture = enable;
    }
    return menuEl;
  }

  /**
   * Get whether or not the menu is open. Returns `true` if the specified
   * menu is open. If a menu is not specified, it will return `true` if
   * any menu is currently open.
   *
   * @param menu The menuId or side of the menu that is being checked.
   */
  @Method()
  async isOpen(menu?: string | null): Promise<boolean> {
    if (menu != null) {
      const menuEl = await this.get(menu);
      return (menuEl !== undefined && menuEl.isOpen());
    } else {
      const menuEl = await this.getOpen();
      return menuEl !== undefined;
    }
  }

  /**
   * Get whether or not the menu is enabled. Returns `true` if the
   * specified menu is enabled. Returns `false` if a menu is disabled
   * or not found.
   *
   * @param menu The menuId or side of the menu that is being checked.
   */
  @Method()
  async isEnabled(menu?: string | null): Promise<boolean> {
    const menuEl = await this.get(menu);
    if (menuEl) {
      return !menuEl.disabled;
    }
    return false;
  }

  /**
   * Get a menu instance. If a menu is not provided then it will return the first
   * menu found. If the specified menu is `start` or `end`, then it will return the
   * enabled menu on that side. Otherwise, it will try to find the menu using the menu's
   * `id` property. If a menu is not found then it will return `null`.
   *
   * @param menu The menuId or side of the menu.
   */
  @Method()
  async get(menu?: string | null): Promise<HTMLIonMenuElement | undefined> {
    if (Build.isDev) {
      if (menu === 'left') {
        console.error('menu.side=left is deprecated, use "start" instead');
        return undefined;
      }
      if (menu === 'right') {
        console.error('menu.side=right is deprecated, use "end" instead');
        return undefined;
      }
    }
    await this.waitUntilReady();

    if (menu === 'start' || menu === 'end') {
      // there could be more than one menu on the same side
      // so first try to get the enabled one
      const menuRef = this.find(m => m.side === menu && !m.disabled);
      if (menuRef) {
        return menuRef;
      }

      // didn't find a menu side that is enabled
      // so try to get the first menu side found
      return this.find(m => m.side === menu);

    } else if (menu != null) {
      // the menuId was not left or right
      // so try to get the menu by its "id"
      return this.find(m => m.menuId === menu);
    }

    // return the first enabled menu
    const menuEl = this.find(m => !m.disabled);
    if (menuEl) {
      return menuEl;
    }

    // get the first menu in the array, if one exists
    return this.menus.length > 0 ? this.menus[0].el : undefined;
  }

  /**
   * Get the instance of the opened menu. Returns `null` if a menu is not found.
   */
  @Method()
  async getOpen(): Promise<HTMLIonMenuElement | undefined> {
    await this.waitUntilReady();
    return this.getOpenSync();
  }

  /**
   * Get all menu instances.
   */
  @Method()
  async getMenus(): Promise<HTMLIonMenuElement[]> {
    await this.waitUntilReady();
    return this.getMenusSync();
  }

  /**
   * Get whether or not a menu is animating. Returns `true` if any
   * menu is currently animating.
   */
  @Method()
  async isAnimating(): Promise<boolean> {
    await this.waitUntilReady();
    return this.isAnimatingSync();
  }

  /**
   * Registers a new animation that can be used with any `ion-menu` by
   * passing the name of the animation in its `type` property.
   *
   * @param name The name of the animation to register.
   * @param animation The animation function to register.
   */
  @Method()
  async registerAnimation(name: string, animation: AnimationBuilder) {
    this.menuAnimations.set(name, animation);
  }

  /**
   * @internal
   */
  @Method()
  _getInstance(): Promise<MenuControllerI> {
    return Promise.resolve(this);
  }

  _register(menu: MenuI) {
    const menus = this.menus;
    if (menus.indexOf(menu) < 0) {
      if (!menu.disabled) {
        this._setActiveMenu(menu);
      }
      menus.push(menu);
    }
  }

  _unregister(menu: MenuI) {
    const index = this.menus.indexOf(menu);
    if (index > -1) {
      this.menus.splice(index, 1);
    }
  }

  _setActiveMenu(menu: MenuI) {
    // if this menu should be enabled
    // then find all the other menus on this same side
    // and automatically disable other same side menus
    const side = menu.side;
    this.menus
      .filter(m => m.side === side && m !== menu)
      .forEach(m => m.disabled = true);
  }

  async _setOpen(menu: MenuI, shouldOpen: boolean, animated: boolean): Promise<boolean> {
    if (this.isAnimatingSync()) {
      return false;
    }
    if (shouldOpen) {
      const openedMenu = await this.getOpen();
      if (openedMenu && menu.el !== openedMenu) {
        await openedMenu.setOpen(false, false);
      }
    }
    return menu._setOpen(shouldOpen, animated);
  }

  async _createAnimation(type: string, menuCmp: MenuI): Promise<Animation> {
    const animationBuilder = this.menuAnimations.get(type);
    if (!animationBuilder) {
      throw new Error('animation not registered');
    }
    const animation = await import('../../utils/animation')
      .then(mod => mod.create(animationBuilder, null, menuCmp));
    if (!config.getBoolean('animated', true)) {
      animation.duration(0);
    }
    return animation;
  }

  getOpenSync(): HTMLIonMenuElement | undefined {
    return this.find(m => m._isOpen);
  }

  getMenusSync(): HTMLIonMenuElement[] {
    return this.menus.map(menu => menu.el);
  }

  isAnimatingSync(): boolean {
    return this.menus.some(menu => menu.isAnimating);
  }

  private find(predicate: (menu: MenuI) => boolean): HTMLIonMenuElement | undefined {
    const instance = this.menus.find(predicate);
    if (instance !== undefined) {
      return instance.el;
    }
    return undefined;
  }

  private waitUntilReady() {
    return Promise.all(
      Array.from(document.querySelectorAll('ion-menu'))
        .map(menu => menu.componentOnReady())
    );
  }
}
