import { Animation } from '../../../interface';

/**
 * MD Toast Enter Animation
 */
export function mdEnterAnimation(AnimationC: Animation, baseEl: HTMLElement, position: string): Promise<Animation> {
  const baseAnimation = new AnimationC();

  const wrapperAnimation = new AnimationC();
  const wrapperEle = baseEl.querySelector('.toast-wrapper') as HTMLElement;
  wrapperAnimation.addElement(wrapperEle);

  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('translateY', '-100%', '0%');
      break;
    case 'middle':
      const topPosition = Math.floor(
        baseEl.clientHeight / 2 - wrapperEle.clientHeight / 2
      );
      wrapperEle.style.top = `${topPosition}px`;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    default:
      wrapperAnimation.fromTo('translateY', '100%', '0%');
      break;
  }
  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .add(wrapperAnimation));
}
