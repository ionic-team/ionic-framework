import { readTask, writeTask } from '@stencil/core';

const TRANSITION = 'all 0.2s ease-in-out';

export const createHeaderIndex = (headerEl: any): any | undefined => {
  if (!headerEl) { return; }

  const toolbars = headerEl.querySelectorAll('ion-toolbar');

  return {
    el: headerEl,
    toolbars: Array.from(toolbars).map((toolbar: any) => {
      const ionTitleEl = toolbar.querySelector('ion-title');
      return {
        el: toolbar,
        background: toolbar.shadowRoot!.querySelector('.toolbar-background'),
        ionTitleEl,
        innerTitleEl: (ionTitleEl) ? ionTitleEl.shadowRoot!.querySelector('.toolbar-title') : null,
        ionButtonsEl: Array.from(toolbar.querySelectorAll('ion-buttons'))
      };
    })
  };
};

const clampValue = (value: number, max: number, min: number): number => {
  if (value > max) {
    return max;
  } else if (value < min) {
    return min;
  }

  return value;
};

export const handleContentScroll = (scrollEl: any, mainHeaderIndex: any, scrollHeaderIndex: any, remainingHeight = 0) => {
  readTask(() => {
    const scrollTop = scrollEl.scrollTop;

    const lastMainToolbar = mainHeaderIndex.toolbars[mainHeaderIndex.toolbars.length - 1];
    const scale = clampValue(1 + (-scrollTop / 500), 1.1, 1);

    const borderOpacity = clampValue((scrollTop - remainingHeight) / lastMainToolbar.el.clientHeight, 1, 0);
    const maxOpacity = 1;
    const scaledOpacity = borderOpacity * maxOpacity;

    writeTask(() => {
      scaleLargeTitles(scrollHeaderIndex.toolbars, scale);
      setToolbarBackgroundOpacity(mainHeaderIndex.toolbars[0], scaledOpacity);
    });
  });
};

const setToolbarBackgroundOpacity = (toolbar: any, opacity = 1) => {
  toolbar.background.style.setProperty('--opacity', opacity);
};

/**
 * If toolbars are intersecting, hide the scrollable toolbar content
 * and show the primary toolbar content. If the toolbars are not intersecting,
 * hide the primary toolbar content and show the scrollable toolbar content
 */
export const handleToolbarIntersection = (ev: any, mainHeaderIndex: any, scrollHeaderIndex: any) => {
  writeTask(() => {
    /**
     * If element does not have an offsetParent,
     * then the page where this header exists
     * is not the active page
     */

    if (!mainHeaderIndex.el.offsetParent) { return; }

    const event = ev[0];
    /**
     * Do nothing if the element is moving left, right, or down out of view
     */
    if (
      event.intersectionRect.left !== event.boundingClientRect.left ||
      event.intersectionRect.right !== event.boundingClientRect.right ||
      event.intersectionRect.bottom !== event.boundingClientRect.bottom
    ) { return; }

    if (event.isIntersecting) {
      makeHeaderInactive(mainHeaderIndex);
      makeHeaderActive(scrollHeaderIndex);
    } else {
      makeHeaderActive(mainHeaderIndex);
      makeHeaderInactive(scrollHeaderIndex);
    }
  });
};

export const makeHeaderInactive = (headerIndex: any) => {
  headerIndex.el.classList.add('header-collapse-ios-inactive');
  setToolbarBackgroundOpacity(headerIndex.toolbars[0], 0);
};

export const makeHeaderActive = (headerIndex: any) => {
  headerIndex.el.classList.remove('header-collapse-ios-inactive');
  setToolbarBackgroundOpacity(headerIndex.toolbars[0], 1);
};

export const setElOpacity = (el: HTMLElement, opacity = 1, transition = false) => {
  el.style.setProperty('transition', (transition) ? TRANSITION : '');
  el.style.setProperty('opacity', `${opacity}`);
};

export const scaleLargeTitles = (toolbars: any[] = [], scale = 1, transition = false) => {
  toolbars.forEach(toolbar => {

    const ionTitle = toolbar.ionTitleEl;
    if (!ionTitle || ionTitle.size !== 'large') { return; }

    const titleDiv = toolbar.innerTitleEl;
    if (titleDiv === null) { return; }

    titleDiv.style.transformOrigin = 'left center';
    titleDiv.style.transition = (transition) ? TRANSITION : '';
    titleDiv.style.transform = `scale3d(${scale}, ${scale}, 1)`;
  });
};
