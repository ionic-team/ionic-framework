import { Component, ComponentInterface, Prop } from '@stencil/core';

import { Color, Config, Mode } from '../../interface';
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

  @Prop({ context: 'config' }) config!: Config;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  /**
   * The state of the progress bar, based on if the time the process takes is known or not.
   * Default options are: `"determinate"` (no animation), `"indeterminate"` (animate from left to right).
   */
  @Prop() type: 'determinate' | 'indeterminate' = 'determinate';

  /**
   * If true, reverse the progress bar direction.
   */
  @Prop() reversed = false;

  /**
   * The value determines how much of the active bar should display when the
   * `type` is `"determinate"`.
   * The value should be between [0, 1].
   */
  @Prop() value = 0;

  /**
   * If the buffer and value are smaller than 1, the buffer circles will show.
   * The buffer should be between [0, 1].
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
    const paused = this.config.getBoolean('_testing');
    return {
      'role': 'progressbar',
      'aria-valuenow': type === 'determinate' ? value : null,
      'aria-valuemin': 0,
      'aria-valuemax': 1,
      class: {
        ...createColorClasses(color),
        [`progress-bar-${type}`]: true,
        'progress-paused': paused,
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
      <div class="progress-buffer-bar" style={{ transform: `scaleX(${buffer})` }}></div>,
    ];
  }
}
