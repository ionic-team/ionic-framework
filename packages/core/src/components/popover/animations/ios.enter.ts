import { Animation } from '../../../index';


/**
 * iOS Popover Enter Animation
 */
export default function iOSEnterAnimation(Animation: Animation, baseElm: HTMLElement): Animation {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseElm.querySelector('.popover-backdrop'));

  backdropAnimation.fromTo('opacity', 0.01, 0.08);

  return baseAnimation
    .addElement(baseElm)
    .easing('ease')
    .duration(100)
    .add(backdropAnimation);
}
