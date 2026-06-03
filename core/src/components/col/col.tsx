import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Listen, Prop, forceUpdate, h } from '@stencil/core';
import { printIonWarning } from '@utils/logging';
import { matchBreakpoint } from '@utils/media';

import type { IonColProperty, IonColStyle } from './col.interface';
import { ION_COL_BREAKPOINTS } from './col.interface';

const BREAKPOINTS = ['', ...ION_COL_BREAKPOINTS] as const;

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 */
@Component({
  tag: 'ion-col',
  styleUrl: 'col.scss',
  shadow: true,
})
export class Col implements ComponentInterface {
  private resizeTimeout: ReturnType<typeof setTimeout> | null = null;

  @Element() el!: HTMLIonColElement;
  /**
   * The amount to offset the column, in terms of how many columns it should shift to the end
   * of the total available.
   */
  @Prop() offset?: string;

  /**
   * The amount to offset the column for xs screens, in terms of how many columns it should shift
   * to the end of the total available.
   */
  @Prop() offsetXs?: string;

  /**
   * The amount to offset the column for sm screens, in terms of how many columns it should shift
   * to the end of the total available.
   */
  @Prop() offsetSm?: string;

  /**
   * The amount to offset the column for md screens, in terms of how many columns it should shift
   * to the end of the total available.
   */
  @Prop() offsetMd?: string;

  /**
   * The amount to offset the column for lg screens, in terms of how many columns it should shift
   * to the end of the total available.
   */
  @Prop() offsetLg?: string;

  /**
   * The amount to offset the column for xl screens, in terms of how many columns it should shift
   * to the end of the total available.
   */
  @Prop() offsetXl?: string;

  /**
   * The order of the column, in terms of where the column should position itself in the columns renderer.
   * If no value is passed, the column order implicit value will be the order in the html structure.
   */
  @Prop() order?: string;

  /**
   * The order of the column for xs screens, in terms of where the column should position itself in the columns renderer.
   * If no value is passed, the column order implicit value will be the order in the html structure.
   */
  @Prop() orderXs?: string;

  /**
   * The order of the column for sm screens, in terms of where the column should position itself in the columns renderer.
   * If no value is passed, the column order implicit value will be the order in the html structure.
   */
  @Prop() orderSm?: string;

  /**
   * The order of the column for md screens, in terms of where the column should position itself in the columns renderer.
   * If no value is passed, the column order implicit value will be the order in the html structure.
   */
  @Prop() orderMd?: string;

  /**
   * The order of the column for lg screens, in terms of where the column should position itself in the columns renderer.
   * If no value is passed, the column order implicit value will be the order in the html structure.
   */
  @Prop() orderLg?: string;

  /**
   * The order of the column for xl screens, in terms of where the column should position itself in the columns renderer.
   * If no value is passed, the column order implicit value will be the order in the html structure.
   */
  @Prop() orderXl?: string;

  // TODO(FW-7557): Remove this in a major release.
  /**
   * The amount to pull the column, in terms of how many columns it should shift to the start of
   * the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pull?: string;
  // TODO(FW-7557): Remove this in a major release.
  /**
   * The amount to pull the column for xs screens, in terms of how many columns it should shift
   * to the start of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pullXs?: string;
  // TODO(FW-7557): Remove this in a major release.
  /**
   * The amount to pull the column for sm screens, in terms of how many columns it should shift
   * to the start of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pullSm?: string;
  // TODO(FW-7557): Remove this in a major release.
  /**
   * The amount to pull the column for md screens, in terms of how many columns it should shift
   * to the start of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pullMd?: string;
  // TODO(FW-7557): Remove this in a major release.
  /**
   * The amount to pull the column for lg screens, in terms of how many columns it should shift
   * to the start of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pullLg?: string;
  // TODO(FW-7557): Remove this in a major release.
  /**
   * The amount to pull the column for xl screens, in terms of how many columns it should shift
   * to the start of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pullXl?: string;
  // TODO(FW-7557): Remove this in a major release.
  /**
   * The amount to push the column, in terms of how many columns it should shift to the end
   * of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() push?: string;
  // TODO(FW-7557): Remove this in a major release.
  /**
   * The amount to push the column for xs screens, in terms of how many columns it should shift
   * to the end of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pushXs?: string;
  // TODO(FW-7557): Remove this in a major release.
  /**
   * The amount to push the column for sm screens, in terms of how many columns it should shift
   * to the end of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pushSm?: string;
  // TODO(FW-7557): Remove this in a major release.
  /**
   * The amount to push the column for md screens, in terms of how many columns it should shift
   * to the end of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pushMd?: string;
  // TODO(FW-7557): Remove this in a major release.
  /**
   * The amount to push the column for lg screens, in terms of how many columns it should shift
   * to the end of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pushLg?: string;
  // TODO(FW-7557): Remove this in a major release.
  /**
   * The amount to push the column for xl screens, in terms of how many columns it should shift
   * to the end of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pushXl?: string;

  /**
   * The size of the column, in terms of how many columns it should take up out of the total
   * available. If `"auto"` is passed, the column will be the size of its content.
   */
  @Prop() size?: string;

