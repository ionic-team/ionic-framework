import { Component, h } from '../index';


@Component({
  tag: 'ion-buttons',
  host: {
    theme: 'bar-buttons'
  }
})
export class Buttons {
  $el: HTMLElement;

  ionViewWillLoad() {
    const buttons = this.$el.querySelectorAll('ion-button') as any;
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('button-type', 'bar-button');
    }
  }

  render() {
    return <slot></slot>;
  }
}
