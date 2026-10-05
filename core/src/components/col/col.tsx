import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, forceUpdate, h } from '@stencil/core';
import {
  getActiveBreakpoint,
  isBreakpointMap,
  matchBreakpoint,
  onBreakpointChange,
  resolveBreakpointMap,
} from '@utils/breakpoints';
import { printIonWarning } from '@utils/logging';

import type { IonColBreakpointValues, IonColProperty, IonColStyle, IonColValue } from './col.interface';
import { ION_COL_PROPERTIES } from './col.interface';

// TODO(FW-7557): Remove this in v11.
/**
 * The breakpoints the deprecated suffixed properties (e.g. `size-md`) cover.
 * `xxl` is absent by design: it is only reachable through the breakpoint object
 * form, so no new suffixed properties are introduced for it.
 */
const LEGACY_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 */
@Component({
  tag: 'ion-col',
  styleUrl: 'col.scss',
  shadow: true,
})
export class Col implements ComponentInterface {
  private unsubscribeBreakpoint?: () => void;

  // TODO(FW-7557): Remove these in v11.
  // Keep track of which deprecation warnings have been printed so they are
  // not repeated on every re-render or screen resize.
  private hasWarnedDeprecatedProps = false;
  private hasWarnedIgnoredProps = false;

  @Element() el!: HTMLIonColElement;

  /**
   * The amount to offset the column, in terms of how many columns it should
   * shift to the end of the total available.
   *
   * Can be a single value that applies at every screen size, or an object of
   * screen breakpoint values (e.g. `{ xs: 0, md: 2 }`), in which case the value
   * for the largest matching breakpoint is used.
   *
   * The width each breakpoint activates at can be changed with the
   * `screenBreakpoints` config.
   */
  @Prop() offset?: IonColValue;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to offset the column for xs screens, in terms of how many
   * columns it should shift to the end of the total available.
   *
   * @deprecated Set `offset` to an object of screen breakpoint values
   * instead (e.g. `{ xs: 2 }`).
   */
  @Prop() offsetXs?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to offset the column for sm screens, in terms of how many
   * columns it should shift to the end of the total available.
   *
   * @deprecated Set `offset` to an object of screen breakpoint values
   * instead (e.g. `{ sm: 2 }`).
   */
  @Prop() offsetSm?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to offset the column for md screens, in terms of how many
   * columns it should shift to the end of the total available.
   *
   * @deprecated Set `offset` to an object of screen breakpoint values
   * instead (e.g. `{ md: 2 }`).
   */
  @Prop() offsetMd?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to offset the column for lg screens, in terms of how many
   * columns it should shift to the end of the total available.
   *
   * @deprecated Set `offset` to an object of screen breakpoint values
   * instead (e.g. `{ lg: 2 }`).
   */
  @Prop() offsetLg?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to offset the column for xl screens, in terms of how many
   * columns it should shift to the end of the total available.
   *
   * @deprecated Set `offset` to an object of screen breakpoint values
   * instead (e.g. `{ xl: 2 }`).
   */
  @Prop() offsetXl?: string;

