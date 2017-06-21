import { Component, h } from '../index';

@Component({
  tag: 'ion-list-header',
  host: {
    theme: 'list-header'
  }
})
export class ListHeader {
  render() {
    return <slot></slot>;
  }
}
