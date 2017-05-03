import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-card-header',
  styleUrls: {
    ios: 'card-header.ios.scss',
    md: 'card-header.md.scss',
    wp: 'card-header.wp.scss'
  }
})
export class CardHeader {
  render() {
    return h(this, Ionic.theme(this, 'card-header'),
      h('slot')
    );
  }
}
