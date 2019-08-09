import { Animation, MenuI } from '../../../interface';

import { baseAnimation } from './base';

/**
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
export const menuOverlayAnimation = (AnimationC: Animation, _: HTMLElement, menu: MenuI): Promise<Animation> => {
  let closedX: string;
  let openedX: string;
  const width = menu.width + 8;
  if (menu.isEndSide) {
    // right side
    closedX = width + 'px';
    openedX = '0px';

  } else {
    // left side
    closedX = -width + 'px';
    openedX = '0px';
  }

  const menuAnimation = new AnimationC()
    .addElement(menu.menuInnerEl)
    .fromTo('translateX', closedX, openedX);

  const isIos = menu.mode === 'ios';
  const opacity = isIos ? 0.2 : 0.25;

  const backdropAnimation = new AnimationC()
    .addElement(menu.backdropEl)
    .fromTo('opacity', 0.01, opacity);

  return baseAnimation(AnimationC, isIos).then(animation => {
    return animation.add(menuAnimation)
      .add(backdropAnimation);
  });
};
