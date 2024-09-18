import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Listen, Method, h } from '@stencil/core';

@Component({
  tag: 'ion-segment-view',
  styleUrl: 'segment-view.scss',
  shadow: true,
})
export class SegmentView implements ComponentInterface {
  @Element() el!: HTMLElement;

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

  @Method()
  async setContent(id: string) {
    const contents = this.getSegmentContents();
    const index = contents.findIndex((content) => content.id === id);

    if (index === -1) return;

    const contentWidth = this.el.offsetWidth;
    this.el.scrollTo({
      top: 0,
      left: index * contentWidth,
      behavior: 'smooth',
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
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
