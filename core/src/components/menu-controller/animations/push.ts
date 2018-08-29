import { Animation, MenuI } from '../../../interface';

import { baseAnimation } from './base';

/**
 * @hidden
 * Menu Push Type
 * The content slides over to reveal the menu underneath.
 * The menu itself also slides over to reveal its bad self.
 */
export function menuPushAnimation(AnimationC: Animation, _: HTMLElement, menu: MenuI): Promise<Animation> {

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
  const menuAni = new AnimationC()
    .addElement(menu.menuInnerEl)
    .fromTo('translateX', menuClosedX, '0px');

  const contentAni = new AnimationC()
    .addElement(menu.contentEl)
    .fromTo('translateX', '0px', contentOpenedX);

  const backdropAni = new AnimationC()
    .addElement(menu.backdropEl)
    .fromTo('opacity', 0.01, 0.2);

  return baseAnimation(AnimationC).then(animation => {
    return animation.add(menuAni)
    .add(backdropAni)
    .add(contentAni);
  });
}
