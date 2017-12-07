import { Component, Element, State } from '@stencil/core';


@Component({
  tag: 'ion-reorder',
  styleUrl: 'reorder.scss',
  host: {
    theme: 'reorder'
  }
})
export class Reorder {

  @State() hasContent: boolean = null;
  @Element() private el: HTMLElement;

  componentDidLoad() {
    this.hasContent = this.el.childElementCount > 0;
  }

  render() {
    // TODO: https://github.com/ionic-team/stencil/issues/171
    if (this.hasContent === true) {
      return <slot></slot>;
    } else if (this.hasContent === false) {
      return <ion-icon class='reorder-icon' name='reorder'></ion-icon>;
    } else {
      return undefined;
    }
  }

}
