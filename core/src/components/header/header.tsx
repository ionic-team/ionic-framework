import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h, readTask, writeTask } from '@stencil/core';
import { ION_PAGE_ELEMENT_SELECTOR, findIonContent, getScrollElement, printIonContentErrorMsg } from '@utils/content';
import type { Attributes } from '@utils/helpers';
import { inheritAriaAttributes } from '@utils/helpers';
import { printIonWarning } from '@utils/logging';
import { hostContext } from '@utils/theme';

import { getIonMode, getIonTheme } from '../../global/ionic-global';

import type { HeaderScrollEffect } from './header-interface';
import {
  cloneElement,
  createHeaderIndex,
  handleContentScroll,
  handleHeaderFade,
  handleToolbarIntersection,
  setHeaderActive,
  setToolbarBackgroundOpacity,
  getRoleType,
} from './header.utils';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-header',
  styleUrls: {
    ios: 'header.ios.scss',
    md: 'header.md.scss',
    ionic: 'header.ionic.scss',
  },
})
export class Header implements ComponentInterface {
  private scrollEl?: HTMLElement;
  private contentScrollCallback?: () => void;
  private contentWheelCallback?: EventListener;
  private intersectionObserver?: IntersectionObserver;
  private collapsibleMainHeader?: HTMLElement;
  private inheritedAttributes: Attributes = {};
  private resizeObserver?: ResizeObserver;
  private contentEl?: HTMLElement;

  // scrollEffect="hide" scroll tracking state
  private scrollHidden = false;
  private previousScrollTop = 0;
  private scrollTopAtDirectionChange = 0;
  private lastWheelEventTime = 0;
  private suppressShowUntil = 0;

  private readonly TOP_VISIBLE_THRESHOLD = 80;
  private readonly SCROLL_HIDE_THRESHOLD = 60;
  private readonly WHEEL_SUPPRESS_DURATION_MS = 80;

  @Element() el!: HTMLElement;

  /**
   * Describes the scroll effect that will be applied to the header.
   * `"hide"` slides the header out of view when scrolling down and back in
   * when scrolling up.
   * `"condense"` collapses the large title into the main toolbar on scroll.
   * `"fade"` fades the toolbar background on scroll.
   */
  @Prop() scrollEffect?: HeaderScrollEffect;

  /**
   * Describes the scroll effect that will be applied to the header.
   * Only applies when the mode is `"ios"`.
   *
   * Typically used for [Collapsible Large Titles](https://ionicframework.com/docs/api/title#collapsible-large-titles)
   *
   * @deprecated Use `scrollEffect` instead.
   */
  @Prop() collapse?: 'condense' | 'fade';

  /**
   * If `true`, the header will have a line at the bottom.
   * TODO(ROU-10855): add support for this prop on ios/md themes
   */
  @Prop() divider = false;

  /**
   * If `true`, the header will be translucent.
   * Only applies when the theme is `"ios"` or `"ionic"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   *
   * Note: In order to scroll content behind the header, the `fullscreen`
   * attribute needs to be set on the content.
   */
  @Prop() translucent = false;

  componentWillLoad() {
    this.inheritedAttributes = inheritAriaAttributes(this.el);
  }

  componentDidLoad() {
    this.checkCollapsibleHeader();
  }

  componentDidUpdate() {
    this.checkCollapsibleHeader();
  }

  disconnectedCallback() {
    this.destroyCollapsibleHeader();
  }

  private async checkCollapsibleHeader() {
    const { scrollEffect, collapse } = this;

    if (collapse !== undefined && scrollEffect === undefined) {
      printIonWarning(
        `The \`collapse\` property on \`ion-header\` is deprecated. Use \`scrollEffect\` instead.\nExample: <ion-header scroll-effect="${collapse}">`
      );
    }

    const hasHide = (scrollEffect ?? collapse) === 'hide';
    const hasCondense = (scrollEffect ?? collapse) === 'condense';
    const hasFade = (scrollEffect ?? collapse) === 'fade';

    this.destroyCollapsibleHeader();

    const pageEl = this.el.closest(ION_PAGE_ELEMENT_SELECTOR);
    const contentEl = pageEl ? findIonContent(pageEl) : null;

    if (hasHide && contentEl) {
      await this.setupScrollEffectHide(contentEl);
      return;
    }

    // condense/fade via the deprecated `collapse` prop are iOS-only.
    // condense/fade via the new `scrollEffect` prop work in all modes.
    const isModeRestricted = scrollEffect === undefined && getIonMode(this) !== 'ios';

    if (hasCondense && !isModeRestricted) {
      // Cloned elements are always needed in iOS transition
      writeTask(() => {
        const title = cloneElement('ion-title') as HTMLIonTitleElement;
        title.size = 'large';
        cloneElement('ion-back-button');
      });

      await this.setupCondenseHeader(contentEl, pageEl);
    } else if (hasFade && !isModeRestricted) {
      if (!contentEl) {
        printIonContentErrorMsg(this.el);
        return;
      }

      const condenseHeader = contentEl.querySelector(
        'ion-header[collapse="condense"],ion-header[scroll-effect="condense"]'
      ) as HTMLElement | null;

      await this.setupFadeHeader(contentEl, condenseHeader);
    }
  }

