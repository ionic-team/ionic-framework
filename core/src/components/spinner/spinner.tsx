import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';
import { createColorClasses } from '@utils/theme';

import { config } from '../../global/config';
import { getIonTheme } from '../../global/ionic-global';
import type { Color } from '../../interface';

import type { SpinnerTypes } from './spinner-configs';
import { SPINNERS } from './spinner-configs';
import type { SpinnerConfig } from './spinner-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-spinner',
  styleUrls: {
    ios: 'spinner.common.scss',
    md: 'spinner.common.scss',
    ionic: 'spinner.ionic.scss',
  },
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
   * Defaults to `"xsmall"` for the `ionic` theme, undefined for all other themes.
   */
  @Prop() size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

  // TODO(ROU-10920): Switch `theme` to `mode`.
  private getName(): SpinnerTypes {
    const spinnerName = this.name || config.get('spinner');
    const theme = getIonTheme(this);
    if (spinnerName) {
      return spinnerName;
    }
    return theme === 'ios' ? 'lines' : 'circular';
  }

  private getSize(): string | undefined {
    const theme = getIonTheme(this);
    const { size } = this;

    // TODO(ROU-10912): Remove theme check when sizes are defined for all themes.
    if (theme !== 'ionic') {
      return undefined;
    }

    if (size === undefined) {
      return 'xsmall';
    }

    return size;
  }

  render() {
    const self = this;
    const theme = getIonTheme(self);
    const spinnerName = self.getName();
    const size = this.getSize();
    const spinner = SPINNERS[spinnerName] ?? SPINNERS['lines'];
    const duration = typeof self.duration === 'number' && self.duration > 10 ? self.duration : spinner.dur;
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
        class={createColorClasses(self.color, {
          [theme]: true,
          [`spinner-${spinnerName}`]: true,
          'spinner-paused': self.paused || config.getBoolean('_testing'),
          [`spinner-${size}`]: size !== undefined,
        })}
        role="progressbar"
        style={spinner.elmDuration ? { animationDuration: duration + 'ms' } : {}}
      >
        {svgs}
      </Host>
    );
  }
}

const buildCircle = (spinner: SpinnerConfig, duration: number, index: number, total: number) => {
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

const buildLine = (spinner: SpinnerConfig, duration: number, index: number, total: number) => {
  const data = spinner.fn(duration, index, total);
  data.style['animation-duration'] = duration + 'ms';

  return (
    <svg viewBox={data.viewBox || '0 0 64 64'} style={data.style}>
      <line transform="translate(32,32)" y1={data.y1} y2={data.y2} />
    </svg>
  );
};
