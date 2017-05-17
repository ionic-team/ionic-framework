import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-card-title',
  styleUrls: {
    ios: 'card-title.ios.scss',
    md: 'card-title.md.scss',
    wp: 'card-title.wp.scss'
  },
  shadow: false
})
export class CardTitle {
  render() {
    return h(this, Ionic.theme(this, 'card-title'));
  }
}
