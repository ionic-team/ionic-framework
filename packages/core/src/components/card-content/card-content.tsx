import { Component } from '@stencil/core';

@Component({
  tag: 'ion-card-content',
  styleUrls: {
    ios: 'card-content.ios.scss',
    md: 'card-content.md.scss',
    wp: 'card-content.wp.scss'
  },
  host: {
    theme: 'card-content'
  }
})
export class CardContent {
  render() {
    return <slot></slot>;
  }
}
