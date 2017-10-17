import { Component } from '@stencil/core';


@Component({
  tag: 'ion-list-header',
  styleUrls: {
    ios: 'list-header.ios.scss',
    md: 'list-header.md.scss',
    wp: 'list-header.wp.scss'
  },
  host: {
    theme: 'list-header'
  }
})
export class ListHeader {
  protected render() {
    return <slot></slot>;
  }
}
