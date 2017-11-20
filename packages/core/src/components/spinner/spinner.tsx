import { Component, Prop } from '@stencil/core';
import { createThemedClasses } from '../../utils/theme';
import { Config } from '../../index';
import { SPINNERS, SpinnerConfig } from './spinner-configs';


/**
 * @name Spinner
 * @description
 * The `ion-spinner` component provides a variety of animated SVG spinners.
 * Spinners enables you to give users feedback that the app is actively
 * processing/thinking/waiting/chillin’ out, or whatever you’d like it to indicate.
 * By default, the `ion-refresher` feature uses this spinner component while it's
 * the refresher is in the `refreshing` state.
 *
 * Ionic offers a handful of spinners out of the box, and by default, it will use
 * the appropriate spinner for the platform on which it’s running.
 *
 * <table class="table spinner-table">
 *  <tr>
 *    <th>
 *      <code>lines</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="lines"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>lines-small</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="lines-small"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>bubbles</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="bubbles"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>circles</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="circles"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>crescent</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="crescent"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>dots</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="dots"></ion-spinner>
 *    </td>
 *  </tr>
 * </table>
 *
 * @usage
 * The following code would use the default spinner for the platform it's
 * running from. If it's neither iOS or Android, it'll default to use `ios`.
 *
 * ```html
 * <ion-spinner></ion-spinner>
 * ```
 *
 * By setting the `name` property, you can specify which predefined spinner to
 * use, no matter what the platform is.
 *
 * ```html
 * <ion-spinner name="bubbles"></ion-spinner>
 * ```
 *
 * ## Styling SVG with CSS
 * One cool thing about SVG is its ability to be styled with CSS! One thing to note
 * is that some of the CSS properties on an SVG element have different names. For
 * example, SVG uses the term `stroke` instead of `border`, and `fill` instead
 * of `background-color`.
 *
 * ```css
 * ion-spinner * {
 *   width: 28px;
 *   height: 28px;
 *   stroke: #444;
 *   fill: #222;
 * }
 * ```
 */
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
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * @input {string} How long it takes it to do one loop.
   */
  @Prop() duration: number;

  /**
   * @input {string} SVG spinner name.
   */
  @Prop() name: string;

  /**
   * @input {boolean} If true, pause the animation.
   */
  @Prop() paused: boolean = false;


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

    let i = 0;
    let l = 0;

    if (spinner.circles) {
      for (i = 0, l = spinner.circles; i < l; i++) {
        svgs.push(buildCircle(spinner, duration, i, l));
      }

    } else if (spinner.lines) {
      for (i = 0, l = spinner.lines; i < l; i++) {
        svgs.push(buildLine(spinner, duration, i, l));
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
