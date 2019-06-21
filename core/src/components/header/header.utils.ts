import { writeTask } from '@stencil/core';

const TRANSITION = 'all 0.2s ease-in-out';
const MAX_TRANSLATE = 500;
const COLLAPSE_THRESHOLD = 0.25;

export const toolbarsFullyCollapsed = (toolbars: any[] = []): boolean => {
  return hasToolbarCollapsed(toolbars[1]);
};

export const translateEl = (el: HTMLElement, translateY = 0, transition = false) => {
  requestAnimationFrame(() => {
    writeTask(() => {
      el.style.transition = (transition) ? TRANSITION : '';
      el.style.transform = `translate3d(0, ${translateY}px, 0)`;
    });
  });
};

export const hasToolbarCollapsed = (toolbar: any): boolean => {
  return toolbar.position.y <= -1;
};

const isToolbarWithinThreshold = (toolbar: any, value: number, threshold: number): boolean => {
  const position = toolbar.position.y;

  return Math.abs(position - value) <= threshold;
};

export const setElOpacity = (el: HTMLElement, opacity = 1, transition = false) => {
  el.style.transition = (transition) ? TRANSITION : '';
  el.style.opacity = opacity.toString();
};

export const resetToolbars = (toolbars: any[] = [], transition = false) => {
  toolbars.forEach(toolbar => {
    translateEl(toolbar.el, 0, transition);
    toolbar.position.y = 0;
  });

  scaleLargeTitles(toolbars, 1, true);
};

export const handleToolbarCollapse = (toolbars: any[] = [], deltaY: number) => {
  let amountAlreadyMoved = 0;

  for (let i = toolbars.length - 1; i > 0; i--) {
    const toolbar = toolbars[i];
    const toolbarHeight = toolbar.dimensions.height;

    /**
     * When deltaY < 0, toolbars should be
     * stacking/unstacking. If this is the
     * case, then we need to keep track of the
     * amount already translated since translations
     * are relative to the position of each toolbar.
     */
    const translate = deltaY + amountAlreadyMoved;

    translateEl(toolbar.el, translate);

    toolbar.position.y = translate / (toolbarHeight);

    toggleToolbarButtonsIfNecessary(toolbar);

    /**
     * If this current toolbar has not fully
     * collapsed, we do not want to collapse
     * any other toolbars until this one
     * has been completed.
     */
    if (!hasToolbarCollapsed(toolbar)) { break; }

    amountAlreadyMoved += toolbarHeight;
  }

  toggleTitlesIfNecessary(toolbars);
};

const toggleToolbarButtonsIfNecessary = (toolbar: any) => {
  if (isToolbarWithinThreshold(toolbar, -1, COLLAPSE_THRESHOLD)) {
    hideCollapsableButtons(toolbar.ionButtonsEl, true);
  } else {
    showCollapsableButtons(toolbar.ionButtonsEl, true);
  }
};

export const hideCollapsableButtons = (buttons: any[] = [], transition = false) => {
  buttons.forEach((button: any) => {
    if (!button.collapse) { return; }

    setElOpacity(button, 0, transition);
  });
};

const showCollapsableButtons = (buttons: any[] = [], transition = false) => {
  buttons.forEach((button: any) => {
    if (!button.collapse) { return; }

    setElOpacity(button, 1, transition);
  });
};

export const handleToolbarPullDown = (toolbars: any[] = [], deltaY: number) => {
  for (let i = toolbars.length - 1; i > 0; i--) {
    const toolbar = toolbars[i];
    const translate = deltaY;

    translateEl(toolbar.el, translate);

    toolbar.position.y = translate / toolbar.dimensions.height;

    toggleToolbarButtonsIfNecessary(toolbar);
  }

  toggleTitlesIfNecessary(toolbars);

  const titleScale = 1 + (deltaY / MAX_TRANSLATE);
  if (titleScale > 1.1) { return; }

  scaleLargeTitles(toolbars, titleScale);
};

const scaleLargeTitles = (toolbars: any[] = [], scale = 1, transition = false) => {
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

export const setElementFixedHeights = (els: any[] = []) => {
  els.forEach(el => {
    el.style.height = `${el.clientHeight}px`;
  });
};

export const resetElementFixedHeights = (els: any[] = []) => {
  els.forEach(el => {
    el.style.height = '';
  });
};

const toggleTitlesIfNecessary = (toolbars: any[] = []) => {
  /**
   * The first collapsable header
   * typically has a large ion-title in it.
   * We want to hide that title and show
   * the title in the main non-collapsable
   * header when the first collapsable header
   * is almost collapsed.
   */

  const collapsableTitle = toolbars[1].ionTitleEl;
  const primaryTitle = toolbars[0].ionTitleEl;

  if (isToolbarWithinThreshold(toolbars[1], -1, COLLAPSE_THRESHOLD)) {
    setElOpacity(collapsableTitle, 0, true);
    setElOpacity(primaryTitle, 1, true);
    showCollapsableButtons(toolbars[0].ionButtonsEl, true);
  } else {
    setElOpacity(collapsableTitle, 1, true);
    setElOpacity(primaryTitle, 0, true);
    hideCollapsableButtons(toolbars[0].ionButtonsEl, true);
  }
};
