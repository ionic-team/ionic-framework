import { Component, ComponentInterface, Element, Prop } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Gesture, GestureDetail } from '../../interface';

import { areToolbarsFullyCollapsed, handleToolbarCollapse, handleToolbarPullDown, resetElementFixedHeights, resetToolbars, setElOpacity, setElementFixedHeights, translateEl } from './header.utils';

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

  private initialTransform = 0;
  private currentTransform = 0;

  private toolbars: any[] = [];

/*
  private maxTranslate = 1000;
  private minTranslate = 0;
*/

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
      this.toolbars = Array.from(toolbars).map(toolbar => {
        const ionTitle = toolbar.querySelector('ion-title');

        return {
          el: toolbar as HTMLElement,
          ionTitleEl: ionTitle,
          innerTitleEl: (ionTitle) ? ionTitle.shadowRoot!.querySelector('.toolbar-title') : undefined,
          dimensions: {
            height: toolbar.clientHeight
          },
          position: {
            y: 0
          }
        };
      });
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
    this.initialHeight = this.el.clientHeight;
    this.disableContentScroll();

    setElementFixedHeights(this.toolbars.map(t => t.el).concat(this.el));
  }

  private initialHeight = 0;

  onMove(detail: GestureDetail) {
    const deltaY = this.initialTransform + Math.ceil(detail.deltaY);

    /**
     * If toolbars are fully collapsed do not
     * let user swipe in a negative direction
     */
    if (areToolbarsFullyCollapsed(this.toolbars) && deltaY <= this.currentTransform) {
      return;
    }

    this.currentTransform = deltaY;

    if (deltaY < 0) {
      handleToolbarCollapse(this.toolbars, deltaY);
      this.el.style.height = `${this.initialHeight + deltaY}px`;
    } else {
      handleToolbarPullDown(this.toolbars, deltaY);
      translateEl(this.contentEl!, deltaY);
    }
  }

  onEnd() {
    if (this.currentTransform < 0) { return; }

    translateEl(this.contentEl!, this.currentTransform);

    this.currentTransform = 0;

    resetToolbars(this.toolbars, true);
    resetElementFixedHeights(this.toolbars.map(t => t.el).concat(this.el));
    translateEl(this.contentEl!, 0, true);
  }

  private disableContentScroll() {
    if (!this.scrollEl) { return; }

    this.scrollEl.style.setProperty('--overflow', 'hidden');
  }

/*
  private enableContentScroll() {
    if (!this.scrollEl) { return; }

    this.scrollEl.style.setProperty('--overflow', 'auto');
  }
*/

  hostData() {
    const mode = getIonMode(this);
    return {
      class: {
        [`${mode}`]: true,

        // Used internally for styling
        [`header-${mode}`]: true,

        [`header-translucent`]: this.translucent,
        [`header-collapse-${mode}`]: this.collapse,
        [`header-translucent-${mode}`]: this.translucent,
      }
    };
  }
}
