import { Component, Host, h, Element, Event, EventEmitter } from '@stencil/core';
import { headerResizeEventDetail } from './med-header-interface';

@Component({
  tag: 'med-header',
  styleUrl: 'med-header.scss',
  shadow: true,
})
export class MedHeader {
  @Element() el!: HTMLElement;
  @Event() medResize!: EventEmitter<headerResizeEventDetail>;

  private hostHeight = 0;
  private hostResizeObserver!: ResizeObserver;

  componentDidLoad() {
    this.setSize();
  }

  disconnectedCallback() {
    this.hostResizeObserver.disconnect();
  }

  private setSize() {
    this.hostResizeObserver = new ResizeObserver(() => {
      let newHostHeight = Number(this.el.getBoundingClientRect().height);

      if (newHostHeight !== this.hostHeight) {
        this.medResize.emit({ height: newHostHeight });
        this.hostHeight = newHostHeight;
      }
    });

    this.hostResizeObserver.observe(this.el);
  }

  render() {
    return (
      <Host from-stencil>
        <slot name="navbar"></slot>
        <slot name="toolbar"></slot>
        <slot name="progress"></slot>
      </Host>
    );
  }

}
