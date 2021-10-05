import { Component, ComponentInterface, Element, Host, Prop, h, writeTask } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { inheritAttributes } from '../../utils/helpers';

import { cloneElement, createHeaderIndex, handleContentScroll, handleHeaderFade, handleToolbarIntersection, setHeaderActive, setToolbarBackgroundOpacity } from './header.utils';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-header',
  styleUrls: {
    ios: 'header.ios.scss',
    md: 'header.md.scss'
  }
})
export class Header implements ComponentInterface {
  private scrollEl?: HTMLElement;
  private contentScrollCallback?: any;
  private intersectionObserver?: any;
  private collapsibleMainHeader?: HTMLElement;
  private inheritedAttributes: { [k: string]: any } = {};

  @Element() el!: HTMLElement;

  /**
   * Describes the scroll effect that will be applied to the header.
   * Only applies in iOS mode.
   *
   * Typically used for [Collapsible Large Titles](https://ionicframework.com/docs/api/title#collapsible-large-titles)
   */
  @Prop() collapse?: 'condense' | 'fade';

  /**
   * If `true`, the header will be translucent.
   * Only applies when the mode is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   *
   * Note: In order to scroll content behind the header, the `fullscreen`
   * attribute needs to be set on the content.
   */
  @Prop() translucent = false;

  componentWillLoad() {
    this.inheritedAttributes = inheritAttributes(this.el, ['role']);
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
    const mode = getIonMode(this);

    if (mode !== 'ios') { return; }

    const { collapse } = this;
    const hasCondense = collapse === 'condense';
    const hasFade = collapse === 'fade';

    this.destroyCollapsibleHeader();

    if (hasCondense) {
      const pageEl = this.el.closest('ion-app,ion-page,.ion-page,page-inner');
      const contentEl = (pageEl) ? pageEl.querySelector('ion-content') : null;

      // Cloned elements are always needed in iOS transition
      writeTask(() => {
        const title = cloneElement('ion-title') as HTMLIonTitleElement;
        title.size = 'large';
        cloneElement('ion-back-button');
      });

      await this.setupCondenseHeader(contentEl, pageEl);
    } else if (hasFade) {
      const pageEl = this.el.closest('ion-app,ion-page,.ion-page,page-inner');
      const contentEl = (pageEl) ? pageEl.querySelector('ion-content') : null;
      const condenseHeader = (contentEl) ? contentEl.querySelector('ion-header[collapse="condense"]') as HTMLElement | null : null;
      await this.setupFadeHeader(contentEl, condenseHeader);
    }
  }

  private setupFadeHeader = async (contentEl: HTMLIonContentElement | null, condenseHeader: HTMLElement | null) => {
    if (!contentEl) { console.error('ion-header requires a content to collapse. Make sure there is an ion-content.'); return; }

    const scrollEl = this.scrollEl = await contentEl.getScrollElement();

    /**
     * Handle fading of toolbars on scroll
     */

    this.contentScrollCallback = () => { handleHeaderFade(this.scrollEl!, this.el, condenseHeader); };
    scrollEl!.addEventListener('scroll', this.contentScrollCallback);

    handleHeaderFade(this.scrollEl!, this.el, condenseHeader);
  }

  private destroyCollapsibleHeader() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = undefined;
    }

    if (this.scrollEl && this.contentScrollCallback) {
      this.scrollEl.removeEventListener('scroll', this.contentScrollCallback);
      this.contentScrollCallback = undefined;
    }

    if (this.collapsibleMainHeader) {
      this.collapsibleMainHeader.classList.remove('header-collapse-main');
      this.collapsibleMainHeader = undefined;
    }
  }

  private async setupCondenseHeader(contentEl: HTMLIonContentElement | null, pageEl: Element | null) {
    if (!contentEl || !pageEl) { console.error('ion-header requires a content to collapse, make sure there is an ion-content.'); return; }
    if (typeof (IntersectionObserver as any) === 'undefined') { return; }

    this.scrollEl = await contentEl.getScrollElement();

    const headers = pageEl.querySelectorAll('ion-header');
    this.collapsibleMainHeader = Array.from(headers).find((header: any) => header.collapse !== 'condense') as HTMLElement | undefined;

    if (!this.collapsibleMainHeader) { return; }

    const mainHeaderIndex = createHeaderIndex(this.collapsibleMainHeader);
    const scrollHeaderIndex = createHeaderIndex(this.el);

    if (!mainHeaderIndex || !scrollHeaderIndex) { return; }

    setHeaderActive(mainHeaderIndex, false);
    setToolbarBackgroundOpacity(mainHeaderIndex.el, 0);

    /**
     * Handle interaction between toolbar collapse and
     * showing/hiding content in the primary ion-header
     * as well as progressively showing/hiding the main header
     * border as the top-most toolbar collapses or expands.
     */
    const toolbarIntersection = (ev: any) => { handleToolbarIntersection(ev, mainHeaderIndex, scrollHeaderIndex, this.scrollEl!); };

    this.intersectionObserver = new IntersectionObserver(toolbarIntersection, { root: contentEl, threshold: [0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });
    this.intersectionObserver.observe(scrollHeaderIndex.toolbars[scrollHeaderIndex.toolbars.length - 1].el);

    /**
     * Handle scaling of large iOS titles and
     * showing/hiding border on last toolbar
     * in primary header
     */
    this.contentScrollCallback = () => { handleContentScroll(this.scrollEl!, scrollHeaderIndex, contentEl); };
    this.scrollEl!.addEventListener('scroll', this.contentScrollCallback);

    writeTask(() => {
      if (this.collapsibleMainHeader !== undefined) {
        this.collapsibleMainHeader.classList.add('header-collapse-main');
      }
    });
  }

  render() {
    const { translucent, inheritedAttributes } = this;
    const mode = getIonMode(this);
    const collapse = this.collapse || 'none';

    return (
      <Host
        role="banner"
        class={{
          [mode]: true,

          // Used internally for styling
          [`header-${mode}`]: true,

          [`header-translucent`]: this.translucent,
          [`header-collapse-${collapse}`]: true,
          [`header-translucent-${mode}`]: this.translucent,
        }}
        {...inheritedAttributes}
      >
        { mode === 'ios' && translucent &&
          <div class="header-background"></div>
        }
        <slot></slot>
      </Host>
    );
  }
}
