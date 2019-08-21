import { Component, ComponentInterface, Element, Host, Prop, h, readTask } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

import { createHeaderIndex, handleContentScroll, handleToolbarIntersection, makeHeaderInactive, setElOpacity } from './header.utils';
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

  private scrollEl?: any;
  private contentScrollCallback?: any;

  @Element() el!: HTMLElement;

  /**
   * If `true`, the header will collapse on scroll of the content.
   * Only applies in `ios` mode.
   */
  @Prop() collapse = false;

  /**
   * If `true`, the header will be translucent.
   * Only applies when the mode is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   *
   * Note: In order to scroll content behind the header, the `fullscreen`
   * attribute needs to be set on the content.
   */
  @Prop() translucent = false;

  async componentDidLoad() {
    // Determine if the header can collapse
    const canCollapse = (this.collapse && getIonMode(this) === 'ios') ? this.collapse : false;

    const tabs = this.el.closest('ion-tabs');
    const page = this.el.closest('ion-app,ion-page,.ion-page,page-inner');
    const contentEl = tabs ? tabs.querySelector('ion-content') : page!.querySelector('ion-content');

    if (canCollapse) {
      await this.setupCollapsableHeader(contentEl, (tabs) ? tabs : page!);
    }
  }

  componentDidUnload() {
    if (this.contentScrollCallback) {
      this.scrollEl.removeEventListener('scroll', this.contentScrollCallback);
    }
  }

  private async setupCollapsableHeader(contentEl: any, pageEl: any) {
    if (!contentEl) { console.error('ion-header requires a content to collapse, make sure there is an ion-content.'); }

    await contentEl.componentOnReady();

    this.scrollEl = await contentEl.getScrollElement();

    readTask(() => {
      const headers = pageEl.querySelectorAll('ion-header');
      const mainHeader = Array.from(headers).find((header: any) => !header.collapse);

      const mainHeaderIndex = createHeaderIndex(mainHeader);
      const scrollHeaderIndex = createHeaderIndex(this.el);

      if (!mainHeaderIndex || !scrollHeaderIndex) { return; }

      // TODO: Find a better way to do this
      let remainingHeight = 0;
      for (let i = 1; i <= scrollHeaderIndex.toolbars.length - 1; i++) {
        remainingHeight += scrollHeaderIndex.toolbars[i].el.clientHeight;
      }

      // TODO: Find a better way to do this
      let zIndex = scrollHeaderIndex.toolbars.length - 1;
      scrollHeaderIndex.toolbars.forEach((toolbar: any) => {
        toolbar.el.style.zIndex = zIndex.toString();
        zIndex -= 1;
      });

      /**
       * Handle interaction between toolbar collapse and
       * showing/hiding content in the primary ion-header
       */
      const toolbarIntersection = (ev: any) => { handleToolbarIntersection(ev, mainHeaderIndex, scrollHeaderIndex); };

      const mainHeaderHeight = mainHeaderIndex.el.clientHeight;
      const intersectionObserver = new IntersectionObserver(toolbarIntersection, { threshold: 0.25, rootMargin: `-${mainHeaderHeight}px 0px 0px 0px` });
      intersectionObserver.observe(scrollHeaderIndex.toolbars[0].el);

      /**
       * Handle scaling of large iOS titles and
       * showing/hiding border on last toolbar
       * in primary header
       */
      this.contentScrollCallback = () => { handleContentScroll(this.scrollEl, mainHeaderIndex, scrollHeaderIndex, remainingHeight); };
      this.scrollEl.addEventListener('scroll', this.contentScrollCallback);

      /**
       * Set the initial state of the collapsable header
       */
      setElOpacity;
      makeHeaderInactive;
      //setElOpacity(mainHeaderIndex.el, 0);
      //makeHeaderInactive(mainHeaderIndex, false);
    });
  }

  render() {
    const mode = getIonMode(this);
    return (
      <Host
        role="banner"
        class={{
          [mode]: true,

          // Used internally for styling
          [`header-${mode}`]: true,

          [`header-translucent`]: this.translucent,
          [`header-collapse-${mode}`]: this.collapse,
          [`header-translucent-${mode}`]: this.translucent,
        }}
      >
      </Host>
    );
  }
}
