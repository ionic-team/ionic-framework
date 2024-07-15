import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Listen, h } from '@stencil/core';
import { addEventListener, removeEventListener } from '@utils/helpers';

@Component({
  tag: 'ion-segment-view',
  styleUrl: 'segment-view.scss',
  shadow: true,
})
export class SegmentView implements ComponentInterface {
  private segmentEl: HTMLIonSegmentElement | null = null;

  @Element() el!: HTMLElement;

  @Listen('scroll')
  segmentViewScroll(ev: any) {
    const { segmentEl } = this;

    const atSnappingPoint = ev.target.scrollLeft % ev.target.offsetWidth === 0;

    if (atSnappingPoint) {
      const index = Math.round(ev.target.scrollLeft / ev.target.offsetWidth);
      const segmentButton = this.getSegmentButtonAtIndex(index);

      if (segmentEl) {
        segmentEl.value = segmentButton.value;
      }
    }
  }

  connectedCallback() {
    const segmentEl = (this.segmentEl = document.querySelector(`ion-segment[view=${this.el.id}]`));
    if (segmentEl) {
      addEventListener(segmentEl, 'ionChange', this.updateSection);
    }
  }

  disconnectedCallback() {
    const segmentEl = this.segmentEl;
    if (segmentEl) {
      removeEventListener(segmentEl, 'ionChange', this.updateSection);
      this.segmentEl = null;
    }
  }

  private updateSection = () => {
    const { segmentEl } = this;

    if (segmentEl) {
      const value = segmentEl.value;
      const index = this.getSegmentButtonIndexWithValue(value);
      this.setSection(index);
    }
  };

  private setSection = (index: number) => {
    const sectionWidth = this.el.offsetWidth;
    this.el.scrollTo({
      top: 0,
      left: index * sectionWidth,
      behavior: 'smooth',
    });
  };

  private getSegmentButtons(): HTMLIonSegmentButtonElement[] {
    const { segmentEl } = this;

    if (!segmentEl) {
      return [];
    }

    return Array.from(segmentEl.querySelectorAll('ion-segment-button'));
  }

  private getSegmentButtonAtIndex(index: number) {
    return this.getSegmentButtons()[index];
  }

  private getSegmentButtonIndexWithValue(value: any) {
    return this.getSegmentButtons().findIndex((b) => b.value === value);
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
