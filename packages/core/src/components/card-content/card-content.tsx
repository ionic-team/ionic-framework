import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'ion-card-content',
  styleUrls: {
    ios: 'card-content.ios.scss',
    md: 'card-content.md.scss'
  },
  host: {
    theme: 'card-content'
  }
})
export class CardContent {
  /**
   * The color to use for the text.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode: 'ios' | 'md';

  render() {
    return <slot></slot>;
  }
}
