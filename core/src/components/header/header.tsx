import { Component, ComponentInterface, Element, Prop } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Gesture, GestureDetail } from '../../interface';

import { handleToolbarCollapse, handleToolbarPullDown, resetElementFixedHeights, resetToolbars, setElOpacity, setElementFixedHeights, toolbarsFullyCollapsed, translateEl } from './header.utils';

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

  private contentEl?: HTMLElement;
  private scrollEl?: HTMLElement;
  private gesture?: Gesture;

  private initialHeaderHeight = 0;
  private initialTransform = 0;
  private currentTransform = 0;

  private toolbars: any[] = [];

/*
  private maxTranslate = 1000;

*/

  private minTranslate = 0;

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
      this.toolbars = Array.from(toolbars).map((toolbar, i) => {
        const ionTitle = toolbar.querySelector('ion-title');
        const toolbarHeight = toolbar.clientHeight;

        if (i > 0) {
          this.minTranslate += toolbarHeight;
        }

        return {
          el: toolbar as HTMLElement,
          ionTitleEl: ionTitle,
          innerTitleEl: (ionTitle) ? ionTitle.shadowRoot!.querySelector('.toolbar-title') : undefined,
          dimensions: {
            height: toolbarHeight
          },
          position: {
            y: 0
          }
        };
      });

      this.minTranslate *= -1;

      await this.setupCollapsableHeader(contentEl);
    }
  }

  componentDidUnload() {
    this.scrollEl = undefined;
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  }

  private async setupCollapsableHeader(contentEl: any) {
    if (!contentEl) { console.error('ion-header requires a content to collapse, make sure there is an ion-content.'); }

    await contentEl.componentOnReady();

    this.contentEl = contentEl;
    this.scrollEl = await contentEl.getScrollElement();
    this.initialHeaderHeight = this.el.clientHeight;

    // TODO: find a better way to do this
    let zIndex = this.toolbars.length;
    this.toolbars.forEach(toolbar => {
      toolbar.el.style.zIndex = zIndex.toString();
      zIndex -= 1;
    });

    // Hide title on first primary toolbar
    setElOpacity(this.toolbars[0].ionTitleEl, 0);

    // Setup gesture controls
    this.gesture = (await import('./collapse')).createCollapseGesture(
      this.scrollEl! as any,
      () => this.canStart(),
      () => this.onStart(),
      (ev: GestureDetail) => this.onMove(ev),
      () => this.onEnd(),
    );

    this.gesture.setDisabled(false);

  }

  canStart(): boolean {
    if (!this.scrollEl) { return false; }

    return true;
  }

  onStart() {
    this.initialTransform = this.currentTransform;
    this.disableContentScroll();

    setElementFixedHeights(this.toolbars.map(t => t.el).concat(this.el));
  }

  onMove(detail: GestureDetail) {
    let deltaY = this.initialTransform + Math.ceil(detail.deltaY);

    if (deltaY < this.minTranslate) {
      deltaY = this.minTranslate;
    }

    if (toolbarsFullyCollapsed(this.toolbars)) {
      this.el.classList.add('header-fully-collapsed');

      /**
       * If toolbars are fully collapsed do not
       * let user swipe in a negative direction
       */
      if (deltaY <= this.minTranslate) {
        return;
      }
    } else {
      this.el.classList.remove('header-fully-collapsed');
    }

    // Add resistance when pulling down
    if (deltaY > 0) {
      deltaY = deltaY ** 0.85;
    }

    this.currentTransform = deltaY;

    let headerHeight = this.initialHeaderHeight;
    if (deltaY < 0) {
      handleToolbarCollapse(this.toolbars, deltaY);
      headerHeight += deltaY;
    } else {
      handleToolbarPullDown(this.toolbars, deltaY);
      translateEl(this.contentEl!, this.currentTransform);
    }

    this.el.style.height = `${headerHeight}px`;

  }

  onEnd() {
    this.enableContentScroll();
    if (this.currentTransform < 0) { return; }

    this.currentTransform = 0;

    requestAnimationFrame(() => {
      translateEl(this.contentEl!, 0, true);
      resetToolbars(this.toolbars, true);

      resetElementFixedHeights(this.toolbars.map(t => t.el).concat(this.el));
    });
  }

  private disableContentScroll() {
    if (!this.scrollEl) { return; }

    this.scrollEl.style.setProperty('--overflow', 'hidden');
  }

  private enableContentScroll() {
    if (!this.scrollEl) { return; }

    this.scrollEl.style.setProperty('--overflow', 'auto');
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
