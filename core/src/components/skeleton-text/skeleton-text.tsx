import { Component, ComponentInterface, Prop } from '@stencil/core';

@Component({
  tag: 'ion-skeleton-text',
  styleUrls: {
    ios: 'skeleton-text.ios.scss',
    md: 'skeleton-text.md.scss'
  },
  shadow: true
})
export class SkeletonText implements ComponentInterface {

  /**
   * Width for the element to render at.
   */
  @Prop() width = '100%';

  render() {
    return <span style={{ width: this.width }}>&nbsp;</span>;
  }
}
