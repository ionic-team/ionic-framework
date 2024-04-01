import {
  readTask,
  writeTask,
} from '@stencil/core';
import { clamp } from '@utils/helpers';

const TRANSITION =
  'all 0.2s ease-in-out';

interface HeaderIndex {
  el: HTMLIonHeaderElement;
  toolbars: ToolbarIndex[] | [];
}

interface ToolbarIndex {
  el: HTMLElement;
  background: HTMLElement;
  ionTitleEl:
    | HTMLIonTitleElement
    | undefined;
  innerTitleEl: HTMLElement;
  ionButtonsEl: HTMLElement[] | [];
}

export const cloneElement = (
  tagName: string
) => {
  const getCachedEl =
    document.querySelector(
      `${tagName}.ion-cloned-element`
    );
  if (getCachedEl !== null) {
    return getCachedEl;
  }

  const clonedEl =
    document.createElement(tagName);
  clonedEl.classList.add(
    'ion-cloned-element'
  );
  clonedEl.style.setProperty(
    'display',
    'none'
  );
  document.body.appendChild(clonedEl);

  return clonedEl;
};

export const createHeaderIndex = (
  headerEl: HTMLElement | undefined
): HeaderIndex | undefined => {
  if (!headerEl) {
    return;
  }

  const toolbars =
    headerEl.querySelectorAll(
      'ion-toolbar'
    );

  return {
    el: headerEl,
    toolbars: Array.from(toolbars).map(
      (
        toolbar: HTMLIonToolbarElement
      ) => {
        const ionTitleEl =
          toolbar.querySelector(
            'ion-title'
          );
        return {
          el: toolbar,
          background:
            toolbar.shadowRoot!.querySelector(
              '.toolbar-background'
            ),
          ionTitleEl,
          innerTitleEl: ionTitleEl
            ? ionTitleEl.shadowRoot!.querySelector(
                '.toolbar-title'
              )
            : null,
          ionButtonsEl: Array.from(
            toolbar.querySelectorAll(
              'ion-buttons'
            )
          ),
        } as ToolbarIndex;
      }
    ),
  } as HeaderIndex;
};

export const handleContentScroll = (
  scrollEl: HTMLElement,
  scrollHeaderIndex: HeaderIndex,
  contentEl: HTMLElement
) => {
  readTask(() => {
    const scrollTop =
      scrollEl.scrollTop;
    const scale = clamp(
      1,
      1 + -scrollTop / 500,
      1.1
    );

    // Native refresher should not cause titles to scale
    const nativeRefresher =
      contentEl.querySelector(
        'ion-refresher.refresher-native'
      );
    if (nativeRefresher === null) {
      writeTask(() => {
        scaleLargeTitles(
          scrollHeaderIndex.toolbars,
          scale
        );
      });
    }
  });
};

export const setToolbarBackgroundOpacity =
  (
    headerEl: HTMLIonHeaderElement,
    opacity?: number
  ) => {
    /**
     * Fading in the backdrop opacity
     * should happen after the large title
     * has collapsed, so it is handled
     * by handleHeaderFade()
     */
    if (headerEl.collapse === 'fade') {
      return;
    }

    if (opacity === undefined) {
      headerEl.style.removeProperty(
        '--opacity-scale'
      );
    } else {
      headerEl.style.setProperty(
        '--opacity-scale',
        opacity.toString()
      );
    }
  };

const handleToolbarBorderIntersection =
  (
    ev: IntersectionObserverEntry[],
    mainHeaderIndex: HeaderIndex,
    scrollTop: number
  ) => {
    if (!ev[0].isIntersecting) {
      return;
    }

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
    const scale =
      ev[0].intersectionRatio > 0.9 ||
      scrollTop <= 0
        ? 0
        : ((1 -
            ev[0].intersectionRatio) *
            100) /
          75;

    setToolbarBackgroundOpacity(
      mainHeaderIndex.el,
      scale === 1 ? undefined : scale
    );
  };

/**
 * If toolbars are intersecting, hide the scrollable toolbar content
 * and show the primary toolbar content. If the toolbars are not intersecting,
 * hide the primary toolbar content and show the scrollable toolbar content
 */
