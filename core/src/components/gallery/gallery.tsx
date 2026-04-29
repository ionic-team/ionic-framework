import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Listen, Prop, Watch, h } from '@stencil/core';
import { printIonWarning } from '@utils/logging';

import { getIonTheme } from '../../global/ionic-global';

import type { GalleryBreakpointColumns, GalleryColumns } from './gallery-interface';

// TODO(FW-7285): Replace with global breakpoints
const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

const DEFAULT_COLUMNS = {
  xs: 2,
  sm: 3,
  md: 4,
  lg: 6,
  xl: 8,
  xxl: 10,
};

type GalleryBreakpoint = keyof typeof BREAKPOINTS;
const BREAKPOINT_ORDER: GalleryBreakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @slot - Content is placed in a responsive gallery layout.
 */
@Component({
  tag: 'ion-gallery',
  styleUrl: 'gallery.scss',
  shadow: true,
})
export class Gallery implements ComponentInterface {
  @Element() el!: HTMLIonGalleryElement;

  private masonryRaf?: number;
  private resizeObserver?: ResizeObserver;
  private lastWidth?: number;

  // Keep track of whether we've warned about invalid columns to avoid
  // duplicate warnings on screen resize.
  private hasWarnedInvalidColumns = false;

  /**
   * The visual layout of the gallery. When `uniform`, rows take up the height
   * of the tallest item and are spaced evenly across the gallery. Additionally,
   * items will have an aspect ratio of 1/1, forcing them to be square unless a
   * height is explicitly set. When `masonry`, items will be positioned under each
   * other with only the specified gap between them.
   */
  @Prop({ reflect: true }) layout: 'uniform' | 'masonry' = 'uniform';

  /**
   * The order in which items are positioned. Only applies when layout is
   * `masonry`. When `sequential`, items are positioned in the order they are
   * placed in the DOM. When `best-fit`, items are positioned under the column
   * with the most available space.
   */
  @Prop({ reflect: true }) order: 'sequential' | 'best-fit' = 'sequential';

  /**
   * The number of columns to display. Can be set as a number or an object of
   * breakpoint values (e.g. `{ xs: 2, sm: 3, md: 4 }`).
   */
  @Prop() columns: GalleryColumns = DEFAULT_COLUMNS;

  @Watch('layout')
  @Watch('order')
  @Watch('columns')
  protected layoutChanged() {
    this.updateResponsiveColumns(true);
    this.scheduleMasonryResize();
  }

  componentDidLoad() {
    this.updateResponsiveColumns(true);
    this.resizeObserver = new ResizeObserver(() => {
      this.updateResponsiveColumns();
      this.scheduleMasonryResize();
    });
    this.resizeObserver.observe(this.el);

    this.scheduleMasonryResize();
  }

