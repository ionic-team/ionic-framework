import { ensureElementInBody } from '../util/util';

let element: HTMLIonMenuControllerElement;
export class MenuController {


  constructor() {
    element = ensureElementInBody('ion-menu-controller') as HTMLIonMenuControllerElement;
  }

  close(menuId?: string) {
    return element.componentOnReady().then(() => {
      return element.close(menuId);
    });
  }

  // maintain legacy sync api
  enable(enabled: boolean, menuId?: string) {
    if (element && element.enable) {
      return element.enable(enabled, menuId);
    }
    // IDK, this is not a good place to be in
    return null;
  }

  enableAsync(menuId?: string): Promise<HTMLIonMenuElement> {
    return element.componentOnReady().then(() => {
      return element.enable(true, menuId);
    });
  }

  get(menuId?: string) {
    if (element && element.get) {
      return element.get(menuId);
    }
    // IDK, this is not a good place to be in
    return null;
  }

  getAsync(menuId?: string): Promise<HTMLIonMenuElement> {
    return element.componentOnReady().then(() => {
      return element.get(menuId);
    });
  }

  getMenus() {
    if (element && element.getMenus) {
      return element.getMenus();
    }
    // IDK, this is not a good place to be in
    return [];
  }

  getMenusAsync(): Promise<HTMLIonMenuElement[]> {
    return element.componentOnReady().then(() => {
      return element.getMenus();
    });
  }

  getOpen() {
    if (element && element.getOpen) {
      return element.getOpen();
    }
    // IDK, this is not a good place to be in
    return null;
  }

  getOpenAsync(): Promise<HTMLIonMenuElement> {
    return element.componentOnReady().then(() => {
      return element.getOpen();
    });
  }

  isEnabled(menuId?: string) {
    if (element && element.isEnabled) {
      return element.isEnabled(menuId);
    }
    // IDK, this is not a good place to be in
    return false;
  }

  isEnabledAsync(menuId?: string): Promise<boolean> {
    return element.componentOnReady().then(() => {
      return element.isEnabled(menuId);
    });
  }

  isOpen(menuId?: string) {
    if (element && element.isOpen) {
      return element.isOpen(menuId);
    }
    // IDK, this is not a good place to be in
    return false;
  }

  isOpenAsync(menuId?: string): Promise<boolean> {
    return element.componentOnReady().then(() => {
      return element.isOpen(menuId);
    });
  }

  open(menuId?: string): Promise<boolean> {
    return element.componentOnReady().then(() => {
      return element.open(menuId);
    });
  }

  swipeEnable(shouldEnable: boolean, menuId?: string) {
    if (element && element.swipeEnable) {
      return element.swipeEnable(shouldEnable, menuId);
    }
    // IDK, this is not a good place to be in
    return null;
  }

  swipeEnableAsync(shouldEnable: boolean, menuId?: string): Promise<HTMLIonMenuElement> {
    return element.componentOnReady().then(() => {
      return element.swipeEnable(shouldEnable, menuId);
    });
  }

  toggle(menuId?: string): Promise<boolean> {
    return element.componentOnReady().then(() => {
      return element.toggle(menuId);
    });
  }
}
