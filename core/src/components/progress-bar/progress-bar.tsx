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
   * Sets the indicator style of the progress bar
   * Options are determinate (no animation), indeterminate (animate from left to right) and query (animate from right to left)
   */
  @Prop() indicator: 'determinate' | 'indeterminate' | 'query' | 'buffer' = 'determinate';

  /**
   * The width of the progress bar in percent - 0 ... 100
   */
  @Prop() value = 0;

  /**
   * The width of the buffer in percent - 0 ... 100
   */
  @Prop() buffer = 0;

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
        [this.indicator]: true,
      }
    };
  }

  render() {
    return (
      <div class="progress-bar">
        <div class="progress" style={{ width: `${this.value}%` }}></div>
        <div class="buffer-circles"></div>
        <div class="buffer-bar" style={{ width: `${this.buffer}%` }}></div>
        <div class="buffer" style={{ width: `${this.buffer}%` }}></div>
      </div>
    );
  }
}
