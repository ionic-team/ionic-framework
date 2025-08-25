import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Listen, Prop, forceUpdate, h } from '@stencil/core';
import { matchBreakpoint } from '@utils/media';

import { getIonTheme } from '../../global/ionic-global';

const win = typeof (window as any) !== 'undefined' ? (window as any) : undefined;
// eslint-disable-next-line @typescript-eslint/prefer-optional-chain
const SUPPORTS_VARS = win && !!(win.CSS && win.CSS.supports && win.CSS.supports('--a: 0'));
const BREAKPOINTS = ['', 'xs', 'sm', 'md', 'lg', 'xl'];

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-col',
  styleUrl: 'col.scss',
  shadow: true,
})
export class Col implements ComponentInterface {
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
    forceUpdate(this);
  }

  // Loop through all of the breakpoints to see if the media query
  // matches and grab the column value from the relevant prop if so
  private getColumns(property: string) {
    let matched;

    for (const breakpoint of BREAKPOINTS) {
      const matches = matchBreakpoint(breakpoint);

      // Grab the value of the property, if it exists and our
      // media query matches we return the value
      const columns = (this as any)[property + breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)];

      if (matches && columns !== undefined) {
        matched = columns;
      }
    }

    // Return the last matched columns since the breakpoints
    // increase in size and we want to return the largest match
    return matched;
  }

  private getSizeClass(): string | undefined {
    const colSize = this.getColumns('size');

    // If size wasn't set for any breakpoint
    // or if the user set the size without a value
    // it means we need to stick with the default and return
    // e.g. <ion-col size-md>
    if (!colSize || colSize === '') {
      return;
    }

    if (colSize === 'auto') {
      return 'ion-grid-auto';
    }

    const colNum = parseInt(colSize);

    if(isNaN(colNum)) {
      return;
    }

    return `ion-grid-col-${colSize}`;
  }

  private getOrderClass(): string | undefined {
    const colOrder = this.getColumns('order');

    if (!colOrder || colOrder === '') {
      return;
    }

    const colNum = parseInt(colOrder);

    if (isNaN(colNum)) {
      return;
    }

    return `ion-grid-order-${colOrder}`;
  }


  private getOffsetClass(): string | undefined {
    const colOffset = this.getColumns('offset');

    if (!colOffset || colOffset === '') {
      return;
    }

    const colNum = parseInt(colOffset);

    if (isNaN(colNum)) {
      return;
    }

    return `ion-grid-offset-col-${colOffset}`;
  }

  render() {
    const theme = getIonTheme(this);

    const colSize = this.getSizeClass();
    const colOrder = this.getOrderClass();
    const colOffset = this.getOffsetClass();

    return (
      <Host
        class={{
          [theme]: true,
          [`${colSize}`]: colSize !== undefined,
          [`${colOrder}`]: colOrder !== undefined,
          [`${colOffset}`]: colOffset !== undefined
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
