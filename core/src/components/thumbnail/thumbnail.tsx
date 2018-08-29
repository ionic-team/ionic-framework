import { Component } from '@stencil/core';

@Component({
  tag: 'ion-thumbnail',
  styleUrl: 'thumbnail.scss',
  shadow: true
})
export class Thumbnail {
  render() {
    return <slot></slot>;
  }
}
