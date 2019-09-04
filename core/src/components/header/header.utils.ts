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
    }) || [[]]
  } as HeaderIndex;
};

export const handleContentScroll = (scrollEl: HTMLElement, mainHeaderIndex: HeaderIndex, scrollHeaderIndex: HeaderIndex, remainingHeight = 0) => {
  readTask(() => {
    const scrollTop = scrollEl.scrollTop;
    const lastMainToolbar = mainHeaderIndex.toolbars[mainHeaderIndex.toolbars.length - 1];

    const scale = clamp(1, 1 + (-scrollTop / 500), 1.1);

    const borderOpacity = clamp(0, (scrollTop - remainingHeight) / lastMainToolbar.el.clientHeight, 1);
    const maxOpacity = 1;
    const scaledOpacity = borderOpacity * maxOpacity;

    writeTask(() => {
      scaleLargeTitles(scrollHeaderIndex.toolbars, scale);
      setToolbarBackgroundOpacity(mainHeaderIndex.toolbars[0], (scaledOpacity === 1) ? undefined : scaledOpacity);
    });
  });
};

const setToolbarBackgroundOpacity = (toolbar: ToolbarIndex, opacity: number | undefined) => {
  if (opacity === undefined) {
    toolbar.background.style.removeProperty('--opacity');
  } else {
    toolbar.background.style.setProperty('--opacity', opacity.toString());
  }
};

/**
 * If toolbars are intersecting, hide the scrollable toolbar content
 * and show the primary toolbar content. If the toolbars are not intersecting,
 * hide the primary toolbar content and show the scrollable toolbar content
 */
export const handleToolbarIntersection = (ev: any, mainHeaderIndex: HeaderIndex, scrollHeaderIndex: HeaderIndex) => {
  console.log(ev);
  writeTask(() => {
    const event = ev[0];
    const intersection = event.intersectionRect;
    const intersectionArea = intersection.width * intersection.height;
    const rootArea = event.rootBounds.width * event.rootBounds.height;

    const isPageHidden = intersectionArea === 0 && rootArea === 0;
    const isPageTransitioning = intersectionArea > 0 && (intersection.left !== event.rootBounds.left || intersection.right !== event.rootBounds.right);

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

      if (hasValidIntersection) {
        setHeaderActive(mainHeaderIndex);
        setHeaderActive(scrollHeaderIndex, false);
      }
    }
  });
};

export const setHeaderActive = (headerIndex: HeaderIndex, active = true) => {
  writeTask(() => {
    if (active) {
      headerIndex.el.classList.remove('header-collapse-ios-inactive');
    } else {
      headerIndex.el.classList.add('header-collapse-ios-inactive');
    }
    setToolbarBackgroundOpacity(headerIndex.toolbars[0], (active) ? undefined : 0);
  });
};

export const scaleLargeTitles = (toolbars: ToolbarIndex[] = [], scale = 1, transition = false) => {
  toolbars.forEach(toolbar => {
    const ionTitle = toolbar.ionTitleEl;
    const titleDiv = toolbar.innerTitleEl;
    if (!ionTitle || ionTitle.size !== 'large') { return; }

    titleDiv.style.transformOrigin = 'left center';
    titleDiv.style.transition = (transition) ? TRANSITION : '';
    titleDiv.style.transform = `scale3d(${scale}, ${scale}, 1)`;
  });
};
