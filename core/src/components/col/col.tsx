import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Listen, Prop, forceUpdate, h } from '@stencil/core';
import { printIonWarning } from '@utils/logging';
import { matchBreakpoint } from '@utils/media';

import { getIonTheme } from '../../global/ionic-global';

// eslint-disable-next-line @typescript-eslint/prefer-optional-chain
const BREAKPOINTS = ['', 'xs', 'sm', 'md', 'lg', 'xl'];

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-col',
  styleUrls: {
    ios: 'col.scss',
    md: 'col.scss',
    ionic: 'col.ionic.scss',
  },
  shadow: true,
})
export class Col implements ComponentInterface {
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

  /**
   * The amount to pull the column, in terms of how many columns it should shift to the start of
   * the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pull?: string;
  /**
   * The amount to pull the column for xs screens, in terms of how many columns it should shift
   * to the start of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pullXs?: string;
  /**
   * The amount to pull the column for sm screens, in terms of how many columns it should shift
   * to the start of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pullSm?: string;
  /**
   * The amount to pull the column for md screens, in terms of how many columns it should shift
   * to the start of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pullMd?: string;
  /**
   * The amount to pull the column for lg screens, in terms of how many columns it should shift
   * to the start of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pullLg?: string;
  /**
   * The amount to pull the column for xl screens, in terms of how many columns it should shift
   * to the start of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pullXl?: string;
  /**
   * The amount to push the column, in terms of how many columns it should shift to the end
   * of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() push?: string;
  /**
   * The amount to push the column for xs screens, in terms of how many columns it should shift
   * to the end of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pushXs?: string;
  /**
   * The amount to push the column for sm screens, in terms of how many columns it should shift
   * to the end of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pushSm?: string;
  /**
   * The amount to push the column for md screens, in terms of how many columns it should shift
   * to the end of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pushMd?: string;
  /**
   * The amount to push the column for lg screens, in terms of how many columns it should shift
   * to the end of the total available.
   * @deprecated Use the combination of `size` and `order` properties to achieve the same effect.
   */
  @Prop() pushLg?: string;
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

  private getStyleClass(property: string, className: string, acceptsAuto = false): string | undefined {
    const colPropertyValue = this.getColumns(property);

    // If size wasn't set for any breakpoint
    // or if the user set the size without a value
    // it means we need to stick with the default and return
    // e.g. <ion-col size-md>
    if (!colPropertyValue || colPropertyValue === '') {
      return;
    }

    if (acceptsAuto && colPropertyValue === 'auto') {
      return 'ion-grid-col-auto';
    }

    const valueNumber = parseInt(colPropertyValue);

    if (isNaN(valueNumber)) {
      return;
    }

    return `${className}-col--${valueNumber}`;
  }

  private getSizeClass(): string | undefined {
    return this.getStyleClass('size', 'ion-grid', true);
  }

  private getOrderClass(): string | undefined {
    return this.getStyleClass('order', 'ion-grid-order');
  }

  private getOffsetClass(): string | undefined {
    return this.getStyleClass('offset', 'ion-grid-offset');
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
          [`${colOffset}`]: colOffset !== undefined,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
