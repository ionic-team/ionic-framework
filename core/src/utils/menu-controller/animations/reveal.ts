import type { MenuI } from '../../../components/menu/menu-interface';
import { getIonMode } from '../../../global/ionic-global';
import { createAnimation } from '../../animation/animation';
import type { Animation } from '../../animation/animation-interface';

import { baseAnimation } from './base';

/**
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
export const menuRevealAnimation = (menu: MenuI): Animation => {
  const mode = getIonMode(menu);
  const isIOS = mode === 'ios';
  const openedX = menu.width * (menu.isEndSide ? -1 : 1) + 'px';
  const contentOpen = createAnimation()
    .addElement(menu.contentEl!) // REVIEW
    .fromTo('transform', 'translateX(0px)', `translateX(${openedX})`);

  return baseAnimation(isIOS).addAnimation(contentOpen);
};
