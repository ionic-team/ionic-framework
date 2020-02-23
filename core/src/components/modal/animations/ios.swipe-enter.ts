import { Animation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * iOS Modal Enter Animation for the Card presentation style
 */
export const iosSwipeEnterAnimation = (
    baseEl: HTMLElement,
    presentingEl?: HTMLElement,
): Animation => {
    const wrapperAnimation = createAnimation()
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .beforeStyles({ 'opacity': 1 })
        .fromTo('transform', 'translateY(100%)', 'translateY(50%)');

    const baseAnimation = createAnimation()
        .addElement(baseEl)
        .easing('cubic-bezier(0.32,0.72,0,1)')
        .duration(500)
        .beforeAddClass('show-modal')
        .addAnimation(wrapperAnimation);

    if (presentingEl) {
        const finalTransform = `translateY(0px)`;

        const presentingAnimation = createAnimation()
            .beforeStyles({
                'transform': 'translateY(300px)',
                'transform-origin': 'top center',
                'overflow': 'hidden'
            })
            .afterStyles({
                'transform': finalTransform
            })
            .addElement(presentingEl)
            .keyframes([
                { offset: 0, transform: 'translateY(0px)' },
                { offset: 1, transform: `translateY(0px)` }
            ]);

        baseAnimation.addAnimation(presentingAnimation);
    }

    return baseAnimation;
};
