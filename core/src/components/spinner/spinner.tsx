import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';
import { createColorClasses } from '@utils/theme';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import type { Color } from '../../interface';

import type { SpinnerTypes } from './spinner-configs';
import { SPINNERS } from './spinner-configs';
import type { SpinnerSize, SpinnerDefinition } from './spinner.interfaces';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 */
@Component({
  tag: 'ion-spinner',
  styleUrl: 'spinner.scss',
  shadow: true,
})
export class Spinner implements ComponentInterface {
  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * Duration of the spinner animation in milliseconds. The default varies based on the spinner.
   */
  @Prop() duration?: number;

  /**
   * The name of the SVG spinner to use. If a name is not provided, the platform's default
   * spinner will be used.
   */
  @Prop() name?: SpinnerTypes;

  /**
   * If `true`, the spinner's animation will be paused.
   */
  @Prop() paused = false;

  /**
   * Set to `"xsmall"` for the smallest size.
   * Set to `"small"` for a smaller size.
   * Set to `"medium"` for a medium size.
   * Set to `"large"` for a large size.
   * Set to `"xlarge"` for the largest size.
   *
   * Defaults to `"medium"` if both the size property and theme config are unset.
   */
  @Prop() size?: SpinnerSize;

  private getName(): SpinnerTypes {
    const spinnerName = this.name || config.get('spinner');
    const mode = getIonMode(this);
    if (spinnerName) {
      return spinnerName;
    }
    return mode === 'ios' ? 'lines' : 'circular';
  }

  /**
   * Gets the spinner size. Uses the `size` property if set, otherwise
   * checks the theme config and falls back to 'medium' if neither is provided.
   */
  get sizeValue(): SpinnerSize {
    const sizeConfig = config.getObjectValue('IonSpinner.size', 'medium') as SpinnerSize;
    const size = this.size || sizeConfig;

    return size;
  }

  render() {
    const { duration: animatedDuration, color, paused, sizeValue } = this;
    const spinnerName = this.getName();
    const spinner = SPINNERS[spinnerName] ?? SPINNERS['lines'];
    const duration = typeof animatedDuration === 'number' && animatedDuration > 10 ? animatedDuration : spinner.dur;
    const svgs: SVGElement[] = [];

    if (spinner.circles !== undefined) {
      for (let i = 0; i < spinner.circles; i++) {
        svgs.push(buildCircle(spinner, duration, i, spinner.circles));
      }
    } else if (spinner.lines !== undefined) {
      for (let i = 0; i < spinner.lines; i++) {
        svgs.push(buildLine(spinner, duration, i, spinner.lines));
      }
    }

    return (
      <Host
        class={createColorClasses(color, {
          [`spinner-name-${spinnerName}`]: true,
          'spinner-paused': paused || config.getBoolean('_testing'),
          [`spinner-size-${sizeValue}`]: true,
        })}
        role="progressbar"
        style={spinner.elmDuration ? { animationDuration: duration + 'ms' } : {}}
      >
        {svgs}
      </Host>
    );
  }
}

const buildCircle = (spinner: SpinnerDefinition, duration: number, index: number, total: number) => {
  const data = spinner.fn(duration, index, total);
  data.style['animation-duration'] = duration + 'ms';

  return (
    <svg viewBox={data.viewBox || '0 0 64 64'} style={data.style}>
      <circle
        transform={data.transform || 'translate(32,32)'}
        cx={data.cx}
        cy={data.cy}
        r={data.r}
        style={spinner.elmDuration ? { animationDuration: duration + 'ms' } : {}}
      />
    </svg>
  );
};

const buildLine = (spinner: SpinnerDefinition, duration: number, index: number, total: number) => {
  const data = spinner.fn(duration, index, total);
  data.style['animation-duration'] = duration + 'ms';

  return (
    <svg viewBox={data.viewBox || '0 0 64 64'} style={data.style}>
      <line transform="translate(32,32)" y1={data.y1} y2={data.y2} />
    </svg>
  );
};
