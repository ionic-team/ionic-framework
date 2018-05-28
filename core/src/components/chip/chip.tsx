import { Component, Prop } from '@stencil/core';
import { Color, Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';


@Component({
  tag: 'ion-chip',
  styleUrls: {
    ios: 'chip.ios.scss',
    md: 'chip.md.scss'
  }
})
export class Chip {
  /**
   * The color to use.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  hostData() {
    return {
      class: createThemedClasses(this.mode, this.color, 'chip'),
    };
  }
}
