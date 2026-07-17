import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h, readTask, writeTask } from '@stencil/core';
import { findIonContent, getScrollElement, printIonContentErrorMsg } from '@utils/content';
import type { Attributes } from '@utils/helpers';
import { inheritAriaAttributes } from '@utils/helpers';
import { printIonWarning } from '@utils/logging';
import type { ScrollHideController } from '@utils/scroll-hide-controller';
import { createScrollHideController } from '@utils/scroll-hide-controller';
import { hostContext } from '@utils/theme';

import { config } from '../../global/config';
import { getIonTheme } from '../../global/ionic-global';

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
  private intersectionObserver?: IntersectionObserver;
  private collapsibleMainHeader?: HTMLElement;
  private inheritedAttributes: Attributes = {};
  private scrollHideCtrl?: ScrollHideController;
  private resizeObserver?: ResizeObserver;
  private contentEl?: HTMLElement;
  private isHidden = false;
  private setupHidePromise: Promise<HTMLElement> | null = null;
  private hasWarnedCollapse = false;
  private activeEffect?: string;

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
   * Only applies when the theme is `"ios"`.
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

    if (collapse !== undefined && scrollEffect === undefined && !this.hasWarnedCollapse) {
      this.hasWarnedCollapse = true;
      printIonWarning(
        `[ion-header] - The \`collapse\` property is deprecated. Use \`scrollEffect\` instead.\nExample: <ion-header scroll-effect="${collapse}">`,
        this.el
      );
    }

    const effect = scrollEffect ?? collapse;

    // Skip teardown/rebuild if the effect hasn't changed.
    // This prevents re-renders from destroying the scroll controller
    // and resetting isHidden.
    if (effect === this.activeEffect) {
      return;
    }

    const hasHide = effect === 'hide';
    const hasCondense = effect === 'condense';
    const hasFade = effect === 'fade';

    this.destroyCollapsibleHeader();
    this.activeEffect = effect;

    const appRootSelector = config.get('appRootSelector', 'ion-app');
    const pageEl = this.el.closest(`${appRootSelector}, ion-page, .ion-page, page-inner`);
    const contentEl = pageEl ? findIonContent(pageEl) : null;

    if (hasHide && contentEl) {
      await this.setupScrollEffectHide(contentEl);
      return;
    }

    // condense/fade via the deprecated `collapse` prop are iOS-only.
    // condense/fade via the new `scrollEffect` prop work in all themes.
    const isModeRestricted = scrollEffect === undefined && getIonTheme(this) !== 'ios';

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

    const promise = getScrollElement(contentEl);
    this.setupHidePromise = promise;

    const scrollEl = await promise;

    /**
     * Only assign if this is still the current promise.
     * Otherwise, a new checkCollapsibleHeader has started or
     * disconnectedCallback was called, so this setup is stale.
     */
    if (this.setupHidePromise === promise) {
      this.setupHidePromise = null;

      this.updateHideHeight();

      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => this.updateHideHeight());
        this.resizeObserver.observe(this.el);
      }

      this.scrollHideCtrl = createScrollHideController(scrollEl, (hidden) => this.setHidden(hidden));

      contentEl.classList.add('content-header-hide-scroll-partner');
    }
  };

  /**
   * Reads the header's current height and writes it as a CSS variable
   * on both the header and the sibling content. The content uses this
   * value to shift up and expand its scroll area when the header hides
   * (gap compensation).
   */
  private updateHideHeight() {
    readTask(() => {
      const headerHeightPx = this.el.offsetHeight;
      writeTask(() => {
        this.el.style.setProperty('--internal-header-hide-height', `${headerHeightPx}px`);
        if (this.contentEl) {
          this.contentEl.style.setProperty('--internal-header-hide-height', `${headerHeightPx}px`);
        }
      });
    });
  }

  private setHidden(hidden: boolean) {
    this.isHidden = hidden;
    this.el.classList.toggle('header-scroll-hidden', hidden);

    if (hidden) {
      this.el.setAttribute('inert', '');
      this.el.setAttribute('aria-hidden', 'true');
    } else {
      this.el.removeAttribute('inert');
      this.el.removeAttribute('aria-hidden');
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
    this.setupHidePromise = null;
    this.activeEffect = undefined;

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = undefined;
    }

    if (this.scrollEl && this.contentScrollCallback) {
      this.scrollEl.removeEventListener('scroll', this.contentScrollCallback);
      this.contentScrollCallback = undefined;
    }

    if (this.scrollHideCtrl) {
      this.scrollHideCtrl.destroy();
      this.scrollHideCtrl = undefined;
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
      this.contentEl.style.removeProperty('--internal-header-hide-height');
      this.contentEl = undefined;
    }

    if (this.isHidden) {
      this.el.classList.remove('header-scroll-hidden');
      this.el.removeAttribute('inert');
      this.el.removeAttribute('aria-hidden');
      this.isHidden = false;
    }
    this.el.style.removeProperty('--internal-header-hide-height');
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
    this.collapsibleMainHeader = Array.from(headers).find((header) => {
      const effect = header.scrollEffect ?? header.collapse;
      return effect !== 'condense';
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
    const { translucent, inheritedAttributes, divider, scrollEffect, collapse } = this;
    const theme = getIonTheme(this);
    const effect = scrollEffect ?? collapse;
    // condense/fade via the deprecated `collapse` prop are iOS-only.
    const isModeRestricted = scrollEffect === undefined && theme !== 'ios';
    const hasHide = effect === 'hide';
    const hasCondense = effect === 'condense' && !isModeRestricted;
    const hasFade = effect === 'fade' && !isModeRestricted;
    // A hidden condense header (deprecated collapse prop on non-iOS) should
    // not have a landmark role since it's display:none.
    const isHiddenCondense = effect === 'condense' && isModeRestricted;
    // banner role must be at top level, so remove role if inside a menu
    const roleType = isHiddenCondense ? 'none' : getRoleType(hostContext('ion-menu', this.el));

    return (
      <Host
        role={roleType}
        class={{
          [theme]: true,

          // Used internally for styling
          [`header-${theme}`]: true,

          [`header-translucent`]: this.translucent,
          ['header-collapse-condense']: hasCondense,
          ['header-collapse-condense-hidden']: isHiddenCondense,
          ['header-collapse-fade']: hasFade,
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
