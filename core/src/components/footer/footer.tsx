import { Component } from '@stencil/core';

@Component({
  tag: 'ion-footer',
  styleUrls: {
    ios: 'footer.ios.scss',
    md: 'footer.md.scss'
  },
  host: {
    theme: 'footer'
  }
})
export class Footer {}
