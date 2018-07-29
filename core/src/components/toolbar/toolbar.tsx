import { Component, Prop } from '@stencil/core';

import { Color, Config, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-toolbar',
  styleUrls: {
    ios: 'toolbar.ios.scss',
    md: 'toolbar.md.scss'
  },
  shadow: true
})
export class Toolbar {

  @Prop({ context: 'config' }) config!: Config;

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
   * If true, the toolbar will be translucent.
   * Note: In order to scroll content behind the toolbar, the `fullscreen`
   * attribute needs to be set on the content.
   * Defaults to `false`.
   */
  @Prop() translucent = false;

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color),
        'toolbar-translucent': this.translucent
      }
    };
  }

  render() {
    return [
      <div class="toolbar-background"></div>,
      <slot name="start"></slot>,
      <slot name="secondary"></slot>,
      <div class="toolbar-content">
        <slot></slot>
      </div>,
      <slot name="primary"></slot>,
      <slot name="end"></slot>
    ];
  }
}
