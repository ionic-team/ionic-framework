import { config } from '@global/config';
import { printIonWarning } from '@utils/logging';

/**
 * Moves focus to a specified element. Note that we do not remove the tabindex
 * because that can result in an unintentional blur. Non-focusables can't be
 * focused, so the body will get focused again.
 */
const moveFocus = (el: HTMLElement) => {
  el.tabIndex = -1;
  el.focus();
};

/**
 * Elements that are hidden using `display: none` should not be focused even if
 * they are present in the DOM.
 */
const isVisible = (el: HTMLElement) => {
  return el.offsetParent !== null;
};

/**
 * The focus controller allows us to manage focus within a view so assistive
 * technologies can inform users of changes to the navigation state. Traditional
 * native apps have a way of informing assistive technology about a navigation
 * state change. Mobile browsers have this too, but only when doing a full page
 * load. In a single page app we do not do that, so we need to build this
 * integration ourselves.
 */
export const createFocusController = (): FocusController => {
  const saveViewFocus = (referenceEl?: HTMLElement) => {
    const focusManagerEnabled = config.get('focusManagerPriority', false);

    /**
     * When going back to a previously visited page focus should typically be moved
     * back to the element that was last focused when the user was on this view.
     */
    if (focusManagerEnabled) {
      const activeEl = document.activeElement;
      if (activeEl !== null && referenceEl?.contains(activeEl)) {
        activeEl.setAttribute(LAST_FOCUS, 'true');
      }
    }
  };

  const setViewFocus = (referenceEl: HTMLElement) => {
    const focusManagerPriorities = config.get('focusManagerPriority', false);
    /**
     * If the focused element is a descendant of the referenceEl then it's possible
     * that the app developer manually moved focus, so we do not want to override that.
     * This can happen with inputs the are focused when a view transitions in.
     */
    if (Array.isArray(focusManagerPriorities) && !referenceEl.contains(document.activeElement)) {
      /**
       * When going back to a previously visited view focus should always be moved back
       * to the element that the user was last focused on when they were on this view.
       */
      const lastFocus = referenceEl.querySelector<HTMLElement>(`[${LAST_FOCUS}]`);
      if (lastFocus && isVisible(lastFocus)) {
        moveFocus(lastFocus);
        return;
      }

      for (const priority of focusManagerPriorities) {
        /**
         * For each recognized case (excluding the default case) make sure to return
         * so that the fallback focus behavior does not run.
         *
         * We intentionally query for specific roles/semantic elements so that the
         * transition manager can work with both Ionic and non-Ionic UI components.
         *
         * If new selectors are added, be sure to remove the outline ring by adding
         * new selectors to rule in core.scss.
         */
        switch (priority) {
          case 'content':
            const content = referenceEl.querySelector<HTMLElement>('main, [role="main"]');
            if (content && isVisible(content)) {
              moveFocus(content);
              return;
            }
            break;
          case 'heading':
            const headingOne = referenceEl.querySelector<HTMLElement>('h1, [role="heading"][aria-level="1"]');
            if (headingOne && isVisible(headingOne)) {
              moveFocus(headingOne);
              return;
            }
            break;
          case 'banner':
            const header = referenceEl.querySelector<HTMLElement>('header, [role="banner"]');
            if (header && isVisible(header)) {
              moveFocus(header);
              return;
            }
            break;
          default:
            printIonWarning(`Unrecognized focus manager priority value ${priority}`);
            break;
        }
      }

      /**
       * If there is nothing to focus then focus the page so focus at least moves to
       * the correct view. The browser will then determine where within the page to
       * move focus to.
       */
      moveFocus(referenceEl);
    }
  };

  return {
    saveViewFocus,
    setViewFocus,
  };
};

export type FocusController = {
  saveViewFocus: (referenceEl?: HTMLElement) => void;
  setViewFocus: (referenceEl: HTMLElement) => void;
};

const LAST_FOCUS = 'ion-last-focus';
