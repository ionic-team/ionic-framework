import { Animation } from '../../../index';

/**
 * Md Modal Leave Animation
 */
export default function mdLeaveAnimation(Animation: Animation, baseElm: HTMLElement): Promise<Animation> {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseElm.querySelector('.modal-backdrop'));

  const wrapperAnimation = new Animation();
  const wrapperElm = baseElm.querySelector('.modal-wrapper');
  wrapperAnimation.addElement(wrapperElm);

  wrapperAnimation
    .fromTo('opacity', 0.99, 0)
    .fromTo('translateY', '0px', '40px');

  backdropAnimation.fromTo('opacity', 0.4, 0.0);

  return Promise.resolve(baseAnimation
    .addElement(baseElm)
    .easing('cubic-bezier(0.47,0,0.745,0.715)')
    .duration(200)
    .add(backdropAnimation)
    .add(wrapperAnimation));
}
