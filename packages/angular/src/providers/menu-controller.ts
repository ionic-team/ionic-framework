import { Injectable } from '@angular/core';
import { menuController } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class MenuController {
  /**
   * Programmatically open the Menu.
   * @param [menuId]  Optionally get the menu by its id, or side.
   * @return returns a promise when the menu is fully opened
   */
  open(menuId?: string): Promise<boolean> {
    return menuController.open(menuId);
  }

  /**
   * Programmatically close the Menu. If no `menuId` is given as the first
   * argument then it'll close any menu which is open. If a `menuId`
   * is given then it'll close that exact menu.
   * @param [menuId]  Optionally get the menu by its id, or side.
   * @return returns a promise when the menu is fully closed
   */
  close(menuId?: string): Promise<boolean> {
    return menuController.close(menuId);
  }

  /**
   * Toggle the menu. If it's closed, it will open, and if opened, it
   * will close.
   * @param [menuId]  Optionally get the menu by its id, or side.
   * @return returns a promise when the menu has been toggled
   */
  toggle(menuId?: string): Promise<boolean> {
    return menuController.toggle(menuId);
  }

  /**
   * Used to enable or disable a menu. For example, there could be multiple
   * left menus, but only one of them should be able to be opened at the same
   * time. If there are multiple menus on the same side, then enabling one menu
   * will also automatically disable all the others that are on the same side.
   * @param [menuId]  Optionally get the menu by its id, or side.
   * @return Returns the instance of the menu, which is useful for chaining.
   */
  enable(shouldEnable: boolean, menuId?: string): Promise<HTMLIonMenuElement | undefined> {
    return menuController.enable(shouldEnable, menuId);
  }

  /**
   * Used to enable or disable the ability to swipe open the menu.
   * @param shouldEnable  True if it should be swipe-able, false if not.
   * @param [menuId]  Optionally get the menu by its id, or side.
   * @return Returns the instance of the menu, which is useful for chaining.
   */
  swipeGesture(shouldEnable: boolean, menuId?: string): Promise<HTMLIonMenuElement | undefined> {
    return menuController.swipeGesture(shouldEnable, menuId);
  }

  /**
   * @param [menuId] Optionally get the menu by its id, or side.
   * @return Returns true if the specified menu is currently open, otherwise false.
   * If the menuId is not specified, it returns true if ANY menu is currenly open.
   */
  isOpen(menuId?: string): Promise<boolean> {
    return menuController.isOpen(menuId);
  }

  /**
   * @param [menuId]  Optionally get the menu by its id, or side.
   * @return Returns true if the menu is currently enabled, otherwise false.
   */
  isEnabled(menuId?: string): Promise<boolean> {
    return menuController.isEnabled(menuId);
  }

  /**
   * Used to get a menu instance. If a `menuId` is not provided then it'll
   * return the first menu found. If a `menuId` is `left` or `right`, then
   * it'll return the enabled menu on that side. Otherwise, if a `menuId` is
   * provided, then it'll try to find the menu using the menu's `id`
   * property. If a menu is not found then it'll return `null`.
   * @param [menuId]  Optionally get the menu by its id, or side.
   * @return Returns the instance of the menu if found, otherwise `null`.
   */
  get(menuId?: string): Promise<HTMLIonMenuElement | undefined> {
    return menuController.get(menuId);
  }

  /**
   * @return Returns the instance of the menu already opened, otherwise `null`.
   */
  getOpen(): Promise<HTMLIonMenuElement | undefined> {
    return menuController.getOpen();
  }

  /**
   * @return Returns an array of all menu instances.
   */
  getMenus(): Promise<HTMLIonMenuElement[]> {
    return menuController.getMenus();
  }
}
