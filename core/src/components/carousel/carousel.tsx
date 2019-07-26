import { Component, ComponentInterface, Element, Event, EventEmitter, Prop, QueueApi, State, Watch, h } from '@stencil/core';

import { clamp } from '../../utils/helpers';

@Component({
  tag: 'ion-carousel',
  styleUrl: 'carousel.scss',
  shadow: true
})
export class Carousel implements ComponentInterface {

  @Element() el!: HTMLElement;

  @Prop({ context: 'queue' }) queue!: QueueApi;

  @Prop() indicator?: 'progress' | 'bullets' = 'bullets';

  @State() progress = 0;
  @Watch('progress')
  progressChanged(progress: number) {
    this.ionCarouselDrag.emit({
      progress
    });
  }

  @Event() ionCarouselDrag!: EventEmitter;

  private onScroll = (ev: Event) => {
    const el = ev.target as HTMLElement;
    this.queue.read(() => {
      this.progress = clamp(0, el.scrollLeft / (el.scrollWidth - el.offsetWidth), 1);
    });
  }

  private length() {
    return this.el.childElementCount;
  }

  private renderBullets() {
    const length = this.length();
    const selected = Math.round(this.progress * (length - 1));
    return (
      <div class="bullets-bar">
        { Array.from({ length }, (_, i) => (
          <span
            class={{
              'bullet': true,
              'active': i === selected,
            }}
          >
          </span>
        ))}
      </div>
    );
  }

  render() {
    const indicator = this.indicator;
    return [
      indicator === 'progress' && <ion-progress-bar value={this.progress}></ion-progress-bar>,
      indicator === 'bullets' && this.renderBullets(),
      <div class="inner-scroll" onScroll={this.onScroll}>
        <slot></slot>
      </div>
    ];
  }
}
