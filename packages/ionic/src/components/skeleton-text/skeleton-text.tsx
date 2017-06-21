import { Component, h, Prop } from '../index';


@Component({
  tag: 'ion-skeleton-text',
  styleUrls: 'skeleton-text.scss'
})
export class SkeletonText {
  @Prop() width: string = '100%';

  render() {
    return <span style={{width: this.width}}>&nbsp;</span>;
  }
}
