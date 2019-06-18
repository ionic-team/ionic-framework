import { Component, ComponentInterface, Element, EventListenerEnable, Prop, QueueApi, State } from '@stencil/core';

import { Gesture, GestureDetail, Mode } from '../../interface';
import { GESTURE_CONTROLLER } from '../../utils/gesture';

@Component({
  tag: 'ion-header',
  styleUrls: {
    ios: 'header.ios.scss',
    md: 'header.md.scss'
  }
})
export class Header implements ComponentInterface {

  private scrollEl?: HTMLElement;
  private gesture?: Gesture;
  private blocker = GESTURE_CONTROLLER.createBlocker({ disableScroll: true });

  lastScrollTop = 0;
  originalHeight = 100;

  @Element() el!: HTMLElement;

  @State() isCollapsed = false;

  @Prop({ context: 'enableListener' }) enableListener!: EventListenerEnable;
  @Prop({ context: 'document' }) doc!: Document;
  @Prop({ context: 'queue' }) queue!: QueueApi;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  /**
   * If `true`, the header will collapse on scroll of the content.
   * Only applies in `ios` mode.
   */
  @Prop() collapse?: boolean;

  /**
   * If `true`, the header will be translucent. Only applies to `ios` mode.
   * Note: In order to scroll content behind the header, the `fullscreen`
   * attribute needs to be set on the content.
   */
  @Prop() translucent = false;

  async componentDidLoad() {
    this.originalHeight = this.el.offsetHeight;

    this.gesture = (await import('../../utils/gesture')).createGesture({
      el: this.doc as any,
      queue: this.queue,
      gestureName: 'header',
      gesturePriority: 20,
      direction: 'y',
      threshold: 0,
      canStart: () => this.canStart(),
      onStart: () => this.onStart(),
      onMove: ev => this.onMove(ev),
      onEnd: ev => this.onEnd(ev),
    });

    // Determine if the header can collapse
    const canCollapse = (this.collapse && this.mode === 'ios') ? this.collapse : false;

    const tabs = this.el.closest('ion-tabs');
    const page = this.el.closest('ion-app,ion-page,.ion-page,page-inner') as HTMLStencilElement;
    const contentEl = tabs ? tabs.querySelector('ion-content') : page.querySelector('ion-content');

    if (canCollapse) {
      await this.setupCollapsableHeader(contentEl);
    }

    // Enable the collapse gesture if collapse is set and mode is ios
    this.gesture.setDisabled(!canCollapse);
  }

  componentDidUnload() {
    this.blocker.destroy();
    this.scrollEl = undefined;
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  }

  private initialTransform: any = 0;
  private collapseTransform: any = 0;

  private toolbars: HTMLIonToolbarElement[] = [];

  private maxTranslate = 200;
  private minTranslate = -500; // TODO: Update this

  private async setupCollapsableHeader(contentEl: any) {
    if (!contentEl) { console.error('ion-header requires a content to collapse, make sure there is an ion-content.'); }

    await contentEl.componentOnReady();
    this.scrollEl = await contentEl.getScrollElement();

    const toolbars = this.getToolbars();
    if (toolbars.length < 2) {
      return;
    }

    this.toolbars = Array.from(toolbars);

    let zIndex = this.toolbars.length;
    this.toolbars.forEach(toolbar => {
      toolbar.style.zIndex = zIndex.toString();
      zIndex -= 1;
    });

    // Setup primary toolbar
    const primaryIonTitle = this.toolbars[0].querySelector('ion-title');
    if (!primaryIonTitle) { return; }

    primaryIonTitle.style.opacity = '0';
  }

  canStart() {
    return !this.isCollapsed;
  }

  onStart() {
    console.log('onStart. Initial transform', this.initialTransform);
    this.initialTransform = this.collapseTransform;
  }

  private disableContentScroll() {
    if (!this.scrollEl) { return; }

    this.scrollEl.style.setProperty('--overflow', 'hidden');
  }

  private enableContentScroll() {
    if (!this.scrollEl) { return; }

    this.scrollEl.style.setProperty('--overflow', 'auto');
  }

  private clampTransform(value: number): number {
    if (value > this.maxTranslate) {
      return this.maxTranslate;
    } else if (value < this.minTranslate) {
      return this.minTranslate;
    } else {
      return value;
    }
  }

  // TODO: Integrate this with Ionic Animation
  private scaleLargeTitles(scale = 1, transition = '') {
    requestAnimationFrame(() => {
      const toolbars = this.toolbars.slice(1);

      toolbars.forEach(toolbar => {
        const ionTitle = toolbar.querySelector('ion-title');
        if (!ionTitle) { return; }

        if (ionTitle.size !== 'large') { return; }

        const titleDiv = ionTitle.shadowRoot!.querySelector('.toolbar-title') as HTMLElement | null;
        if (titleDiv === null) { return; }

        titleDiv.style.transformOrigin = 'left center';
        titleDiv.style.transition = transition;
        titleDiv.style.transform = `scale3d(${scale}, ${scale}, 1)`;
      });
    });
  }

