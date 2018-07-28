import { Component, Prop } from '@stencil/core';
import { Color, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-title',
  styleUrl: 'title.scss',
  shadow: true
})
export class ToolbarTitle {

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  hostData() {
    return {
      class: createColorClasses(this.color)
    };
  }

  render() {
    return [
      <div class="toolbar-title">
        <slot></slot>
      </div>
    ];
  }
}
