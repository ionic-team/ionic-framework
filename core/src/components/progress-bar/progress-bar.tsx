import { Component, ComponentInterface, Element, Prop } from '@stencil/core';

import { Color, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-progress-bar',
  styleUrl: 'progress-bar.scss',
  shadow: true
})
export class ProgressBar implements ComponentInterface {

  @Element() el!: HTMLElement;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  /**
   * Sets the indicator style of the progress bar
   * Options are determinate (no animation), reversed (to determinate), indeterminate (animate from left to right) and query (animate from right to left)
   */
  @Prop() indicator: 'reversed' | 'determinate' | 'indeterminate' | 'query' | 'buffer' = 'determinate';

  /**
   * The width of the progress bar in percent - 0 ... 100
   */
  @Prop() value = 0;

  /**
   * The width of the buffer in percent - 0 ... 100
   */
  @Prop() buffer = 0;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color),
        [this.indicator]: true,
      }
    };
  }

  // tslint:disable:linebreak-style
  render() {
    const content = [];
    if (this.indicator === 'indeterminate' || this.indicator === 'query') {
      content.push(
        <div class="progress">
          <div class="primary-bar"><span class="bar-inner"></span></div>
          <div class="secondary-bar"><span class="bar-inner"></span></div>
        </div>,
      );
    } else {
      content.push(
        <div class="progress" style={{ transform: `scaleX(${this.value})` }}></div>
      );
    }

    if (this.indicator === 'buffer') {
      const buffer = this.buffer;
      content.push(
        <div class="buffer-circles"></div>,
        <div class="buffer-bar" style={{ transform: `scaleX(${buffer})` }}></div>,
        <div class="buffer-background" style={{ transform: `scaleX(${buffer})` }}></div>
      );
    }
    return content;
  }
}
