import { printIonWarning } from '@utils/logging';

import type { MenuI, MenuControllerI } from '../../components/menu/menu-interface';
import type { AnimationBuilder, BackButtonEvent } from '../../interface';
import { MENU_BACK_BUTTON_PRIORITY } from '../hardware-back-button';
import { componentOnReady } from '../helpers';

import { menuOverlayAnimation } from './animations/overlay';
import { menuPushAnimation } from './animations/push';
import { menuRevealAnimation } from './animations/reveal';

const createMenuController = (): MenuControllerI => {
  const menuAnimations = new Map<string, AnimationBuilder>();
  const menus: MenuI[] = [];

  const open = async (menu?: string | null): Promise<boolean> => {
    const menuEl = await get(menu, true);
    if (menuEl) {
      return menuEl.open();
    }
    return false;
  };

  const close = async (menu?: string | null): Promise<boolean> => {
    const menuEl = await (menu !== undefined ? get(menu, true) : getOpen());
    if (menuEl !== undefined) {
      return menuEl.close();
    }
    return false;
  };

  const toggle = async (menu?: string | null): Promise<boolean> => {
    const menuEl = await get(menu, true);
    if (menuEl) {
      return menuEl.toggle();
    }
    return false;
  };

  const enable = async (shouldEnable: boolean, menu?: string | null): Promise<HTMLIonMenuElement | undefined> => {
    const menuEl = await get(menu);
    if (menuEl) {
      menuEl.disabled = !shouldEnable;
    }
    return menuEl;
  };

  const swipeGesture = async (shouldEnable: boolean, menu?: string | null): Promise<HTMLIonMenuElement | undefined> => {
    const menuEl = await get(menu);
    if (menuEl) {
      menuEl.swipeGesture = shouldEnable;
    }
    return menuEl;
  };

  const isOpen = async (menu?: string | null): Promise<boolean> => {
    if (menu != null) {
      const menuEl = await get(menu);
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      return menuEl !== undefined && menuEl.isOpen();
    } else {
      const menuEl = await getOpen();
      return menuEl !== undefined;
    }
  };

  const isEnabled = async (menu?: string | null): Promise<boolean> => {
    const menuEl = await get(menu);
    if (menuEl) {
      return !menuEl.disabled;
    }
    return false;
  };

  /**
   * Finds and returns the menu specified by "menu" if registered.
   * @param menu - The side or ID of the desired menu
   * @param logOnMultipleSideMenus - If true, this function will log a warning
   * if "menu" is a side but multiple menus on the same side were found. Since this function
   * is used in multiple places, we default this log to false so that the calling
   * functions can choose whether or not it is appropriate to log this warning.
   */
  const get = async (
    menu?: string | null,
    logOnMultipleSideMenus: boolean = false
  ): Promise<HTMLIonMenuElement | undefined> => {
    await waitUntilReady();

    if (menu === 'start' || menu === 'end') {
      // there could be more than one menu on the same side
      // so first try to get the enabled one
      const menuRefs = menus.filter((m) => m.side === menu && !m.disabled);
      if (menuRefs.length >= 1) {
        if (menuRefs.length > 1 && logOnMultipleSideMenus) {
          printIonWarning(
            `menuController queried for a menu on the "${menu}" side, but ${menuRefs.length} menus were found. The first menu reference will be used. If this is not the behavior you want then pass the ID of the menu instead of its side.`,
            menuRefs.map((m) => m.el)
          );
        }

        return menuRefs[0].el;
      }

      // didn't find a menu side that is enabled
      // so try to get the first menu side found
      const sideMenuRefs = menus.filter((m) => m.side === menu);
      if (sideMenuRefs.length >= 1) {
        if (sideMenuRefs.length > 1 && logOnMultipleSideMenus) {
          printIonWarning(
            `menuController queried for a menu on the "${menu}" side, but ${sideMenuRefs.length} menus were found. The first menu reference will be used. If this is not the behavior you want then pass the ID of the menu instead of its side.`,
            sideMenuRefs.map((m) => m.el)
          );
        }

        return sideMenuRefs[0].el;
      }
    } else if (menu != null) {
      // the menuId was not left or right
      // so try to get the menu by its "id"
      return find((m) => m.menuId === menu);
    }

    // return the first enabled menu
    const menuEl = find((m) => !m.disabled);
    if (menuEl) {
      return menuEl;
    }

    // get the first menu in the array, if one exists
    return menus.length > 0 ? menus[0].el : undefined;
  };

  /**
   * Get the instance of the opened menu. Returns `null` if a menu is not found.
   */
  const getOpen = async (): Promise<HTMLIonMenuElement | undefined> => {
    await waitUntilReady();
    return _getOpenSync();
  };

  /**
   * Get all menu instances.
   */
  const getMenus = async (): Promise<HTMLIonMenuElement[]> => {
    await waitUntilReady();
    return getMenusSync();
  };

  /**
   * Get whether or not a menu is animating. Returns `true` if any
   * menu is currently animating.
   */
  const isAnimating = async (): Promise<boolean> => {
    await waitUntilReady();
    return isAnimatingSync();
  };

  const registerAnimation = (name: string, animation: AnimationBuilder) => {
    menuAnimations.set(name, animation);
  };

  const _register = (menu: MenuI) => {
    if (menus.indexOf(menu) < 0) {
      menus.push(menu);
    }
  };

  const _unregister = (menu: MenuI) => {
    const index = menus.indexOf(menu);
    if (index > -1) {
      menus.splice(index, 1);
    }
  };

  const _setOpen = async (menu: MenuI, shouldOpen: boolean, animated: boolean): Promise<boolean> => {
    if (isAnimatingSync()) {
      return false;
    }
    if (shouldOpen) {
      const openedMenu = await getOpen();
      if (openedMenu && menu.el !== openedMenu) {
        await openedMenu.setOpen(false, false);
      }
    }
    return menu._setOpen(shouldOpen, animated);
  };

  const _createAnimation = (type: string, menuCmp: MenuI) => {
    const animationBuilder = menuAnimations.get(type) as any; // TODO(FW-2832): type
    if (!animationBuilder) {
      throw new Error('animation not registered');
    }

    const animation = animationBuilder(menuCmp);
    return animation;
  };

  const _getOpenSync = (): HTMLIonMenuElement | undefined => {
    return find((m) => m._isOpen);
  };

  const getMenusSync = (): HTMLIonMenuElement[] => {
    return menus.map((menu) => menu.el);
  };

  const isAnimatingSync = (): boolean => {
    return menus.some((menu) => menu.isAnimating);
  };

  const find = (predicate: (menu: MenuI) => boolean): HTMLIonMenuElement | undefined => {
    const instance = menus.find(predicate);
    if (instance !== undefined) {
      return instance.el;
    }
    return undefined;
  };

  const waitUntilReady = () => {
    return Promise.all(
      Array.from(document.querySelectorAll('ion-menu')).map(
        (menu) => new Promise((resolve) => componentOnReady(menu, resolve))
      )
    );
  };

  registerAnimation('reveal', menuRevealAnimation);
  registerAnimation('push', menuPushAnimation);
  registerAnimation('overlay', menuOverlayAnimation);

  if (typeof document !== 'undefined') {
    document.addEventListener('ionBackButton', (ev: any) => {
      // TODO(FW-2832): type
      const openMenu = _getOpenSync();
      if (openMenu) {
        (ev as BackButtonEvent).detail.register(MENU_BACK_BUTTON_PRIORITY, () => {
          return openMenu.close();
        });
      }
    });
  }

  return {
    registerAnimation,
    get,
    getMenus,
    getOpen,
    isEnabled,
    swipeGesture,
    isAnimating,
    isOpen,
    enable,
    toggle,
    close,
    open,
    _getOpenSync,
    _createAnimation,
    _register,
    _unregister,
    _setOpen,
  };
};

export const menuController = /*@__PURE__*/ createMenuController();
