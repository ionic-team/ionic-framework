import { Animation } from '../../../index';


/**
 * iOS Loading Leave Animation
 */
export default function iOSLeaveAnimation(Animation: Animation, baseElm: HTMLElement): Animation {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseElm.querySelector('.picker-backdrop'));

  const wrapperAnimation = new Animation();
  wrapperAnimation.addElement(baseElm.querySelector('.picker-wrapper'));

  backdropAnimation.fromTo('opacity', 0.26, 0.01);

  wrapperAnimation.fromTo('translateY', '0%', '100%');

  return baseAnimation
    .addElement(baseElm)
    .easing('ease-in-out')
    .duration(200)
    .add(backdropAnimation)
    .add(wrapperAnimation);
}
