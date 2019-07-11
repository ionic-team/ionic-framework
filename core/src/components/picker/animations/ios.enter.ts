import { Animation } from '../../../interface';

/**
 * iOS Picker Enter Animation
 */
export const iosEnterAnimation = (AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> => {
  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.picker-wrapper'));

  backdropAnimation.fromTo('opacity', 0.01, 0.26);

  wrapperAnimation.fromTo('translateY', '100%', '0%');

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .add(backdropAnimation)
    .add(wrapperAnimation));
};
