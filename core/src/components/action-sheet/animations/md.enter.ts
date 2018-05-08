
import { Animation } from '../../../interface';

/**
 * MD Action Sheet Enter Animation
 */
export function mdEnterAnimation(Animation: Animation, baseEl: HTMLElement): Promise<Animation> {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new Animation();
  wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'));

  backdropAnimation.fromTo('opacity', 0.01, 0.26);
  wrapperAnimation.fromTo('translateY', '100%', '0%');

  const ani = baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .add(backdropAnimation)
    .add(wrapperAnimation);

  return Promise.resolve(ani);
}
