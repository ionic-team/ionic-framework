import { Build, Component, Method } from '@stencil/core';

import { AnimationBuilder, IonicAnimation, MenuI } from '../../interface';
import { menuController } from '../../utils/menu-controller';

@Component({
  tag: 'ion-menu-controller',
  styleUrl: 'menu-controller.scss'
})
export class MenuController {

  constructor() {
    if (Build.isDev) {
      console.warn(`[DEPRECATED][ion-menu-controller] Use the menuController export from @ionic/core:
  import { menuController } from '@ionic/core';`);
    }
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
  open(menu?: string | null) {
    return menuController.open(menu);
  }

  /**
   * Close the menu. If a menu is specified, it will close that menu.
   * If no menu is specified, then it will close any menu that is open.
   * If it does not find any open menus, it will return `false`.
   *
   * @param menu The menuId or side of the menu to close.
   */
  @Method()
  close(menu?: string | null) {
    return menuController.close(menu);
  }

  /**
   * Toggle the menu open or closed. If the menu is already open, it will try to
   * close the menu, otherwise it will try to open it. Returns `false` if
   * a menu is not found.
   *
   * @param menu The menuId or side of the menu to toggle.
   */
  @Method()
  toggle(menu?: string | null) {
    return menuController.toggle(menu);
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
  enable(enable: boolean, menu?: string | null) {
    return menuController.enable(enable, menu);
  }

  /**
   * Enable or disable the ability to swipe open the menu.
   *
   * @param enable If `true`, the menu swipe gesture should be enabled.
   * @param menu The menuId or side of the menu to enable or disable the swipe gesture on.
   */
  @Method()
  swipeGesture(enable: boolean, menu?: string | null) {
    return menuController.swipeGesture(enable, menu);
  }

  /**
   * Get whether or not the menu is open. Returns `true` if the specified
   * menu is open. If a menu is not specified, it will return `true` if
   * any menu is currently open.
   *
   * @param menu The menuId or side of the menu that is being checked.
   */
  @Method()
  isOpen(menu?: string | null) {
    return menuController.isOpen(menu);
  }

  /**
   * Get whether or not the menu is enabled. Returns `true` if the
   * specified menu is enabled. Returns `false` if a menu is disabled
   * or not found.
   *
   * @param menu The menuId or side of the menu that is being checked.
   */
  @Method()
  isEnabled(menu?: string | null) {
    return menuController.isEnabled(menu);
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
  get(menu?: string | null) {
    return menuController.get(menu);
  }

  /**
   * Get the instance of the opened menu. Returns `null` if a menu is not found.
   */
  @Method()
  getOpen() {
    return menuController.getOpen();
  }

  /**
   * Get all menu instances.
   */
  @Method()
  getMenus() {
    return menuController.getMenus();
  }

  /**
   * Get whether or not a menu is animating. Returns `true` if any
   * menu is currently animating.
   */
  @Method()
  isAnimating() {
    return menuController.isAnimating();
  }

  /**
   * Registers a new animation that can be used with any `ion-menu` by
   * passing the name of the animation in its `type` property.
   *
   * @param name The name of the animation to register.
   * @param animation The animation function to register.
   */
  @Method()
  async registerAnimation(name: string, animation: AnimationBuilder | ((menu: MenuI) => IonicAnimation)) {
    return menuController.registerAnimation(name, animation);
  }
}
