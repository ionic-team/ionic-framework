import { Animation } from '../../../interface';


/**
 * iOS Loading Enter Animation
 */
export function iosEnterAnimation(Animation: Animation, baseEl: HTMLElement): Promise<Animation> {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new Animation();
  wrapperAnimation.addElement(baseEl.querySelector('.loading-wrapper'));

  backdropAnimation.fromTo('opacity', 0.01, 0.3);

  wrapperAnimation.fromTo('opacity', 0.01, 1)
                  .fromTo('scale', 1.1, 1);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('ease-in-out')
    .duration(200)
    .add(backdropAnimation)
    .add(wrapperAnimation));
}
