import { Component, Element, Method, Prop, State } from '@stencil/core';


@Component({
  tag: 'ion-fab',
  styleUrl: 'fab.scss'
})
export class Fab {
  @Element() private el: HTMLElement;

  @State() activated = false;

  /**
   * Where to align the fab horizontally in the viewport.
   * Possible values are: `"left"`, `"right"`, `"center"`, `"start"`, `"end"`.
   */
  @Prop() horizontal: 'left' | 'right' | 'center' | 'start' | 'end';

  /**
   * Where to align the fab vertically in the viewport.
   * Possible values are: `"top"`, `"center"`, `"bottom"`.
   */
  @Prop() vertical: 'top' | 'center' | 'bottom';

  /**
   * If true, the fab will display on the edge of the header if
   * `vertical` is `"top"`, and on the edge of the footer if
   * it is `"bottom"`. Should be used with a `fixed` slot.
   */
  @Prop() edge: boolean;


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

  hostData() {
    return {
      class: {
        [`fab-horizontal-${this.horizontal}`]: this.horizontal,
        [`fab-vertical-${this.vertical}`]: this.vertical,
        ['fab-edge']: this.edge
      }
    };
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