  private setupScrollEffectHide = async (contentEl: HTMLElement) => {
    this.contentEl = contentEl;
    const scrollEl = (this.scrollEl = await getScrollElement(contentEl));

    this.updateHideSlideY();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.updateHideSlideY());
      this.resizeObserver.observe(this.el);
    }

    this.contentScrollCallback = () => this.handleScrollEffectHide();
    scrollEl.addEventListener('scroll', this.contentScrollCallback, { passive: true });

    this.contentWheelCallback = (ev: Event) => this.handleWheelEffectHide(ev as WheelEvent);
    scrollEl.addEventListener('wheel', this.contentWheelCallback, { passive: true });

    contentEl.classList.add('content-header-hide-scroll-partner');
  };

  private updateHideSlideY() {
    readTask(() => {
      const headerHeightPx = this.el.offsetHeight;
      writeTask(() => {
        this.el.style.setProperty('--internal-header-hide-slide-y', `${headerHeightPx}px`);
        if (this.contentEl) {
          this.contentEl.style.setProperty('--internal-header-hide-slide-y', `${headerHeightPx}px`);
        }
      });
    });
  }

  private handleWheelEffectHide = (ev: WheelEvent) => {
    this.lastWheelEventTime = Date.now();

    readTask(() => {
      const currentScrollTop = this.scrollEl!.scrollTop;

      if (currentScrollTop <= this.TOP_VISIBLE_THRESHOLD) {
        if (this.scrollHidden) {
          writeTask(() => this.setHidden(false));
        }
        return;
      }

      if (ev.deltaY < 0) {
        this.scrollTopAtDirectionChange = currentScrollTop;
        if (this.scrollHidden) {
          writeTask(() => this.setHidden(false));
        }
      } else if (ev.deltaY > 0) {
        const scrolledSinceDirectionChange = currentScrollTop - this.scrollTopAtDirectionChange;
        if (scrolledSinceDirectionChange >= this.SCROLL_HIDE_THRESHOLD && !this.scrollHidden) {
          writeTask(() => this.setHidden(true));
        }
      }
    });
  };

  private handleScrollEffectHide = () => {
    // Suppress scroll events shortly after a wheel event — delta already processed via wheel
    if (Date.now() - this.lastWheelEventTime < this.WHEEL_SUPPRESS_DURATION_MS) {
      return;
    }

    readTask(() => {
      const currentScrollTop = this.scrollEl!.scrollTop;

      if (currentScrollTop <= this.TOP_VISIBLE_THRESHOLD) {
        if (this.scrollHidden) {
          writeTask(() => this.setHidden(false));
        }
        this.previousScrollTop = currentScrollTop;
        return;
      }

      const isScrollingDown = currentScrollTop > this.previousScrollTop;
      const wasScrollingDown = this.previousScrollTop > this.scrollTopAtDirectionChange;

      if (isScrollingDown !== wasScrollingDown) {
        this.scrollTopAtDirectionChange = this.previousScrollTop;
      }

      const scrolledSinceDirectionChange = Math.abs(currentScrollTop - this.scrollTopAtDirectionChange);
      const requiredScrollDistance = isScrollingDown ? this.SCROLL_HIDE_THRESHOLD : 0;
      this.previousScrollTop = currentScrollTop;

      if (scrolledSinceDirectionChange < requiredScrollDistance) {
        return;
      }

      const shouldHide = isScrollingDown;
      if (shouldHide !== this.scrollHidden) {
        // After hiding, the content height increases (CSS transition), which lowers
        // max scrollTop and triggers a spurious upward-scroll event. Suppress "show"
        // actions briefly to absorb that adjustment.
        if (!shouldHide && Date.now() < this.suppressShowUntil) {
          return;
        }
        writeTask(() => this.setHidden(shouldHide));
      }
    });
  };

  private setHidden(hidden: boolean) {
    this.scrollHidden = hidden;
    this.el.classList.toggle('header-scroll-hidden', hidden);

    if (hidden) {
      this.el.setAttribute('inert', '');
      this.el.setAttribute('aria-hidden', 'true');
      // Suppress "show" events for slightly longer than the content height/transform
      // transition (300ms) to prevent the scrollTop adjustment from immediately
      // re-showing the header.
      this.suppressShowUntil = Date.now() + 400;
    } else {
      this.el.removeAttribute('inert');
      this.el.removeAttribute('aria-hidden');
      this.suppressShowUntil = 0;
    }

    if (this.contentEl) {
      this.contentEl.classList.toggle('content-header-hide-scroll-hidden', hidden);
    }
  }

  private setupFadeHeader = async (contentEl: HTMLElement, condenseHeader: HTMLElement | null) => {
    const scrollEl = (this.scrollEl = await getScrollElement(contentEl));

    /**
     * Handle fading of toolbars on scroll
     */
    this.contentScrollCallback = () => {
      handleHeaderFade(this.scrollEl!, this.el, condenseHeader);
    };
    scrollEl!.addEventListener('scroll', this.contentScrollCallback);

    handleHeaderFade(this.scrollEl!, this.el, condenseHeader);
  };

  private destroyCollapsibleHeader() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = undefined;
    }

    if (this.scrollEl && this.contentScrollCallback) {
      this.scrollEl.removeEventListener('scroll', this.contentScrollCallback);
      this.contentScrollCallback = undefined;
    }

    if (this.scrollEl && this.contentWheelCallback) {
      this.scrollEl.removeEventListener('wheel', this.contentWheelCallback);
      this.contentWheelCallback = undefined;
    }

    if (this.collapsibleMainHeader) {
      this.collapsibleMainHeader.classList.remove('header-collapse-main');
      this.collapsibleMainHeader = undefined;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }

    if (this.contentEl) {
      this.contentEl.classList.remove('content-header-hide-scroll-partner', 'content-header-hide-scroll-hidden');
      this.contentEl.style.removeProperty('--internal-header-hide-slide-y');
      this.contentEl = undefined;
    }

    if (this.scrollHidden) {
      this.el.classList.remove('header-scroll-hidden');
      this.el.removeAttribute('inert');
      this.el.removeAttribute('aria-hidden');
      this.scrollHidden = false;
    }
    this.el.style.removeProperty('--internal-header-hide-slide-y');
    this.previousScrollTop = 0;
    this.scrollTopAtDirectionChange = 0;
    this.lastWheelEventTime = 0;
    this.suppressShowUntil = 0;
  }

  private async setupCondenseHeader(contentEl: HTMLElement | null, pageEl: Element | null) {
    if (!contentEl || !pageEl) {
      printIonContentErrorMsg(this.el);
      return;
    }
    if (typeof (IntersectionObserver as any) === 'undefined') {
      return;
    }

    this.scrollEl = await getScrollElement(contentEl);

    const headers = pageEl.querySelectorAll('ion-header');
    this.collapsibleMainHeader = Array.from(headers).find((header: HTMLIonHeaderElement) => {
      const scrollEffect = (header as HTMLIonHeaderElement & { scrollEffect?: string }).scrollEffect;
      return header.collapse !== 'condense' && scrollEffect !== 'condense';
    }) as HTMLElement | undefined;

    if (!this.collapsibleMainHeader) {
      return;
    }

    const mainHeaderIndex = createHeaderIndex(this.collapsibleMainHeader);
    const scrollHeaderIndex = createHeaderIndex(this.el);

    if (!mainHeaderIndex || !scrollHeaderIndex) {
      return;
    }

    setHeaderActive(mainHeaderIndex, false);
    setToolbarBackgroundOpacity(mainHeaderIndex.el, 0);

    /**
     * Handle interaction between toolbar collapse and
     * showing/hiding content in the primary ion-header
     * as well as progressively showing/hiding the main header
     * border as the top-most toolbar collapses or expands.
     */
    const toolbarIntersection = (ev: IntersectionObserverEntry[]) => {
      handleToolbarIntersection(ev, mainHeaderIndex, scrollHeaderIndex, this.scrollEl!);
    };

    this.intersectionObserver = new IntersectionObserver(toolbarIntersection, {
      root: contentEl,
      threshold: [0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    });
    this.intersectionObserver.observe(scrollHeaderIndex.toolbars[scrollHeaderIndex.toolbars.length - 1].el);

    /**
     * Handle scaling of large iOS titles and
     * showing/hiding border on last toolbar
     * in primary header
     */
    this.contentScrollCallback = () => {
      handleContentScroll(this.scrollEl!, scrollHeaderIndex, contentEl);
    };
    this.scrollEl!.addEventListener('scroll', this.contentScrollCallback);

    writeTask(() => {
      if (this.collapsibleMainHeader !== undefined) {
        this.collapsibleMainHeader.classList.add('header-collapse-main');
      }
    });
  }

  render() {
    const { translucent, inheritedAttributes, divider } = this;
    const theme = getIonTheme(this);
    const hasHide = (this.scrollEffect ?? this.collapse) === 'hide';
    const hasCondense = (this.scrollEffect ?? this.collapse) === 'condense';
    const hasFade = (this.scrollEffect ?? this.collapse) === 'fade';
    // Use 'none' as fallback for collapse-based class (only for non-hide effects)
    let collapseClass = 'none';
    if (hasCondense) collapseClass = 'condense';
    else if (hasFade) collapseClass = 'fade';

    // banner role must be at top level, so remove role if inside a menu
    const roleType = getRoleType(hostContext('ion-menu', this.el), hasCondense, theme);

    return (
      <Host
        role={roleType}
        class={{
          [theme]: true,

          // Used internally for styling
          [`header-${theme}`]: true,

          [`header-translucent`]: this.translucent,
          [`header-collapse-${collapseClass}`]: true,
          [`header-translucent-${theme}`]: this.translucent,
          ['header-divider']: divider,
          'header-scroll-effect-hide': hasHide,
        }}
        {...inheritedAttributes}
      >
        {theme !== 'md' && translucent && <div class="header-background"></div>}
        <slot></slot>
      </Host>
    );
  }
}
