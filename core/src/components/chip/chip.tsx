import { Component, ComponentInterface, Prop } from '@stencil/core';

import { Color, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-chip',
  styleUrls: {
    md: 'chip.md.new.scss'
  },
  shadow: true
})
export class Chip implements ComponentInterface {
  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  @Prop() removable = false;
  @Prop() outline = false;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  hostData() {
    return {
      'ion-activatable': true,
      class: {
        ...createColorClasses(this.color),
        'chip-outline': this.outline,
      }
    };
  }

  render() {
    return [
      <slot></slot>,
      this.removable ? <ion-icon class="chip-remove-button" name="close-circle"></ion-icon> : null,
      <ion-ripple-effect></ion-ripple-effect>
    ];
  }
}
