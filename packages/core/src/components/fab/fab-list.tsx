import { Component, Element, Prop, PropDidChange } from '@stencil/core';

/**
  * @name FabList
  * @description
  * `ion-fab-list` is a container for multiple FAB buttons. They are components of `ion-fab` and allow you to specificy the buttons position, left, right, top, bottom.
  * @usage
  *
  * ```html
  *  <ion-fab bottom right>
  *    <button ion-fab>Share</button>
  *    <ion-fab-list side="top">
  *      <button ion-fab>Facebook</button>
  *      <button ion-fab>Twitter</button>
  *      <button ion-fab>Youtube</button>
  *    </ion-fab-list>
  *    <ion-fab-list side="left">
  *      <button ion-fab>Vimeo</button>
  *    </ion-fab-list>
  *  </ion-fab>
  * ```
  * @module ionic
  *
  * @demo /docs/demos/src/fab/
  * @see {@link /docs/components#fab Fab Component Docs}
 */
@Component({
  tag: 'ion-fab-list',
})
export class FabList {
  @Element() private el: HTMLIonFabElement;

  @Prop() activated: boolean = false;

  @PropDidChange('activated')
  protected activatedChanged(activated: boolean) {
    const fabs = this.el.querySelectorAll('ion-fab-button');

    // if showing the fabs add a timeout, else show immediately
    var timeout = activated ? 30 : 0;
    for (var i = 0; i < fabs.length; i++) {
      const fab = fabs[i];
      setTimeout(() => fab.show = activated, i * timeout);
    }
  }

  hostData() {
    return {
      class: {
        'fab-list-active': this.activated
      }
    };
  }

  render() {
    return (
      <slot></slot>
    );
  }
}
