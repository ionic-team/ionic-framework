import { Component } from '@stencil/core';


@Component({
  tag: 'ion-page',
  styleUrl: 'page.scss'
})
export class Page {

  hostData() {
    return {
      class: {
        'ion-page': true
      }
    };
  }
  render() {
    return <slot></slot>;
  }
}
