import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-card-content',
  styleUrls: {
    ios: 'card-content.ios.scss',
    md: 'card-content.md.scss',
    wp: 'card-content.wp.scss'
  }
})
export class CardContent {
  render() {
    return h(this, Ionic.theme(this, 'card-content'),
      h('slot')
    );
  }
}
