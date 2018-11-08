import { Component, ComponentInterface, Prop } from '@stencil/core';

import { Color, Config, Mode, SpinnerConfig, SpinnerTypes } from '../../interface';
import { createColorClasses } from '../../utils/theme';

import { SPINNERS } from './spinner-configs';

@Component({
  tag: 'ion-spinner',
  styleUrl: 'spinner.scss',
  shadow: true
})
export class Spinner implements ComponentInterface {
  @Prop({ context: 'config' }) config!: Config;

  mode!: Mode;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

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
    const name = this.name || this.config.get('spinner');
    if (name) {
      return name;
    }
    return (this.mode === 'ios') ? 'lines' : 'crescent';
  }

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color),

        [`spinner-${this.getName()}`]: true,
        'spinner-paused': !!this.paused || this.config.getBoolean('_testing')
      }
    };
  }

  render() {
    const name = this.getName();

    const spinner = SPINNERS[name] || SPINNERS['lines'];
    const duration = (typeof this.duration === 'number' && this.duration > 10 ? this.duration : spinner.dur);
    const svgs: any[] = [];

    if (spinner.circles !== undefined) {
      for (let i = 0; i < spinner.circles; i++) {
        svgs.push(buildCircle(spinner, duration, i, spinner.circles));
      }

    } else if (spinner.lines !== undefined) {
      for (let i = 0; i < spinner.lines; i++) {
        svgs.push(buildLine(spinner, duration, i, spinner.lines));
      }
    }

    return svgs;
  }
}

function buildCircle(spinner: SpinnerConfig, duration: number, index: number, total: number) {
  const data = spinner.fn(duration, index, total);
  data.style['animation-duration'] = `${duration}ms`;

  return (
    <svg viewBox="0 0 64 64" style={data.style}>
      <circle transform="translate(32,32)" r={data.r}></circle>
    </svg>
  );
}

function buildLine(spinner: SpinnerConfig, duration: number, index: number, total: number) {
  const data = spinner.fn(duration, index, total);
  data.style['animation-duration'] = `${duration}ms`;

  return (
    <svg viewBox="0 0 64 64" style={data.style}>
      <line transform="translate(32,32)" y1={data.y1} y2={data.y2}></line>
    </svg>
  );
}
