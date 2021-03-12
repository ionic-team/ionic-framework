import { Component, Host, h } from '@stencil/core';
import ResizeObserver from "resize-observer-polyfill";

@Component({
  tag: 'med-navbar',
  styleUrl: 'med-navbar.scss',
  shadow: true,
})
export class MedNavbar {
  private leftEl!: HTMLDivElement;
  private rightEl!: HTMLDivElement;
  private centerEl!: HTMLDivElement;

  private resizeObserver!: ResizeObserver;

  componentDidLoad() {
    this.setSize();
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  private setSize() {
    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        console.log('Element:', entry.target.id);
        console.log('Size:', entry.contentRect.width);

        const rightWidth = Number(this.rightEl.getBoundingClientRect().width);
        const leftWidth = Number(this.leftEl.getBoundingClientRect().width);
        const leftDiff = entry.contentRect.width - rightWidth;
        const rightDiff = entry.contentRect.width - leftWidth;

        let marginLeft = 0;
        let marginRight = 0;

        if (rightWidth !== leftWidth) {
          if (entry.target.id === 'left') { 
            if (leftDiff > 0) {
              marginRight = leftDiff;
            } else {
              marginLeft = rightDiff - leftDiff;
              if (marginLeft < 0) {
                marginLeft *= -1;
              }
            }
          } else if (entry.target.id === 'right') {
            if (rightDiff > 0) {
              marginLeft = rightDiff;
            } else {
              marginRight = rightDiff - leftDiff;
              if (marginRight < 0) {
                marginRight *= -1;
              }
            }
          }
        }

        this.centerEl.style.setProperty('--padding-left',`${marginLeft}px`);
        this.centerEl.style.setProperty('--padding-right',`${marginRight}px`);
      }
    });

    this.resizeObserver.observe(this.leftEl);
    this.resizeObserver.observe(this.rightEl);
  }

  render() {
    return (
      <Host from-stencil>
        <header class="header">
          <div id="left" class="left" ref={(el) => this.leftEl = el as HTMLDivElement}>
            <slot name="start"></slot>
          </div>
          <div class="center" ref={(el) => this.centerEl = el as HTMLDivElement}>
            <div class="title">
              <slot name="title"></slot>
              <slot name="subtitle"></slot>
            </div>
          </div>
          <div id="right" class="right" ref={(el) => this.rightEl = el as HTMLDivElement}>
            <slot name="end"></slot>
          </div>
        </header>
      </Host>
    );
  }
}