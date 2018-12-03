import { Component, ComponentInterface, Element, Prop } from '@stencil/core';

import { Color, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-progress-bar',
  styleUrl: 'progress-bar.scss',
  shadow: true
})
export class ProgressBar implements ComponentInterface {

  @Element() el!: HTMLElement;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  /**
   * Sets the animation style of the progress bar
   * Options are determinate (no animation), indeterminate (animate from left to right) and query (animate from right to left)
   */
  @Prop() animation: 'determinate' | 'indeterminate' | 'query' = 'determinate';

  /**
   * The width of the progress bar
   */
  @Prop() value = 0;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color),
      }
    };
  }

  render() {
    return (
      <div class="progress-bar">
        <div class={this.animation} style={{ width: `${this.value}%` }}></div>
      </div>
    );
  }
}
