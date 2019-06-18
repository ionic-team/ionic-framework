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
      threshold: 20,
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

    if (contentEl && canCollapse) {
      await contentEl.componentOnReady();
      this.scrollEl = await contentEl.getScrollElement();
    } else {
      console.error('ion-header requires a content to collapse, make sure there is an ion-content.');
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

  canStart() {
    return !this.isCollapsed;
  }

  onStart() {
    console.log('onStart');
  }

  onMove(detail: GestureDetail) {
    console.log('detail is', detail);

    // if there is no scroll element then do nothing
    if (!this.scrollEl) {
      return;
    }

    const toolbars = this.el.querySelectorAll('ion-toolbar');
    // if there are no toolbars then do nothing
    if (toolbars.length === 0) {
      return;
    }

    // Grab the first toolbar's min height to make sure we don't
    // go any smaller than that
    const firstToolbar = toolbars[0];
    const minHeightStr = window.getComputedStyle(firstToolbar).getPropertyValue('--min-height').replace('px', '');
    const minHeight = parseInt(minHeightStr, 10);
    const title = firstToolbar.querySelector('ion-title') as HTMLIonTitleElement;

    if (detail && detail.deltaY) {
      // const velocity = detail.velocityY;
      const difference = Math.floor(detail.deltaY);

      // If dragging up we need to collapse the header
      if (difference < 0) {
        this.scrollEl.style.overflowY = 'hidden';

        // If the current height of the toolbar is greater than the min height
        if (firstToolbar.offsetHeight > minHeight) {
          // If subtracting the difference would bring it under the min height
          // set the height to the min height, otherwise subtract
          const height = (firstToolbar.offsetHeight + difference < minHeight)
            ? `${minHeight}px`
            : `${firstToolbar.offsetHeight + difference}px`;

          firstToolbar.style.height = height;
        }

        // if we're at the min height and still dragging then
        // add the scroll back in
        if (firstToolbar.offsetHeight === minHeight) {
          // do something here like set collapsed
          // collapsed changing should enable scroll
          // and stop the gesture
          // this.scrollEl.scrollTop = 0;
          this.scrollEl.style.overflowY = 'auto';
          title.size = 'standard';
        }

      // If dragging down we need to expand the header ONLY
      // when it reaches the top of the scroll
      } else {
        console.log(this.scrollEl.scrollTop);
        // this.scrollEl.style.overflowY = 'auto';

        if (this.scrollEl.scrollTop === 0) {
          this.scrollEl.style.overflowY = 'hidden';

          // If the current height of the header is less than the original height
          // we can expand up to the original height
          if (this.el.offsetHeight < this.originalHeight) {
            const height = (this.el.offsetHeight + difference) > this.originalHeight
              ? `${this.originalHeight}px`
              : `${firstToolbar.offsetHeight + difference}px`;

            firstToolbar.style.height = height;
          }

          // if we're at the original height and still dragging then
          // add the scroll back in
          if (this.el.offsetHeight === this.originalHeight) {
            // do something here like set collapsed
            // collapsed changing should enable scroll
            // and stop the gesture
            this.scrollEl.style.overflowY = 'auto';
            title.size = 'large';
          }
        }
      }
    }

    return;
  }

  onEnd(detail: GestureDetail) {
    console.log('onEnd', detail);
    this.blocker.unblock();
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
