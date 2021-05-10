import { Component, Host, h, Element, Event, EventEmitter } from '@stencil/core';
import ResizeObserver from "resize-observer-polyfill";
import { navbarResizeEventDetail } from './med-navbar-interface';

@Component({
  tag: 'med-navbar',
  styleUrl: 'med-navbar.scss',
  shadow: true,
})
export class MedNavbar {
  @Element() el!: HTMLElement;
  @Event() medResize!: EventEmitter<navbarResizeEventDetail>;

  private leftEl!: HTMLDivElement;
  private rightEl!: HTMLDivElement;
  private centerEl!: HTMLDivElement;

  private sidesResizeObserver!: ResizeObserver;

  componentDidLoad() {
    this.setSize();
  }

  disconnectedCallback() {
    this.sidesResizeObserver.disconnect();
  }

  private setSize() {
    this.sidesResizeObserver = new ResizeObserver((entries: any) => {
      for (let entry of entries) {
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

    this.sidesResizeObserver.observe(this.leftEl);
    this.sidesResizeObserver.observe(this.rightEl);
  }

  render() {
    return (
      <Host class="med-navbar" from-stencil>
        <header class="header">
          <slot name="top"></slot>

          <div class="header__container">
            <div id="left" class="left" ref={(el) => this.leftEl = el as HTMLDivElement}>
              <slot name="left"></slot>
            </div>

            <div class="center" ref={(el) => this.centerEl = el as HTMLDivElement}>

              <slot name="title"></slot>
              <slot name="subtitle"></slot>

            </div>

            <div id="right" class="right" ref={(el) => this.rightEl = el as HTMLDivElement}>
              <slot name="right"></slot>
            </div>
          </div>

        </header>
      </Host>
    );
  }
}
