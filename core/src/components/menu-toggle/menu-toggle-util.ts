import { menuController } from '@utils/menu-controller';

// Given a menu, return whether or not the menu toggle should be visible
export const updateVisibility = async (
  menu: string | undefined
) => {
  const menuEl =
    await menuController.get(menu);
  return !!(
    menuEl && (await menuEl.isActive())
  );
};
