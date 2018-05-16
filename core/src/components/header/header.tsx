import { Component } from '@stencil/core';

@Component({
  tag: 'ion-header',
  styleUrls: {
    ios: 'header.ios.scss',
    md: 'header.md.scss'
  },
  host: {
    theme: 'header'
  }
})
export class Header {}
