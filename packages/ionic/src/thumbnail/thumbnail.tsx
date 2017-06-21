import { Component, h } from '../index';


@Component({
  tag: 'ion-thumbnail',
  styleUrls: {
    ios: 'thumbnail.ios.scss',
    md: 'thumbnail.md.scss',
    wp: 'thumbnail.wp.scss'
  },
  host: {
    theme: 'thumbnail'
  }
})
export class Thumbnail {
  render() {
    return <slot></slot>;
  }
}
