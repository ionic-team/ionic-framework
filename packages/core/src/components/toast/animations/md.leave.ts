import { Animation } from '../../../index';

/**
 * md Toast Leave Animation
 */
export default function mdLeaveAnimation(Animation: Animation, baseElm: HTMLElement, position: string): Promise<Animation> {
  const baseAnimation = new Animation();

  const wrapperAnimation = new Animation();
  const wrapperEle = baseElm.querySelector('.toast-wrapper') as HTMLElement;
  wrapperAnimation.addElement(wrapperEle);

  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('translateY', '0px', '-100%');
      break;
    case 'middle':
      wrapperAnimation.fromTo('opacity', 0.99, 0);
      break;
    default:
      wrapperAnimation.fromTo('translateY', `0px`, '100%');
      break;
  }
  return Promise.resolve(baseAnimation
    .addElement(baseElm)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(300)
    .add(wrapperAnimation));
}
