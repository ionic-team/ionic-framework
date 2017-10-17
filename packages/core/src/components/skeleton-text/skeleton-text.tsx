import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'ion-skeleton-text',
  styleUrl: 'skeleton-text.scss'
})
export class SkeletonText {
  @Prop() width: string = '100%';

  protected render() {
    return <span style={{width: this.width}}>&nbsp;</span>;
  }
}
