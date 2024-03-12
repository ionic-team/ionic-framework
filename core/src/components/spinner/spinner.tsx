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
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of components.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
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

  private getName(): SpinnerTypes {
    const spinnerName = this.name || config.get('spinner');
    const theme = getIonTheme(this);
    if (spinnerName) {
      return spinnerName;
    }
    return theme === 'ios' ? 'lines' : 'circular';
  }

  render() {
    const self = this;
    const theme = getIonTheme(self);
    const spinnerName = self.getName();
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
