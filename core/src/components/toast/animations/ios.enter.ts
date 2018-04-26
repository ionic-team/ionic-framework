import { Animation } from '../../../interface';

/**
 * iOS Toast Enter Animation
 */
export default function iosEnterAnimation(Animation: Animation, baseEl: HTMLElement, position: string): Promise<Animation> {
  const baseAnimation = new Animation();

  const wrapperAnimation = new Animation();
  const wrapperEle = baseEl.querySelector('.toast-wrapper') as HTMLElement;
  wrapperAnimation.addElement(wrapperEle);

  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('translateY', '-100%', 'calc(env(safe-area-inset-top) + 10px)');
      break;
    case 'middle':
      const topPosition = Math.floor(
        baseEl.clientHeight / 2 - wrapperEle.clientHeight / 2
      );
      wrapperEle.style.top = `${topPosition}px`;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    default:
      wrapperAnimation.fromTo('translateY', '100%', 'calc(-10px - env(safe-area-inset-bottom))');
      break;
  }
  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.155,1.105,.295,1.12)')
    .duration(400)
    .add(wrapperAnimation));
}
