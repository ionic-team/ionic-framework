import { Animation } from '../../../interface';

/**
 * iOS Toast Enter Animation
 */
export function iosEnterAnimation(Animation: Animation, baseEl: HTMLElement, position: string): Promise<Animation> {
  const baseAnimation = new Animation();

  const wrapperAnimation = new Animation();
  const wrapperEle = baseEl.querySelector('.toast-wrapper') as HTMLElement;
  wrapperAnimation.addElement(wrapperEle);

  let variable;

  if (CSS.supports('bottom', 'env(safe-area-inset-bottom)')) {
    variable = 'env';
  } else if (CSS.supports('bottom', 'constant(safe-area-inset-bottom)')) {
    variable = 'constant';
  }

  const bottom = variable ? 'calc(-10px - ' + variable + '(safe-area-inset-bottom))' : '-10px';
  const top = variable ? 'calc(' + variable + '(safe-area-inset-top) + 10px)' : '10px';

  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('translateY', '-100%', top);
      break;
    case 'middle':
      const topPosition = Math.floor(
        baseEl.clientHeight / 2 - wrapperEle.clientHeight / 2
      );
      wrapperEle.style.top = `${topPosition}px`;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    default:
      wrapperAnimation.fromTo('translateY', '100%', bottom);
      break;
  }
  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.155,1.105,.295,1.12)')
    .duration(400)
    .add(wrapperAnimation));
}