  /**
   * The order of the column, in terms of where the column should position
   * itself in the columns renderer. If no value is passed, the column order
   * implicit value will be the order in the html structure.
   *
   * Can be a single value that applies at every screen size, or an object of
   * screen breakpoint values (e.g. `{ xs: 2, md: 1 }`), in which case the value
   * for the largest matching breakpoint is used.
   *
   * The width each breakpoint activates at can be changed with the
   * `screenBreakpoints` config.
   */
  @Prop() order?: IonColValue;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The order of the column for xs screens, in terms of where the column should
   * position itself in the columns renderer. If no value is passed, the column
   * order implicit value will be the order in the html structure.
   *
   * @deprecated Set `order` to an object of screen breakpoint values
   * instead (e.g. `{ xs: 1 }`).
   */
  @Prop() orderXs?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The order of the column for sm screens, in terms of where the column should
   * position itself in the columns renderer. If no value is passed, the column
   * order implicit value will be the order in the html structure.
   *
   * @deprecated Set `order` to an object of screen breakpoint values
   * instead (e.g. `{ sm: 1 }`).
   */
  @Prop() orderSm?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The order of the column for md screens, in terms of where the column should
   * position itself in the columns renderer. If no value is passed, the column
   * order implicit value will be the order in the html structure.
   *
   * @deprecated Set `order` to an object of screen breakpoint values
   * instead (e.g. `{ md: 1 }`).
   */
  @Prop() orderMd?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The order of the column for lg screens, in terms of where the column should
   * position itself in the columns renderer. If no value is passed, the column
   * order implicit value will be the order in the html structure.
   *
   * @deprecated Set `order` to an object of screen breakpoint values
   * instead (e.g. `{ lg: 1 }`).
   */
  @Prop() orderLg?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The order of the column for xl screens, in terms of where the column should
   * position itself in the columns renderer. If no value is passed, the column
   * order implicit value will be the order in the html structure.
   *
   * @deprecated Set `order` to an object of screen breakpoint values
   * instead (e.g. `{ xl: 1 }`).
   */
  @Prop() orderXl?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to pull the column, in terms of how many columns it should shift
   * to the start of the total available.
   *
   * @deprecated Use the combination of `size` and `order` properties to achieve
   * the same effect.
   */
  @Prop() pull?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to pull the column for xs screens, in terms of how many columns
   * it should shift to the start of the total available.
   *
   * @deprecated Use the combination of `size` and `order` properties to achieve
   * the same effect.
   */
  @Prop() pullXs?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to pull the column for sm screens, in terms of how many columns
   * it should shift to the start of the total available.
   *
   * @deprecated Use the combination of `size` and `order` properties to achieve
   * the same effect.
   */
  @Prop() pullSm?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to pull the column for md screens, in terms of how many columns
   * it should shift to the start of the total available.
   *
   * @deprecated Use the combination of `size` and `order` properties to achieve
   * the same effect.
   */
  @Prop() pullMd?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to pull the column for lg screens, in terms of how many columns
   * it should shift to the start of the total available.
   *
   * @deprecated Use the combination of `size` and `order` properties to achieve
   * the same effect.
   */
  @Prop() pullLg?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to pull the column for xl screens, in terms of how many columns
   * it should shift to the start of the total available.
   *
   * @deprecated Use the combination of `size` and `order` properties to achieve
   * the same effect.
   */
  @Prop() pullXl?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to push the column, in terms of how many columns it should shift
   * to the end of the total available.
   *
   * @deprecated Use the combination of `size` and `order` properties to achieve
   * the same effect.
   */
  @Prop() push?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to push the column for xs screens, in terms of how many columns
   * it should shift to the end of the total available.
   *
   * @deprecated Use the combination of `size` and `order` properties to achieve
   * the same effect.
   */
  @Prop() pushXs?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to push the column for sm screens, in terms of how many columns
   * it should shift to the end of the total available.
   *
   * @deprecated Use the combination of `size` and `order` properties to achieve
   * the same effect.
   */
  @Prop() pushSm?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to push the column for md screens, in terms of how many columns
   * it should shift to the end of the total available.
   *
   * @deprecated Use the combination of `size` and `order` properties to achieve
   * the same effect.
   */
  @Prop() pushMd?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to push the column for lg screens, in terms of how many columns
   * it should shift to the end of the total available.
   *
   * @deprecated Use the combination of `size` and `order` properties to achieve
   * the same effect.
   */
  @Prop() pushLg?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The amount to push the column for xl screens, in terms of how many columns
   * it should shift to the end of the total available.
   *
   * @deprecated Use the combination of `size` and `order` properties to achieve
   * the same effect.
   */
  @Prop() pushXl?: string;

  /**
   * The size of the column, in terms of how many columns it should take up out
   * of the total available. If `"auto"` is passed, the column will be the size
   * of its content.
   *
   * Can be a single value that applies at every screen size, or an object of
   * screen breakpoint values (e.g. `{ xs: 12, md: 6 }`), in which case the
   * value for the largest matching breakpoint is used.
   *
   * An empty string or `null` at a breakpoint resets the column to the default
   * flex layout from that breakpoint up (e.g. `{ xs: 12, md: null }`).
   *
   * The width each breakpoint activates at can be changed with the
   * `screenBreakpoints` config.
   */
  @Prop() size?: IonColValue;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The size of the column for xs screens, in terms of how many columns it
   * should take up out of the total available. If `"auto"` is passed, the
   * column will be the size of its content.
   *
   * @deprecated Set `size` to an object of screen breakpoint values
   * instead (e.g. `{ xs: 12 }`).
   */
  @Prop() sizeXs?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The size of the column for sm screens, in terms of how many columns it
   * should take up out of the total available. If `"auto"` is passed, the
   * column will be the size of its content.
   *
   * @deprecated Set `size` to an object of screen breakpoint values
   * instead (e.g. `{ sm: 6 }`).
   */
  @Prop() sizeSm?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The size of the column for md screens, in terms of how many columns it
   * should take up out of the total available. If `"auto"` is passed, the
   * column will be the size of its content.
   *
   * @deprecated Set `size` to an object of screen breakpoint values
   * instead (e.g. `{ md: 6 }`).
   */
  @Prop() sizeMd?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The size of the column for lg screens, in terms of how many columns it
   * should take up out of the total available. If `"auto"` is passed, the
   * column will be the size of its content.
   *
   * @deprecated Set `size` to an object of screen breakpoint values
   * instead (e.g. `{ lg: 4 }`).
   */
  @Prop() sizeLg?: string;

