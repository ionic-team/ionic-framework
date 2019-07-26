import { Animation, MenuI } from '../../../interface';

import { baseAnimation } from './base';

/**
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
export const menuRevealAnimation = (AnimationC: Animation, _: HTMLElement, menu: MenuI): Promise<Animation> => {
  const openedX = (menu.width * (menu.isEndSide ? -1 : 1)) + 'px';

  const contentOpen = new AnimationC()
    .addElement(menu.contentEl)
    .fromTo('translateX', '0px', openedX);

  return baseAnimation(AnimationC).then(animation => {
    return animation.add(contentOpen);
  });
};
