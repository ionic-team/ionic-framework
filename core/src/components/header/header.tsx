import { Component, ComponentInterface, Element, Prop, readTask } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

import { createHeaderIndex, handleContentScroll, handleToolbarIntersection, setToolbarBorderColor } from './header.utils';
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

  @Element() el!: HTMLElement;

  @Prop({ context: 'document' }) doc!: Document;

  /**
   * If `true`, the header will collapse on scroll of the content.
   * Only applies in `ios` mode.
   */
  @Prop() collapse = false;

  /**
   * If `true`, the header will be translucent. Only applies to `ios` mode.
   * Note: In order to scroll content behind the header, the `fullscreen`
   * attribute needs to be set on the content.
   */
  @Prop() translucent = false;

  async componentDidLoad() {
    // Determine if the header can collapse
    const toolbars = this.el.querySelectorAll('ion-toolbar');
    const canCollapse = (this.collapse && getIonMode(this) === 'ios' && toolbars.length >= 2) ? this.collapse : false;

    const tabs = this.el.closest('ion-tabs');
    const page = this.el.closest('ion-app,ion-page,.ion-page,page-inner');
    const contentEl = tabs ? tabs.querySelector('ion-content') : page!.querySelector('ion-content');

    if (canCollapse) {
      await this.setupCollapsableHeader(contentEl);
    }
  }

  private async setupCollapsableHeader(contentEl: any) {
    if (!contentEl) { console.error('ion-header requires a content to collapse, make sure there is an ion-content.'); }

    await contentEl.componentOnReady();

    this.scrollEl = await contentEl.getScrollElement();

    const headers = document.querySelectorAll('ion-header');
    const mainHeader = Array.from(headers).find(header => !header.collapse);

    readTask(() => {
      const mainHeaderIndex = createHeaderIndex(mainHeader);
      const scrollHeaderIndex = createHeaderIndex(this.el);

      if (!mainHeaderIndex || !scrollHeaderIndex) { return; }

      // TODO: Find a better way to do this
      let zIndex = scrollHeaderIndex.toolbars.length;
      scrollHeaderIndex.toolbars.forEach((toolbar: any) => {
        toolbar.el.style.zIndex = zIndex.toString();
        zIndex -= 1;
      });

      /**
       * Handle interaction between toolbar collapse and
       * showing/hiding content in the primary ion-header
       */
      const toolbarIntersection = (ev: any) => { handleToolbarIntersection(ev, mainHeaderIndex, scrollHeaderIndex); };
      const intersectionObserver = new IntersectionObserver(toolbarIntersection, { threshold: 0.25 });

      intersectionObserver.observe(scrollHeaderIndex.toolbars[0].el);

      /**
       * Handle scaling of large iOS titles and
       * showing/hiding border on last toolbar
       * in primary header
       */

      // TODO: Find a better way to do this
      let remainingHeight = 0;
      for (let i = 1; i <= scrollHeaderIndex.toolbars.length - 1; i++) {
        remainingHeight += scrollHeaderIndex.toolbars[i].el.clientHeight;
      }

      const contentScroll = () => { handleContentScroll(this.scrollEl, mainHeaderIndex, scrollHeaderIndex, remainingHeight); };
      this.scrollEl.addEventListener('scroll', contentScroll);

      /**
       * Set the initial state of the collapsable header
       */
      const lastMainToolbar = mainHeaderIndex.toolbars[mainHeaderIndex.toolbars.length - 1];
      setToolbarBorderColor(lastMainToolbar, 'rgba(0, 0, 0, 0)');
    });
  }

  hostData() {
    const mode = getIonMode(this);
    return {
      class: {
        [`${mode}`]: true,

        // Used internally for styling
        [`header-${mode}`]: true,

        [`header-translucent`]: this.translucent,
        [`header-collapse-${mode}`]: this.collapse,
        [`header-translucent-${mode}`]: this.translucent
      }
    };
  }
}
