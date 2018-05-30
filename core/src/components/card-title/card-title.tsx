import { Component, Prop } from '@stencil/core';
import { Color, Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';

@Component({
  tag: 'ion-card-title',
  styleUrls: {
    ios: 'card-title.ios.scss',
    md: 'card-title.md.scss'
  }
})
export class CardTitle {
  /**
   * The color to use for the text color.
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  hostData() {
    return {
      class: createThemedClasses(this.mode, this.color, 'card-title'),
      'role': 'heading',
      'aria-level': '2'
    };
  }
}
