import { Component, Prop } from '@stencil/core';
import { Color, Mode } from '../../interface';


@Component({
  tag: 'ion-text',
  styleUrl: 'text.scss'
})
export class Text {

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode!: Mode;

  hostData() {
    return {
      class: {
        [`ion-color-${this.color}`]: !!this.color
      }
    };
  }
}
