import { Component } from '@stencil/core';


@Component({
  tag: 'ion-item-group',
  styleUrls: {
    ios: 'item-group.ios.scss',
    md: 'item-group.md.scss'
  },
  host: {
    theme: 'item-group'
  }
})
export class ItemGroup {}
