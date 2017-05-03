import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-card',
  styleUrls: {
    ios: 'card.ios.scss',
    md: 'card.md.scss',
    wp: 'card.wp.scss'
  }
})
export class Card {
  render() {
    return h(this, Ionic.theme(this, 'card'),
      h('slot')
    );
  }
}
