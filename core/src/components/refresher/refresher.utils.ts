import { writeTask } from '@stencil/core';

export const handleScrollWhilePulling = (
  scrollEl: HTMLElement,
  spinner: HTMLElement,
  ticks: NodeListOf<SVGElement>,
  opacity: number,
  currentTickToShow: number,
  shouldPlaySpinner: boolean
) => {
  writeTask(() => {
    spinner.style.setProperty('opacity', opacity.toString());

    ticks.forEach((el, i) => {
      el.style.setProperty('opacity', (i <= currentTickToShow) ? '0.99' : '0');
    });

    scrollEl.style.setProperty('transform', (shouldPlaySpinner) ? 'translateY(44px)' : 'translateY(0px)');
  });
};

export const handleScrollWhileRefreshing = (
  spinner: HTMLElement,
  opacity: number
) => {
  writeTask(() => spinner.style.setProperty('opacity', opacity.toString()));
};
