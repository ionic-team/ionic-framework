import { readTask, writeTask } from '@stencil/core';

import { clamp } from '../../utils/helpers';

const TRANSITION = 'all 0.2s ease-in-out';

interface HeaderIndex {
  el: HTMLElement;
  toolbars: ToolbarIndex[] | [];
}

interface ToolbarIndex {
  el: HTMLElement;
  background: HTMLElement;
  ionTitleEl: HTMLIonTitleElement | undefined;
  innerTitleEl: HTMLElement;
  ionButtonsEl: HTMLElement[] | [];
}

export const cloneElement = (tagName: string) => {
  const getCachedEl = document.querySelector(`${tagName}.ion-cloned-element`);
  if (getCachedEl !== null) { return getCachedEl; }

  const clonedEl = document.createElement(tagName);
  clonedEl.classList.add('ion-cloned-element');
  clonedEl.style.setProperty('display', 'none');
  document.body.appendChild(clonedEl);

  return clonedEl;
};

export const createHeaderIndex = (headerEl: HTMLElement | undefined): HeaderIndex | undefined => {
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
        ionButtonsEl: Array.from(toolbar.querySelectorAll('ion-buttons')) || []
      } as ToolbarIndex;
    }) || []
  } as HeaderIndex;
};

export const handleContentScroll = (scrollEl: HTMLElement, scrollHeaderIndex: HeaderIndex, contentEl: HTMLElement) => {
  readTask(() => {
    const scrollTop = scrollEl.scrollTop;
    const scale = clamp(1, 1 + (-scrollTop / 500), 1.1);

    // Native refresher should not cause titles to scale
    const nativeRefresher = contentEl.querySelector('ion-refresher.refresher-native');
    if (nativeRefresher === null) {
      writeTask(() => {
        scaleLargeTitles(scrollHeaderIndex.toolbars, scale);
      });
    }
  });
};

export const setToolbarBackgroundOpacity = (toolbar: ToolbarIndex, opacity?: number) => {
  if (opacity === undefined) {
    toolbar.background.style.removeProperty('--opacity');
  } else {
    toolbar.background.style.setProperty('--opacity', opacity.toString());
  }
};

const handleToolbarBorderIntersection = (ev: any, mainHeaderIndex: HeaderIndex, scrollTop: number) => {
  if (!ev[0].isIntersecting) { return; }

  /**
   * There is a bug in Safari where overflow scrolling on a non-body element
   * does not always reset the scrollTop position to 0 when letting go. It will
   * set to 1 once the rubber band effect has ended. This causes the background to
   * appear slightly on certain app setups.
   *
   * Additionally, we check if user is rubber banding (scrolling is negative)
   * as this can mean they are using pull to refresh. Once the refresher starts,
   * the content is transformed which can cause the intersection observer to erroneously
   * fire here as well.
   */
  const scale = (ev[0].intersectionRatio > 0.9 || scrollTop <= 0) ? 0 : ((1 - ev[0].intersectionRatio) * 100) / 75;

  mainHeaderIndex.toolbars.forEach(toolbar => {
    setToolbarBackgroundOpacity(toolbar, (scale === 1) ? undefined : scale);
  });
};

/**
 * If toolbars are intersecting, hide the scrollable toolbar content
 * and show the primary toolbar content. If the toolbars are not intersecting,
 * hide the primary toolbar content and show the scrollable toolbar content
 */
export const handleToolbarIntersection = (ev: any, mainHeaderIndex: HeaderIndex, scrollHeaderIndex: HeaderIndex, scrollEl: HTMLElement) => {
  writeTask(() => {
    const scrollTop = scrollEl.scrollTop;
    handleToolbarBorderIntersection(ev, mainHeaderIndex, scrollTop);

    const event = ev[0];

    const intersection = event.intersectionRect;
    const intersectionArea = intersection.width * intersection.height;
    const rootArea = event.rootBounds.width * event.rootBounds.height;

    const isPageHidden = intersectionArea === 0 && rootArea === 0;
    const leftDiff = Math.abs(intersection.left - event.boundingClientRect.left);
    const rightDiff = Math.abs(intersection.right - event.boundingClientRect.right);
    const isPageTransitioning = intersectionArea > 0 && (leftDiff >= 5 || rightDiff >= 5);

    if (isPageHidden || isPageTransitioning) {
      return;
    }

    if (event.isIntersecting) {
      setHeaderActive(mainHeaderIndex, false);
      setHeaderActive(scrollHeaderIndex);
    } else {
      /**
       * There is a bug with IntersectionObserver on Safari
       * where `event.isIntersecting === false` when cancelling
       * a swipe to go back gesture. Checking the intersection
       * x, y, width, and height provides a workaround. This bug
       * does not happen when using Safari + Web Animations,
       * only Safari + CSS Animations.
       */

      const hasValidIntersection = (intersection.x === 0 && intersection.y === 0) || (intersection.width !== 0 && intersection.height !== 0);

      if (hasValidIntersection && scrollTop > 0) {
        setHeaderActive(mainHeaderIndex);
        setHeaderActive(scrollHeaderIndex, false);
        setToolbarBackgroundOpacity(mainHeaderIndex.toolbars[0]);
      }
    }
  });
};

export const setHeaderActive = (headerIndex: HeaderIndex, active = true) => {
  if (active) {
    headerIndex.el.classList.remove('header-collapse-condense-inactive');
  } else {
    headerIndex.el.classList.add('header-collapse-condense-inactive');
  }
};

export const scaleLargeTitles = (toolbars: ToolbarIndex[] = [], scale = 1, transition = false) => {
  toolbars.forEach(toolbar => {
    const ionTitle = toolbar.ionTitleEl;
    const titleDiv = toolbar.innerTitleEl;
    if (!ionTitle || ionTitle.size !== 'large') { return; }

    titleDiv.style.transition = (transition) ? TRANSITION : '';
    titleDiv.style.transform = `scale3d(${scale}, ${scale}, 1)`;
  });
};
