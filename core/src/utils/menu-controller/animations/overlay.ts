import { IonicAnimation, MenuI } from '../../../interface';
import { createAnimation } from '../../animation/animation';

import { baseAnimation } from './base';

/**
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
export const menuOverlayAnimation = (menu: MenuI): IonicAnimation => {
  let closedX: string;
  let openedX: string;

  const BOX_SHADOW_WIDTH = 8;
  const width = menu.width + BOX_SHADOW_WIDTH;
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

  menuAnimation
    .addElement(menu.menuInnerEl)
    .fromTo('transform', `translateX(${closedX})`, `translateX(${openedX})`);

  backdropAnimation
    .addElement(menu.backdropEl)
    .fromTo('opacity', 0.01, 0.32);

  return baseAnimation().addAnimation([menuAnimation, backdropAnimation]);
};
