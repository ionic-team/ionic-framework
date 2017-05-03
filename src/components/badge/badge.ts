import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-badge',
  styleUrls: {
    ios: 'badge.ios.scss',
    md: 'badge.md.scss',
    wp: 'badge.wp.scss'
  }
})
export class Badge {
  render() {
    return h(this, Ionic.theme(this, 'badge'),
      h('slot')
    );
  }
}
