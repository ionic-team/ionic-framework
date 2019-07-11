import { Animation } from '../../../interface';

/**
 * Md Alert Enter Animation
 */
export const mdEnterAnimation = (AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> => {
  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'));

  backdropAnimation.fromTo('opacity', 0.01, 0.32);

  wrapperAnimation.fromTo('opacity', 0.01, 1).fromTo('scale', 0.9, 1);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('ease-in-out')
    .duration(150)
    .add(backdropAnimation)
    .add(wrapperAnimation));
};
