import { Animation } from '../../../interface';

/**
 * iOS Popover Leave Animation
 */
export const iosLeaveAnimation = (AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> => {
  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.popover-wrapper'));

  wrapperAnimation.fromTo('opacity', 0.99, 0);
  backdropAnimation.fromTo('opacity', 0.08, 0);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('ease')
    .duration(500)
    .add(backdropAnimation)
    .add(wrapperAnimation));
};