  /**
   * The size of the column for xs screens, in terms of how many columns it should take up out
   * of the total available. If `"auto"` is passed, the column will be the size of its content.
   */
  @Prop() sizeXs?: string;

  /**
   * The size of the column for sm screens, in terms of how many columns it should take up out
   * of the total available. If `"auto"` is passed, the column will be the size of its content.
   */
  @Prop() sizeSm?: string;

  /**
   * The size of the column for md screens, in terms of how many columns it should take up out
   * of the total available. If `"auto"` is passed, the column will be the size of its content.
   */
  @Prop() sizeMd?: string;

  /**
   * The size of the column for lg screens, in terms of how many columns it should take up out
   * of the total available. If `"auto"` is passed, the column will be the size of its content.
   */
  @Prop() sizeLg?: string;

  /**
   * The size of the column for xl screens, in terms of how many columns it should take up out
   * of the total available. If `"auto"` is passed, the column will be the size of its content.
   */
  @Prop() sizeXl?: string;

  @Listen('resize', { target: 'window' })
  onResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }

    this.resizeTimeout = setTimeout(() => {
      forceUpdate(this);
    }, 100);
  }

  disconnectedCallback() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
  }

  // Loop through all of the breakpoints to see if the media query
  // matches and grab the column value from the relevant prop if so
  private getColumns(property: IonColProperty): string | undefined {
    let matched: string | undefined;

    for (const breakpoint of BREAKPOINTS) {
      const matches = matchBreakpoint(breakpoint);

      // Grab the value of the property, if it exists and our
      // media query matches we return the value
      const columns = this[(property + breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)) as keyof this] as
        | string
        | undefined;

      if (matches && columns !== undefined) {
        matched = columns;
      }
    }

    // Return the last matched columns since the breakpoints
    // increase in size and we want to return the largest match
    return matched;
  }

  private getColumnValue(property: IonColProperty): number | undefined {
    const colPropertyValue = this.getColumns(property);

    /**
     * Return early when no value matched any breakpoint, or when the
     * matched value is an empty string. The empty-string case comes
     * from a value-less HTML attribute (e.g. `<ion-col size-md>`) —
     * the attribute is present but carries no width, so the column
     * falls back to the default flex layout.
     */
    if (!colPropertyValue || colPropertyValue === '') {
      return;
    }

    const valueNumber = parseInt(colPropertyValue, 10);

    // Non-numeric values (including "auto") have no numeric span/offset/order.
    return isNaN(valueNumber) ? undefined : valueNumber;
  }

  /**
   * Builds the inline custom properties that drive the token-based calc() in
   * col.scss. Feeding the span/offset multipliers and order as inline values
   * lets any column count work against `--ion-grid-columns` without a
   * build-time class cap.
   */
  private getColumnStyle(size: number | undefined, order: number | undefined, offset: number | undefined): IonColStyle {
    const style: IonColStyle = {};

    if (size !== undefined) {
      style['--internal-col-span'] = `${size}`;
    }
    if (order !== undefined) {
      style['order'] = `${order}`;
    }
    if (offset !== undefined) {
      style['--internal-col-margin'] = `${offset}`;
    }

    return style;
  }

  componentDidLoad() {
    if (
      this.pull ||
      this.pullLg ||
      this.pullMd ||
      this.pullSm ||
      this.pullXl ||
      this.pullXs ||
      this.push ||
      this.pushLg ||
      this.pushMd ||
      this.pushSm ||
      this.pushXl ||
      this.pushXs
    ) {
      printIonWarning(
        '[ion-col] - The pull and push properties are deprecated and no longer work, in favor of the order and size properties.',
        this.el
      );
    }
  }

  render() {
    const size = this.getColumnValue('size');
    const order = this.getColumnValue('order');
    const offset = this.getColumnValue('offset');
    const isAutoSize = this.getColumns('size') === 'auto';

    return (
      <Host
        class={{
          'col-size': size !== undefined,
          'col-auto': isAutoSize,
          'col-offset': offset !== undefined,
        }}
        style={this.getColumnStyle(size, order, offset)}
      >
        <slot></slot>
      </Host>
    );
  }
}
