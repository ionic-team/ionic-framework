import { Component, Prop } from '@stencil/core';
import { createThemedClasses } from '../../utils/theme';
import { SPINNERS, SpinnerConfig } from './spinner-configs';


@Component({
  tag: 'ion-spinner',
  styleUrls: {
    ios: 'spinner.ios.scss',
    md: 'spinner.md.scss',
    wp: 'spinner.wp.scss'
  }
})
export class Spinner {

  @Prop() mode: string;
  @Prop() color: string;
  @Prop() duration: number = null;
  @Prop() name: string;
  @Prop() paused: boolean = false;


  ionViewDidLoad() {
    if (this.name === 'ios') {
      // deprecation warning, renamed in v4
      console.warn(`spinner "ios" has been renamed to "lines"`);

    } else if (this.name === 'ios-small') {
      // deprecation warning, renamed in v4
      console.warn(`spinner "ios-small" has been renamed to "lines-sm"`);
    }
  }

  hostData() {
    const spinnerThemedClasses = createThemedClasses(this.mode, this.color, `spinner spinner-${this.name}`);
    spinnerThemedClasses['spinner-paused'] = true;

    return {
      class: spinnerThemedClasses
    };
  }

  render() {
    let name = this.name || Ionic.config.get('spinner', 'lines');
    if (name === 'ios') {
      name = this.name = 'lines';

    } else if (this.name === 'ios-small') {
      name = this.name = 'lines-sm';
    }

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

  return h('svg', {
            attrs: {
              'viewBox': '0 0 64 64'
            },
            style: data.style
          },
          h('circle', {
            attrs: {
              'r': data.r,
              'transform': 'translate(32,32)'
            }
          })
        );
}


function buildLine(spinner: SpinnerConfig, duration: number, index: number, total: number) {
  const data = spinner.fn(duration, index, total);
  data.style.animationDuration = duration + 'ms';

  return h('svg', {
            attrs: {
              'viewBox': '0 0 64 64'
            },
            style: data.style
          },
          h('line', {
            attrs: {
              'y1': data.y1,
              'y2': data.y2,
              'transform': 'translate(32,32)'
            }
          })
        );
}
