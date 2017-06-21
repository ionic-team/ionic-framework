import { Component, h } from '../index';


@Component({
  tag: 'ion-footer',
  host: {
    theme: 'footer'
  }
})
export class Footer {
  render() {
    return <slot></slot>;
  }
}
