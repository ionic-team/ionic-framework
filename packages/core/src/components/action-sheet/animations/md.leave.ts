import { Animation } from '../../../index';

/**
 * MD Action Sheet Leave Animation
 */
export default function MdLeaveAnimation(
  Animation: Animation,
  baseElm: HTMLElement
): Animation {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseElm.querySelector('.action-sheet-backdrop'));

  const wrapperAnimation = new Animation();
  wrapperAnimation.addElement(baseElm.querySelector('.action-sheet-wrapper'));

  backdropAnimation.fromTo('opacity', 0.26, 0);
  wrapperAnimation.fromTo('translateY', '0%', '100%');

  return baseAnimation
    .addElement(baseElm)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(450)
    .add(backdropAnimation)
    .add(wrapperAnimation);
}
