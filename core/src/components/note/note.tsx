import { Component, ComponentInterface, Prop } from '@stencil/core';

import { Color, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-note',
  styleUrls: {
    ios: 'note.ios.scss',
    md: 'note.md.scss'
  },
  shadow: true
})
export class Note implements ComponentInterface {
  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color),
        [`${this.mode}`]: true,
      }
    };
  }

  render() {
    return <slot></slot>;
  }

}
