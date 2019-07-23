import { Animation, MenuI } from '../../../interface';

import { baseAnimation } from './base';

/**
 * Menu Push Type
 * The content slides over to reveal the menu underneath.
 * The menu itself also slides over to reveal its bad self.
 */
export const menuPushAnimation = (AnimationC: Animation, _: HTMLElement, menu: MenuI): Promise<Animation> => {

  let contentOpenedX: string;
  let menuClosedX: string;
  const width = menu.width;

  if (menu.isEndSide) {
    contentOpenedX = -width + 'px';
    menuClosedX = width + 'px';

  } else {
    contentOpenedX = width + 'px';
    menuClosedX = -width + 'px';
  }
  const menuAnimation = new AnimationC()
    .addElement(menu.menuInnerEl)
    .fromTo('translateX', menuClosedX, '0px');

  const contentAnimation = new AnimationC()
    .addElement(menu.contentEl)
    .fromTo('translateX', '0px', contentOpenedX);

  const backdropAnimation = new AnimationC()
    .addElement(menu.backdropEl)
    .fromTo('opacity', 0.01, 0.32);

  return baseAnimation(AnimationC).then(animation => {
    return animation.add(menuAnimation)
      .add(backdropAnimation)
      .add(contentAnimation);
  });
};
