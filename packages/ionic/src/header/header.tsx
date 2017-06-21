import { Component, h } from '../index';


@Component({
  tag: 'ion-header',
  host: {
    theme: 'header'
  }
})
export class Header {
  render() {
    return <slot></slot>;
  }
}
