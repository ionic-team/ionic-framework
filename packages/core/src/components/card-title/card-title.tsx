import { Component, Prop} from '@stencil/core';


@Component({
  tag: 'ion-card-title',
  styleUrls: {
    ios: 'card-title.ios.scss',
    md: 'card-title.md.scss'
  },
  host: {
    theme: 'card-title'
  }
})
export class CardTitle {

  /**
   * The color to use for the text color.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode: 'ios' | 'md';

  hostData() {
    return {
      'role': 'heading',
      'aria-level': '2'
    };
  }

  render() {
    return <slot></slot>;
  }
}
