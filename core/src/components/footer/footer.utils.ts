import { readTask, writeTask } from '@stencil/core';
import { clamp } from '../../utils/helpers';

export const handleFooterFade = (scrollEl: HTMLElement, baseEl: HTMLElement) => {
  readTask(() => {
    const scrollTop = scrollEl.scrollTop;
    const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;

    const threshold = maxScroll - 30;

    const numerator = scrollTop - threshold;
    const denom = maxScroll - threshold;
    const scale = clamp(0, 1 - (numerator / denom), 1);

    writeTask(() => {
      baseEl.style.setProperty('--opacity', scale.toString());
    })
  });
}
