import { readTask, writeTask } from '@stencil/core';
import { clamp } from '@utils/helpers';

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
