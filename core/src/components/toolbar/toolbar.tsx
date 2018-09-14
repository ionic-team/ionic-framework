import { Component, ComponentInterface, Prop } from '@stencil/core';

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
export class Toolbar implements ComponentInterface {

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

  hostData() {
    return {
      class: createColorClasses(this.color)
    };
  }

  render() {
    return [
      <div class="toolbar-background"></div>,
      <div class="toolbar-container">
        <slot name="start"></slot>
        <slot name="secondary"></slot>
        <div class="toolbar-content">
          <slot></slot>
        </div>
        <slot name="primary"></slot>
        <slot name="end"></slot>
      </div>
    ];
  }
}
