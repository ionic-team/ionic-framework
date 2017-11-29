import { Animation } from '../../../index';


/**
 * iOS Picker Enter Animation
 */
export default function iosEnterAnimation(Animation: Animation, baseElm: HTMLElement): Animation {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseElm.querySelector('.picker-backdrop'));

  const wrapperAnimation = new Animation();
  wrapperAnimation.addElement(baseElm.querySelector('.picker-wrapper'));

  backdropAnimation.fromTo('opacity', 0.01, 0.26);

  wrapperAnimation.fromTo('translateY', '100%', '0%');

  return baseAnimation
    .addElement(baseElm)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .add(backdropAnimation)
    .add(wrapperAnimation);
}
