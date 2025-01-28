import { createAnimation } from '@utils/animation/animation';

import type { ModalAnimationOptions } from '../modal-interface';
import { getBackdropValueForSheet } from '../utils';

export const createSheetEnterAnimation = (baseEl: HTMLElement, opts: ModalAnimationOptions) => {
  const { currentBreakpoint, backdropBreakpoint } = opts;

  /**
   * If the backdropBreakpoint is undefined, then the backdrop
   * should always fade in. If the backdropBreakpoint came before the
   * current breakpoint, then the backdrop should be fading in.
   */
  const shouldShowBackdrop = backdropBreakpoint === undefined || backdropBreakpoint < currentBreakpoint!;
  const initialBackdrop = shouldShowBackdrop ? `calc(var(--backdrop-opacity) * ${currentBreakpoint!})` : '0';

  const backdropAnimation = createAnimation('backdropAnimation').fromTo('opacity', 0, initialBackdrop);

  if (shouldShowBackdrop) {
    backdropAnimation
      .beforeStyles({
        'pointer-events': 'none',
      })
      .afterClearStyles(['pointer-events']);
  }

  const wrapperAnimation = createAnimation('wrapperAnimation').keyframes([
    { offset: 0, opacity: 1, transform: 'translateY(100%)' },
    { offset: 1, opacity: 1, transform: `translateY(${100 - currentBreakpoint! * 100}%)` },
  ]);

  const contentAnimation = createAnimation('contentAnimation').keyframes([
    { offset: 0, opacity: 1, maxHeight: `${(1 - currentBreakpoint!) * 100}%` },
    { offset: 1, opacity: 1, maxHeight: `${currentBreakpoint! * 100}%` },
  ]);

  const headerHeight = baseEl.querySelector('ion-header')?.clientHeight ?? 0;

  const footerHeight = baseEl.querySelector('ion-footer')?.clientHeight
    ?? baseEl.shadowRoot?.querySelector('ion-footer')?.clientHeight ?? 0;

  const wrapperHeight = baseEl.shadowRoot?.querySelector('.modal-wrapper, .modal-shadow')?.clientHeight ?? 100;

  const footerOffset = parseFloat(((footerHeight ? (footerHeight / wrapperHeight) : 0)).toFixed(2));

  const headerOffset = parseFloat(((headerHeight ? (headerHeight / wrapperHeight) : 0)).toFixed(2));

  const footerAnimation = createAnimation('footerAnimation').keyframes([
    { offset: 0, opacity: 1, transform: `translateY(${footerHeight}px)` },
    { offset: headerOffset, opacity: 1, transform: `translateY(${footerHeight}px)` },
    { offset: ((footerOffset + headerOffset) * 2), opacity: 1, transform: 'translateY(0)' },
  ]);

  return { wrapperAnimation, backdropAnimation, contentAnimation, footerAnimation };
};

export const createSheetLeaveAnimation = (baseEl: HTMLElement, opts: ModalAnimationOptions) => {
  const { currentBreakpoint, backdropBreakpoint } = opts;

  /**
   * Backdrop does not always fade in from 0 to 1 if backdropBreakpoint
   * is defined, so we need to account for that offset by figuring out
   * what the current backdrop value should be.
   */
  const backdropValue = `calc(var(--backdrop-opacity) * ${getBackdropValueForSheet(
    currentBreakpoint!,
    backdropBreakpoint!
  )})`;
  const defaultBackdrop = [
    { offset: 0, opacity: backdropValue },
    { offset: 1, opacity: 0 },
  ];

  const customBackdrop = [
    { offset: 0, opacity: backdropValue },
    { offset: backdropBreakpoint!, opacity: 0 },
    { offset: 1, opacity: 0 },
  ];

  const backdropAnimation = createAnimation('backdropAnimation').keyframes(
    backdropBreakpoint !== 0 ? customBackdrop : defaultBackdrop
  );

  const wrapperAnimation = createAnimation('wrapperAnimation').keyframes([
    { offset: 0, opacity: 1, transform: `translateY(${100 - currentBreakpoint! * 100}%)` },
    { offset: 1, opacity: 1, transform: `translateY(100%)` },
  ]);

  const headerHeight = baseEl.querySelector('ion-header')?.clientHeight ?? 0;

  const footerHeight = baseEl.querySelector('ion-footer')?.clientHeight
    ?? baseEl.shadowRoot?.querySelector('ion-footer')?.clientHeight ?? 0;

  const wrapperHeight = baseEl.shadowRoot?.querySelector('.modal-wrapper, .modal-shadow')?.clientHeight ?? 100;

  const footerOffset = parseFloat(((footerHeight ? (footerHeight / wrapperHeight) : 0)).toFixed(2));

  const headerOffset = parseFloat(((headerHeight ? (headerHeight / wrapperHeight) : 0)).toFixed(2));

  const footerAnimation = createAnimation('footerAnimation').keyframes([
    { offset: 0, opacity: 1, transform: 'translateY(0)' },
    { offset: (1 - (footerOffset + headerOffset) * 2), opacity: 1, transform: 'translateY(0)' },
    { offset: (1), opacity: 1, transform: `translateY(${footerHeight}px)` },
  ]);

  return { wrapperAnimation, backdropAnimation, footerAnimation };
};
