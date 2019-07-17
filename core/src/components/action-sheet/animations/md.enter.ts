
import { Animation } from '../../../interface';

/**
 * MD Action Sheet Enter Animation
 */
export const mdEnterAnimation = (AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> => {
  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'));

  backdropAnimation.fromTo('opacity', 0.01, 0.32);
  wrapperAnimation.fromTo('translateY', '100%', '0%');

  const ani = baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .add(backdropAnimation)
    .add(wrapperAnimation);

  return Promise.resolve(ani);
};