  private setToolbarTitleVisibility(toolbar: any, show = true) {
    requestAnimationFrame(() => {
      const ionTitle = toolbar.querySelector('ion-title');
      if (!ionTitle) { return; }

      ionTitle.style.transition = 'all 0.2s ease-in-out';
      ionTitle.style.opacity = (show) ? '1' : '0';
    });
  }

  // TODO: Integrate this with Ionic Animation
  private translateToolbars(translateY = 0, transition = '') {
    requestAnimationFrame(() => {
      if (!this.scrollEl) { return; }

      const toolbarsToAnimate = this.toolbars.slice(1);
      const toolbars = (translateY > 0) ? toolbarsToAnimate : toolbarsToAnimate.reverse();

      let relativeTranslation = translateY;
      let transformOffset = 0;

      let index = toolbars.length - 1;
      let secondaryToolbarOffset = -1;
      for (const toolbar of toolbars) {
        const toolbarHeight = toolbar.clientHeight;

        transformOffset += toolbarHeight;

        toolbar.style.transition = transition;
        toolbar.style.transform = `translate3d(0, ${relativeTranslation}px, 0)`;

        if (translateY < 0) {

          if (index === 0) {
            secondaryToolbarOffset = transformOffset;
          }

          index -= 1;
          if (Math.abs(translateY) <= transformOffset) {
            break;
          }

          relativeTranslation += toolbarHeight;
        }
      }

      this.scrollEl.style.transition = transition;
      this.scrollEl.style.transform = `translate3d(0, ${translateY}px, 0)`;

      // check to see if 1st toolbar is collapsed enough to show original title
      const primaryToolbar = this.toolbars[0];
      const secondaryToolbar = this.toolbars[1];

      if (secondaryToolbarOffset > -1 && (secondaryToolbarOffset - Math.abs(this.collapseTransform)) <= 20) {
        this.setToolbarTitleVisibility(primaryToolbar, true);
        this.setToolbarTitleVisibility(secondaryToolbar, false);
      } else {
        this.setToolbarTitleVisibility(primaryToolbar, false);
        this.setToolbarTitleVisibility(secondaryToolbar, true);
      }
    });
  }

  private snapToolbarTranslation() {
    if (!this.scrollEl) { return; }
    const toolbarsToAnimate = this.toolbars.slice(1).reverse();

    let transformOffset = 0;
    for (const toolbar of toolbarsToAnimate) {
      const toolbarHeight = toolbar.clientHeight;

      transformOffset += toolbarHeight;

      const isCollapsed = Math.abs(this.collapseTransform) > transformOffset;
      if (isCollapsed) {
        continue;
      }

      this.collapseTransform = -transformOffset;

      this.translateToolbars(this.collapseTransform, 'all 0.25s ease-in-out');

      break;
    }
  }

  onMove(detail: GestureDetail) {
    if (!this.scrollEl) { return; }

    const toolbars = this.getToolbars();
    if (toolbars.length < 2) { return; }

    const proposedTransform = this.clampTransform(this.initialTransform + detail.deltaY);
    if (proposedTransform === this.collapseTransform) {
      return;
    }

    // User must be at top for any of this to happen
    if (this.scrollEl.scrollTop > 20) {
      return;
    }

    this.collapseTransform = proposedTransform;

    this.disableContentScroll();
    this.translateToolbars(this.collapseTransform);

    if (this.collapseTransform > 0) {
      const scale = 1 + (this.collapseTransform / this.maxTranslate / 5);
      if (scale < 1.1) {
        this.scaleLargeTitles(scale);
      }
    }
  }

  private getToolbars(): NodeListOf<HTMLIonToolbarElement> {
    return this.el.querySelectorAll('ion-toolbar');
  }

  onEnd(detail: GestureDetail) {
    console.log('onEnd', detail);
    this.enableContentScroll();
    this.blocker.unblock();

    if (this.collapseTransform > 0) {
      this.collapseTransform = 0;

      this.translateToolbars(this.collapseTransform, 'all 0.25s ease-in-out');

      const scale = 1 + (this.collapseTransform / this.maxTranslate / 5);
      if (scale < 1.1) {
        this.scaleLargeTitles(scale, 'all 0.25s ease-in-out');
      }
    } else {
      this.snapToolbarTranslation();
    }
  }

  hostData() {
    return {
      class: {
        [`${this.mode}`]: true,

        // Used internally for styling
        [`header-${this.mode}`]: true,

        [`header-translucent`]: this.translucent,
        [`header-translucent-${this.mode}`]: this.translucent,
      }
    };
  }
}
