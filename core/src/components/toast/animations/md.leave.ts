import { Animation } from '../../../interface';

/**
 * md Toast Leave Animation
 */
export function mdLeaveAnimation(AnimationC: Animation, baseEl: HTMLElement, position: string): Promise<Animation> {
  const baseAnimation = new AnimationC();

  const wrapperAnimation = new AnimationC();
  const wrapperEle = baseEl.querySelector('.toast-wrapper') as HTMLElement;
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
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(300)
    .add(wrapperAnimation));
}
