import { Component, Prop } from '@stencil/core';
import { createThemedClasses } from '../../utils/theme';
import { Config } from '../../index';
import { SPINNERS, SpinnerConfig } from './spinner-configs';


@Component({
  tag: 'ion-spinner',
  styleUrls: {
    ios: 'spinner.ios.scss',
    md: 'spinner.md.scss'
  },
  host: {
    theme: 'spinner'
  }
})
export class Spinner {
  @Prop({ context: 'config' }) config: Config;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * How long it takes it to do one loop.
   */
  @Prop() duration: number;

  /**
   * SVG spinner name.
   */
  @Prop() name: string;

  /**
   * If true, pause the animation.
   */
  @Prop() paused = false;


  private getName(): string {
    let name = this.name || this.config.get('spinner');
    if (!name) {
      // fallback
      if (this.mode === 'md') {
        return 'crescent';
      } else {
        return 'lines';
      }
    }
    if (name === 'ios') {
      // deprecation warning, renamed in v4
      console.warn(`spinner "ios" has been renamed to "lines"`);
      name = 'lines';
    } else if (name === 'ios-small') {
      // deprecation warning, renamed in v4
      console.warn(`spinner "ios-small" has been renamed to "lines-sm"`);
      name = 'lines-sm';
    }
    return name;
  }

  hostData() {
    const themedClasses = createThemedClasses(this.mode, this.color, `spinner spinner-${this.getName()}`);

    const spinnerClasses = {
      ...themedClasses,
      'spinner-paused': this.paused
    };

    return {
      class: spinnerClasses
    };
  }

  render() {
    const name = this.getName();

    const spinner = SPINNERS[name] || SPINNERS['lines'];

    const duration = (typeof this.duration === 'number' && this.duration > 10 ? this.duration : spinner.dur);

    const svgs: any[] = [];

    if (spinner.circles) {
      for (let i = 0; i < spinner.circles; i++) {
        svgs.push(buildCircle(spinner, duration, i, spinner.circles));
      }

    } else if (spinner.lines) {
      for (let i = 0; i < spinner.lines; i++) {
        svgs.push(buildLine(spinner, duration, i, spinner.lines));
      }
    }

    return svgs;
  }
}


function buildCircle(spinner: SpinnerConfig, duration: number, index: number, total: number) {
  const data = spinner.fn(duration, index, total);
  data.style.animationDuration = duration + 'ms';

  return (
    <svg viewBox='0 0 64 64' style={data.style}>
      <circle transform='translate(32,32)' r={data.r}></circle>
    </svg>
  );
}


function buildLine(spinner: SpinnerConfig, duration: number, index: number, total: number) {
  const data = spinner.fn(duration, index, total);
  data.style.animationDuration = duration + 'ms';

  return (
    <svg viewBox='0 0 64 64' style={data.style}>
      <line transform='translate(32,32)' y1={data.y1} y2={data.y2}></line>
    </svg>
  );
}
