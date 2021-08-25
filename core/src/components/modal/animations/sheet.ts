import { createAnimation } from '../../../utils/animation/animation';

export const createSheetEnterAnimation = (currentBreakpoint: number) => {
  const backdropAnimation = createAnimation('backdropAnimation')
    .fromTo('opacity', '0.01', `calc(var(--backdrop-opacity) * ${currentBreakpoint})`);

  const wrapperAnimation = createAnimation('wrapperAnimation')
    .keyframes([
      { offset: 0, opacity: 1, transform: 'translateY(100%)' },
      { offset: 1, opacity: 1, transform: `translateY(${100 - (currentBreakpoint * 100)}%)` }
    ]);

  return { wrapperAnimation, backdropAnimation };
}

export const createSheetLeaveAnimation = (currentBreakpoint: number) => {
  const backdropAnimation = createAnimation('backdropAnimation')
    .fromTo('opacity', `calc(var(--backdrop-opacity) * ${currentBreakpoint})`, 0);

  const wrapperAnimation = createAnimation('wrapperAnimation')
    .keyframes([
      { offset: 0, opacity: 1, transform: `translateY(${100 - (currentBreakpoint * 100)}%)` },
      { offset: 1, opacity: 1, transform: `translateY(100%)` }
    ]);

  return { wrapperAnimation, backdropAnimation };
}
