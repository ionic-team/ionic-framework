
import { Animation } from '../../../index';

/**
 * MD Action Sheet Enter Animation
 */
export default function MdEnterAnimation(Animation: Animation, baseElm: HTMLElement): Animation {
  console.log('MD Animation')
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseElm.querySelector('.action-sheet-backdrop'));

  const wrapperAnimation = new Animation();
  wrapperAnimation.addElement(baseElm.querySelector('.action-sheet-wrapper'));

  backdropAnimation.fromTo('opacity', 0.01, 0.26);
  wrapperAnimation.fromTo('translateY', '100%', '0%');

  return baseAnimation
    .addElement(baseElm)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .add(backdropAnimation)
    .add(wrapperAnimation);
}
