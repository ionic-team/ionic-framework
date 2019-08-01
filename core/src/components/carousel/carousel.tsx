import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h, readTask } from '@stencil/core';

import { clamp } from '../../utils/helpers';

@Component({
  tag: 'ion-carousel',
  styleUrl: 'carousel.scss',
  shadow: true
})
export class Carousel implements ComponentInterface {

  @Element() el!: HTMLElement;

  @Prop() indicator: 'bullets' | 'none' = 'bullets';

  @State() progress = 0;
  @Watch('progress')
  progressChanged(progress: number) {
    this.ionCarouselDrag.emit({
      progress
    });
  }

  @Event() ionCarouselDrag!: EventEmitter<{
    progress: number
  }>;

  @Method()
  async getSelectedIndex() {
    return this.selected();
  }

  private length() {
    return this.el.childElementCount;
  }

  private selected() {
    const length = this.length();
    return Math.round(this.progress * (length - 1));
  }

  private onScroll = (ev: Event) => {
    const el = ev.target as HTMLElement;
    readTask(() => {
      this.progress = clamp(0, el.scrollLeft / (el.scrollWidth - el.offsetWidth), 1);
    });
  }

  private onBulletClick = (ev: Event) => {
    const index = parseInt((ev.target as any).getAttribute('data-index'), 10);
    const slide = this.el.children[index] as Element | undefined;
    if (slide) {
      slide.scrollIntoView({ behavior: 'smooth' });
    }
  }

  render() {
    const indicator = this.indicator;
    return (
      <Host>
        <div class="inner-scroll" onScroll={this.onScroll}>
          <slot></slot>
        </div>
      {indicator === 'bullets' && renderBullets(this.length(), this.selected(), this.onBulletClick)}
      </Host>
    );
  }
}

const renderBullets = (nuBullets: number, selectedIndex: number, handler: (ev: Event) => void) => {
  return (
    <div class="bullets-bar">
      { Array.from({ length: nuBullets }, (_, i) => (
        <button
          onClick={handler}
          data-index={i}
          class={{
            'bullet': true,
            'active': i === selectedIndex,
          }}
        >
        </button>
      ))}
    </div>
  );
};
