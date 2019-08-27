import { IonicAnimation, MenuI } from '../../../interface';
import { createAnimation } from '../../animation/animation';

import { baseAnimation } from './base';

/**
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
export const menuRevealAnimation = (menu: MenuI): IonicAnimation => {
  const openedX = (menu.width * (menu.isEndSide ? -1 : 1)) + 'px';

  const contentOpen = createAnimation()
    .addElement(menu.contentEl)
    .fromTo('transform', 'translateX(0px)', `translateX(${openedX})`);

  return baseAnimation().addAnimation(contentOpen);
};
