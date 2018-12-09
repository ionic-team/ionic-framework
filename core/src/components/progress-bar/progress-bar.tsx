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
   */
  @Prop() type: 'determinate' | 'indeterminate' = 'determinate';

  /**
   * Reverse the progress bar
   */
  @Prop() reversed = false;

  /**
   * Only on type `"determinate"`: Value of the progress bar from [0, ..., 1]
   */
  @Prop() value = 0;

  /**
   * shows circle points if buffer is smaller 1 - Value of the buffer from [0, ..., 1] 
   */
  @Prop() buffer = 1;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  hostData() {
    const { color, type, reversed, value } = this;
    return {
      'role': "progressbar",
      'aria-valuenow': type === 'determinate' ? value : null,
      'aria-valuemin': 0,
      'aria-valuemax': 1,
      class: {
        ...createColorClasses(color),
        [`progress-bar-${type}`]: true,
        'progress-bar-reversed': reversed,
      }
    };
  }

  render() {
    if (this.type === 'indeterminate') {
      return [
        <div class="indeterminate-bar-primary"><span class="progress-indeterminate"></span></div>,
        <div class="indeterminate-bar-secondary"><span class="progress-indeterminate"></span></div>
      ];
    }

    const value = clamp(0, this.value, 1);
    const buffer = clamp(0, this.buffer, 1);

    return [
      <div class="progress" style={{ transform: `scaleX(${value})` }}></div>,
      buffer !== 1 && <div class="buffer-circles"></div>,
      <div class="progress-background-bar" style={{ transform: `scaleX(${buffer})` }}></div>,
    ];
  }
}
