import { Component } from '@stencil/core';


@Component({
  tag: 'ion-avatar',
  styleUrls: {
    ios: 'avatar.ios.scss',
    md: 'avatar.md.scss'
  },
  shadow: true
})
export class Avatar {

  render() {
    return <slot/>;
  }

}
