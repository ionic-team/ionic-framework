import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';
import { createColorClasses, hostContext } from '@utils/theme';

import { getIonTheme } from '../../global/ionic-global';
import type { Color } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-status-hint',
  styleUrls: {
    ionic: 'status-hint.ionic.scss',
  },
  shadow: true,
})
export class StatusHint implements ComponentInterface {
  @Element() el!: HTMLElement;

  @Prop({ reflect: true }) color?: Color;

  /**
   * Set to `"small"` for a compact size.
   * Set to `"medium"` for the default height and width.
   * Set to `"large"` for a larger size.
   *
   * Defaults to `"small"`.
   */
  @Prop() size?:  'small' | 'medium' | 'large';

  /**
   * Set to `"soft"` for an hint with slightly rounded corners,
   * `"round"` for an hint with fully rounded corners, or `"rectangular"`
   * for an hint without rounded corners.
   *
   * Defaults to `"round"`.
   */
  @Prop() shape?: 'soft' | 'round' | 'rectangular';

  @Prop() position: 'top-right' | 'bottom-right' | 'static' = 'static';

  private getSize(): string | undefined {
    const { size } = this;

    if (size === undefined) {
      return 'large';
    }

    return size;
  }

  private getShape(): string | undefined {
    const { shape } = this;

    if (shape === undefined) {
      return 'round';
    }

    return shape;
  }

  private getHintPosition(): string {
    return this.position;
  }

  render() {
    const theme = getIonTheme(this);
    const size = this.getSize();
    const shape = this.getShape();
    const position = this.getHintPosition();

    return (
      <Host
        class={createColorClasses(this.color, {
          [theme]: true,
          [theme]: true,
          [`hint-${size}`]: size !== undefined,
          [`hint-${shape}`]: shape !== undefined,
          [`hint-${this.position}`]: position !== undefined,
        })}
      >
        <slot></slot>
      </Host>
      
    );
  }
}
