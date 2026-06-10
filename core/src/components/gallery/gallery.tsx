import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Listen, Prop, Watch, h } from '@stencil/core';
import { isCssVariable, isValidLengthPercentage } from '@utils/css-value-validation';
import { raf } from '@utils/helpers';
import { printIonWarning } from '@utils/logging';

import { getIonTheme } from '../../global/ionic-global';

import { DEFAULT_COLUMNS, DEFAULT_GAP } from './gallery-constants';
import type { GalleryBreakpoints, GalleryColumns, GalleryGap } from './gallery-interface';

// TODO(FW-7285): Replace with global breakpoints
const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

type GalleryBreakpoint = keyof typeof BREAKPOINTS;
const BREAKPOINT_ORDER: GalleryBreakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

/**
 * The tag of the component used to wrap each gallery item.
 */
const GALLERY_ITEM_SELECTOR = 'ion-gallery-item';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @slot - One or more `ion-gallery-item` components, placed in a responsive
 * gallery layout.
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

  // Keep track of whether we've warned about invalid columns, invalid gap,
  // and unused order properties to avoid duplicate warnings on screen resize.
  private hasWarnedInvalidColumns = false;
  private hasWarnedInvalidGap = false;
  private hasWarnedUnusedOrder = false;
  private hasWarnedInvalidItems = false;

  /**
   * The visual layout of the gallery. When `uniform`, rows take up the height
   * of the tallest item and are spaced evenly across the gallery. Additionally,
   * items will have an aspect ratio of 1/1, forcing them to be square unless a
   * height is explicitly set. When `masonry`, items will be positioned under each
   * other with only the specified gap between them.
   */
  @Prop() layout: 'uniform' | 'masonry' = 'uniform';

  /**
   * The order in which items are positioned. Only applies when layout is
   * `masonry`. When `sequential`, items are positioned in the order they are
   * placed in the DOM. When `best-fit`, items are positioned under the column
   * with the most available space. Defaults to `sequential` when layout is
   * `masonry` and `order` is not explicitly set.
   */
  @Prop() order?: 'sequential' | 'best-fit';

  /**
   * The number of columns to display. Can be set as a number or an object of
   * breakpoint values (e.g. `{ xs: 2, sm: 3, md: 4 }`).
   */
  @Prop() columns: GalleryColumns = DEFAULT_COLUMNS;

  /**
   * The space between gallery items. Accepts valid CSS [length-percentage](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length-percentage)
   * values like `16px`, `1rem`, `20%`, math functions like `calc(10px + 20%)`,
   * CSS variables like `var(--app-gallery-gap)`, or numbers (treated as pixel
   * values). Can also be set as a breakpoint map
   * (e.g. `{ xs: '8px', sm: '1rem', md: '24px' }`). Does not accept
   * space-separated values or CSS keyword values like `inherit`, `auto`, etc.
   */
  @Prop() gap: GalleryGap = DEFAULT_GAP;

  @Watch('columns')
  @Watch('gap')
  protected onColumnsOrGapChanged() {
    this.syncResponsiveLayout();
  }

  @Watch('layout')
  @Watch('order')
  protected onLayoutOrOrderChanged() {
    this.syncResponsiveLayout();

    // Wait until the next animation frame to warn about unused order
    // to avoid erroneous warnings when the layout and order are updated
    // in the same frame.
    raf(() => {
      this.warnUnusedOrder();
    });
  }

  componentDidLoad() {
    this.collapseWrappers();
    this.updateResponsiveStyles(true);
    this.resizeObserver = new ResizeObserver(() => {
      this.updateResponsiveStyles();
      this.scheduleMasonryResize();
    });
    this.observeResizes();

    this.scheduleMasonryResize();

    this.warnUnusedOrder();
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
   * Observe the host and each item for size changes. Items are observed in
   * addition to the host so masonry placement is recomputed when an item's
   * rendered height changes — most importantly when a dynamically added
   * `ion-gallery-item` finishes hydrating, which (unlike an `<img>`) emits no
   * `load` event and does not change the host's measured size while collapsed.
   */
  private observeResizes() {
    const observer = this.resizeObserver;
    if (observer === undefined) {
      return;
    }

    observer.disconnect();
    observer.observe(this.el);
    this.getItems().forEach((item) => observer.observe(item));
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

    const target = ev.target;
    if (target instanceof Node && this.el.contains(target)) {
      this.scheduleMasonryResize();
    }
  }

  /**
   * Listen for the slotchange event on the slot. When the gallery's items are
   * added or removed, re-collapse wrappers, re-observe items for size changes,
   * and recompute the masonry grid.
   */
  private onSlotChange = () => {
    this.collapseWrappers();
    this.observeResizes();
    this.scheduleMasonryResize();
  };

  /**
   * Recompute the gallery column and gap variables and masonry placement when
   * columns, gap, layout, or order change.
   */
  private syncResponsiveLayout() {
    this.updateResponsiveStyles(true);
    this.scheduleMasonryResize();
  }

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
   * Normalize a single column value (`columns` as a number, string, or one entry from
   * a `columns` breakpoint map) to a positive integer. Returns `undefined` when
   * the input cannot be interpreted as a finite number.
   */
  private sanitizeColumns(columns: number | string | undefined): number | undefined {
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
   * Normalize a single gap value (`gap` as a number, a string such as a CSS
   * length-percentage or `var()` reference, or one entry from a `gap`
   * breakpoint map) to a CSS length string. Returns `undefined` when the
   * input cannot be interpreted as a valid CSS length or `var()` reference.
   */
  private sanitizeGap(gap: number | string | undefined): string | undefined {
    if (gap === undefined) {
      return undefined;
    }

    const normalizedGap = typeof gap === 'string' ? gap.trim() : gap;
    if (normalizedGap === '' || typeof normalizedGap === 'object') {
      return undefined;
    }

    const numericGap = Number(normalizedGap);
    if (Number.isFinite(numericGap)) {
      return numericGap < 0 ? undefined : `${numericGap}px`;
    }

    if (typeof normalizedGap !== 'string') {
      return undefined;
    }

    if (isCssVariable(normalizedGap)) {
      return normalizedGap;
    }

    const isValidCssLength = isValidLengthPercentage(normalizedGap);

    return isValidCssLength ? normalizedGap : undefined;
  }

  /**
   * Check if the value is a breakpoint map object.
   */
  private isBreakpointMap(value: unknown): value is GalleryBreakpoints {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  /**
   * Check if the breakpoint map has any invalid values for the provided
   * sanitizer. A breakpoint map is invalid when there are no valid breakpoint
   * keys set (e.g. `{}` or `{ colums: 3 }`), or when a value under a
   * breakpoint key fails the sanitizer (e.g. `{ xs: -3 }`, `{ sm: 'foo' }`).
   */
  private hasInvalidBreakpointMap(
    breakpointMap: GalleryBreakpoints,
    sanitizeValue: (value: string | number | undefined) => unknown
  ) {
    let hasBreakpointEntry = false;

    for (const breakpoint of BREAKPOINT_ORDER) {
      const value = breakpointMap[breakpoint];
      if (value !== undefined) {
        hasBreakpointEntry = true;
        if (sanitizeValue(value) === undefined) {
          return true;
        }
      }
    }

    return !hasBreakpointEntry;
  }

  /**
   * Resolve a responsive value from a breakpoint map.
   * Uses a breakpoint-specific default when custom values are missing/invalid.
   */
  private resolveFromBreakpoints<T>(
    width: number,
    breakpointMap: GalleryBreakpoints,
    sanitizeProvided: (value: string | number | undefined) => T | undefined,
    getSanitizedDefault: (breakpoint: GalleryBreakpoint) => T | undefined
  ) {
    let resolvedValue: T | undefined;

    for (const bp of BREAKPOINT_ORDER) {
      const providedValue = breakpointMap[bp];
      const sanitizedProvided = sanitizeProvided(providedValue);
      const sanitizedDefault = getSanitizedDefault(bp);
      const resolved =
        providedValue === undefined || sanitizedProvided === undefined ? sanitizedDefault : sanitizedProvided;

      if (resolved !== undefined && width >= BREAKPOINTS[bp]) {
        resolvedValue = resolved;
      }
    }

    return resolvedValue;
  }

  /**
   * Get the columns from a responsive breakpoint map.
   * Returns the columns for the last matching breakpoint.
   */
  private getColumnsFromBreakpointMap(width: number, breakpointMap: GalleryBreakpoints) {
    return this.resolveFromBreakpoints(
      width,
      breakpointMap,
      (value) => this.sanitizeColumns(value),
      (bp) => this.sanitizeColumns(DEFAULT_COLUMNS[bp])
    );
  }

  /**
   * Get the gap from a responsive breakpoint map.
   * Returns the gap for the last matching breakpoint.
   */
  private getGapFromBreakpointMap(width: number, breakpointMap: GalleryBreakpoints) {
    return this.resolveFromBreakpoints(
      width,
      breakpointMap,
      (value) => this.sanitizeGap(value),
      () => this.sanitizeGap(DEFAULT_GAP)
    );
  }

  /**
   * Warn about an invalid columns value when it is set to a negative number,
   * an empty breakpoint map, a map with no supported breakpoint keys,
   * or a map with invalid breakpoint values.
   */
  private warnInvalidColumns(columns: GalleryColumns) {
    if (this.hasWarnedInvalidColumns) {
      return;
    }

    printIonWarning(
      `[ion-gallery] - Invalid "columns" value (${JSON.stringify(
        columns
      )}). Expected a positive integer or breakpoint map object (e.g. { xs: 2, md: 4 }). Falling back to default responsive columns.`,
      this.el
    );
    this.hasWarnedInvalidColumns = true;
  }

  /**
   * Warn about an invalid gap value when it is set to a negative number,
   * an empty breakpoint map, a map with no supported breakpoint keys,
   * or a map with invalid breakpoint values.
   */
  private warnInvalidGap(gap: GalleryGap) {
    if (this.hasWarnedInvalidGap) {
      return;
    }

    printIonWarning(
      `[ion-gallery] - Invalid "gap" value (${JSON.stringify(
        gap
      )}). Expected a non-negative number, CSS length string, CSS variable (e.g. var(--app-gap)), or breakpoint map object (e.g. { xs: 8, md: "1rem" }).`,
      this.el
    );
    this.hasWarnedInvalidGap = true;
  }

  /**
   * Warn when `order` is explicitly set while layout is `uniform`.
   */
  private warnUnusedOrder() {
    const { layout } = this;
    const order = this.order == null ? undefined : this.order;

    if (this.hasWarnedUnusedOrder || layout !== 'uniform' || order === undefined) {
      return;
    }

    printIonWarning(
      `[ion-gallery] - "order" has no effect when "layout" is "uniform". Set "layout" to "masonry" for "order" to apply.`,
      this.el
    );
    this.hasWarnedUnusedOrder = true;
  }

  /**
   * Resolve the active columns value for the current width. Falls back to
   * the default responsive columns when the provided prop is invalid.
   */
  private getColumnsForWidth(width: number) {
    const { columns } = this;
    const isBreakpointColumns = this.isBreakpointMap(columns);
    const hasInvalidBreakpointColumns =
      isBreakpointColumns && this.hasInvalidBreakpointMap(columns, (value) => this.sanitizeColumns(value));

    const sanitizedColumns = isBreakpointColumns
      ? this.getColumnsFromBreakpointMap(width, columns)
      : this.sanitizeColumns(columns);

    if (hasInvalidBreakpointColumns || (!isBreakpointColumns && sanitizedColumns === undefined)) {
      this.warnInvalidColumns(columns);
    }

    if (sanitizedColumns !== undefined) {
      return sanitizedColumns;
    }

    return this.getColumnsFromBreakpointMap(width, DEFAULT_COLUMNS);
  }

  /**
   * Resolve the active gap value for the current width.
   */
  private getGapForWidth(width: number) {
    const { gap } = this;
    const providedGap = gap ?? DEFAULT_GAP;

    const isBreakpointGap = this.isBreakpointMap(providedGap);
    const hasInvalidBreakpointGap =
      isBreakpointGap && this.hasInvalidBreakpointMap(providedGap, (value) => this.sanitizeGap(value));
    const sanitizedGap = isBreakpointGap
      ? this.getGapFromBreakpointMap(width, providedGap)
      : this.sanitizeGap(providedGap);

    if (hasInvalidBreakpointGap || (!isBreakpointGap && sanitizedGap === undefined)) {
      this.warnInvalidGap(providedGap);
    }

    if (sanitizedGap !== undefined) {
      return sanitizedGap;
    }

    return this.sanitizeGap(DEFAULT_GAP);
  }

  /**
   * Update the responsive styles for the gallery. This is used to update
   * the columns and gap when the component width changes.
   */
  private updateResponsiveStyles(force = false) {
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

    const gap = this.getGapForWidth(width);
    this.el.style.setProperty('--internal-gallery-gap', `${gap}`);
  }

  /**
   * Return the `ion-gallery-item` elements to place in the grid. Each item is a
   * direct grid cell, whether a direct child or nested inside a pass-through
   * wrapper (e.g. a layout `<div>`). Items belonging to a nested `ion-gallery`
   * are excluded.
   */
  private getItems(): HTMLIonGalleryItemElement[] {
    return Array.from(this.el.querySelectorAll<HTMLIonGalleryItemElement>(GALLERY_ITEM_SELECTOR)).filter(
      (item) => item.closest('ion-gallery') === this.el
    );
  }

  /**
   * Collapse each pass-through wrapper's box with `display: contents` so its
   * items participate in the gallery grid. Restore the box of a wrapper that
   * no longer contains items, and warn about children that contain none.
   */
  private collapseWrappers() {
    const items = this.getItems();

    Array.from(this.el.children as HTMLCollectionOf<HTMLElement>).forEach((child) => {
      if (child.matches(GALLERY_ITEM_SELECTOR)) {
        return;
      }

      if (!items.some((item) => child.contains(item))) {
        // If the wrapper was previously collapsed with `display: contents`
        // but now contains no items, clear the display style.
        if (child.style.display === 'contents') {
          child.style.display = '';
        }
        this.warnInvalidItems();
        return;
      }

      // Collapse the wrapper's box so its items sit directly in the grid.
      child.style.display = 'contents';
    });
  }

  /**
   * Warn when the gallery has content that is not wrapped in an
   * `ion-gallery-item` component. Items belonging to a nested
   * gallery are considered invalid content for the parent gallery.
   */
  private warnInvalidItems() {
    if (this.hasWarnedInvalidItems) {
      return;
    }

    printIonWarning(
      `[ion-gallery] - Gallery items must be wrapped in "ion-gallery-item" components. Direct children that are not "ion-gallery-item" (and do not contain one) are ignored.`,
      this.el
    );
    this.hasWarnedInvalidItems = true;
  }

  /**
   * Clear the item styles for the given item element.
   * This is used to switch between uniform and masonry layouts.
   */
  private clearItemStyles(itemEl: HTMLIonGalleryItemElement) {
    itemEl.style.gridRowStart = '';
    itemEl.style.gridRowEnd = '';
    itemEl.style.gridColumn = '';
    itemEl.style.marginBottom = '';
  }

  /**
   * Clear placement styles for all items when leaving masonry mode.
   */
  private clearMasonryStyles() {
    this.getItems().forEach((itemEl) => this.clearItemStyles(itemEl));
  }

  /**
   * Whether the item contains any images that have not finished loading.
   * Used to defer masonry placement until the rendered height is final.
   */
  private hasUnloadedImages(itemEl: HTMLIonGalleryItemElement): boolean {
    return Array.from(itemEl.querySelectorAll('img')).some((img) => !img.complete || img.naturalHeight === 0);
  }

  /**
   * Convert a rendered item height to the number of grid rows it should span.
   * Returns undefined when the item has images that are not fully loaded yet.
   */
  private calculateRowSpan(itemEl: HTMLIonGalleryItemElement, rowHeight: number, rowGap: number) {
    if (this.hasUnloadedImages(itemEl)) {
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
    const order = this.getOrder();

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
  private layoutMasonry(items: HTMLIonGalleryItemElement[], rowHeight: number, rowGap: number, columns: number) {
    const columnHeights = new Array<number>(columns).fill(0);
    const lastItemsByColumn = new Array<HTMLIonGalleryItemElement | undefined>(columns).fill(undefined);

    items.forEach((itemEl, i) => {
      itemEl.style.marginBottom = '';
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
      lastItemsByColumn[columnIndex] = itemEl;
    });

    // Remove trailing space from the final item in each column while preserving
    // spacing between all non-final items.
    lastItemsByColumn.forEach((itemEl) => {
      if (itemEl === undefined) {
        return;
      }

      itemEl.style.marginBottom = '0px';
      const spanWithoutTrailingGap = this.calculateRowSpan(itemEl, rowHeight, rowGap);
      if (spanWithoutTrailingGap === undefined) {
        this.clearItemStyles(itemEl);
        return;
      }

      itemEl.style.gridRowEnd = `span ${spanWithoutTrailingGap}`;
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

    const width = this.el.getBoundingClientRect().width;
    const columns = this.getColumnsForWidth(width);

    // Skip masonry placement when width/columns does not resolve
    // to a valid breakpoint column count.
    if (columns === undefined) {
      return;
    }

    const styles = getComputedStyle(this.el);
    const rowHeight = parseFloat(styles.getPropertyValue('grid-auto-rows')) || 0;
    const rowGap = parseFloat(styles.getPropertyValue('row-gap')) || parseFloat(styles.getPropertyValue('gap')) || 0;
    const items = this.getItems();

    this.layoutMasonry(items, rowHeight, rowGap, columns);
  };

  /**
   * Resolved order for layout and CSS. Order should be `undefined` for
   * the uniform layout. When order is not set, it should be `"sequential"`
   * for the masonry layout.
   */
  private getOrder(): 'sequential' | 'best-fit' | undefined {
    const { layout } = this;
    const order = this.order == null ? undefined : this.order;

    if (layout === 'uniform') {
      return undefined;
    }

    if (layout === 'masonry' && order === undefined) {
      return 'sequential';
    }

    return order;
  }

  render() {
    const { layout } = this;
    const order = this.getOrder();
    const theme = getIonTheme(this);

    return (
      <Host
        class={{
          [theme]: true,
          [`gallery-layout-${layout}`]: true,
          [`gallery-order-${order}`]: layout === 'masonry' && order !== undefined,
        }}
      >
        <slot onSlotchange={this.onSlotChange} />
      </Host>
    );
  }
}
