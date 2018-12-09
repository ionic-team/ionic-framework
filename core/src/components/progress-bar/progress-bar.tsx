import { Component, ComponentInterface, Prop } from '@stencil/core';

import { Color, Mode } from '../../interface';
import { clamp } from '../../utils/helpers';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-progress-bar',
  styleUrls: {
    ios: 'progress-bar.ios.scss',
    md: 'progress-bar.md.scss'
  },
  shadow: true
})
export class ProgressBar implements ComponentInterface {

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  /**
   * Style of the progress bar
   * Options are `"determinate"` (no animation), `"indeterminate"` (animate from left to right),
   * and `"buffer"` (shows circle points)
   */
  @Prop() type: 'determinate' | 'indeterminate' | 'buffer' = 'determinate';

  /**
   * Reverse the progress bar
   */
  @Prop() reversed = false;

  /**
   * Only on type `"determinate"` and  `"buffer"`: Value of the progress bar from [0, ..., 1]
   */
  @Prop() value = 0;

  /**
   * Only on type `"buffer"`: Value of the buffer from [0, ..., 1]
   */
  @Prop() buffer = 0;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  hostData() {
    const { color, type, reversed } = this;
    return {
      class: {
        ...createColorClasses(color),
        [`progress-bar-${type}`]: true,
        'progress-bar-reversed': reversed,
      }
    };
  }

  render() {
    const content = [];
    if (this.type === 'indeterminate') {
      content.push(
        <div class="indeterminate-bar-primary"><span class="progress-indeterminate"></span></div>,
        <div class="indeterminate-bar-secondary"><span class="progress-indeterminate"></span></div>
      );
    } else {
      const value = clamp(0, this.value, 1);
      content.push(
        <div class="progress" style={{ transform: `scaleX(${value})` }}></div>
      );
    }

    if (this.type === 'buffer') {
      const buffer = clamp(0, this.buffer, 1);
      content.push(
        <div class="buffer-circles"></div>,
        <div class="buffer-bar" style={{ transform: `scaleX(${buffer})` }}></div>,
      );
    }
    return content;
  }
}
