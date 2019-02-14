import { Component, ComponentInterface, h } from '@stencil/core';

@Component({
  tag: 'ion-thumbnail',
  styleUrl: 'thumbnail.scss',
  shadow: true
})
export class Thumbnail implements ComponentInterface {
  render() {
    return <slot></slot>;
  }
}
