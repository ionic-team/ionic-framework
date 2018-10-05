import { Component, ComponentInterface, Element, Listen, Prop, State } from '@stencil/core';

import { Config } from '../../interface';
import { DisplayWhen, getTestResult } from '../../utils/show-hide-when-utils';

@Component({
  tag: 'ion-hide-when',
  styleUrl: './hide-when.scss',
  shadow: true
})
export class HideWhen implements ComponentInterface, DisplayWhen {

  @Element() element!: HTMLElement;
  @Prop({ context: 'config' }) config!: Config;
  @Prop({ context: 'window' }) win!: Window;

  /**
   * If the current platform matches the given value, the element will hide.
   * Accepts a comma separated list of modes to match against.
   */
  @Prop() modes!: string;

  /**
   * If the current orientation matches this value, the element will hide.
   */
  @Prop() orientation?: string;

  /**
   * If the current media query matches this value, the element will hide.
   */
  @Prop() mediaQuery?: string;

  /**
   * If the current screen width matches the given size, the element will hide.
   * Uses the build in sizes of xs, sm, md, lg, xl.
   */
  @Prop() size?: string;

  /**
   * If the current platform matches the given value, the element will hide.
   * Accepts a comma separated list of platforms to match against.
   */
  @Prop() platform?: string;

  /**
   * If false, and two or more conditions are set, the element will hide when all are true.
   * If true, and two or more conditions are set, the element will hide when at least one is true.
   */
  @Prop() or = false;

  @State() passesTest = false;

  componentWillLoad() {
    this.onResize();
  }

  @Listen('window:resize')
  onResize() {
    this.passesTest = getTestResult(this);
  }

  hostData() {
    return {
      class: {
        'hide-content': this.passesTest
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}
