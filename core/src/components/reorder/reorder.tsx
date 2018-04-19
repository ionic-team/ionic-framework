import { Component, Element } from '@stencil/core';


@Component({
  tag: 'ion-reorder',
  styleUrls: {
    ios: 'reorder.ios.scss',
    md: 'reorder.md.scss',
  },
  host: {
    theme: 'reorder'
  }
})
export class Reorder {

  private custom = true;

  @Element() el!: HTMLElement;

  componentWillLoad() {
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
    return (this.custom)
      ? <slot/>
      : <ion-icon class='reorder-icon' name='reorder'/>;
  }

}
