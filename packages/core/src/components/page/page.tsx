import { Component } from '@stencil/core';


@Component({
  tag: 'ion-page',
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
