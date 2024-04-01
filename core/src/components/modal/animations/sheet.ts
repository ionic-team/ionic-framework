import { createAnimation } from '@utils/animation/animation';

import type { ModalAnimationOptions } from '../modal-interface';
import { getBackdropValueForSheet } from '../utils';

export const createSheetEnterAnimation =
  (opts: ModalAnimationOptions) => {
    const {
      currentBreakpoint,
      backdropBreakpoint,
    } = opts;

    /**
     * If the backdropBreakpoint is undefined, then the backdrop
     * should always fade in. If the backdropBreakpoint came before the
     * current breakpoint, then the backdrop should be fading in.
     */
    const shouldShowBackdrop =
      backdropBreakpoint ===
        undefined ||
      backdropBreakpoint <
        currentBreakpoint!;
    const initialBackdrop =
      shouldShowBackdrop
        ? `calc(var(--backdrop-opacity) * ${currentBreakpoint!})`
        : '0';

    const backdropAnimation =
      createAnimation(
        'backdropAnimation'
      ).fromTo(
        'opacity',
        0,
        initialBackdrop
      );

    if (shouldShowBackdrop) {
      backdropAnimation
        .beforeStyles({
          'pointer-events': 'none',
        })
        .afterClearStyles([
          'pointer-events',
        ]);
    }

    const wrapperAnimation =
      createAnimation(
        'wrapperAnimation'
      ).keyframes([
        {
          offset: 0,
          opacity: 1,
          transform: 'translateY(100%)',
        },
        {
          offset: 1,
          opacity: 1,
          transform: `translateY(${
            100 -
            currentBreakpoint! * 100
          }%)`,
        },
      ]);

    return {
      wrapperAnimation,
      backdropAnimation,
    };
  };

export const createSheetLeaveAnimation =
  (opts: ModalAnimationOptions) => {
    const {
      currentBreakpoint,
      backdropBreakpoint,
    } = opts;

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
      {
        offset: 0,
        opacity: backdropValue,
      },
      { offset: 1, opacity: 0 },
    ];

    const customBackdrop = [
      {
        offset: 0,
        opacity: backdropValue,
      },
      {
        offset: backdropBreakpoint!,
        opacity: 0,
      },
      { offset: 1, opacity: 0 },
    ];

    const backdropAnimation =
      createAnimation(
        'backdropAnimation'
      ).keyframes(
        backdropBreakpoint !== 0
          ? customBackdrop
          : defaultBackdrop
      );

    const wrapperAnimation =
      createAnimation(
        'wrapperAnimation'
      ).keyframes([
        {
          offset: 0,
          opacity: 1,
          transform: `translateY(${
            100 -
            currentBreakpoint! * 100
          }%)`,
        },
        {
          offset: 1,
          opacity: 1,
          transform: `translateY(100%)`,
        },
      ]);

    return {
      wrapperAnimation,
      backdropAnimation,
    };
  };
