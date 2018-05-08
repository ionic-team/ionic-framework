import { Animation, Menu } from '../../../interface';
import { baseAnimation } from './base';

/**
 * @hidden
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
export function menuRevealAnimation(Animation: Animation, _: HTMLElement, menu: Menu): Promise<Animation> {
  const openedX = (menu.width * (menu.isEndSide ? -1 : 1)) + 'px';

  const contentOpen = new Animation()
    .addElement(menu.contentEl)
    .fromTo('translateX', '0px', openedX);

  return baseAnimation(Animation).then(animation => {
    return animation.add(contentOpen);
  });
}
