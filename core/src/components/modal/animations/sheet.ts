import { ModalAnimationOptions } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

export const createSheetEnterAnimation = (opts: ModalAnimationOptions) => {
  const { currentBreakpoint, backdropBreakpoint } = opts;

  /**
   * If the backdropBreakpoint is undefined, then the backdrop
   * should always fade in. If the backdropBreakpoint came before the
   * current breakpoint, then the backdrop should be fading in.
   */
  const shouldShowBackdrop = backdropBreakpoint === undefined || backdropBreakpoint < currentBreakpoint!;
  const initialBackdrop = shouldShowBackdrop ? `calc(var(--backdrop-opacity) * ${currentBreakpoint!})` : '0.01';

  const backdropAnimation = createAnimation('backdropAnimation')
    .fromTo('opacity', 0, initialBackdrop);

  const wrapperAnimation = createAnimation('wrapperAnimation')
    .keyframes([
      { offset: 0, opacity: 1, transform: 'translateY(100%)' },
      { offset: 1, opacity: 1, transform: `translateY(${100 - (currentBreakpoint! * 100)}%)` }
    ]);

  return { wrapperAnimation, backdropAnimation };
}

export const createSheetLeaveAnimation = (opts: ModalAnimationOptions) => {
  const { currentBreakpoint } = opts;

  const backdropAnimation = createAnimation('backdropAnimation')
    .fromTo('opacity', `calc(var(--backdrop-opacity) * ${currentBreakpoint!})`, 0);

  const wrapperAnimation = createAnimation('wrapperAnimation')
    .keyframes([
      { offset: 0, opacity: 1, transform: `translateY(${100 - (currentBreakpoint! * 100)}%)` },
      { offset: 1, opacity: 1, transform: `translateY(100%)` }
    ]);

  return { wrapperAnimation, backdropAnimation };
}