  disconnectedCallback() {
    if (this.masonryRaf !== undefined) {
      cancelAnimationFrame(this.masonryRaf);
      this.masonryRaf = undefined;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
  }

  /**
   * Listen for the load event on child elements.
   * When the layout is `masonry`, this listener is used to schedule a resize
   * of the masonry grid when the child elements load. This is useful for when
   * images take time to load.
   */
  @Listen('load', { capture: true })
  protected onChildLoad(ev: Event) {
    if (this.layout !== 'masonry') {
      return;
    }

    const target = ev.target as HTMLElement | null;
    if (target !== null && this.el.contains(target)) {
      this.scheduleMasonryResize();
    }
  }

  /**
   * Listen for the slotchange event on the slot.
   * When the layout is `masonry`, this listener is used to schedule a resize
   * of the masonry grid when the slot changes. This is useful for when items
   * are added or removed from the gallery.
   */
  private onSlotChange = () => {
    this.scheduleMasonryResize();
  };

  /**
   * Batch masonry measurements to a single animation frame.
   * This avoids repeated sync layouts during rapid resize/load/slot changes.
   */
  private scheduleMasonryResize() {
    if (this.layout !== 'masonry') {
      this.clearMasonryStyles();
      return;
    }

    if (this.masonryRaf !== undefined) {
      cancelAnimationFrame(this.masonryRaf);
    }

    this.masonryRaf = requestAnimationFrame(this.resizeMasonryGrid);
  }

  /**
   * Normalize a columns value to a positive integer.
   * Returns undefined when the input cannot be interpreted as a finite number.
   */
  private sanitizeColumns(columns: number | string | undefined) {
    if (columns === undefined) {
      return undefined;
    }

    const numericColumns = typeof columns === 'number' ? columns : Number(columns);

    if (!Number.isFinite(numericColumns) || !Number.isInteger(numericColumns) || numericColumns <= 0) {
      return undefined;
    }

    return numericColumns;
  }

  /**
   * Check if the value is a breakpoint columns object.
   */
  private isBreakpointColumns(value: GalleryColumns): value is GalleryBreakpointColumns {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  /**
   * Check if the breakpoint columns object has any invalid values.
   * Returns true if any value is undefined or not a positive integer.
   */
  private hasInvalidBreakpointColumns(breakpointColumns: GalleryBreakpointColumns) {
    for (const breakpoint of BREAKPOINT_ORDER) {
      const value = breakpointColumns[breakpoint];
      if (value !== undefined && this.sanitizeColumns(value) === undefined) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get the columns from a responsive breakpoint map.
   * Returns the columns for the last matching breakpoint.
   */
  private getColumnsFromBreakpointColumns(width: number, breakpointColumns: GalleryBreakpointColumns) {
    let columns: number | undefined;
    for (const bp of BREAKPOINT_ORDER) {
      const customValue = breakpointColumns[bp];
      const parsedCustom = this.sanitizeColumns(customValue);
      const parsedDefault = this.sanitizeColumns(DEFAULT_COLUMNS[bp]);

      // Use valid custom values when present; otherwise fall back to defaults per breakpoint.
      const resolved = customValue === undefined || parsedCustom === undefined ? parsedDefault : parsedCustom;

      if (resolved !== undefined && width >= BREAKPOINTS[bp]) {
        columns = resolved;
      }
    }
    return columns;
  }

  /**
   * Warn about an invalid columns value when it is set to a non-positive
   * integer or a breakpoint map object with invalid values.
   */
  private warnInvalidColumns(columns: GalleryColumns) {
    printIonWarning(
      `[ion-gallery] - Invalid "columns" value (${JSON.stringify(
        columns
      )}). Expected a positive integer or breakpoint map object (e.g. { xs: 2, md: 4 }). Falling back to default responsive columns.`,
      this.el
    );
    this.hasWarnedInvalidColumns = true;
  }

  /**
   * Resolve the active columns value for the current width. Falls back to
   * the default responsive columns when the provided prop is invalid.
   */
  private getColumnsForWidth(width: number) {
    const { columns, hasWarnedInvalidColumns } = this;
    const isBreakpointColumns = this.isBreakpointColumns(columns);
    const hasInvalidBreakpointColumns = isBreakpointColumns && this.hasInvalidBreakpointColumns(columns);

    const sanitizedColumns = isBreakpointColumns
      ? this.getColumnsFromBreakpointColumns(width, columns)
      : this.sanitizeColumns(columns);

    if (
      !hasWarnedInvalidColumns &&
      (hasInvalidBreakpointColumns || (!isBreakpointColumns && sanitizedColumns === undefined))
    ) {
      this.warnInvalidColumns(columns);
    }

    if (sanitizedColumns !== undefined) {
      return sanitizedColumns;
    }

    return this.getColumnsFromBreakpointColumns(width, DEFAULT_COLUMNS);
  }

  /**
   * Update the responsive columns for the gallery.
   * This is used to update the columns when the component width changes.
   */
  private updateResponsiveColumns(force = false) {
    const width = this.el.getBoundingClientRect().width;

    // Only update the columns if the component width has changed by more than
    // 1px or if the force flag is true. This prevents unnecessary re-renders
    // when the component width has not changed.
    if (!width || (!force && this.lastWidth !== undefined && Math.abs(this.lastWidth - width) < 1)) {
      return;
    }

    this.lastWidth = width;

    const columns = this.getColumnsForWidth(width);
    this.el.style.setProperty('--internal-gallery-columns', `${columns}`);
  }

  /**
   * Return all directly slotted HTMLElement children of the gallery.
   */
  private getItems() {
    return Array.from(this.el.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
  }

  /**
   * Clear the item styles for the given item element.
   * This is used to switch between uniform and masonry layouts.
   */
  private clearItemStyles(itemEl: HTMLElement) {
    itemEl.style.gridRowStart = '';
    itemEl.style.gridRowEnd = '';
    itemEl.style.gridColumn = '';
  }

  /**
   * Clear placement styles for all items when leaving masonry mode.
   */
  private clearMasonryStyles() {
    this.getItems().forEach((itemEl) => this.clearItemStyles(itemEl));
  }

  /**
   * Convert a rendered item height to the number of grid rows it should span.
   * Returns undefined for images that are not fully loaded yet.
   */
  private calculateRowSpan(itemEl: HTMLElement, rowHeight: number, rowGap: number) {
    if (itemEl instanceof HTMLImageElement && (!itemEl.complete || itemEl.naturalHeight === 0)) {
      return undefined;
    }

    const height = itemEl.getBoundingClientRect().height;
    const itemStyles = getComputedStyle(itemEl);
    const marginBottom = parseFloat(itemStyles.getPropertyValue('margin-bottom')) || 0;
    const denominator = rowHeight + rowGap;

    if (!denominator || !Number.isFinite(denominator)) {
      return 1;
    }

    return Math.ceil((height + marginBottom + rowGap) / denominator) || 1;
  }

  /**
   * Get the index of the column to position the item in.
   * When the order is `best-fit`, the column with the shortest height is
   * returned. Otherwise, items are placed in the column that matches their
   * natural DOM order.
   */
  private getColumnIndex(index: number, columnHeights: number[], columns: number) {
    const { order } = this;

    if (order === 'best-fit') {
      let columnIndex = 0;
      for (let i = 1; i < columns; i++) {
        if (columnHeights[i] < columnHeights[columnIndex]) {
          columnIndex = i;
        }
      }
      return columnIndex;
    }

    return index % columns;
  }

  /**
   * Apply masonry placement by assigning each item a column and row span.
   */
  private layoutMasonry(items: HTMLElement[], rowHeight: number, rowGap: number, columns: number) {
    const columnHeights = new Array<number>(columns).fill(0);

    items.forEach((itemEl, i) => {
      const span = this.calculateRowSpan(itemEl, rowHeight, rowGap);
      if (span === undefined) {
        this.clearItemStyles(itemEl);
        return;
      }

      const columnIndex = this.getColumnIndex(i, columnHeights, columns);
      const start = columnHeights[columnIndex] + 1;

      itemEl.style.gridColumn = `${columnIndex + 1}`;
      itemEl.style.gridRowStart = `${start}`;
      itemEl.style.gridRowEnd = `span ${span}`;
      columnHeights[columnIndex] = start + span - 1;
    });
  }

  /**
   * Measure the host and children, then compute masonry placement.
   */
  private resizeMasonryGrid = () => {
    this.masonryRaf = undefined;

    if (this.layout !== 'masonry') {
      this.clearMasonryStyles();
      return;
    }

    const styles = getComputedStyle(this.el);
    const rowHeight = parseFloat(styles.getPropertyValue('grid-auto-rows')) || 0;
    const rowGap = parseFloat(styles.getPropertyValue('row-gap')) || parseFloat(styles.getPropertyValue('gap')) || 0;
    const columnsStr = styles.getPropertyValue('--internal-gallery-columns');
    // Fallback to 2 columns for masonry calculations when the resolved
    // --internal-gallery-columns CSS value is missing or unparsable.
    const columns = parseInt(columnsStr, 10) || 2;
    const items = this.getItems();

    this.layoutMasonry(items, rowHeight, rowGap, columns);
  };

  render() {
    const { layout, order } = this;
    const theme = getIonTheme(this);

    return (
      <Host
        class={{
          [theme]: true,
          [`gallery-layout-${layout}`]: true,
          [`gallery-order-${order}`]: layout === 'masonry',
        }}
      >
        <slot onSlotchange={this.onSlotChange} />
      </Host>
    );
  }
}
