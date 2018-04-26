import { Component } from '@stencil/core';

@Component({
  tag: 'ion-reorder',
  styleUrls: {
    ios: 'reorder.ios.scss',
    md: 'reorder.md.scss',
  },
  host: {
    theme: 'reorder'
  }
})
export class Reorder {

  render() {
    return (
      <slot>
        <ion-icon class="reorder-icon" name="reorder"/>
      </slot>
    );
  }

}
