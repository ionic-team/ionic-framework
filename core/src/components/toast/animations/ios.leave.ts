import { Animation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * iOS Toast Leave Animation
 */
export const iosLeaveAnimation = (baseEl: ShadowRoot, position: string): Animation => {
  const baseAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  const hostEl = baseEl.host || baseEl;
  const wrapperEl = baseEl.querySelector('.toast-wrapper') as HTMLElement;

  const bottom = `calc(-10px - var(--ion-safe-area-bottom, 0px))`;
  const top = `calc(10px + var(--ion-safe-area-top, 0px))`;

  wrapperAnimation.addElement(wrapperEl);

  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('transform', `translateY(${top})`, 'translateY(-100%)');
      break;
    case 'middle':
      wrapperAnimation.fromTo('opacity', 0.99, 0);
      break;
    default:
      wrapperAnimation.fromTo('transform', `translateY(${bottom})`, 'translateY(100%)');
      break;
  }
  return baseAnimation
    .addElement(hostEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(300)
    .addAnimation(wrapperAnimation);
};
