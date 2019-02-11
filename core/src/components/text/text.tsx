import { Component, ComponentInterface, Prop } from '@stencil/core';

import { Color, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-text',
  styleUrl: 'text.scss',
  shadow: true
})
export class Text implements ComponentInterface {

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * Indicates the direction of the component.
   * Defaults to the value of the `dir` attribute on the html element.
   */
  @Prop({ reflectToAttr: true }) dir: string = document.dir;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  hostData() {
    return {
      class: createColorClasses(this.color)
    };
  }

  render() {
    return <slot></slot>;
  }
}
