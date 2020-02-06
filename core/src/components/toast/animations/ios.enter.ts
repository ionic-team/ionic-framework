import { Animation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * iOS Toast Enter Animation
 */
export const iosEnterAnimation = (baseEl: ShadowRoot, position: string): Animation => {
  const baseAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  const hostEl = baseEl.host || baseEl;
  const wrapperEl = baseEl.querySelector('.toast-wrapper') as HTMLElement;

  const bottom = `calc(-10px - var(--ion-safe-area-bottom, 0px))`;
  const top = `calc(10px + var(--ion-safe-area-top, 0px))`;

  wrapperAnimation.addElement(wrapperEl);

  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('transform', 'translateY(-100%)', `translateY(${top})`);
      break;
    case 'middle':
      const topPosition = Math.floor(
        hostEl.clientHeight / 2 - wrapperEl.clientHeight / 2
      );
      wrapperEl.style.top = `${topPosition}px`;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    default:
      wrapperAnimation.fromTo('transform', 'translateY(100%)', `translateY(${bottom})`);
      break;
  }
  return baseAnimation
    .addElement(hostEl)
    .easing('cubic-bezier(.155,1.105,.295,1.12)')
    .duration(400)
    .addAnimation(wrapperAnimation);
};
