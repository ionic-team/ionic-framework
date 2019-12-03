import { writeTask } from '@stencil/core';

export const handleScrollWhilePulling = (
  spinner: HTMLElement,
  ticks: NodeListOf<SVGElement>,
  opacity: number,
  currentTickToShow: number
) => {
  writeTask(() => {
    spinner.style.setProperty('opacity', opacity.toString());

    ticks.forEach((el, i) => {
      el.style.setProperty('opacity', (i <= currentTickToShow) ? '0.99' : '0');
    });
  });
};

export const handleScrollWhileRefreshing = (
  spinner: HTMLElement,
  opacity: number
) => {
  writeTask(() => spinner.style.setProperty('opacity', opacity.toString()));
};
