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
  @Prop() height = 'auto';
  @Prop() radius = '0';

  render () {
    const themedStyles = {
      'width': this.width,
      'height': this.height,
      'border-radius': this.radius,
    };

    return <span style={themedStyles}>&nbsp;</span>;
  }
}
