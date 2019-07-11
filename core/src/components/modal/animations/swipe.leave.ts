import { Animation } from '../../../interface';

/**
 * Modal Swipe Leave Animation
 */
export function swipeLeaveAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {
  const baseAnimation = new AnimationC();
  /*

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  const wrapperEl = baseEl.querySelector('.modal-wrapper');
  wrapperAnimation.addElement(wrapperEl);
  const wrapperElRect = wrapperEl!.getBoundingClientRect();

  wrapperAnimation.beforeStyles({ 'opacity': 1 })
                  .fromTo('translateY', `${wrapperElRect.top}px`, `${(baseEl.ownerDocument as any).defaultView.innerHeight}px`);

  backdropAnimation.to('opacity', 0.0);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('ease-out')
    .duration(250)
    .add(backdropAnimation)
    .add(wrapperAnimation));
  */

  return Promise.resolve(baseAnimation.addElement(baseEl).duration(0));
}