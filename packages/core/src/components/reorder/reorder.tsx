import { Component } from '@stencil/core';

@Component({
  tag: 'ion-reorder',
})
export class ItemReorder {

  hostData()  {
    return {
      attrs: {
        'reorderAnchor': '',
      }
    };
  }

  render() {
    return <ion-icon name='reorder'></ion-icon>;
  }
}

