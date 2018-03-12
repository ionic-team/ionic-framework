import { Component, Prop} from '@stencil/core';


@Component({
  tag: 'ion-card-subtitle',
  styleUrls: {
    ios: 'card-subtitle.ios.scss',
    md: 'card-subtitle.md.scss'
  },
  host: {
    theme: 'card-subtitle'
  }
})
export class CardSubtitle {
  /**
   * The color to use for the text color.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
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
      'aria-level': '3'
    };
  }

}
