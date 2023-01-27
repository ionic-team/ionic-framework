import { getIonMode } from '../../../global/ionic-global';
import type { Animation, MenuI } from '../../../interface';
import { createAnimation } from '../../animation/animation';

import { baseAnimation } from './base';

/**
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
export const menuOverlayAnimation = (menu: MenuI): Animation => {
  let closedX: string;
  let openedX: string;
  const width = menu.width + 8;
  const menuAnimation = createAnimation();
  const backdropAnimation = createAnimation();

  if (menu.isEndSide) {
    // right side
    closedX = width + 'px';
    openedX = '0px';
  } else {
    // left side
    closedX = -width + 'px';
    openedX = '0px';
  }

  menuAnimation.addElement(menu.menuInnerEl!).fromTo('transform', `translateX(${closedX})`, `translateX(${openedX})`);

  const mode = getIonMode(menu);
  const isIos = mode === 'ios';
  const opacity = isIos ? 0.2 : 0.25;

  backdropAnimation.addElement(menu.backdropEl!).fromTo('opacity', 0.01, opacity);

  return baseAnimation(isIos).addAnimation([menuAnimation, backdropAnimation]);
};
