import { Component } from '@stencil/core';

@Component({
  tag: 'ion-buttons',
  styleUrls: {
    ios: 'buttons.ios.scss',
    md: 'buttons.md.scss'
  },
  host: {
    theme: 'bar-buttons'
  }
})
export class Buttons {}
