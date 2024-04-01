import { createAnimation } from '@utils/animation/animation';
import { getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';

/**
 * iOS Popover Leave Animation
 */
export const iosLeaveAnimation = (
  baseEl: HTMLElement
): Animation => {
  const root = getElementRoot(baseEl);
  const contentEl = root.querySelector(
    '.popover-content'
  ) as HTMLElement;
  const arrowEl = root.querySelector(
    '.popover-arrow'
  ) as HTMLElement | null;

  const baseAnimation =
    createAnimation();
  const backdropAnimation =
    createAnimation();
  const contentAnimation =
    createAnimation();

  backdropAnimation
    .addElement(
      root.querySelector(
        'ion-backdrop'
      )!
    )
    .fromTo(
      'opacity',
      'var(--backdrop-opacity)',
      0
    );

  contentAnimation
    .addElement(
      root.querySelector(
        '.popover-arrow'
      )!
    )
    .addElement(
      root.querySelector(
        '.popover-content'
      )!
    )
    .fromTo('opacity', 0.99, 0);

  return baseAnimation
    .easing('ease')
    .afterAddWrite(() => {
      baseEl.style.removeProperty(
        '--width'
      );
      baseEl.classList.remove(
        'popover-bottom'
      );

      contentEl.style.removeProperty(
        'top'
      );
      contentEl.style.removeProperty(
        'left'
      );
      contentEl.style.removeProperty(
        'bottom'
      );
      contentEl.style.removeProperty(
        'transform-origin'
      );

      if (arrowEl) {
        arrowEl.style.removeProperty(
          'top'
        );
        arrowEl.style.removeProperty(
          'left'
        );
        arrowEl.style.removeProperty(
          'display'
        );
      }
    })
    .duration(300)
    .addAnimation([
      backdropAnimation,
      contentAnimation,
    ]);
};
