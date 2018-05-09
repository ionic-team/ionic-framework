import { Animation, Menu } from '../../../interface';
import { baseAnimation } from './base';

const BOX_SHADOW_WIDTH = 8;
/**
 * @hidden
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
export function menuOverlayAnimation(Animation: Animation, _: HTMLElement, menu: Menu): Promise<Animation> {
  let closedX: string, openedX: string;
  const width = menu.width + BOX_SHADOW_WIDTH;
  if (menu.isEndSide) {
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



  return baseAnimation(Animation).then(animation => {
    return animation.add(menuAni)
      .add(backdropAni);
  });
}
