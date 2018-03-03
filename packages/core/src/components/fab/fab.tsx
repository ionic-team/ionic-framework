import { Component, Element, Method, State } from '@stencil/core';


@Component({
  tag: 'ion-fab',
  styleUrl: 'fab.scss'
})
export class Fab {
  @Element() private el: HTMLElement;

  @State() activated = false;

  /**
   * Close an active FAB list container
   */
  @Method()
  close() {
    this.activated = false;
  }

  toggleActive = () => {
    this.activated = !this.activated;
  }

  render() {
    const fab = this.el.querySelector('ion-fab-button');
    if (fab) {
      fab.toggleActive = this.toggleActive;
      fab.activated = this.activated;
    }

    const lists = this.el.querySelectorAll('ion-fab-list');
    for (let i = 0, length = lists.length; i < length; i += 1) {
      lists[i].activated = this.activated;
    }

    return (
      <slot></slot>
    );
  }

}
