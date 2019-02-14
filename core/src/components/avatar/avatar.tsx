import { Component, ComponentInterface, h } from '@stencil/core';

@Component({
  tag: 'ion-avatar',
  styleUrls: {
    ios: 'avatar.ios.scss',
    md: 'avatar.md.scss'
  },
  shadow: true
})
export class Avatar implements ComponentInterface {

  render() {
    return <slot></slot>;
  }

}
