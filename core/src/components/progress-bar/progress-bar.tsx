import { Component, ComponentInterface, Host, Prop, h, Element } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { Color } from '../../interface';
import { clamp } from '../../utils/helpers';
import { createColorClasses, hostContext } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part progress - The progress bar that shows the current value when `type` is `"determinate"` and slides back and forth when `type` is `"indeterminate"`.
 * @part stream - The animated circles that appear while buffering. This only shows when `buffer` is set and `type` is `"determinate"`.
 * @part track - The track bar behind the progress bar. If the `buffer` property is set and `type` is `"determinate"` the track will be the
 * width of the `buffer` value.
 */
@Component({
  tag: 'ion-progress-bar',
  styleUrls: {
    ios: 'progress-bar.med.scss',
    md: 'progress-bar.med.scss',
  },
  shadow: true
})
export class ProgressBar implements ComponentInterface {
  @Element() el!: HTMLElement;

  @Prop() percentage = false;

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

  /**
   * Define a variação do componente.
   */
  @Prop() dsName?: 'minimalist';

  render() {
    const { color, type, reversed, value, buffer, percentage, dsName } = this;
    const paused = config.getBoolean('_testing');
    const mode = getIonMode(this);
    return (
      <Host
        role="progressbar"
        aria-valuenow={type === 'determinate' ? value : null}
        aria-valuemin="0"
        aria-valuemax="1"
        class={createColorClasses(color, {
          [mode]: true,
          'med-progress-bar': true,
          [`med-progress-bar--${dsName}`]: dsName !== undefined,
          [`progress-bar-${type}`]: true,
          'percentage': percentage,
          'progress-paused': paused,
          'progress-bar-reversed': document.dir === 'rtl' ? !reversed : reversed,
          'in-med-header': hostContext('med-header', this.el),
        })}
      >
        {type === 'indeterminate'
          ? renderIndeterminate()
          : renderProgress(value, buffer)
        }
      </Host>
    );
  }
}

const renderIndeterminate = () => {
  return (
    <div part="track" class="progress-buffer-bar">
      <div class="indeterminate-bar-primary"><span part="progress" class="progress-indeterminate"></span></div>
      <div class="indeterminate-bar-secondary"><span part="progress" class="progress-indeterminate"></span></div>
    </div>
  );
};

const renderProgress = (value: number, buffer: number) => {
  const finalValue = value !== 0 ? (value * 100) : 8;
  const unit = value !== 0 ? '%' : 'px';
  const finalBuffer = clamp(0, buffer, 1);
  const renderedNumber = value * 100;

  return [
    <div class="progress-container">
      <div part="progress" class={`progress ${finalValue === 100 ? 'progress--correct' : ''}`} style={{ width: `${finalValue}${unit}` }}></div>
      <span class="progress__percentage">{renderedNumber.toFixed()}%</span>
    </div>,
    /**
     * Buffer circles with two container to move
     * the circles behind the buffer progress
     * with respecting the animation.
     * When finalBuffer === 1, we use display: none
     * instead of removing the element to avoid flickering.
     */
    <div class={{ 'buffer-circles-container': true, 'ion-hide': finalBuffer === 1 }} style={{ transform: `translateX(${finalBuffer * 100}%)` }}>
      <div class="buffer-circles-container" style={{ transform: `translateX(-${finalBuffer * 100}%)` }}>
        <div part="stream" class="buffer-circles"></div>
      </div>
    </div>,
    <div part="track" class="progress-buffer-bar" style={{ transform: `translateX(${finalBuffer})` }}></div>,
  ];
};
