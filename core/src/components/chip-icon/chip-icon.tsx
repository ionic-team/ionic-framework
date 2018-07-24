import { Component, Prop } from '@stencil/core';
import { Color, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-chip-icon',
  styleUrl: 'chip-icon.scss',
  shadow: true
})
export class ChipIcon {
  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * The icon to use.
   * Possible values are the same as `"ion-icon"`.
   */
  @Prop() name?: string;

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color)
      }
    };
  }

  render() {
    return <ion-icon name={this.name}/>;
  }
}
