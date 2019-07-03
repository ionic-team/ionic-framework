
// Get the menu controller element
export const getMenuController = (doc: Document): Promise<HTMLIonMenuControllerElement | undefined> => {
  const menuControllerElement = doc.querySelector('ion-menu-controller');
  if (!menuControllerElement) {
    return Promise.resolve(undefined);
  }
  return menuControllerElement.componentOnReady();
};

// Given a menu, toggle it
export const toggleMenu = async (menu: string | undefined) => {
  const menuCtrl = await getMenuController(document);
  if (menuCtrl) {
    const menuEl = await menuCtrl.get(menu);
    if (menuEl) {
      menuCtrl.toggle(menu);
    }
  }
};

// Given a menu, return whether or not the menu toggle should be visible
export const updateVisibility = async (menu: string | undefined) => {
  const menuCtrl = await getMenuController(document);
  if (menuCtrl) {
    const menuEl = await menuCtrl.get(menu);
    if (menuEl && await menuEl.isActive()) {
      return true;
    }
  }
  return false;
};
