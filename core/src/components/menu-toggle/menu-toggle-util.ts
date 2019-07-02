
// Get the menu controller element
export function getMenuController(doc: Document): Promise<HTMLIonMenuControllerElement | undefined> {
  const menuControllerElement = doc.querySelector('ion-menu-controller');
  if (!menuControllerElement) {
    return Promise.resolve(undefined);
  }
  return menuControllerElement.componentOnReady();
}

// Given a menu, toggle it
export async function toggleMenu(menu: string | undefined) {
  const menuCtrl = await getMenuController(document);
  if (menuCtrl) {
    const menuEl = await menuCtrl.get(menu);
    if (menuEl) {
      menuCtrl.toggle(menu);
    }
  }
}

// Given a menu, return whether or not the menu
// toggle should be visible
export async function updateVisibility(menu: string | undefined) {
  const menuCtrl = await getMenuController(document);
  if (menuCtrl) {
    const menuEl = await menuCtrl.get(menu);
    if (menuEl && await menuEl.isActive()) {
      return true;
    }
  }
  return false;
}
