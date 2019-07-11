import { Animation } from '../../../interface';

/**
 * Modal Swipe Leave Animation
 */
export function swipeLeaveAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {
  const baseAnimation = new AnimationC();
  const backdropAnimation = new AnimationC();
  const backdropEl = baseEl.querySelector('ion-backdrop');
  backdropAnimation.addElement(backdropEl);

  const wrapperAnimation = new AnimationC();
  const wrapperEl = baseEl.querySelector('.modal-wrapper');
  wrapperAnimation.addElement(wrapperEl);
  const wrapperElRect = wrapperEl!.getBoundingClientRect();

  const currentOpacity = backdropEl!.style.opacity;
  console.log('Backdrop opacity', currentOpacity);

  wrapperAnimation.beforeStyles({ 'opacity': 1 })
                  .fromTo('translateY', `${wrapperElRect.top}px`, `${(baseEl.ownerDocument as any).defaultView.innerHeight}px`);

  backdropAnimation.fromTo('opacity', currentOpacity, 0.0);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('ease-out')
    .duration(250)
    .add(backdropAnimation)
    .add(wrapperAnimation));
}
