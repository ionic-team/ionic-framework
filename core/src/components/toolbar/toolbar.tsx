import { Component, Prop } from '@stencil/core';
import { Color, Config, Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';


@Component({
  tag: 'ion-toolbar',
  styleUrls: {
    ios: 'toolbar.ios.scss',
    md: 'toolbar.md.scss'
  },
  host: {
    theme: 'toolbar'
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
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'toolbar-translucent') : {};

    return {
      class: themedClasses
    };
  }

  render() {
    const backgroundCss = createThemedClasses(this.mode, this.color, 'toolbar-background');
    const contentCss = createThemedClasses(this.mode, this.color, 'toolbar-content');

    return [
      <div class={backgroundCss}></div>,
      <slot name="start"></slot>,
      <slot name="secondary"></slot>,
      <div class={contentCss}>
        <slot></slot>
      </div>,
      <slot name="primary"></slot>,
      <slot name="end"></slot>
    ];
  }
}
