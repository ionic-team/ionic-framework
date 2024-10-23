import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Listen, Method, Prop, h } from '@stencil/core';

@Component({
  tag: 'ion-segment-view',
  styleUrls: {
    ios: 'segment-view.ios.scss',
    md: 'segment-view.md.scss',
  },
  shadow: true,
})
export class SegmentView implements ComponentInterface {
  private scrollEndTimeout: ReturnType<typeof setTimeout> | null = null;
  private isTouching = false;
  private isManualScroll = true;

  @Element() el!: HTMLElement;

  /**
   * If `true`, the segment view cannot be interacted with.
   */
  @Prop() disabled = false;

  /**
   * Emitted when the segment view is scrolled.
   */
  @Event() ionSegmentViewScroll!: EventEmitter<{
    scrollRatio: number;
    isManualScroll: boolean;
  }>;

  /**
   * Emitted when the segment view scroll has ended.
   */
  @Event() ionSegmentViewScrollEnd!: EventEmitter<void>;

  @Event() ionSegmentViewScrollStart!: EventEmitter<void>;

  @Listen('scroll')
  handleScroll(ev: Event) {
    const { scrollLeft, scrollWidth, clientWidth } = ev.target as HTMLElement;
    const scrollRatio = scrollLeft / (scrollWidth - clientWidth);

    this.ionSegmentViewScroll.emit({
      scrollRatio,
      isManualScroll: this.isManualScroll,
    });

    // Reset the timeout to check for scroll end
    this.resetScrollEndTimeout();
  }

  /**
   * Handle touch start event to know when the user is actively dragging the segment view.
   */
  @Listen('touchstart')
  handleScrollStart() {
    this.ionSegmentViewScrollStart.emit();

    if (this.scrollEndTimeout) {
      clearTimeout(this.scrollEndTimeout);
      this.scrollEndTimeout = null;
    }

    this.isTouching = true;
  }

  /**
   * Handle touch end event to know when the user is no longer dragging the segment view.
   */
  @Listen('touchend')
  handleTouchEnd() {
    this.isTouching = false;
  }

  /**
   * Reset the scroll end detection timer. This is called on every scroll event.
   */
  private resetScrollEndTimeout() {
    if (this.scrollEndTimeout) {
      clearTimeout(this.scrollEndTimeout);
      this.scrollEndTimeout = null;
    }
    this.scrollEndTimeout = setTimeout(() => {
      this.checkForScrollEnd();
    }, 150);
  }

  /**
   * Check if the scroll has ended and the user is not actively touching.
   * If the conditions are met (active content is enabled and no active touch),
   * reset the scroll position and emit the scroll end event.
   */
  private checkForScrollEnd() {
    // Only emit scroll end event if the active content is not disabled and
    // the user is not touching the segment view
    if (!this.isTouching) {
      this.ionSegmentViewScrollEnd.emit();
      this.isManualScroll = true;
    }
  }

  /**
   * This method is used to programmatically set the displayed segment content
   * in the segment view. Calling this method will update the `value` of the
   * corresponding segment button.
   * @param id: The id of the segment content to display.
   * @param smoothScroll: Whether to animate the scroll transition.
   */
  @Method()
  async setContent(id: string, smoothScroll = true) {
    const contents = this.getSegmentContents();
    const index = contents.findIndex((content) => content.id === id);

    if (index === -1) return;

    this.isManualScroll = false;

    const contentWidth = this.el.offsetWidth;
    this.el.scrollTo({
      top: 0,
      left: index * contentWidth,
      behavior: smoothScroll ? 'smooth' : 'instant',
    });
  }

  private getSegmentContents(): HTMLIonSegmentContentElement[] {
    return Array.from(this.el.querySelectorAll('ion-segment-content'));
  }

  render() {
    const { disabled } = this;

    return (
      <Host
        class={{
          'segment-view-disabled': disabled,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
