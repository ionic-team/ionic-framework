import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Listen, Method, Prop, h } from '@stencil/core';

@Component({
  tag: 'ion-segment-view',
  styleUrl: 'segment-view.scss',
  shadow: true,
})
export class SegmentView implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * If `true`, the segment view cannot be interacted with.
   */
  @Prop() disabled = false;

  @Listen('scroll')
  handleScroll(ev: any) {
    const { scrollLeft, offsetWidth } = ev.target;
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
      behavior: smoothScroll ? 'smooth' : 'auto',
    });
  }

  private getSegmentContents(): HTMLIonSegmentContentElement[] {
    return Array.from(this.el.querySelectorAll('ion-segment-content'));
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
