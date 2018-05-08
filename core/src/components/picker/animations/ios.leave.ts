import { Animation } from '../../../interface';


/**
 * iOS Picker Leave Animation
 */
export function iosLeaveAnimation(Animation: Animation, baseEl: HTMLElement): Promise<Animation> {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new Animation();
  wrapperAnimation.addElement(baseEl.querySelector('.picker-wrapper'));

  backdropAnimation.fromTo('opacity', 0.26, 0.01);

  wrapperAnimation.fromTo('translateY', '0%', '100%');

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .add(backdropAnimation)
    .add(wrapperAnimation));
}
