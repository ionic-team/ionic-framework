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
  private initialScrollLeft = 0;
  private previousScrollLeft = 0;

  @Element() el!: HTMLElement;

  /**
   * If `true`, the segment view cannot be interacted with.
   */
  @Prop() disabled = false;

  @Event() ionSegmentViewScroll!: EventEmitter<{ scrollDirection: string; scrollDistance: number }>;

  @Listen('scroll')
  handleScroll(ev: Event) {
    const { initialScrollLeft, previousScrollLeft } = this;
    const { scrollLeft, offsetWidth } = ev.target as HTMLElement;

    const scrollDirection = scrollLeft > previousScrollLeft ? 'right' : 'left';
    this.previousScrollLeft = scrollLeft;

    let scrollDistance = scrollLeft;

    if (scrollDirection === 'left') {
      scrollDistance = initialScrollLeft - scrollLeft;
    }

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
  }

  @Listen('touchstart')
  handleTouchStart() {
    this.initialScrollLeft = this.el.scrollLeft;
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
