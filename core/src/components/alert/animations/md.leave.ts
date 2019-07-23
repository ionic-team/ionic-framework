import { Animation } from '../../../interface';

/**
 * Md Alert Leave Animation
 */
export const mdLeaveAnimation = (AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> => {
  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'));

  backdropAnimation.fromTo('opacity', 0.32, 0);

  wrapperAnimation.fromTo('opacity', 0.99, 0);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('ease-in-out')
    .duration(150)
    .add(backdropAnimation)
    .add(wrapperAnimation));
};
