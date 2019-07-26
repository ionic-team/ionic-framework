import { Animation } from '../../../interface';

/**
 * MD Action Sheet Leave Animation
 */
export const mdLeaveAnimation = (AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> => {

  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'));

  backdropAnimation.fromTo('opacity', 0.32, 0);
  wrapperAnimation.fromTo('translateY', '0%', '100%');

  const ani = baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(450)
    .add(backdropAnimation)
    .add(wrapperAnimation);

  return Promise.resolve(ani);
};
