import { Animation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * iOS Modal Leave Animation
 */
export const iosSwipeLeaveAnimation = (
    baseEl: HTMLElement,
    presentingEl?: HTMLElement,
    duration = 500
): Animation => {

    const wrapperAnimation = createAnimation()
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .beforeStyles({ 'opacity': 1 })
        .fromTo('transform', 'translateY(0%)', `translateY(50%)`);

    const baseAnimation = createAnimation()
        .addElement(baseEl)
        .easing('cubic-bezier(0.32,0.72,0,1)')
        .duration(duration)
        .addAnimation(wrapperAnimation);

    return baseAnimation;
};
