import { Animation } from '../../../interface';

/**
 * Md Modal Leave Animation
 */
export const mdLeaveAnimation = (AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> => {
  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  const wrapperEl = baseEl.querySelector('.modal-wrapper');
  wrapperAnimation.addElement(wrapperEl);

  wrapperAnimation
    .fromTo('opacity', 0.99, 0)
    .fromTo('translateY', '0px', '40px');

  backdropAnimation.fromTo('opacity', 0.32, 0.0);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(0.47,0,0.745,0.715)')
    .duration(200)
    .add(backdropAnimation)
    .add(wrapperAnimation));
};
