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
  private initialScrollLeft?: number;
  private previousScrollLeft = 0;
  private scrollEndTimeout: ReturnType<typeof setTimeout> | null = null;
  private isTouching = false;

  @Element() el!: HTMLElement;

  /**
   * If `true`, the segment view cannot be interacted with.
   */
  @Prop() disabled = false;

  /**
   * Emitted when the segment view is scrolled.
   */
  @Event() ionSegmentViewScroll!: EventEmitter<{ scrollDirection: string; scrollDistance: number }>;

  /**
   * Emitted when the segment view scroll has ended.
   */
  @Event() ionSegmentViewScrollEnd!: EventEmitter<void>;

  @Listen('scroll')
  handleScroll(ev: Event) {
    const { initialScrollLeft, previousScrollLeft } = this;
    const { scrollLeft, offsetWidth } = ev.target as HTMLElement;

    if (initialScrollLeft === undefined) {
      this.initialScrollLeft = scrollLeft;
    }

    const scrollDirection = scrollLeft > previousScrollLeft ? 'right' : 'left';
    this.previousScrollLeft = scrollLeft;

    // If the scroll direction is left then we need to calculate where we started and subtract
    // the current scrollLeft to get the distance scrolled. Otherwise, we use the scrollLeft.
    const scrollDistance = scrollDirection === 'left' ? initialScrollLeft! - scrollLeft : scrollLeft;

    // Emit the scroll direction and distance
    this.ionSegmentViewScroll.emit({
      scrollDirection,
      scrollDistance,
    });

    const atSnappingPoint = scrollLeft % offsetWidth === 0;

    if (!atSnappingPoint) return;

    const index = Math.round(scrollLeft / offsetWidth);
    const segmentContent = this.getSegmentContents()[index];

    if (segmentContent === null || segmentContent === undefined) {
      return;
    }

    const segmentButton = this.getSegmentButtonById(segmentContent.id) as HTMLIonSegmentButtonElement;
    const segment = this.getParentSegment(segmentButton);

    if (segment) {
      segment.value = segmentButton.value;
    }

    this.resetScrollEndTimeout();
  }

  /**
   * Handle touch start event to know when the user is actively dragging the segment view.
   */
  @Listen('touchstart')
  handleScrollStart() {
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
   * If both conditions are met, reset the initial scroll position and
   * emit the scroll end event.
   */
  private checkForScrollEnd() {
    if (!this.isTouching) {
      this.ionSegmentViewScrollEnd.emit();
      this.initialScrollLeft = undefined;
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

    const contentWidth = this.el.offsetWidth;
    this.el.scrollTo({
      top: 0,
      left: index * contentWidth,
      behavior: smoothScroll ? 'smooth' : 'instant',
    });
  }

  private getSegmentContents(): HTMLIonSegmentContentElement[] {
    return Array.from(this.el.querySelectorAll('ion-segment-content:not([disabled])'));
  }

  private getSegmentButtonById(id: string) {
    return document.querySelector(`ion-segment-button[content-id="${id}"]`);
  }

  private getParentSegment(button: Element) {
    return button.closest('ion-segment');
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
