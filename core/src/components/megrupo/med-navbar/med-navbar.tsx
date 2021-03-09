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
  private headerEl!: HTMLDivElement; // emitir quando a altura do header mudar

  private resizeObserver!: ResizeObserver;

  componentDidLoad() {
    window.requestAnimationFrame(this.setSize.bind(this));
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

        if (rightWidth === leftWidth) {
          this.centerEl.style.setProperty('--margin-right','0');
          this.centerEl.style.setProperty('--margin-left','0');
          return;
        } 

        if(entry.target.id === 'left') {
          if (leftDiff > 0) {
            this.centerEl.style.setProperty('--margin-right',`${leftDiff}px`);
            this.centerEl.style.setProperty('--margin-left',`0px`);
          } else {
            this.centerEl.style.setProperty('--margin-left',`${rightDiff - leftDiff}px`);
            this.centerEl.style.setProperty('--margin-right',`0px`);
          }
        } else if (entry.target.id === 'right') {
          if (rightDiff > 0) {
            this.centerEl.style.setProperty('--margin-left',`${rightDiff}px`);
            this.centerEl.style.setProperty('--margin-right',`0px`);
          } else {
            this.centerEl.style.setProperty('--margin-left',`${rightDiff - leftDiff}px`);
            this.centerEl.style.setProperty('--margin-right',`0px`);
          }
        }
      }
    });

    this.resizeObserver.observe(this.leftEl);
    this.resizeObserver.observe(this.rightEl);
    this.resizeObserver.observe(this.headerEl);
  }

  render() {
    return (
      <Host from-stencil>
        <header class="header" ref={(el) => this.headerEl = el as HTMLDivElement}>
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