import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'ion-skeleton-text',
  styleUrls: {
    ios: 'skeleton-text.ios.scss',
    md: 'skeleton-text.md.scss'
  },
  host: {
    theme: 'skeleton-text'
  }
})
export class SkeletonText {
  @Prop() width = '100%';

  render () {
    return <span style={{width: this.width}}>&nbsp;</span>;
  }
}
