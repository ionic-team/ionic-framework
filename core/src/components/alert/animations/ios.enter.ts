import { Animation } from '../../../interface';

/**
 * iOS Alert Enter Animation
 */
export function iosEnterAnimation(Animation: Animation, baseEl: HTMLElement): Promise<Animation> {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new Animation();
  wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'));

  backdropAnimation.fromTo('opacity', 0.01, 0.3);

  wrapperAnimation.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);

  const ani = baseAnimation
    .addElement(baseEl)
    .easing('ease-in-out')
    .duration(200)
    .add(backdropAnimation)
    .add(wrapperAnimation);

  return Promise.resolve(ani);
}
