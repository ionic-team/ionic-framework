import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Listen, Prop, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

// Interfaces would go in a separate file
export interface GridLayoutChangeEventDetail {
  layout: 'uniform' | 'masonry';
}

@Component({
  tag: 'ion-grid',
  styleUrl: 'grid.scss',
  shadow: true,
})
export class Grid implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * If `true`, the grid will have a fixed width based on the screen size.
   */
  @Prop() fixed = false;

  /**
   * The layout of the grid. The 'uniform' layout means the grid rows will have
   * a uniform height. The `masonry` layout means the grid rows will have a variable height.
   * based on the content of the rows, without gaps in between.
   * @default 'uniform'
   */
  @Prop() layout: 'uniform' | 'masonry' = 'uniform';

  /**
   * Emitted when the grid layout changes. This is used by row and col to
   * adjust their layout.
   *
   * @internal
   */
  @Event() gridLayoutChange!: EventEmitter<GridLayoutChangeEventDetail>;

  private masonryRaf?: number;

  private resizeMasonryItem(colEl: HTMLElement, rowHeight: number, rowGap: number) {
    const height = colEl.scrollHeight;
    const denominator = rowHeight + rowGap;

    if (!denominator || !isFinite(denominator)) {
      colEl.style.gridRowEnd = 'span 1';
      return;
    }

    const span = Math.ceil((height + rowGap) / denominator) || 1;

    colEl.style.gridRowEnd = `span ${span}`;
  }

  private resizeMasonryGrid = () => {
    if (this.layout !== 'masonry') {
      return;
    }

    const rows = Array.from(this.el.querySelectorAll('ion-row')) as HTMLElement[];

    rows.forEach((rowEl) => {
      const styles = getComputedStyle(rowEl);
      const rowHeight = parseFloat(styles.getPropertyValue('grid-auto-rows')) || 0;
      const rowGap = parseFloat(styles.getPropertyValue('gap')) || parseFloat(styles.getPropertyValue('row-gap')) || 0;

      const cols = Array.from(rowEl.querySelectorAll('ion-col')) as HTMLElement[];
      cols.forEach((colEl) => this.resizeMasonryItem(colEl, rowHeight, rowGap));
    });
  };

  private scheduleMasonryResize() {
    if (this.layout !== 'masonry') {
      return;
    }

    if (this.masonryRaf != null) {
      cancelAnimationFrame(this.masonryRaf);
    }

    this.masonryRaf = requestAnimationFrame(this.resizeMasonryGrid);
  }

  componentDidLoad() {
    this.scheduleMasonryResize();
    this.gridLayoutChange.emit({ layout: this.layout });
  }

  componentDidRender() {
    this.scheduleMasonryResize();
  }

  @Listen('resize', { target: 'window' })
  protected onWindowResize() {
    this.scheduleMasonryResize();
  }

  @Watch('layout')
  protected layoutChanged(newLayout: 'uniform' | 'masonry') {
    this.scheduleMasonryResize();
    this.gridLayoutChange.emit({ layout: newLayout });
  }

  render() {
    const { fixed, layout } = this;
    const mode = getIonMode(this);

    return (
      <Host
        class={{
          [mode]: true,
          'grid-fixed': fixed,
          [`grid-layout-${layout}`]: layout !== undefined,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
