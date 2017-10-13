import { Animation } from '../../../index';


/**
 * iOS Loading Enter Animation
 */
export default function iOSEnterAnimation(Animation: Animation, baseElm: HTMLElement): Animation {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseElm.querySelector('.picker-backdrop'));

  const wrapperAnimation = new Animation();
  wrapperAnimation.addElement(baseElm.querySelector('.picker-wrapper'));

  backdropAnimation.fromTo('opacity', 0.01, 0.26);

  wrapperAnimation.fromTo('translateY', '100%', '0%');

  return baseAnimation
    .addElement(baseElm)
    .easing('ease-in-out')
    .duration(200)
    .add(backdropAnimation)
    .add(wrapperAnimation);
}
