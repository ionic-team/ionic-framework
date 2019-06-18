import { Component, ComponentInterface, Element, EventListenerEnable, Prop, QueueApi } from '@stencil/core';

import { Gesture, GestureDetail, Mode } from '../../interface';

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

  private initialTransform = 0;
  private currentTransform = 0;

  private toolbars: HTMLIonToolbarElement[] = [];

  private maxTranslate = 200;
  private minTranslate = -500; // TODO: Update this

  @Element() el!: HTMLElement;

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
      onEnd: () => this.onEnd(),
    });

    // Determine if the header can collapse
    const toolbars = this.el.querySelectorAll('ion-toolbar');
    const canCollapse = (this.collapse && this.mode === 'ios' && toolbars.length >= 2) ? this.collapse : false;

    const tabs = this.el.closest('ion-tabs');
    const page = this.el.closest('ion-app,ion-page,.ion-page,page-inner') as HTMLStencilElement;
    const contentEl = tabs ? tabs.querySelector('ion-content') : page.querySelector('ion-content');

    if (canCollapse) {
      this.toolbars = Array.from(toolbars);
      await this.setupCollapsableHeader(contentEl);
    }

    // Enable the collapse gesture if collapse is set and mode is ios
    this.gesture.setDisabled(!canCollapse);
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
    this.scrollEl = await contentEl.getScrollElement();

    // TODO: find a better way to do this
    let zIndex = this.toolbars.length;
    this.toolbars.forEach(toolbar => {
      toolbar.style.zIndex = zIndex.toString();
      zIndex -= 1;
    });

    // Hide title on first primary toolbar
    this.setToolbarTitleVisibility(this.toolbars[0], false);
  }

  canStart(): boolean {
    if (!this.scrollEl) { return false; }

    return true;
  }

  onStart() {
    this.initialTransform = this.currentTransform;
    this.disableContentScroll();
  }

  onMove(detail: GestureDetail) {
    const proposedTransform = this.clampTransform(this.initialTransform + detail.deltaY);
    if (proposedTransform === this.currentTransform) {
      return;
    }

    this.currentTransform = proposedTransform;

    this.translateToolbars(this.currentTransform);

    if (this.currentTransform > 0) {
      this.updateLargeTitlesScale();
    }
  }

  onEnd() {
    if (this.currentTransform <= 0) {
      this.snapToolbarTranslation();
      return;
    }

    this.currentTransform = 0;

    this.translateToolbars(this.currentTransform, true);
    this.updateLargeTitlesScale(true);
    this.enableContentScroll();
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

  private updateLargeTitlesScale(transition = false) {
    const scale = 1 + (this.currentTransform / this.maxTranslate / 5);
    if (scale < 1.1) {
      this.scaleLargeTitles(scale, (transition) ? 'all 0.25s ease-in-out' : '');
    }
  }

  // TODO: Integrate this with Ionic Animation
  private scaleLargeTitles(scale = 1, transition = '') {
    requestAnimationFrame(() => {
      const toolbars = this.toolbars.slice(1);

      toolbars.forEach(toolbar => {
        const ionTitle = toolbar.querySelector('ion-title');
        if (!ionTitle || ionTitle.size !== 'large') { return; }

        const titleDiv = ionTitle.shadowRoot!.querySelector('.toolbar-title') as HTMLElement | null;
        if (titleDiv === null) { return; }

        titleDiv.style.transformOrigin = 'left center';
        titleDiv.style.transition = transition;
        titleDiv.style.transform = `scale3d(${scale}, ${scale}, 1)`;
      });
    });
  }

  private setToolbarTitleVisibility(toolbar: any, show = true, transition = false) {
    requestAnimationFrame(() => {
      const ionTitle = toolbar.querySelector('ion-title');
      if (!ionTitle) { return; }

      ionTitle.style.transition = (transition) ? 'all 0.2s ease-in-out' : '';
      ionTitle.style.opacity = (show) ? '1' : '0';
    });
  }

  // TODO: Integrate this with Ionic Animation
  private translateToolbars(translateY = 0, transition = false) {
    requestAnimationFrame(() => {
      if (!this.scrollEl) { return; }

      const transitionString = (transition) ? 'all 0.25s ease-in-out' : '';

      const toolbarsToAnimate = this.toolbars.slice(1);
      const toolbars = (translateY > 0) ? toolbarsToAnimate : toolbarsToAnimate.reverse();

      let relativeTranslation = translateY;
      let transformOffset = 0;

      let index = toolbars.length - 1;
      let secondaryToolbarOffset = -1;
      for (const toolbar of toolbars) {
        const toolbarHeight = toolbar.clientHeight;

        transformOffset += toolbarHeight;

        toolbar.style.transition = transitionString;
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

      this.scrollEl.style.transition = transitionString;
      this.scrollEl.style.transform = `translate3d(0, ${translateY}px, 0)`;

      // check to see if 1st toolbar is collapsed enough to show original title
      const primaryToolbar = this.toolbars[0];
      const secondaryToolbar = this.toolbars[1];

      if (secondaryToolbarOffset > -1 && (secondaryToolbarOffset - Math.abs(this.currentTransform)) <= 20) {
        this.setToolbarTitleVisibility(primaryToolbar, true, true);
        this.setToolbarTitleVisibility(secondaryToolbar, false, true);
      } else {
        this.setToolbarTitleVisibility(primaryToolbar, false, true);
        this.setToolbarTitleVisibility(secondaryToolbar, true, true);
      }
    });
  }

  private snapToolbarTranslation() {
    if (!this.scrollEl) { return; }
    const toolbarsToAnimate = this.toolbars.slice(1).reverse();

    /**
     * The transform value at which
     * a toolbar is considered "collapsed"
     */
    let collapsedTransform = 0;
    for (const toolbar of toolbarsToAnimate) {
      const toolbarHeight = toolbar.clientHeight;
      collapsedTransform += toolbarHeight;

      const isCollapsed = Math.abs(this.currentTransform) > collapsedTransform;
      if (isCollapsed) {
        continue;
      }

      this.currentTransform = -collapsedTransform;

      this.translateToolbars(this.currentTransform, true);

      break;
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
