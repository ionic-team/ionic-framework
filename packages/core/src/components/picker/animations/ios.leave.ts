import { Animation } from '../../../index';


/**
 * iOS Picker Leave Animation
 */
export default function iosLeaveAnimation(Animation: Animation, baseElm: HTMLElement): Promise<Animation> {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseElm.querySelector('.picker-backdrop'));

  const wrapperAnimation = new Animation();
  wrapperAnimation.addElement(baseElm.querySelector('.picker-wrapper'));

  backdropAnimation.fromTo('opacity', 0.26, 0.01);

  wrapperAnimation.fromTo('translateY', '0%', '100%');

  return Promise.resolve(baseAnimation
    .addElement(baseElm)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .add(backdropAnimation)
    .add(wrapperAnimation));
}
