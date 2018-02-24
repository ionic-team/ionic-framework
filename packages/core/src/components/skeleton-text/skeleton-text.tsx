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
  @Prop() animated = false;
  render () {
    return (<div class={this.animated ? 'animated' : ''}>
              <span style={{width: this.width}}>&nbsp;</span>
            </div>);
  }
}
