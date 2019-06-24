import { readTask, writeTask } from '@stencil/core';

const TRANSITION = 'all 0.2s ease-in-out';

export const setToolbarBorderColor = (toolbar: any, color: string) => {
  if (!toolbar) { return; }

  writeTask(() => {
    toolbar.el.style.setProperty('--border-color', color);
  });
};

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
        innerTitleEl: (ionTitleEl) ? ionTitleEl.shadowRoot!.querySelector('.toolbar-title') : null
      };
    })
  };
};

export const handleContentScroll = (scrollEl: any, mainHeaderIndex: any, scrollHeaderIndex: any, remainingHeight = 0) => {
  readTask(() => {
    const scrollTop = scrollEl.scrollTop;
    const lastMainToolbar = mainHeaderIndex.toolbars[mainHeaderIndex.toolbars.length - 1];

    if (scrollTop === 0) {
      setToolbarBorderColor(lastMainToolbar, `rgba(0, 0, 0, 0)`);
      return;
    }

    const scale = 1 + (-scrollTop / 1000);
    if (scale <= 1.1) {
      writeTask(() => {
        scaleLargeTitles(scrollHeaderIndex.toolbars);
      });
    }

    const borderOpacity = (scrollTop - remainingHeight) / lastMainToolbar.el.clientHeight;

    if (borderOpacity >= 0 && borderOpacity <= 1) {

      const maxOpacity = 0.2;
      const scaledOpacity = borderOpacity * maxOpacity;

      writeTask(() => {
        setToolbarBorderColor(lastMainToolbar, `rgba(0, 0, 0, ${scaledOpacity})`);
      });
    }
  });
};

/**
 * If toolbars are intersecting, hide the scrollable toolbar content
 * and show the primary toolbar content. If the toolbars are not intersecting,
 * hide the primary toolbar content and show the scrollable toolbar content
 */
export const handleToolbarIntersection = (ev: any, mainHeaderIndex: any, scrollHeaderIndex: any) => {
  writeTask(() => {

    const mainHeaderToolbars = mainHeaderIndex.toolbars;
    const lastMainHeaderToolbar = mainHeaderToolbars[mainHeaderToolbars.length - 1];

    if (ev[0].isIntersecting) {
      makeHeaderInactive(mainHeaderIndex.el, true);
      makeHeaderActive(scrollHeaderIndex.el, true);
      setToolbarBorderColor(lastMainHeaderToolbar, 'rgba(0, 0, 0, 0)');
    } else {
      makeHeaderActive(mainHeaderIndex.el, true);
      makeHeaderInactive(scrollHeaderIndex.el, true);
      setToolbarBorderColor(lastMainHeaderToolbar, 'rgba(0, 0, 0, 0.2)');
    }
  });
};

export const makeHeaderInactive = (header: any, transition = false) => {
  const headerTitle = header.querySelector('ion-title');
  if (!headerTitle) { return; }

  setElOpacity(headerTitle, 0, transition);

  const headerButtons = Array.from(header.querySelectorAll('ion-buttons'));
  if (headerButtons.length === 0) { return; }

  hideCollapsableButtons(headerButtons, transition);
};

export const makeHeaderActive = (header: any, transition = false) => {
  const headerTitle = header.querySelector('ion-title');
  if (!headerTitle) { return; }

  setElOpacity(headerTitle, 1, transition);

  const headerButtons = Array.from(header.querySelectorAll('ion-buttons'));
  if (headerButtons.length === 0) { return; }

  showCollapsableButtons(headerButtons, transition);
};

export const setElOpacity = (el: HTMLElement, opacity = 1, transition = false) => {
  el.style.transition = (transition) ? TRANSITION : '';
  el.style.opacity = opacity.toString();
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
