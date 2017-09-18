import { Component } from '@stencil/core';

@Component({
  tag: 'ion-utils'
})
export class IonUtils {

  setTitle(newTitle: string): void {
    if (document.title !== newTitle) {
      document.title = newTitle;
    }
  }

}