export const handleToolbarIntersection =
  (
    ev: any, // TODO(FW-2832): type (IntersectionObserverEntry[] triggers errors which should be sorted)
    mainHeaderIndex: HeaderIndex,
    scrollHeaderIndex: HeaderIndex,
    scrollEl: HTMLElement
  ) => {
    writeTask(() => {
      const scrollTop =
        scrollEl.scrollTop;
      handleToolbarBorderIntersection(
        ev,
        mainHeaderIndex,
        scrollTop
      );

      const event = ev[0];

      const intersection =
        event.intersectionRect;
      const intersectionArea =
        intersection.width *
        intersection.height;
      const rootArea =
        event.rootBounds.width *
        event.rootBounds.height;

      const isPageHidden =
        intersectionArea === 0 &&
        rootArea === 0;
      const leftDiff = Math.abs(
        intersection.left -
          event.boundingClientRect.left
      );
      const rightDiff = Math.abs(
        intersection.right -
          event.boundingClientRect.right
      );
      const isPageTransitioning =
        intersectionArea > 0 &&
        (leftDiff >= 5 ||
          rightDiff >= 5);

      if (
        isPageHidden ||
        isPageTransitioning
      ) {
        return;
      }

      if (event.isIntersecting) {
        setHeaderActive(
          mainHeaderIndex,
          false
        );
        setHeaderActive(
          scrollHeaderIndex
        );
      } else {
        /**
         * There is a bug with IntersectionObserver on Safari
         * where `event.isIntersecting === false` when cancelling
         * a swipe to go back gesture. Checking the intersection
         * x, y, width, and height provides a workaround. This bug
         * does not happen when using Safari + Web Animations,
         * only Safari + CSS Animations.
         */

        const hasValidIntersection =
          (intersection.x === 0 &&
            intersection.y === 0) ||
          (intersection.width !== 0 &&
            intersection.height !== 0);

        if (
          hasValidIntersection &&
          scrollTop > 0
        ) {
          setHeaderActive(
            mainHeaderIndex
          );
          setHeaderActive(
            scrollHeaderIndex,
            false
          );
          setToolbarBackgroundOpacity(
            mainHeaderIndex.el
          );
        }
      }
    });
  };

export const setHeaderActive = (
  headerIndex: HeaderIndex,
  active = true
) => {
  const headerEl = headerIndex.el;

  if (active) {
    headerEl.classList.remove(
      'header-collapse-condense-inactive'
    );
    headerEl.removeAttribute(
      'aria-hidden'
    );
  } else {
    headerEl.classList.add(
      'header-collapse-condense-inactive'
    );
    headerEl.setAttribute(
      'aria-hidden',
      'true'
    );
  }
};

export const scaleLargeTitles = (
  toolbars: ToolbarIndex[] = [],
  scale = 1,
  transition = false
) => {
  toolbars.forEach((toolbar) => {
    const ionTitle = toolbar.ionTitleEl;
    const titleDiv =
      toolbar.innerTitleEl;
    if (
      !ionTitle ||
      ionTitle.size !== 'large'
    ) {
      return;
    }

    titleDiv.style.transition =
      transition ? TRANSITION : '';
    titleDiv.style.transform = `scale3d(${scale}, ${scale}, 1)`;
  });
};

export const handleHeaderFade = (
  scrollEl: HTMLElement,
  baseEl: HTMLElement,
  condenseHeader: HTMLElement | null
) => {
  readTask(() => {
    const scrollTop =
      scrollEl.scrollTop;
    const baseElHeight =
      baseEl.clientHeight;
    const fadeStart = condenseHeader
      ? condenseHeader.clientHeight
      : 0;

    /**
     * If we are using fade header with a condense
     * header, then the toolbar backgrounds should
     * not begin to fade in until the condense
     * header has fully collapsed.
     *
     * Additionally, the main content should not
     * overflow out of the container until the
     * condense header has fully collapsed. When
     * using just the condense header the content
     * should overflow out of the container.
     */
    if (
      condenseHeader !== null &&
      scrollTop < fadeStart
    ) {
      baseEl.style.setProperty(
        '--opacity-scale',
        '0'
      );
      scrollEl.style.setProperty(
        'clip-path',
        `inset(${baseElHeight}px 0px 0px 0px)`
      );
      return;
    }

    const distanceToStart =
      scrollTop - fadeStart;
    const fadeDuration = 10;
    const scale = clamp(
      0,
      distanceToStart / fadeDuration,
      1
    );
    writeTask(() => {
      scrollEl.style.removeProperty(
        'clip-path'
      );
      baseEl.style.setProperty(
        '--opacity-scale',
        scale.toString()
      );
    });
  });
};
