import { Component } from '@stencil/core';


@Component({
  tag: 'ion-app',
  styleUrls: {
    ios: 'app.ios.scss',
    md: 'app.md.scss',
    wp: 'app.wp.scss'
  },
  host: {
    theme: 'app'
  }
})
export class App {
  render() {
    return <slot></slot>;
  }
}
