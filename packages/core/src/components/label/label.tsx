import { Component } from '@stencil/core';


@Component({
  tag: 'ion-label',
  styleUrls: {
    ios: 'label.ios.scss',
    md: 'label.md.scss',
    wp: 'label.wp.scss'
  },
  host: {
    theme: 'label'
  }
})
export class Label {
  render() {
    return <slot></slot>;
  }
}
