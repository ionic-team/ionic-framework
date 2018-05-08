import { Animation } from '../../../interface';

/**
 * iOS Alert Leave Animation
 */
export function iosLeaveAnimation(Animation: Animation, baseEl: HTMLElement): Promise<Animation> {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new Animation();
  wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'));

  backdropAnimation.fromTo('opacity', 0.3, 0);

  wrapperAnimation.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);

  const ani = baseAnimation
    .addElement(baseEl)
    .easing('ease-in-out')
    .duration(200)
    .add(backdropAnimation)
    .add(wrapperAnimation);

  return Promise.resolve(ani);
}
