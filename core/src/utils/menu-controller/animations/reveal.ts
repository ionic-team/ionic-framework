import { getIonMode } from '../../../global/ionic-global';
import { Animation, MenuI } from '../../../index';
import { createAnimation } from '../../animation/animation';

import { baseAnimation } from './base';

/**
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
export const menuRevealAnimation = (menu: MenuI): Animation => {
  const mode = getIonMode(menu);
  const openedX = (menu.width * (menu.isEndSide ? -1 : 1)) + 'px';
  const contentOpen = createAnimation()
    .addElement(menu.contentEl!) // REVIEW
    .fromTo('transform', 'translateX(0px)', `translateX(${openedX})`);

  return baseAnimation(mode === 'ios').addAnimation(contentOpen);
};
