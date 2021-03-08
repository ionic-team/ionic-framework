import { Component, Host, h } from '@stencil/core';
import ResizeObserver from "resize-observer-polyfill";

@Component({
  tag: 'med-navbar',
  styleUrl: 'med-navbar.scss',
  shadow: true,
})
export class MedHeader {
  private leftEl!: HTMLDivElement;
  private rightEl!: HTMLDivElement;

  private resizeObserver!: ResizeObserver;
  private leftWidth = 0;
  private rightWidth = 0;

  componentDidLoad() {
    window.requestAnimationFrame(this.setSize.bind(this));
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  private setSize() {
    this.resizeObserver = new ResizeObserver(entries => {
      this.rightEl.style.width = '';
      this.leftEl.style.width = '';

      this.leftWidth = entries[0] ? entries[0].contentRect.width : this.leftWidth;
      this.rightWidth = entries[1] ? entries[1].contentRect.width : this.rightWidth;

      if (this.leftWidth > this.rightWidth) {
        this.rightEl.style.width = `${this.leftWidth}px`;
      } else {
        this.leftEl.style.width = `${this.rightWidth}px`;
      }

      console.log('left',this.leftWidth);
      console.log('right',this.rightWidth);
    });

    this.resizeObserver.observe(this.leftEl);
    this.resizeObserver.observe(this.rightEl);
  }

  render() {
    return (
      <Host>
       <header class="med-navbar">
          <div class="med-navbar__left" ref={(el) => this.leftEl = el as HTMLDivElement}>
            <slot name="start"></slot>
          </div>
          <div class="med-navbar__center">
            <slot name="title"></slot>
            <slot name="subtitle"></slot>
          </div>
          <div class="med-navbar__right" ref={(el) => this.rightEl = el as HTMLDivElement}>
            <slot name="end"></slot>
          </div>
        </header>
      </Host>
    );
  }
}