import { Animation } from '../../../interface';

/**
 * MD Toast Enter Animation
 */
export function mdEnterAnimation(AnimationC: Animation, baseEl: HTMLElement, position: string): Promise<Animation> {
  const baseAnimation = new AnimationC();

  const wrapperAnimation = new AnimationC();
  const wrapperEl = baseEl.querySelector('.toast-wrapper') as HTMLElement;

  wrapperAnimation.addElement(wrapperEl);

  const bottom = `calc(-8px - var(--ion-safe-area-bottom, 0px))`;
  const top = `calc(8px + var(--ion-safe-area-top, 0px))`;

  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('translateY', '-100%', top);
      break;
    case 'middle':
      const topPosition = Math.floor(
        baseEl.clientHeight / 2 - wrapperEl.clientHeight / 2
      );
      wrapperEl.style.top = `${topPosition}px`;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    default:
      wrapperAnimation.fromTo('translateY', '100%', bottom);
      break;
  }
  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .add(wrapperAnimation));
}