  // TODO(FW-7557): Remove this in v11.
  /**
   * The size of the column for xl screens, in terms of how many columns it
   * should take up out of the total available. If `"auto"` is passed, the
   * column will be the size of its content.
   *
   * @deprecated Set `size` to an object of screen breakpoint values
   * instead (e.g. `{ xl: 3 }`).
   */
  @Prop() sizeXl?: string;

  connectedCallback() {
    this.unsubscribeBreakpoint = onBreakpointChange(() => forceUpdate(this));
  }

  disconnectedCallback() {
    this.unsubscribeBreakpoint?.();
    this.unsubscribeBreakpoint = undefined;
  }

  // TODO(FW-7557): Remove this in v11.
  /**
   * Collect the values set through the deprecated suffixed properties (e.g.
   * `size-md`) into a breakpoint object.
   */
  private getLegacyBreakpointValues(property: IonColProperty): IonColBreakpointValues {
    const values: IonColBreakpointValues = {};

    for (const breakpoint of LEGACY_BREAKPOINTS) {
      const suffixed = `${property}${breakpoint.charAt(0).toUpperCase()}${breakpoint.slice(1)}` as keyof this;
      const value = this[suffixed] as string | undefined;

      if (value !== undefined) {
        values[breakpoint] = value;
      }
    }

    return values;
  }

  /**
   * Resolve the value of a responsive property for the current screen size. A
   * breakpoint object takes precedence over the deprecated suffixed properties,
   * which in turn narrow the unsuffixed value.
   */
  private getColumns(property: IonColProperty): string | number | null | undefined {
    const value: IonColValue | undefined = this[property];

    if (isBreakpointMap<string | number | null>(value)) {
      return resolveBreakpointMap(value, matchBreakpoint);
    }

    const legacyValues = this.getLegacyBreakpointValues(property);
    const matchedLegacy = resolveBreakpointMap(legacyValues, matchBreakpoint);

    return matchedLegacy !== undefined ? matchedLegacy : (value as string | number | undefined);
  }

  // TODO(FW-7557): Remove this in v11.
  /**
   * Warn when a deprecated suffixed property is set, and again if one is being
   * silently ignored because the matching property is also set to a breakpoint
   * object.
   */
  private warnDeprecatedBreakpointProps() {
    const used: string[] = [];
    const ignored: string[] = [];

    const describeProperties = (names: string[]) =>
      `The ${names.join(', ')} ${names.length === 1 ? 'property is' : 'properties are'}`;

    for (const property of ION_COL_PROPERTIES) {
      for (const breakpoint of Object.keys(this.getLegacyBreakpointValues(property))) {
        const name = `${property}-${breakpoint}`;
        used.push(name);

        if (isBreakpointMap(this[property])) {
          ignored.push(name);
        }
      }
    }

    if (used.length > 0 && !this.hasWarnedDeprecatedProps) {
      this.hasWarnedDeprecatedProps = true;
      printIonWarning(
        `[ion-col] - ${describeProperties(
          used
        )} deprecated. Set the "size", "order" and "offset" properties to an object of screen breakpoint values instead (e.g. col.size = { xs: 12, md: 6 }), which is also the only way to target the "xxl" breakpoint.`,
        this.el
      );
    }

    if (ignored.length > 0 && !this.hasWarnedIgnoredProps) {
      this.hasWarnedIgnoredProps = true;
      printIonWarning(
        `[ion-col] - ${describeProperties(
          ignored
        )} ignored because the matching property is set to an object of screen breakpoint values, which takes precedence.`,
        this.el
      );
    }
  }

  /**
   * Resolve a responsive property to the column count it represents.
   *
   * @param property The responsive property to resolve.
   * @return The column count, or `undefined` when the property is unset or
   * does not resolve to a number.
   */
  private getColumnValue(property: IonColProperty): number | undefined {
    const colPropertyValue = this.getColumns(property);

    /**
     * Return early when no value matched any breakpoint, or when the matched
     * value is empty. An empty value (`''` or `null`) carries no width, so the
     * column falls back to the default flex layout.
     */
    if (colPropertyValue === undefined || colPropertyValue === null || colPropertyValue === '') {
      return;
    }

    const valueNumber = typeof colPropertyValue === 'number' ? colPropertyValue : parseInt(colPropertyValue, 10);

    return isNaN(valueNumber) ? undefined : valueNumber;
  }

  /**
   * Builds the inline custom properties that drive the token based calc() in
   * the styles.
   *
   * @param size The number of columns the column should span, or `undefined`
   * for default flex.
   * @param order The flex order position of the column.
   * @param offset The number of columns to offset (margin) the column by.
   * @return An object containing the custom properties to apply to the column's
   * style.
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

  // TODO(FW-7557): Remove this in v11 — it exists only to warn about
  // the deprecated breakpoint properties.
  componentWillRender() {
    this.warnDeprecatedBreakpointProps();
  }

  // TODO(FW-7557): Remove this in v11 — it exists only to warn about
  // the deprecated pull and push properties.
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
        screen-breakpoint={getActiveBreakpoint()}
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
