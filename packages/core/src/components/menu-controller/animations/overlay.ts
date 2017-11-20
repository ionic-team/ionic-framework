import { Animation, Menu } from '../../../index';
import baseAnimation from './base';

const BOX_SHADOW_WIDTH = 8;
/**
 * @hidden
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
export default function(Animation: Animation, _: HTMLElement, menu: Menu): Animation {
  let closedX: string, openedX: string;
  const width = menu.width + BOX_SHADOW_WIDTH;
  if (menu.isRightSide) {
    // right side
    closedX = width + 'px';
    openedX = '0px';

  } else {
    // left side
    closedX = -width + 'px';
    openedX = '0px';
  }

  const menuAni = new Animation()
    .addElement(menu.menuInnerEl)
    .fromTo('translateX', closedX, openedX);

  const backdropAni = new Animation()
    .addElement(menu.backdropEl)
    .fromTo('opacity', 0.01, 0.3);

  return baseAnimation(Animation)
    .add(menuAni)
    .add(backdropAni);
}
