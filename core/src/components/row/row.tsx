import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, State, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import type { GridLayoutChangeEventDetail } from '../grid/grid';

@Component({
  tag: 'ion-row',
  styleUrl: 'row.scss',
  shadow: true,
})
export class Row implements ComponentInterface {
  @Element() el!: HTMLElement;

  @State() private layout: 'uniform' | 'masonry' = 'uniform';

  private grid: HTMLIonGridElement | null = null;

  private onGridLayoutChange = (ev: CustomEvent<GridLayoutChangeEventDetail>) => {
    this.layout = ev.detail.layout;
  };

  connectedCallback() {
    this.grid = this.el.closest('ion-grid');

    if (this.grid) {
      this.layout = this.grid.layout;

      this.grid.addEventListener('gridLayoutChange', this.onGridLayoutChange);
    }
  }

  disconnectedCallback() {
    if (this.grid) {
      this.grid.removeEventListener('gridLayoutChange', this.onGridLayoutChange);
      this.grid = null;
    }
  }

  render() {
    const mode = getIonMode(this);

    return (
      <Host
        class={{
          [mode]: true,
          'in-grid-masonry': this.layout === 'masonry',
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
