import { Component } from '@stencil/core';


@Component({
  tag: 'ion-card-header',
  styleUrls: {
    ios: 'card-header.ios.scss',
    md: 'card-header.md.scss',
    wp: 'card-header.wp.scss'
  },
  host: {
    theme: 'card-header'
  }
})
export class CardHeader {
  render() {
    return <slot></slot>;
  }
}
