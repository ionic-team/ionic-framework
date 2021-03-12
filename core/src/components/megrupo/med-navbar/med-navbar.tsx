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
  
  private marginRight: string;
  private marginLeft: string;

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

        const rightWidth = this.rightEl.getBoundingClientRect().width;
        const leftWidth = this.leftEl.getBoundingClientRect().width;
        const leftDiff = Math.round(entry.contentRect.width - rightWidth);
        const rightDiff = Math.round(entry.contentRect.width - leftWidth);

        let marginLeft = '0';
        let marginRight = '0';

        if (rightWidth !== leftWidth) {
          if (entry.target.id === 'left') { 
            if (leftDiff > 0) {
              marginRight = `${leftDiff}`;
            } else {
              marginLeft = `${rightDiff - leftDiff}`;
            }
          } else if (entry.target.id === 'right') {
            if (rightDiff > 0) {
              marginLeft = `${rightDiff}`;
            } else {
              marginLeft = `${rightDiff - leftDiff}`;
            }
          }
        }

        /* if(this.marginRight !== marginRight && this.marginLeft !== marginLeft) {
          this.centerEl.style.setProperty('--margin-right',`${marginRight}px`);
          this.centerEl.style.setProperty('--margin-left',`${marginLeft}px`);

          console.log(this.marginRight);
          console.log(this.marginLeft);
        } */

        this.centerEl.style.setProperty('--margin-right',`${marginRight}px`);
        this.centerEl.style.setProperty('--margin-left',`${marginLeft}px`);
        
       /*  this.marginRight = marginRight;
        this.marginLeft = marginLeft; */
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