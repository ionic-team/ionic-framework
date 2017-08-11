import { Component } from '@stencil/core';


@Component({
  tag: 'ion-option',
  host: {
    theme: 'option'
  }
})
export class option {

  render() {
    return <div class="my-option"></div>;
  }

}