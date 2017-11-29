import { Animation } from '../../../index';


/**
 * Md Popover Enter Animation
 */
export default function mdEnterAnimation(Animation: Animation, baseElm: HTMLElement): Animation {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseElm.querySelector('.popover-backdrop'));

  backdropAnimation.fromTo('opacity', 0.01, 0.08);

  return baseAnimation
    .addElement(baseElm)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(300)
    .add(backdropAnimation);
}
