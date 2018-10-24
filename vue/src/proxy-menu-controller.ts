import * as apiUtils from './api-utils';
import { ProxyMenuControllerInterface } from './interfaces';

// A proxy class that allows early access to controller methods
export default class ProxyMenuController implements ProxyMenuControllerInterface {
  constructor(public tag: string) {}

  // Open a menu
  open(menuId?: string): Promise<boolean> {
    return apiUtils.proxyMethod(this.tag, 'open', menuId);
  }

  // Close a menu
  close(menuId?: string): Promise<boolean> {
    return apiUtils.proxyMethod(this.tag, 'close', menuId);
  }

  // Toggle a menu
  toggle(menuId?: string): Promise<boolean> {
    return apiUtils.proxyMethod(this.tag, 'toggle', menuId);
  }

  // Enable or disable a menu
  enable(shouldEnable: boolean, menuId?: string): Promise<HTMLElement> {
    return apiUtils.proxyMethod(this.tag, 'enable', shouldEnable, menuId);
  }

  // Enable or disable the ability to swipe open the menu
  swipeEnable(shouldEnable: boolean, menuId?: string): Promise<HTMLElement> {
    return apiUtils.proxyMethod(this.tag, 'swipeEnable', shouldEnable, menuId);
  }

  // Check if specific or any menu is open
  isOpen(menuId?: string): Promise<boolean> {
    return apiUtils.proxyMethod(this.tag, 'isOpen', menuId);
  }

  // Check is certain menu is enabled
  isEnabled(menuId?: string): Promise<boolean> {
    return apiUtils.proxyMethod(this.tag, 'isEnabled', menuId);
  }

  // Get specific or first menu instance
  get(menuId?: string): Promise<HTMLElement> {
    return apiUtils.proxyMethod(this.tag, 'get', menuId);
  }

  // Get an instance of an open menu
  getOpen(): Promise<HTMLElement> {
    return apiUtils.proxyMethod(this.tag, 'getOpen');
  }

  // Get an array of all menus
  getMenus(): Promise<HTMLElement> {
    return apiUtils.proxyMethod(this.tag, 'getMenus');
  }
}
