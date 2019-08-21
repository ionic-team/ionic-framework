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
      setElOpacity(mainHeaderIndex.el, scaledOpacity);
    });
  });
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
      makeHeaderInactive(mainHeaderIndex, true, true);
      makeHeaderActive(scrollHeaderIndex, false);
    } else {
      makeHeaderActive(mainHeaderIndex, true, true);
      makeHeaderInactive(scrollHeaderIndex, true);
    }
  });
};

export const makeHeaderInactive = (headerIndex: any, transition = false, isMainHeader = false) => {
  headerIndex.el.classList.add('no-translucent');

  if (headerIndex.toolbars.length === 0) {
    return;
  }

  headerIndex.toolbars.forEach((toolbar: any) => {
    const ionTitleEl = toolbar.ionTitleEl;
    if (!ionTitleEl) { return; }

    setElOpacity(ionTitleEl, 0, transition);
    hideCollapsableButtons(toolbar.ionButtonsEl, transition);

    if (ionTitleEl.size === 'large') {
      ionTitleEl.classList.add('large-ion-title-hidden');
    }
    
    if (isMainHeader) {
      ionTitleEl.classList.add('collapse-header-title-hidden');
    }
  });
};

export const makeHeaderActive = (headerIndex: any, transition = false, isMainHeader = false) => {
  if (headerIndex.toolbars.length === 0) {
    return;
  }

  headerIndex.toolbars.forEach((toolbar: any) => {
    const ionTitleEl = toolbar.ionTitleEl;
    if (!ionTitleEl) { return; }

    setElOpacity(ionTitleEl, 1, transition);
    showCollapsableButtons(toolbar.ionButtonsEl, transition);
    
    if (ionTitleEl.size === 'large') {
      ionTitleEl.classList.remove('large-ion-title-hidden');
    }
    
    if (isMainHeader) {
      ionTitleEl.classList.remove('collapse-header-title-hidden');
    }
  });

  headerIndex.el.classList.remove('no-translucent');
};

export const setElOpacity = (el: HTMLElement, opacity = 1, transition = false) => {
  el.style.transition = (transition) ? TRANSITION : '';
  el.style.opacity = `${opacity}`;
};

export const hideCollapsableButtons = (buttons: any[] = [], transition = false) => {
  buttons.forEach((button: any) => {
    if (!button.collapse) { return; }

    button.classList.remove('ion-buttons-collapsed');
    setElOpacity(button, 0, transition);
  });
};

const showCollapsableButtons = (buttons: any[] = [], transition = false) => {
  buttons.forEach((button: any) => {
    if (!button.collapse) { return; }
    
    button.classList.add('ion-buttons-collapsed');
    setElOpacity(button, 1, transition);
  });
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
