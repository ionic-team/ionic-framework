import { readTask, writeTask } from '@stencil/core';
import { clamp } from '@utils/helpers';
import { createCollapseHideInteraction } from '@utils/on-scroll/collapse-hide.utils';

export const handleFooterFade = (scrollEl: HTMLElement, baseEl: HTMLElement) => {
  readTask(() => {
    const scrollTop = scrollEl.scrollTop;
    const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;

    /**
     * Toolbar background will fade
     * out over fadeDuration in pixels.
     */
    const fadeDuration = 10;

    /**
     * Begin fading out maxScroll - 30px
     * from the bottom of the content.
     * Also determine how close we are
     * to starting the fade. If we are
     * before the starting point, the
     * scale value will get clamped to 0.
     * If we are after the maxScroll (rubber
     * band scrolling), the scale value will
     * get clamped to 1.
     */
    const fadeStart = maxScroll - fadeDuration;
    const distanceToStart = scrollTop - fadeStart;

    const scale = clamp(0, 1 - distanceToStart / fadeDuration, 1);

    writeTask(() => {
      baseEl.style.setProperty('--opacity-scale', scale.toString());
    });
  });
};

export const createFooterHideInteraction = (footerEl: HTMLElement, scrollEl: HTMLElement): (() => void) =>
  createCollapseHideInteraction({
    regionEl: footerEl,
    scrollEl,
    slideCssVar: '--footer-hide-slide-y',
    contentPartnerClass: 'content-footer-hide-scroll-partner',
    contentHiddenClass: 'content-footer-hide-scroll-hidden',
    regionHiddenClass: 'footer-collapse-hide-hidden',
  });
