import { Component } from '@stencil/core';


@Component({
  tag: 'ion-avatar',
  styleUrls: {
    ios: 'avatar.ios.scss',
    md: 'avatar.md.scss'
  },
  host: {
    theme: 'avatar'
  }
})
export class Avatar {}
