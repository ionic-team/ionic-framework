import { Component, Prop } from '@stencil/core';
import { Color, Config, Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';

@Component({
  tag: 'ion-toolbar',
  styleUrls: {
    ios: 'toolbar.ios.scss',
    md: 'toolbar.md.scss'
  }
})
export class Toolbar {

  @Prop({ context: 'config' }) config!: Config;

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
        ...createThemedClasses(this.mode, this.color, 'toolbar'),
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
