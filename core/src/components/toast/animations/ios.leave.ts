import { Animation } from '../../../interface';

/**
 * iOS Toast Leave Animation
 */
export function iosLeaveAnimation(AnimationC: Animation, baseEl: HTMLElement, position: string): Promise<Animation> {
  const baseAnimation = new AnimationC();

  const wrapperAnimation = new AnimationC();
  const wrapperEle = baseEl.querySelector('.toast-wrapper') as HTMLElement;
  wrapperAnimation.addElement(wrapperEle);

  const bottom = `calc(-10px - var(--ion-safe-area-bottom, 0px))`;
  const top = `calc(10px + var(--ion-safe-area-top, 0px))`;

  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('translateY', top, '-100%');
      break;
    case 'middle':
      wrapperAnimation.fromTo('opacity', 0.99, 0);
      break;
    default:
      wrapperAnimation.fromTo('translateY', bottom, '100%');
      break;
  }
  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(300)
    .add(wrapperAnimation));
}
