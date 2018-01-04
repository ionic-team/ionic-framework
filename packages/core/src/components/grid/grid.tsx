import { Component } from '@stencil/core';


@Component({
  tag: 'ion-grid',
  styleUrls: {
    ios: 'grid.ios.scss',
    md: 'grid.md.scss'
  },
  host: {
    theme: 'grid'
  }
})
export class Grid {}
