import { Component, Element, State } from '@stencil/core';


@Component({
  tag: 'ion-reorder',
  styleUrl: 'reorder.scss',
  host: {
    theme: 'reorder'
  }
})
export class Reorder {

  @Element() private el: HTMLElement;

  @State() custom: boolean;

  componentDidLoad() {
    this.custom = this.el.childElementCount > 0;
  }

  hostData() {
    const hostClasses = {
      'reorder-custom': this.custom
    };

    return {
      class: hostClasses
    };
  }

  render() {
    // TODO: https://github.com/ionic-team/stencil/issues/171
    if (this.custom === true) {
      return <slot></slot>;
    } else if (this.custom === false) {
      return <ion-icon class='reorder-icon' name='reorder'></ion-icon>;
    } else {
      return undefined;
    }
  }

}
