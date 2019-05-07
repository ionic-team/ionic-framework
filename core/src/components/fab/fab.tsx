import { Component, ComponentInterface, Element, Listen, Method, Prop, Watch } from '@stencil/core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-fab',
  styleUrl: 'fab.scss',
  shadow: true
})
export class Fab implements ComponentInterface {
  mode!: Mode;

  @Element() el!: HTMLElement;

  /**
   * Where to align the fab horizontally in the viewport.
   */
  @Prop() horizontal?: 'start' | 'end' | 'center';

  /**
   * Where to align the fab vertically in the viewport.
   */
  @Prop() vertical?: 'top' | 'bottom' | 'center';

  /**
   * If `true`, the fab will display on the edge of the header if
   * `vertical` is `"top"`, and on the edge of the footer if
   * it is `"bottom"`. Should be used with a `fixed` slot.
   */
  @Prop() edge = false;

  /**
   * If `true`, both the `ion-fab-button` and all `ion-fab-list` inside `ion-fab` will become active.
   * That means `ion-fab-button` will become a `close` icon and `ion-fab-list` will become visible.
   */
  @Prop({ mutable: true }) activated = false;
  @Watch('activated')
  activatedChanged() {
    const activated = this.activated;
    const fab = this.getFab();
    if (fab) {
      fab.activated = activated;
    }
    Array.from(this.el.querySelectorAll('ion-fab-list')).forEach(list => {
      list.activated = activated;
    });
  }

  componentDidLoad() {
    if (this.activated) {
      this.activatedChanged();
    }
  }

  getFab() {
    return this.el.querySelector('ion-fab-button');
  }

  @Listen('click')
  onClick() {
    const hasList = !!this.el.querySelector('ion-fab-list');
    const getButton = this.getFab();
    const isButtonDisabled = getButton && getButton.disabled;

    if (hasList && !isButtonDisabled) {
      this.activated = !this.activated;
    }
  }

  /**
   * Close an active FAB list container.
   */
  @Method()
  close() {
    this.activated = false;
  }

  hostData() {
    return {
      class: {
        [`${this.mode}`]: true,
        [`fab-horizontal-${this.horizontal}`]: this.horizontal !== undefined,
        [`fab-vertical-${this.vertical}`]: this.vertical !== undefined,
        'fab-edge': this.edge
      }
    };
  }

  render() {
    return <slot></slot>;
  }

}
