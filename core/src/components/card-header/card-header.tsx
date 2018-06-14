import { Component, Prop } from '@stencil/core';
import { Color, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-card-header',
  styleUrls: {
    ios: 'card-header.ios.scss',
    md: 'card-header.md.scss'
  },
  shadow: true
})
export class CardHeader {
  /**
   * The color to use for the background.
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * If true, the card header will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color),
        'card-header-translucent': this.translucent,
      }
    };
  }

  render() {
    return <slot/>;
  }
}
