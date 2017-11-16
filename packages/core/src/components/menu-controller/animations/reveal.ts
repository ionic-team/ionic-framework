import { Animation, Menu } from '../../../index';
import baseAnimation from './base';

/**
 * @hidden
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
export default function(Animation: Animation, _: HTMLElement, menu: Menu): Animation {
  const openedX = (menu.width * (menu.isRightSide ? -1 : 1)) + 'px';

  const contentOpen = new Animation()
    .addElement(menu.contentEl)
    .fromTo('translateX', '0px', openedX);

  return baseAnimation(Animation)
    .add(contentOpen);
}
