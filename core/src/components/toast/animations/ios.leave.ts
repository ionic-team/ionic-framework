import { Animation } from '../../../index';

/**
 * iOS Toast Leave Animation
 */
export default function iosLeaveAnimation(Animation: Animation, baseEl: HTMLElement, position: string): Promise<Animation> {
  const baseAnimation = new Animation();

  const wrapperAnimation = new Animation();
  const wrapperEle = baseEl.querySelector('.toast-wrapper') as HTMLElement;
  wrapperAnimation.addElement(wrapperEle);
  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('translateY', 'calc(env(safe-area-inset-top) + 10px)', '-100%');
      break;
    case 'middle':
      wrapperAnimation.fromTo('opacity', 0.99, 0);
      break;
    default:
      wrapperAnimation.fromTo('translateY', 'calc(-10px - env(safe-area-inset-bottom))', '100%');
      break;
  }
  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(300)
    .add(wrapperAnimation));
}
